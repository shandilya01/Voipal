import axios from "axios";

const PostLogin = async(userObj) => {
    try{
        console.log("lgon piost", userObj)
        const resp = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/login`, userObj);
        console.log("resp",resp)
        return {
            success:true,
            data:resp.data,
            status:resp.status,
        };
    }catch (err){
        return {
            success:false,
            error:(err.message || "Oops! Something wrong from our side!"),
        }
        // console.log("error", err.message)

        // return {
        //     success:true,
        //     data : {
        //         id: "32311",
        //         name: "Shandilya",
        //         email: "tushar0shandilya@gmail.com",
        //         incantation: "shandilya.shandilya.shandilya",
        //         mobile: "",
        //     },
        //     status:200,
        // }
    }
    
}

export {PostLogin};