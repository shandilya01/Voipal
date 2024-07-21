import axios from "axios";

const PostSignUp = async (details) => {
    try{
        const resp = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/signup`, details);
        return {
            success:true,
            data:null,
            status:resp.status,
        };
    }catch (err) {
        return {
            success:false,
            error:(err.message || "Oops! Something wrong from our side!"),
        }
    }
}

export {PostSignUp};