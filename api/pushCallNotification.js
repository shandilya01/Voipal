import axios from "axios";

const PushCallNotification = async(userId, peerId) => {
    try{
        const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/pushCallNotification`, {params:{peerId:peerId, userId:userId}});
        return {
            success:true,
            data:resp.data,
            status:resp.status,
        }
    }catch (err){
        return {
            success:false,
            error: err.message || "Oops! Something wrong from our side!",
        }
    }
}

export {PushCallNotification}