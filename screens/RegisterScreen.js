import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native'
import React, { useContext } from 'react'
import { useState } from 'react';
import { useNavigation } from "@react-navigation/native"
import axios from "axios"
import {userType} from "../UserContext"
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const {ipAddress}=useContext(userType);
    const navigation = useNavigation();

    const handleImageSelection = async () => {
        try {
            let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (permissionResult.granted === false) {
                alert("Permission to access camera roll is required!");
                return;
            }

            let pickerResult = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!pickerResult.cancelled) {
                setImage(pickerResult.assets[0].uri);
                console.log("hello: ", pickerResult.assets[0].uri);
                console.log(image);
            }
        } catch (error) {
            console.log("Error selecting image: ", error);
        }
    };



    const handleRegister = async () => {
        try {
            if (!image) {
                Alert.alert(
                    "Registration Failed",
                    "Please select an image"
                );
                return;
            }

            // Create form data
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("image", {
                uri: image,
                type: 'image/jpeg', 
                name: 'image.jpg',
            });

            const response = await axios.post(`http://${ipAddress}:8000/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });


            console.log(response);
            Alert.alert(
                "Registration Successfull",
                "You have been registered successfully !"
            );
            setName("");
            setEmail("");
            setPassword("");
            setImage("");
        } catch (err) {
            console.log("Registration failed:", err);
            Alert.alert(
                "Registration Failed",
                "Error occurred while registering"
            );
        }
    };




    // const handleRegister = () => {
    //     const user = {
    //         name: name,
    //         email: email,
    //         password: password,
    //         image: image,
    //     }
    //     axios.post("http://${ipAddress}:8000/register", user).then((response) => {
    //         Alert.alert(
    //             "Registration Successfull",
    //             "You have been registered successfully !"
    //         )
    //         setName("");
    //         setEmail("");
    //         setPassword("");
    //         setImage("");
    //     }).catch((err) => {
    //         Alert.alert(
    //             "Registeration Failed",
    //             "Error occurred while registering"
    //         )
    //         console.log("registration failed", err);
    //     })
    // }
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
                            <Text style={{ fontSize: 18, marginVertical: 10 }}>Select Image From Gallery </Text>
                            <Feather onPress={handleImageSelection} name="image" size={35} color="#9A9498" />
                        </View>
                    </View>
                    <Pressable
                        onPress={handleRegister}
                        style={{ width: 200, backgroundColor: "#4A55A2", padding: 15, marginTop: 50, marginLeft: "auto", marginRight: "auto", borderRadius: 7 }}>
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
