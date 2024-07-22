import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { GetContactListById } from "../../api/getContactList";
import { PushCallNotification } from "../../api/pushCallNotification";
import { Link, useLocalSearchParams } from "expo-router";

// import { Stack} from "expo-router";

// export default function RootLayout() {
//   return (
    
//   );
// }


export default function Home(){
    const user = useLocalSearchParams();
    const [contactList,setContactList] = useState([])
    const [loader, setLoader] = useState(false)

    const initiateCallPushNotification = async(peerId) => {
        setLoader(true)
        console.log("peerId", peerId)
        const resp = await PushCallNotification(user.id, peerId);
        if (resp.success){
            if (resp.status == 200){
                console.log("Call Accepted by peer, initiating Socket Handshake")
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
            // <Link key={item.name} href={`/call?peerName=${item.name}`} asChild>
                <TouchableOpacity style = {styles.contactItem} onPress={()=>{initiateCallPushNotification(item.id)}}>
                    <Text>{item.name} - {item.email} - {item.incantation}</Text>
                </TouchableOpacity>
            // </Link>
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