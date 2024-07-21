import { useLocalSearchParams } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

// 3 different states -> 1. call outgoing, 2. call incoming, 3. call ongoing
// webrtc // wbsockets

export default function Call(){
    const props = useLocalSearchParams();
    return (
        <View>
            <Text>Calling : {props.peerName} ...</Text>
            <TouchableOpacity>
                <Text>Click to Accept</Text>
            </TouchableOpacity>
        </View>
    );
}