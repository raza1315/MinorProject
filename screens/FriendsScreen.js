import { ScrollView, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FriendRequest from '../components/FriendRequest'
import { userType } from "../UserContext"
import axios from "axios"
import { useNavigation } from '@react-navigation/native'
const FriendsScreen = () => {
  const { userId, setUserId,ipAddress } = useContext(userType);
  const [friendRequests, setFriendRequests] = useState([]);
  const navigation=useNavigation();
  useEffect(()=>{
    navigation.setOptions({
        headerTitle:"Friend Requests",
        headerRight:()=>(<Text onPress={()=>{navigation.navigate("Chats")}} style={{backgroundColor:"#0077B6",padding:7,borderRadius:7,textAlign:"center",color:"white",fontWeight:500}}> Chat Now</Text>)
    })
},[])
  useEffect(() => {
    fetchFriendRequest();
  }, [])
  const fetchFriendRequest = async () => {
    try {
      const response = await axios.get(`http://${ipAddress}:8000/friend-request/${userId}`);
      if (response.status === 200) {
        const friendRequestData = response.data.map((friendRquest) => {
          return (
            {
              _id: friendRquest._id,
              name: friendRquest.name,
              email: friendRquest.email,
              image: friendRquest.image,
            }

          )
        })
        setFriendRequests(friendRequestData);
      }
    }
    catch (err) {
      console.log("error while fetching the friendRequest list : ", err);
    }
  }
  return (
    <ScrollView style={{marginHorizontal:10,padding:10}}>
      {friendRequests.length > 0 ? <Text style={{fontWeight:"400",fontSize:15,color:"#232023",fontStyle:"italic"}}>Your Friend Requests :</Text>: <Text>You Don't Have Any Friend Requests Yet</Text>}
      {friendRequests.map((item,index)=>{
        return(<FriendRequest key ={index} item={item} friendRequests={friendRequests} setFriendRequests={setFriendRequests} />)
      })}
    </ScrollView>
  )
}

export default FriendsScreen
