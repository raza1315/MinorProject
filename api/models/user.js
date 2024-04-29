const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
    },
    
    friendRequest:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    friends:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    sentFriendRequest:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ]

});
const User=mongoose.model("User",userSchema);
module.exports= User;