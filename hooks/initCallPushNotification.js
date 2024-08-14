import * as Crypto from 'expo-crypto';
import { PushCallNotification } from '../api/pushCallNotification';

const generateRandomUniqueRoomId = () => {
    return Crypto.randomUUID();
}

export default async function initiateCallPushNotification (userId, peerId) {
    const roomId = generateRandomUniqueRoomId();
    const resp = await PushCallNotification(userId, peerId, roomId);
    if (resp.success) {
        if (resp.status === 200) {
            return {success:true, message:"Call Request Sent", roomId:roomId};
        } else {
            return {success:false, message:"Peer not available"};
        }
    } else {
        return {success:false,message:"Push notification failed"};
    }
}

