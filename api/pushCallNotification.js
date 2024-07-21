import axios from "axios";

const PushCallNotification = async(userId) => {
    try{
        const resp = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/pushCallNotification`, userId);
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