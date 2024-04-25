import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation,useIsFocused } from "@react-navigation/native"
import { SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage"
import { decode as atob } from 'base-64';
import axios from "axios"
import { userType } from '../UserContext';
import User from '../components/User';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { userId, setUserId,ipAddress } = useContext(userType);
  const [users, setUsers] = useState([]);
  const [reload, setReload] = useState(false);
  const isFocused = useIsFocused();
  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem("authToken");
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.userId;
    setUserId(userId);

    axios.get(`http://${ipAddress}:8000/users/${userId}`).then((res) => {
      setUsers(res.data);
    }).catch((err) => {
      console.log("error retrieving the users ", err);
    })

  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => {
        return (<Text style={{ fontWeight: "bold", fontSize: 16 }}>Chat App Name</Text>);
      },
      headerRight: () => {
        return (
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 18
          }}>
            <MaterialIcons onPress={()=>{ navigation.navigate('Login');AsyncStorage.clear()}} name="logout" size={26} color="#232023" />
            <Ionicons
              onPress={() => { navigation.navigate("Chats") }}
              name="chatbox-ellipses-outline" size={26} color="#232023" />
            <SimpleLineIcons
              onPress={() => { navigation.navigate("Friends") }}
              name="people" size={26} color="#232023" />
          </View>
        );
      }
    })
  }, []);

  useEffect(() => {
    if(isFocused){
      fetchUsers();
      console.log("fetched user");
    }
  }, [isFocused])
  return (
    <ScrollView>
      <View style={{ padding: 10 }}>
        {users.map((item, index) => {
          return (<User key={index} item={item} />)
        })}
      </View>
    </ScrollView>
  )
}

export default HomeScreen
