import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { GetContactListById } from "../../api/getContactList";
import { PushCallNotification } from "../../api/pushCallNotification";
import * as Notifications from "expo-notifications";
import { Link, router, useLocalSearchParams } from "expo-router";

// import { Stack} from "expo-router";

// export default function RootLayout() {
//   return (
    
//   );
// }

const generateRandomUniqueRoomId = () => {
    return "123"
}

export default function Home(){
    const user = useLocalSearchParams();
    // const lastNotificationResponse = Notifications.useLastNotificationResponse()
    const [contactList,setContactList] = useState([])
    const [loader, setLoader] = useState(false)

    const initiateCallPushNotification = async(peerId, peerName) => {
        setLoader(true)
        const roomId = generateRandomUniqueRoomId();
        const resp = await PushCallNotification(user.id, peerId, roomId);
        if (resp.success){
            if (resp.status == 200){
                console.log("Call Accepted by peer, initiating Socket Handshake")
                router.push({pathname:"call", params:{peerName:peerName, screenType:"outgoing", roomId:roomId}})
            }else{
                console.log("Connection Error")
                Alert.alert("Connection Error")
            }
        }else{
            console.log("Push notification failed")
            Alert.alert(resp.error)
        }
        setLoader(false)
    }

    // calls up when a notification comes up from killed state/background state
    // useEffect(()=>{
    //     console.log("last notification response", lastNotificationResponse)
    // },[lastNotificationResponse])

    useEffect(()=>{
        // what to do if app is in foreground and a notification comes up
        const subscriptionForeground = Notifications.addNotificationReceivedListener(
          notification => {
            console.log("foreground", notification)
            console.log(notification.request.content.data)
        }
        )
        return ()=>{
          subscriptionForeground.remove();
        }
      },[])

    useEffect(()=>{
        const populateContacts = async  () => {
            setLoader(true);
            const resp  = await GetContactListById(user.id);
            if(resp.success && resp.status==200){
                setContactList(resp.data);
            }else{
                Alert.alert("Could not fetch Contacts!");
            }
            setLoader(false);
        }
        populateContacts();
    }, []);

    const renderContactItem = ({item}) => {
        return (
            // <Link key={item.name} href={`/call?peerName=${item.name}?screenType=outgoing`} asChild>
                <TouchableOpacity style = {styles.contactItem} onPress={()=>{initiateCallPushNotification(item.id, item.name)}}>
                    <Text>{item.name} - {item.email} - {item.incantation}</Text>
                </TouchableOpacity>
        )
    }

    return (
        <View>
            <FlatList
                data = {contactList}
                renderItem={renderContactItem}
                keyExtractor={item => item.id}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    contactItem:{
        padding:15,
        borderRadius:5,
        backgroundColor:"cyan",
    }
})