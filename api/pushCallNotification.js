import axios from "axios";

const PushCallNotification = async(userId, peerId, roomId) => {
    try{
        const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/pushCallNotification`, {params:{peerId:peerId, userId:userId, roomId:roomId}});
        console.log("dsad",resp)
        return {
            success:true,
            data:resp.data,
            status:resp.status,
        }
    }catch (err){
        console.log("dsad",err)
        return {
            success:false,
            error: err.response?.data?.message || err.message ||"Oops! Something wrong from our side!",
        }
    }
}

export {PushCallNotification}