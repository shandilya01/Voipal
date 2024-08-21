import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native";
import { mediaDevices, RTCIceCandidate, RTCPeerConnection, RTCView } from "react-native-webrtc";

const iceServers = {
  iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

export default function Call() {
  console.log("rerendered Call")
  const props = useLocalSearchParams();
  const currScreenType = useRef(props.screenType);
  const ws = useRef(null);
  const pc = useRef(null);
  const isConnectedWS = useRef(false);
  const localStreamRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const [micEnabled, setMicEnabled] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(true)

  useEffect(() => {
    console.log("starting local stream as pc is already initialized");
    startLocalStream();

    ws.current = new WebSocket('ws://192.168.0.117:5001/ws');
    pc.current = new RTCPeerConnection(iceServers);

    ws.current.onopen = () => {
      isConnectedWS.current = true;
      if (currScreenType.current === "outgoing") {
        console.log("firing join event")  
        fireJoinEvent(props.roomId);
      }
      console.log('Connected to the server', props.name, props.peerName);
    };

    ws.current.onerror = (error) => {
      console.log('Connection error:', error);
      Alert.alert(error);
      router.replace('(tabs)/')
    };

    ws.current.onmessage = (event) => {
      console.log("message listen", event);
      const data = JSON.parse(event.data);
      handleSocketMessage(data);
    };

    return () => {
      console.log("Closing socket");
      isConnectedWS.current = false;
      ws.current.close();
      pc.current.close();
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = micEnabled;
      });
    }
  }, [micEnabled]);

  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = videoEnabled;
      });
    }
  }, [videoEnabled]);

  const startLocalStream = async () => {
    const stream = await mediaDevices.getUserMedia({ video: true, audio: true });
    console.log("local stream", stream);
    stream.getTracks().forEach(track => pc.current.addTrack(track, stream));
    localStreamRef.current = stream
    setLocalStream(stream);
  };

  const sendMessage = (message) => {
    if (ws.current && isConnectedWS.current) {
      ws.current.send(JSON.stringify(message));
      console.log("message sent", message);
    } else {
      console.log("could not send message", ws.current, isConnectedWS);
    }
  };

  const fireJoinEvent = (roomId) => {
    const message = { event: 'join', roomId: roomId };
    sendMessage(message);
  };

  const handleAddStreamEvent = (e) => {
    console.log("Got remote stream", e);
    if (e.streams && e.streams[0]) {
      setRemoteStream(e.streams[0]);
      currScreenType.current = "ongoing";
    }
  };

  const handleIceCandidateEvent = (e) => {
    if (e.candidate) {
      console.log("sending ice candidate");
      const message = { event: 'candidate', roomId: props.roomId, data: e.candidate };
      sendMessage(message);
    }
  };

  const handleSocketMessage = (data) => {
    console.log("handling socket message data", data, data.Event);
    switch (data.Event) {
      case "joined":
        console.log("joined");
        sendMessage({ event: 'ready', roomId: props.roomId });
        break;
      case "ready":
        pc.current.onicecandidate = handleIceCandidateEvent;
        pc.current.ontrack = handleAddStreamEvent;
        pc.current.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        }).then((offer) => {
          pc.current.setLocalDescription(offer);
          sendMessage({ event: "offer", data: offer, roomId: props.roomId });
        }).catch(err => { console.log("offer error", err); });
        break;
      case "candidate":
        console.log("received candidate data", data);
        pc.current.addIceCandidate(new RTCIceCandidate(data.Data));
        break;
      case "offer":
        pc.current.onicecandidate = handleIceCandidateEvent;
        pc.current.ontrack = handleAddStreamEvent;
        pc.current.setRemoteDescription(data.Data);
        pc.current.createAnswer().then((answer) => {
          pc.current.setLocalDescription(answer);
          sendMessage({ event: "answer", data: answer, roomId: props.roomId });
        }).catch(err => { console.log("answer error", err); });
        break;
      case "answer":
        console.log("received answer data", data);
        pc.current.setRemoteDescription(data.Data);
        break;
      case "full":
        console.log("room full, not able to join");
        break;
      default:
        console.log("message event not defined", data);
    }
  };

  let currScreen;

  switch (currScreenType.current) {
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
    <View
      style={styles.container}
    >
      <View style={styles.videoContainer}>
        {localStreamRef.current && (
          <RTCView streamURL={localStreamRef.current.toURL()} style={styles.localVideo} />
        )}
        {remoteStream && (
          <RTCView streamURL={remoteStream.toURL()} style={styles.remoteVideo} />
        )}
        
      </View>
      
      {currScreen}

      <View style = {styles.buttonBar}>
      <TouchableOpacity style = {styles.micButton} onPress={()=>setMicEnabled(!micEnabled)}>
            <Ionicons name={micEnabled?"mic-outline":"mic-off-outline"} size={40} color="#6200EE" />
        </TouchableOpacity>
        <TouchableOpacity style = {styles.dialButton} onPress={()=>router.replace('(tabs)/')}>
            <Ionicons name="call" size={40} color="#a84032" />
        </TouchableOpacity>
        <TouchableOpacity style = {styles.videoButton} onPress={()=>setVideoEnabled(!videoEnabled)}>
            <Ionicons name={videoEnabled?"videocam-outline":"videocam-off-outline"} size={40} color="#6200EE" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: Dimensions.get('window').width * 0.4,
    height: Dimensions.get('window').width * 0.4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#F59D82",
  },
  remoteVideo: {
    width: Dimensions.get('window').width * 0.8,
    height: Dimensions.get('window').width * 0.8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#F59D82",
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
  dialButton: {
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  videoButton:{
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonBar:{
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30, 
    flexDirection:'row',
    width:'100%',
    justifyContent:'space-evenly',
  }
});
