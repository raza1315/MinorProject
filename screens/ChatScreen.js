import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { userType } from "../UserContext"
import UserChat from '../components/UserChat'
const ChatScreen = () => {
    const [friends, setFriends] = useState([]);
    const { userId,ipAddress } = useContext(userType);
    useEffect(()=>{
        const fetchFriends=async(userId)=>{
            await axios.get(`http://${ipAddress}:8000/chats/${userId}`).then(res=>{
                setFriends(res.data);
            })
        }
        fetchFriends(userId);
    },[])
    console.log(friends);
    return (
        <ScrollView>
            <Pressable>
                {friends.length>0? 
                    <View>{friends.map((friend,index)=>{
                        return(<UserChat key={index} friend={friend}/>)
                    })}</View>
                :<Text style={{fontSize:30,color:"green", textAlign:"center",marginTop:10}}> No Friends Yet ! </Text>}
            </Pressable>
        </ScrollView>
    ) 
}

export default ChatScreen
