import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native";
import { mediaDevices, RTCIceCandidate, RTCPeerConnection, RTCView } from "react-native-webrtc";

const iceServers = {
    iceServers: [
      { urls: "stun:stun.services.mozilla.com" },
      { urls: "stun:stun.l.google.com:19302" },
    ],
  };

export default function Call(){
    const props = useLocalSearchParams();
    const [currScreenType,setCurrScreenType] = useState(props.screenType)
    const ws = useRef(null)
    const pc = useRef(null);
    const isConnectedWS = useRef(false)
    const [localStream,setLocalStream] = useState(null)
    const [remoteStream,setRemoteStream] = useState(null)

    useEffect(()=>{
        console.log("starting local stream as pc is already initialized")
        startLocalStream();

        ws.current = new WebSocket('ws://192.168.29.102:5001/ws')
        pc.current = new RTCPeerConnection(iceServers)

        ws.current.onopen = () => {
            isConnectedWS.current= true;
            if (currScreenType === "outgoing"){
                console.log("firing join event for", currScreenType)
                fireJoinEvent(props.roomId)
            }
            console.log('Connected to the server', props.name, props.peerName);
        };
        ws.current.onerror = (error) => {
            console.log('Connection error:', error);
        };
        ws.current.onmessage = (event) => {
            console.log("message listen", event)
            data = JSON.parse(event.data)
            handleSocketMessage(data)
        };

        return ()=>{
                console.log("Closing socket"); 
                isConnectedWS.current = false
                ws.current.close(); 
                pc.current.close();
                if (localStream) {
                    localStream.getTracks().forEach(track => track.stop());
                }
            }
    },[])

    
    
    const startLocalStream = async () => {
        const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
        console.log("local stream", stream)
        pc.current.addTrack(stream.getTracks()[0], stream);
        pc.current.addTrack(stream.getTracks()[1], stream);
        setLocalStream(stream);
    };

    const sendMessage = (message) => {
        if (ws.current && isConnectedWS.current) {
            ws.current.send(JSON.stringify(message));
            console.log("message sent", message)
        }else{
            console.log("could not send message", ws.current, isConnectedWS)
        }
    }

    const fireJoinEvent = (roomId) => {
        const message = { event: 'join', roomId: roomId };
        sendMessage(message)
    }

    const handleAddStreamEvent = (e) => {
        console.log("Got remote stream")
        setRemoteStream(e.stream)
    }

    const handleIceCandidateEvent = (e) => {
        if (e.candidate){
            console.log("seding ice candidate");
            const message = { event: 'candidate', roomId: props.roomId ,data:e.candidate};
            sendMessage(message)
        }
    }

    const handleSocketMessage = (data) => {
        console.log("handling socket message data", data, data.Event)
        switch(data.Event){
            case "joined":
                console.log("joined")
                // fire the ready event for all the users except the joined one to start recieving ice candidates;
                sendMessage({ event: 'ready', roomId: props.roomId })
                break;
            case "ready":
                // someone joined lets create ice candidates then for him and send him offer
                pc.current.onicecandidate = handleIceCandidateEvent // send the ice candidate
                pc.current.onaddstream = handleAddStreamEvent
                // pc.current.addTrack(localStream.getTracks()[0], localStream);
                // pc.current.addTrack(localStream.getTracks()[1], localStream);
                pc.current.createOffer().then((offer) => {
                    pc.current.setLocalDescription(offer);
                    sendMessage({event:"offer", data:offer, roomId:props.roomId})
                }).catch(err => {console.log("offer error", err)})
                break;
            case "candidate":
                // other members have sent you a candidate now set it up
                console.log("recieved candidate data", data)
                pc.current.addIceCandidate(new RTCIceCandidate(data.Data))
                break;
            case "offer":
                // other members have sent you offer now set it up a sent them answer too
                pc.current.onicecandidate = handleIceCandidateEvent // send the ice candidate
                pc.current.onaddstream = handleAddStreamEvent
                // pc.current.addTrack(localStream.getTracks()[0], localStream);
                // pc.current.addTrack(localStream.getTracks()[1], localStream);
                pc.current.setRemoteDescription(data.Data)
                pc.current.createAnswer().then((answer) => {
                    pc.current.setLocalDescription(answer);
                    sendMessage({event:"answer", data:answer, roomId:props.roomId})
                }).catch(err => {console.log("answer error", err)})
                break;
            case "answer":
                //recieve answer from the new joinee now set this as remote description
                console.log("recieved asnwer data", data)
                pc.current.setRemoteDescription(data.Data)
                break;

            // extra cases if peer not able to join for some reason
            case "full":
                console.log("room full not able to join")
                break;
            default:
                console.log("message event not defined", data)
        };
    }

    let currScreen;

    switch (currScreenType) {
        case "outgoing":
            currScreen = (
                <View style={styles.callStatus}>
                    <Text style={styles.callText}>Calling {props.peerName}... to join in room {props.roomId}</Text>
                </View>
            );
            break;
        case "incoming":
            currScreen = (
                <View style={styles.callStatus}>
                    <Button
                        onPress={() => { fireJoinEvent(props.roomId); }}
                        title="Accept incoming call"
                    />
                    <Text style={styles.callText}>Incoming call from {props.name} in room: {props.roomId}</Text>
                </View>
            );
            break;
        case "ongoing":
            currScreen = (
                <View style={styles.callStatus}>
                    <Text style={styles.callText}>Room ID: {props.roomId}</Text>
                </View>
            );
            break;
        default:
            currScreen = (
                <View style={styles.callStatus}>
                    <Text style={styles.callText}>Screen type not given</Text>
                </View>
            );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.videoContainer}>
                {localStream && (
                    <RTCView streamURL={localStream.toURL()} style={styles.localVideo} />
                )}
                {remoteStream && (
                    <RTCView streamURL={remoteStream.toURL()} style={styles.remoteVideo} />
                )}
            </View>
            {currScreen}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F0F0",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    videoContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginBottom: 20,
    },
    localVideo: {
        width: 200,
        height: 200,
        borderRadius: 10,
        backgroundColor: "#000",
    },
    remoteVideo: {
        width: 500,
        height: 500,
        borderRadius: 10,
        backgroundColor: "#000",
    },
    callStatus: {
        alignItems: "center",
        marginVertical: 20,
    },
    callText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        textAlign: "center",
        paddingHorizontal: 10,
    },
});