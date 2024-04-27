const express = require("express");
const socketIO = require("socket.io");
const ip = require("ip");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
// const fs = require('fs');

const app = express();
const ipAddress = ip.address();
const port = 8000;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');

//database connect kara h MongoDB 
mongoose.connect(
    "mongodb+srv://raza1513:raza1513@cluster0.rd6j7yk.mongodb.net/", {
}
).then(() => {
    console.log("connected to MongoDb");
}).catch((err) => {
    console.log("Error connection to MongoDB", err);
})

//MonngoDB ke schema import 
const User = require("./models/user");
const Message = require("./models/message");

//Express server
const server = app.listen(port, () => {
    console.log(`server is running on ${ipAddress} : ${port}`);
})


//socket.io server
const io = socketIO(server);

io.on('connection', (socket) => {
    console.log(`User : ${socket.id} Connected `);

    socket.on('sendmessage', (data) => {
        console.log('Message : ', data.message, "send by : ", data.senderId, "To : ", data.friendId);
        const payload = {
            message: data.message,
            sender: data.senderId,
            receiver: data.friendId,
            timeStamp: new Date(),
        }
        const newMessage = new Message({
            senderId: payload.sender,
            receiverId: payload.receiver,
            message: payload.message,
            timeStamp: new Date(),
        })
        newMessage.save();
        socket.broadcast.emit('message', payload);
    });


    socket.on('disconnect', () => {
        console.log(`user : ${socket.id} disconnected`);
    })
})


//multer for uplaoding images : 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "../assets/";
        // fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + "-" + file.originalname);
    }
})
const upload = multer({ storage: storage });


//end points for http requests 
app.post("/register", upload.single('image'), async (req, res) => {
    const { name, email, password } = req.body;
    const image = req.file.path;
    console.log(name, email, password, image);
    const newUser = new User({ name, email, password, image });


    newUser.save().then(() => {
        res.status(200).json({ message: "user registered successfully" })
    }).catch((err) => {
        console.log("Error resgistering the user", err);
        res.status(500).json({ message: "Error registering the user" });
    })
})

const createToken = (userId) => {
    const payload = {
        userId: userId
    };
    const token = jwt.sign(payload, "KeyRandom", { expiresIn: "1h" });
    return token;
}

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(404).json({ message: "Email and Password required !" });
    }

    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(404).json({ message: "user not found " })
        }

        if (user.password != password) {
            return res.status(404).json({ message: "Password is Invalid" })
        }

        const token = createToken(user._id);
        res.status(200).json({ token });
    }).catch((err) => {
        console.log("Error while finding the user", err);
        res.status(500).json({ message: "Some Error Occured" });
    })
})
app.get("/users/:userId", (req, res) => {
    const loggedInUserId = req.params.userId;
    User.find({ _id: { $ne: loggedInUserId } }).then((users) => {
        res.status(200).json(users);
    }).catch((err) => {
        console.log("error retrieving users", err);
        res.status(500).json({ message: "error retrieving users" });
    })
})

app.post("/friend-request", async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;
    try {
        await User.findByIdAndUpdate(selectedUserId, {
            $addToSet: { friendRequest: currentUserId }
        })
        await User.findByIdAndUpdate(currentUserId, {
            $addToSet: { sentFriendRequest: selectedUserId }
        })

        res.status(200).json({ message: "successfully sent request" });
    }
    catch (err) {
        res.status(500).json({ message: "internal error" });
    }
})

app.get("/friend-request/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate("friendRequest", "name email image").lean();
        const friendRequest = user.friendRequest;
        res.status(200).json(friendRequest);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Error" })
    }
})

app.post("/friend-request/accept", async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;
        await User.findByIdAndUpdate(senderId, {
            $addToSet: { friends: receiverId },
            $pull: { sentFriendRequest: receiverId },
        })
        await User.findByIdAndUpdate(senderId, {
            $pull: { friendRequest: receiverId },
        })
        await User.findByIdAndUpdate(receiverId, {
            $addToSet: { friends: senderId },
            $pull: { friendRequest: senderId },
        })
        await User.findByIdAndUpdate(receiverId, {
            $pull: { sentFriendRequest: senderId },
        })
        res.status(200).json({ message: " Friend Request accepted successfully ! " })
    }
    catch (err) {
        console.log("error in accepting the frined request : ", err);
    }
})

app.get('/chats/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate("friends", "name email image").lean();
        const friends = user.friends;
        res.status(200).json(friends);
    }
    catch (err) {
        console.log("Error retrieving the FriendsList", err);
    }
})

app.get("/friend-requests/sent/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate("sentFriendRequest", "name email image").lean();
        const sentFriendRequest = user.sentFriendRequest;
        res.status(200).json(sentFriendRequest)
    }
    catch (err) {
        console.log("couldnt send request", err);
    }
})

app.get("/friends/:userId", (req, res) => {
    try {
        const userId = req.params.userId;
        User.findById(userId).populate("friends").then((user) => {
            if (!user) {
                return res.status(404).json({ message: "user not found " })
            }
            const friendIds = user.friends.map((friend) => friend._id);
            res.status(200).json(friendIds);
        });
    }
    catch (err) {
        console.log(err);
    }

})

app.get("/friend/:friendId", async (req, res) => {
    try {
        const friendId = req.params.friendId;
        const receiverId = await User.findById(friendId);
        res.status(200).json(receiverId);
    }
    catch (err) {
        console.log("error fetching the receiver details : ", err);
        res.status(500).json({ message: "internal error" });
    }
})

app.get("/messages/:userId/:friendId", async (req, res) => {
    try {
        const { userId, friendId } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: friendId },
                { senderId: friendId, receiverId: userId }
            ]
        }).populate("senderId", "_id name");
        res.status(200).json(messages);

    }
    catch (err) {
        console.log("Error fetching the messages : ", err);
        res.status(500).json({ message: "internal error occurred" });
    }
})

