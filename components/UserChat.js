import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const UserChat = ({ friend }) => {
    const navigation = useNavigation();
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
                backgroundColor:"rgba(255,250,250,0.2)",
                borderRadius:15,
                marginHorizontal:8,
                padding: 10,
                marginBottom:9
            }}>
            <Image style={{ borderRadius: 25, width: 50, height: 50, resizeMode: "cover", }} source={{ uri:`${friend.image}` }} />
            <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={{ color:"white",fontSize: 15, fontWeight: 500, marginRight: 3 }}>{friend.name}</Text>
                <Text style={{ color: "rgba(255,255,255,0.55)", fontWeight: 500, marginTop: 3 }}>last msg sent</Text>
            </View>
            <View>
                <Text style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.6)" }}>5:00 pm</Text>
            </View>
        </Pressable>
    )
}

export default UserChat