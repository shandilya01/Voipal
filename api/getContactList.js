import axios from "axios";

const GetContactListById = async(userId) => {
    try{
        const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/contactsbyid`,{params :{id: userId}})
        return {
            success:true,
            data:resp.data,
            status:resp.status,
        }
    }catch (err){
        return {
            success:false,
            error:(err.message || "Could not fetch Contacts"),
        }
        
    }
}

const refreshVoipIdById = async(userId) => {
    try{
        const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/refreshVoipId`,{params :{id: userId}})
        return {
            success:true,
            data:resp.data,
            status:resp.status,
        }
    }catch (err){
        return {
            success:false,
            error:(err.message || "Could Not Update VoipId"),
        }
    }
}

const getWordList = async() => {
    try{
        const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/getWordList`)
        return {
            success:true,
            data:resp.data,
            status:resp.status,
        }
    }catch (err){
        return {
            success:false,
            error:(err.message || "Could Not Get Word List"),
        }
    }
}

const getUserByVoipId = async (peerVoipId) => {
    try{
        const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/getUserByVoipId`,{params :{voipId: peerVoipId}})
        return {
            success:true,
            data:resp.data,
            status:resp.status,
        }
    }catch (err){
        return {
            success:false,
            error:(err.message || "Could Not Get Word List"),
        }
    }
}

export {GetContactListById,refreshVoipIdById,getWordList,getUserByVoipId};