import { Pressable, Image, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { userType } from '../UserContext'
import axios from "axios"

const FriendRequest = ({ item, friendRequests, setFriendRequests }) => {
    const { userId , ipAddress } = useContext(userType);
    const acceptRequestHandle = async (friendRequestId) => {
        try {
            const payload = {
                senderId: friendRequestId,
                receiverId: userId
            }
            await axios.post(`http://${ipAddress}:8000/friend-request/accept`, payload).then((res) => {
                setFriendRequests(friendRequests.filter((friend) => friend._id != friendRequestId));
            })
        }
        catch (err) {
            console.log("Error Accepting the friend's request : ", err);
        }
    }
    return (
        <Pressable
            style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 10
            }}
        >
            <Image style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                resizeMode: "cover",
            }} source={{ uri: `${item.image}` }} />
            <Text
                style={{ color:"white",fontSize: 16, fontWeight: "500", marginLeft: 10, marginRight: 10, flex: 1 }}
            >{item.name} sent you a Friend Request </Text>
            <Pressable
                onPress={() => { acceptRequestHandle(item._id) }}
                style={{ borderRadius: 6, backgroundColor: "#6b00d7", padding: 10 }}>
                <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>Accept</Text>
            </Pressable>
        </Pressable>
    )
}

export default  FriendRequest
