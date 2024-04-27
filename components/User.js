import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { userType } from '../UserContext';
import axios from "axios"
import { useIsFocused } from '@react-navigation/native';
const User = ({ item }) => {
  const { userId, setUserId,ipAddress } = useContext(userType);
  const [refresh, setRefresh] = useState(1);
  const [friendRequest, setFriendRequest] = useState([]);
  const [sentReq, setSentReq] = useState(false);
  const [userFriends, setUserFriends] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchFriendRequest = async () => {
      try {
        const response = await axios.get(`http://${ipAddress}:8000/friend-requests/sent/${userId}`);
        if (response.status == 200) {
          setFriendRequest(response.data);
        }
        else {
          console.log("error", response.status);
        }
      } catch (err) {
        console.log("error fetching friends array: ", err);
      }
    }
    if (isFocused) {

      fetchFriendRequest();
    }
  }, [isFocused])

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await axios.get(`http://${ipAddress}:8000/friends/${userId}`);
        if (response.status == 200) {
          setUserFriends(response.data);
        }
        else {
          console.log("error", response.status);
        }
      } catch (err) {
        console.log("error fetching friends array: ", err);
      }
    }
    if (isFocused) {

      fetchUserFriends();
    }
  }, [isFocused])

  const sendFriendRequest = async (currentUserId, selectedUserId) => {
    const payload = {
      currentUserId: currentUserId,
      selectedUserId: selectedUserId
    }
    axios.post(`http://${ipAddress}:8000/friend-request`, payload).then((res => {
      console.log("sent request successfully !");
      setSentReq(true);
    })).catch((err) => {
      console.log("error in sending request ", err);
    })
  }

  return (
    <Pressable style={{
      flexDirection: "row",
      marginVertical: 10,
      alignItems: "center",
      backgroundColor:"rgba(255,255,255,0.25)",
      borderRadius:17,
      paddingVertical:8,
      paddingHorizontal:8,
    }}>
      <View>
        <Image style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor:"red",
          resizeMode: "cover",
        }} source={{ uri:`${item.image}`  }} />
      </View>
      <View style={{
        marginLeft: 12,
        flex: 1,

      }}>
        <Text style={{ fontWeight: 600,color:"white" ,fontSize:15.5}}>{item.name}</Text>
        <Text style={{ color: "rgba(255,255,255,0.6)", fontStyle:"italic",marginTop: 4,marginRight:4 }}>{item.email}</Text>
      </View>
      {userFriends.includes(item._id) ? (<>
        <Pressable
          style={{
            backgroundColor: "#03C04A",
            borderRadius: 6,
            width: 105,
            padding: 10
          }}>
          <Text style={{
            textAlign: "center",
            color: "white",
            fontSize: 13,
          }}>Friend</Text>
        </Pressable>
      </>) : sentReq || friendRequest.some((friend) => friend._id == item._id) ? (<>
        <Pressable
          style={{
            backgroundColor: "gray",
            borderRadius: 6,
            width: 105,
            padding: 10
          }}>
          <Text style={{
            textAlign: "center",
            color: "white",
            fontSize: 13
          }}>Sent Request</Text>
        </Pressable>
      </>) : (<>
        <Pressable
          onPress={() => sendFriendRequest(userId, item._id)}
          style={{
            backgroundColor: "#567189",
            borderRadius: 6,
            width: 105,
            padding: 10
          }}>
          <Text style={{
            textAlign: "center",
            color: "white",
            fontSize: 13
          }}>Follow</Text>
        </Pressable></>)}

    </Pressable>
  )
}

export default User
