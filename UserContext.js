import { createContext,useState } from "react";
const userType=createContext()
const UserContext=({children})=>{
    const [userId,setUserId]=useState("");
    const [ipAddress,setIpAddress]=useState("192.168.0.143");
     return(
        <userType.Provider value={{userId,setUserId,ipAddress}}>
            {children}
        </userType.Provider>
    )
}

export {userType, UserContext};