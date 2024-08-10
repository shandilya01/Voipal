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

const refreshIncantationById = async(userId) => {
    try{
        const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/refreshIncantation`,{params :{id: userId}})
        return {
            success:true,
            data:resp.data,
            status:resp.status,
        }
    }catch (err){
        return {
            success:false,
            error:(err.message || "Could Not Update Incantation"),
        }
    }
}

export {GetContactListById,refreshIncantationById};