import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {NavigationContainer} from "@react-navigation/native"
import {createNativeStackNavigator} from "@react-navigation/native-stack"
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import HomeScreen from './screens/HomeScreen'
import FriendsScreen from "./screens/FriendsScreen"
import ChatScreen from './screens/ChatScreen'
import ChatMessageScreen from './screens/ChatMessageScreen'
import WelcomeScreen from './screens/WelcomeScreen'

const StackNavigator = () => {
const Stack = createNativeStackNavigator();
    return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown:false}} name="Login" component={LoginScreen} />
        <Stack.Screen options={{headerShown:false}} name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Friends" component={FriendsScreen} />
        <Stack.Screen name="Chats" component={ChatScreen} />
        <Stack.Screen name="Messages" component={ChatMessageScreen} />
        <Stack.Screen options={{headerShown:false}} name="Welcome" component={WelcomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator
  