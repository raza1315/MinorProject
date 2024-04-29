import { View, Text, Image, TouchableOpacity, Vibration } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation, useIsFocused } from '@react-navigation/native'
import { userType } from "../UserContext"
import axios from "axios"
const UserChat = ({ friend }) => {
    const navigation = useNavigation();
    const { userId, ipAddress } = useContext(userType);
    const [lastMsg, setLastMsg] = useState("");
    const isFocused = useIsFocused();

    const GetTimeOfMsg = (time) => {
        const date = new Date(time);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return hours + ":" + minutes;
    }
    const fetcgLastMsg = async () => {
        const res = await axios.get(`http://${ipAddress}:8000/messages/${userId}/${friend._id}`);
        const n = res.data.length;
        if (n != 0) {
            setLastMsg(res.data[n - 1]);
        }
        else {
            setLastMsg("No Last Message");
        }
    }
    useEffect(() => {
        fetcgLastMsg();
    }, [isFocused])
    return (
        <TouchableOpacity
        activeOpacity={0.76}
            onPress={() => { navigation.navigate("Messages", { friendId: friend._id }); Vibration.vibrate(50) }}
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
                 {friend.image == "avatarId1" ? <Image style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          resizeMode: "cover",
        }} source={require("../assets/avatar1.jpg")} /> : friend.image=="avatarId2"? <Image style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          resizeMode: "cover",
        }} source={require("../assets/avatar2.jpg")} />:friend.image=="avatarId3"? <Image style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          resizeMode: "cover",
        }} source={require("../assets/avatar3.jpg")} />:friend.image=="avatarId4"? <Image style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          resizeMode: "cover",
        }} source={require("../assets/avatar4.jpg")} />:<Image style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          resizeMode: "cover",
        }} source={require("../assets/defaultAvatar.jpg")} />}

            <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={{ color: "white", fontSize: 15, fontWeight: 500, marginRight: 3 }}>{friend.name}</Text>
                <Text style={{ color: "rgba(240,240,240,0.7)", fontWeight: 500, marginTop: 3 }}>{lastMsg.message}</Text>
            </View>
            <View>
                <Text style={{ marginRight: 15, fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>{lastMsg.timeStamp ? GetTimeOfMsg(lastMsg.timeStamp) : "---"}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default UserChat