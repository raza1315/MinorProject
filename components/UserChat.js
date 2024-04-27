import { View, Text, Pressable, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { userType } from "../UserContext"
import axios from "axios"
const UserChat = ({ friend }) => {
    const navigation = useNavigation();
    const { userId, ipAddress } = useContext(userType);
    const [lastMsg, setLastMsg] = useState("");
    const GetTimeOfMsg = (time) => {
        const date = new Date(time);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return hours + ":" + minutes;
    }
    const fetcgLastMsg = async () => {
        const res = await axios.get(`http://${ipAddress}:8000/messages/${userId}/${friend._id}`);
        const n=res.data.length;
        setLastMsg(res.data[n-1]);
    }
    useEffect(() => {
        fetcgLastMsg();
    }, [])
    return (
        <Pressable
            onPress={() => { navigation.navigate("Messages", { friendId: friend._id }) }}
            style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 0.7,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderColor: "rgba(255,255,255,0.45)",
                backgroundColor: "rgba(255,250,250,0.2)",
                borderRadius: 15,
                marginHorizontal: 8,
                padding: 10,
                marginBottom: 9
            }}>
            <Image style={{ borderRadius: 25, width: 50, height: 50, resizeMode: "cover", }} source={{ uri: `${friend.image}` }} />
            <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={{ color: "white", fontSize: 15, fontWeight: 500, marginRight: 3 }}>{friend.name}</Text>
                <Text style={{ color: "rgba(240,240,240,0.7)", fontWeight: 500, marginTop: 3 }}>{lastMsg.message}</Text>
            </View>
            <View>
                <Text style={{ marginRight:15,fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>{GetTimeOfMsg(lastMsg.timeStamp)}</Text>
            </View>
        </Pressable>
    )
}

export default UserChat