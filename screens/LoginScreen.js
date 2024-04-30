import { Alert, KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from "@react-navigation/native"
import axios from "axios"
import {userType} from "../UserContext"
import AsyncStorage from "@react-native-async-storage/async-storage"
const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {ipAddress} =useContext(userType)
    const navigation = useNavigation();
    useEffect(() => {
        const alreadyLogIn = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken");
                if (token) {
                    navigation.navigate("Welcome");
                }
            }
            catch (err) {
                console.log("Error : ", err);
            }

        }
        alreadyLogIn();
    },[])

    const handleLogin = () => {
        const user = {
            email: email,
            password: password
        }
        axios.post(`http://${ipAddress}:8000/login`, user).then((res) => {
            const token = res.data.token;
            AsyncStorage.setItem("authToken", token);
            navigation.navigate("Welcome");

        }).catch((err) => {
            Alert.alert("Login Failed", "Please Enter Correct Password or Email");
            console.log("Login Error : ", err);
        })

    }
    return (
        <View style={{ flex: 1, backgroundColor: "rgba(252,252,255,1)", padding: 10, alignItems: "center" }}>
            <KeyboardAvoidingView>
                <View style={{ marginTop: 100, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "#4A55A2", fontSize: 18, fontWeight: "600" }}>Sign In</Text>
                    <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 15 }}>Sign In to Your Account</Text>
                </View>
                <View style={{ marginTop: 50 }}>
                    <View>
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
                            style={{ borderBottomColor: "gray", borderBottomWidth: 1, marginVertical: 10, width: 300, fontSize: email ? 18 : 18, }} placeholderTextColor={"black"} placeholder='Enter Your Password'></TextInput>
                    </View>
                    <Pressable
                        onPress={handleLogin}
                        style={{ width: 200, backgroundColor: "#4A55A2", padding: 15, marginTop: 50, marginLeft: "auto", marginRight: "auto", borderRadius: 7 }}>
                        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold", textAlign: "center" }}>Login</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => { navigation.navigate("Register") }}
                        style={{ marginTop: 15 }}>
                        <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>Don't have an Account ? Sign Up</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export default LoginScreen
