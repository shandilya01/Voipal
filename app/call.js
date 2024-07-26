import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native";
import io from "socket.io-client";

// 3 different states -> 1. call outgoing, 2. call incoming, 3. call ongoing
// webrtc // wbsockets

export default function Call(){
    const props = useLocalSearchParams();
    const [currScreenType,setCurrScreenType] = useState(props.screenType)
    const [ws,setWs] = useState(null);
    const [isConnected, setIsConnected] = useState(false)
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(()=>{
        const socket = new WebSocket('ws://192.168.29.102:5001/ws')
        socket.onopen = () => {
            setIsConnected(true)
            console.log('Connected to the server');
        };
        socket.onerror = (error) => {
            console.log('Connection error:', error);
        };
        socket.onmessage = (event) => {
            console.log("got event", event)
        };
        setWs(socket)
        console.log("socket status", socket)

        return ()=>{console.log("Closing socket"); socket.close()}
    },[])
    
    const fireJoinEvent = (roomId) => {
        console.log(ws, roomId, "dsad12")
        if (ws && roomId && isConnected) {
            const message = { event: 'join', roomId: roomId };
            ws.send(JSON.stringify(message));
            console.log("message sent")
        }
    }

    let currScreen;

    switch (currScreenType){
        case "outgoing":
            console.log("firing join event for outgoing")
            fireJoinEvent(props.roomId)
            currScreen = <View>
                    <Text>Calling : {props.peerName} ... to join in room {props.roomId}</Text>
                </View>
                
            break;

        // Id          int    `json:"id"`
        // Name        string `json:"name"`
        // Email       string `json:"email"`
        // PhoneNumber string `json:"phoneNumber"`
        // Incantation string `json:"incantation"`
        // RoomId      string `json:"roomId"`
        case "incoming":
            currScreen = <View>
                <Button onPress={()=>{fireJoinEvent(props.roomId)}} title ='Accept incoming Call'>Press to Accept Incoming Call from User : {props.name}</Button>
                <Text>from {props.name} in room : {props.roomId}</Text>
            </View>
            break;
        case "ongoing":
            currScreen = <View>
                <Text>Timer started</Text>
            </View>
            break;
        default :
            currScreen = <View><Text>Screen Type not given</Text></View>
    }
    
    return <SafeAreaView>{currScreen}</SafeAreaView>
}