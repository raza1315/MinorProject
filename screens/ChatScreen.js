import { View, Text, ScrollView, Pressable, ImageBackground } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { userType } from "../UserContext"
import UserChat from '../components/UserChat'
import { useNavigation ,useIsFocused} from '@react-navigation/native'
const ChatScreen = () => {
    const [friends, setFriends] = useState([]);
    const { userId, ipAddress } = useContext(userType);
    const navigation = useNavigation();
    const isFocused=useIsFocused();
    useEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: "#040720"
            },
            headerTintColor: "white",
        });
    }, []);
    useEffect(() => {
        const fetchFriends = async (userId) => {
            await axios.get(`http://${ipAddress}:8000/chats/${userId}`).then(res => {
                setFriends(res.data);
            })
        }
        if(isFocused){
            fetchFriends(userId);
            console.log("focussing");
        }
    }, [isFocused])
    return (
        <View style={{ flex: 1, backgroundColor: "rgba(106,54,166,0.9)", borderTopColor: "white", borderTopWidth: 0.49 }}>
            <ImageBackground style={{flex:1,resizeMode:"cover",}} source={require("../assets/chatScreen.jpg")}>
                <View style={{marginTop:9}}></View>
                <ScrollView>
                    <Pressable>
                        {friends.length > 0 ?
                            <View>{friends.map((friend, index) => {
                                return (<UserChat key={index} friend={friend} />)
                            })}</View>
                            : <Text style={{ fontSize: 30, color: "lightgray", textAlign: "center", marginTop: 10 }}> No Friends Yet ! </Text>}
                    </Pressable>
                </ScrollView>
            </ImageBackground>
        </View>
    )
}

export default ChatScreen
