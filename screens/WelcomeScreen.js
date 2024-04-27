import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import LottieView from 'lottie-react-native'
import { useNavigation,useIsFocused } from '@react-navigation/native'
const WelcomeScreen = () => {
    const navigation=useNavigation();
    const isFocused=useIsFocused();
    useEffect(()=>{
        if(isFocused){
            
            setTimeout(()=>{
                navigation.navigate("Home");
            },2350)
        }
        },[isFocused]);
  return (
    <View style={{flex:1,flexDirection:"column",justifyContent:"center",alignItems:"center",marginTop:"-30%",backgroundColor:"rgba(0,0,0,0.94)"}}>
        <Text style={{fontSize:40,color:"white",textAlign:"center"}}>Welcome To Whisper-Wave</Text>
        <LottieView
        autoPlay
        style={{
          width: 400,
          height: 400,
          borderRadius:30,

        }}
        source={require('../assets/chatLoad.json')}
      />
      <View style={{position:"absolute",top:"67%",flexDirection:'row',justifyContent:"space-around",marginHorizontal:20}}>
        <LottieView
        autoPlay
        style={{
          width: 200,
          height: 200,
          borderRadius:30,
        }}
        source={require('../assets/LF2.json')}
        />
        </View>
    </View>
  )
}

export default WelcomeScreen
