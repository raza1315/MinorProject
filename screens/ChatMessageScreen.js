import { View, Text, KeyboardAvoidingView, ScrollView, TextInput, Pressable, TouchableOpacity, Image, Keyboard, ImageBackground } from 'react-native'
import { Entypo, FontAwesome, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import EmojiSelector from 'react-native-emoji-selector';
import axios from "axios"
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import LottieView from 'lottie-react-native'
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { userType } from "../UserContext"
import io from 'socket.io-client';

const ChatMessageScreen = () => {
    const [showEmoji, setShowEmoji] = useState(false);
    const [friendData, setFriendData] = useState([]);
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const scrollViewRef = useRef();
    const route = useRoute();
    const { friendId } = route.params;
    const { userId, ipAddress } = useContext(userType);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const timeStamp = new Date();

    const GetTimeOfMsg = (time) => {
        const date = new Date(time);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return hours + ":" + minutes;
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => {
                return (<View style={{ flexDirection: "row", alignItems: "center", gap: 10, }}>
                    <Ionicons onPress={() => navigation.goBack()} name="arrow-back" size={25} color="white" />
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Image style={{ resizeMode: "cover", width: 35, height: 35, borderRadius: 30 }} source={{ uri: `${friendData.image}` }} />
                        <Text style={{ color: "white", fontWeight: 500, fontSize: 20 }}>{friendData.name}</Text>
                    </View>
                </View>)
            },
            headerStyle: {
                backgroundColor: "#2e3154"
            }
        })
    })
    useEffect(() => {
        if (isFocused) {
            fetchMessages();
        }
    }, [isFocused]);
    useEffect(() => {
        console.log("current chat friend: ", friendId, " current user : ", userId);
        const fetchFriendData = async () => {
            try {
                const response = await axios.get(`http://${ipAddress}:8000/friend/${friendId}`);
                setFriendData(response.data);
            }
            catch (err) {
                console.log("error getting the friend data ", err);
            }
        }
        //fetching profile data and scrolling to bottom 
        fetchFriendData();
        scrollToBottom();

        //socket connection 
        const newSocket = io(`http://${ipAddress}:8000`);
        setSocket(newSocket);

        //keyboard pop ka function 
        const keyBoardActive = Keyboard.addListener('keyboardDidShow', () => {
            setShowEmoji(false);
        })

        //cleanup function listener ko remove karne ke liye and socket disconnect 
        return () => {
            newSocket.disconnect();
            keyBoardActive.remove();
        };
    }, [])

    useEffect(() => {
        if (socket) {
            socket.on('message', (data) => {
                if (data.sender == friendId && data.receiver == userId) {
                    const time = GetTimeOfMsg(data.timeStamp)
                    setMessages((prevMessages) => [...prevMessages, { message: data.message, sentTo: data.senderId, time: time }]);
                }
            });
        }
    }, [socket]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://${ipAddress}:8000/messages/${userId}/${friendId}`);
            if (response.status == 200) {
                response.data.forEach(msgData => {
                    const time = GetTimeOfMsg(msgData.timeStamp);
                    setMessages((prevMessages) => [...prevMessages, { message: msgData.message, sentTo: msgData.receiverId, time: time }])
                });
            }
            else {
                console.log("error");
            }
        }
        catch (err) {
            console.log(`error fetching the messages ${err}`);
        }

    }

    const sendMessage = () => {
        if (messageInput.trim() !== '') {
            const payload = {
                message: messageInput,
                senderId: userId,
                friendId: friendId
            }
            const time = new Date();
            const formattedTime = GetTimeOfMsg(time);
            setMessages((prevMessages) => [...prevMessages, { message: messageInput, sentTo: friendId, time: formattedTime }])
            socket.emit('sendmessage', payload);
            setMessageInput('');
        }
    }

    function handleEmoji() {
        setShowEmoji(!showEmoji);
        Keyboard.dismiss();
    }
    const handleEmojiClick = (emoji) => {
        setMessageInput(prevMessages => prevMessages + emoji);
    }

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd()
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <ImageBackground source={require("../assets/chatMessageScreenDoodle.jpg")} style={{ resizeMode: 'cover', flex: 1 }}>
                {messages.length == 0 ?
                    <LottieView
                        autoPlay
                        style={{
                            position:"absolute",
                            top:"18%",
                            left:"4%",
                            width: 350,
                            height: 350,
                        }}
                        source={require('../assets/loadingMsg.json')}
                    /> : <></>}
                <ScrollView style={{ width: "100%", backgroundColor: "transparent", flexDirection: "column", paddingTop: 7 }} ref={scrollViewRef} onContentSizeChange={scrollToBottom}>
                    {messages.map((msg, index) => (
                        msg.sentTo == friendId ?
                            <View key={index} style={{ alignSelf: "flex-end", justifyContent: "center", paddingHorizontal: 11, paddingVertical: 6, backgroundColor: "white", maxWidth: "77%", marginBottom: 10, marginRight: 10, borderBottomLeftRadius: 13, borderBottomRightRadius: 15, borderTopLeftRadius: 15, }}>
                                <Text style={{ color: "rgba(0,0,0,0.7)", letterSpacing: 0.3, marginRight: "15%", fontSize: 17, }}>{msg.message}</Text>
                                <Text style={{ color: "#8c8c8c", fontSize: 12, textAlign: 'right', marginTop: "-4.7%" }}>{msg.time}</Text>

                            </View>
                            :
                            <View key={index} style={{ alignSelf: "flex-start", justifyContent: "center", paddingHorizontal: 11, paddingVertical: 6, backgroundColor: "rgba(255,255,255,0.35)", maxWidth: "77 %", marginBottom: 10, marginLeft: 10, borderBottomLeftRadius: 15, borderBottomRightRadius: 13, borderTopRightRadius: 15 }}>
                                <Text style={{ marginRight: "15%", color: "white", letterSpacing: 0.3, fontSize: 17, }}>{msg.message}</Text>
                                <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, textAlign: 'right', marginTop: "-4.7%" }}>{msg.time}</Text>

                            </View>

                    ))}
                </ScrollView>
                <View style={{ height: 2 }}></View>
            </ImageBackground>
            <View style={{ backgroundColor: '#2e3154', flexDirection: "row", padding: 10, borderTopWidth: 0.45, borderTopColor: "lightgray", alignItems: "center", marginBottom: 0 }}>
                <MaterialCommunityIcons onPress={handleEmoji} style={{ marginRight: 5, borderRadius: 15, backgroundColor: "rgba(240,240,240,0.4)", padding: 9, paddingLeft: 7.5, paddingBottom: 7 }} name="sticker-emoji" size={25} color="white" />
                <TextInput value={messageInput} onChangeText={(text) => setMessageInput(text)} placeholder="Type your message.. " style={{ flex: 1, height: 40, backgroundColor: "rgba(240,240,240,0.4)", borderRadius: 11, paddingHorizontal: 10 }} />
                <Feather style={{ marginLeft: 8, borderRadius: 15, backgroundColor: "rgba(240,240,240,0.4)", padding: 9, paddingLeft: 7.5, paddingBottom: 7 }} name="image" size={25} color="white" />
                <TouchableOpacity onPress={sendMessage}>
                    <Feather style={{ marginLeft: 10, borderRadius: 15, backgroundColor: "rgba(240,240,240,0.4)", padding: 9, paddingLeft: 7.5, paddingBottom: 7 }} name="send" size={25} color="white" />
                </TouchableOpacity>
            </View>
            {showEmoji && (
                <EmojiSelector onEmojiSelected={handleEmojiClick} style={{ height: 280 }} />
            )}
        </KeyboardAvoidingView>
    )
}

export default ChatMessageScreen