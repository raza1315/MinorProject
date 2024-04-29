import { KeyboardAvoidingView, Pressable, Image, Text, TextInput, View, Alert, Vibration, Touchable, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { useState } from 'react';
import { useNavigation } from "@react-navigation/native"
import axios from "axios"
import { userType } from "../UserContext"
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [showAvatar, setShowAvatar] = useState(false);
    const [selectAvatar, setSelectAvatar] = useState('');
    const { ipAddress } = useContext(userType);
    const navigation = useNavigation();



    const handleRegister = () => {
        const user = {
            name: name,
            email: email,
            password: password,
            image: selectAvatar,
        }
        axios.post(`http://${ipAddress}:8000/register`, user).then((response) => {
            Alert.alert(
                "Registration Successfull",
                "You have been registered successfully !"
            )
            setName("");
            setEmail("");
            setPassword("");
            setImage("");
        }).catch((err) => {
            Alert.alert(
                "Registeration Failed",
                "Error occurred while registering"
            )
            console.log("registration failed", err);
        })
    }
    return (
        <View style={{ flex: 1, backgroundColor: "white", padding: 10, alignItems: "center" }}>
            <KeyboardAvoidingView>
                <View style={{ marginTop: 100, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "#4A55A2", fontSize: 18, fontWeight: "600" }}>Sign Up</Text>
                    <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 15 }}>Register to Your Account</Text>
                </View>
                <View style={{ marginTop: 50 }}>
                    <View>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>Name</Text>
                        <TextInput
                            value={name}
                            onChangeText={(text) => { setName(text); }}
                            style={{ borderBottomColor: "gray", borderBottomWidth: 1, marginVertical: 10, width: 300, fontSize: email ? 18 : 18, }} placeholderTextColor={"black"} placeholder='Enter Your Name'></TextInput>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={(text) => { setEmail(text); }}
                            style={{ borderBottomColor: "gray", borderBottomWidth: 1, marginVertical: 10, width: 300, fontSize: email ? 18 : 18, }} placeholderTextColor={"black"} placeholder='Enter Your Email'></TextInput>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>Password</Text>
                        <TextInput
                            secureTextEntry={true}
                            value={password}
                            onChangeText={(text) => { setPassword(text); }}
                            style={{ borderBottomColor: "gray", borderBottomWidth: 1, marginVertical: 10, width: 300, fontSize: email ? 18 : 18, }} placeholderTextColor={"black"} placeholder='Password'></TextInput>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "600", color: "gray" }}>Image</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <Text style={{ fontSize: 18, marginVertical: 10 }}>Choose an Avatar </Text>
                            <Feather onPress={() => setShowAvatar(!showAvatar)} name="image" size={35} color="#9A9498" />
                        </View>
                    </View>
                    {showAvatar ?
                        <View style={{ width: "100%", height: "12%", flexDirection: "row",gap:20, backgroundColor: "lightgray", borderRadius: 15, paddingHorizontal: 20, paddingVertical: 7 }}>
                            <TouchableOpacity onPress={()=>{setSelectAvatar("avatarId1");Vibration.vibrate(60)}}>
                                <Image source={require("../assets/avatar1.jpg")} style={{resizeMode:"cover",height:50,width:50,borderRadius:50}}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setSelectAvatar("avatarId2");Vibration.vibrate(60)}}>
                                <Image source={require("../assets/avatar2.jpg")} style={{resizeMode:"cover",height:50,width:50,borderRadius:50}}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setSelectAvatar("avatarId3");Vibration.vibrate(60)}}>
                                <Image source={require("../assets/avatar3.jpg")} style={{resizeMode:"cover",height:50,width:50,borderRadius:50}}/>
                            </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{setSelectAvatar("avatarId4");Vibration.vibrate(60)}}>
                                <Image source={require("../assets/avatar4.jpg")} style={{resizeMode:"cover",height:50,width:50,borderRadius:50}}/>
                            </TouchableOpacity>
                        </View>
                        :
                        <></>}
                    <Pressable
                        onPress={handleRegister}
                        style={{ width: 200, backgroundColor: "#4A55A2", padding: 15, marginTop: 45, marginLeft: "auto", marginRight: "auto", borderRadius: 7 }}>
                        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", textAlign: "center" }}>Register</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => { navigation.goBack() }}
                        style={{ marginTop: 15 }}>
                        <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>Already have an Account ? Sign In</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default RegisterScreen
