import { createContext,useState } from "react";
const userType=createContext()
const UserContext=({children})=>{
    const [userId,setUserId]=useState("");
    const [ipAddress,setIpAddress]=useState("https://konnect-one.vercel.app");

     return(
        <userType.Provider value={{userId,setUserId,ipAddress}}>
            {children}
        </userType.Provider>
    )
}

export {userType, UserContext};