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
                borderWidth: 0.8,
                borderLeftWidth: 0,
                borderTopWidth: 0,
                borderRightWidth: 0,
                borderColor: "#D0D0D0",
                padding: 10
            }}>
            <Image style={{ borderRadius: 25, width: 50, height: 50, resizeMode: "cover", }} source={{ uri:`${friend.image}` }} />
            <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={{ fontSize: 15, fontWeight: 500, marginRight: 3 }}>{friend.name}</Text>
                <Text style={{ color: "gray", fontWeight: 500, marginTop: 3 }}>last msg sent</Text>
            </View>
            <View>
                <Text style={{ fontSize: 12, fontWeight: 400, color: "#585858" }}>5:00 pm</Text>
            </View>
        </Pressable>
    )
}

export default UserChat