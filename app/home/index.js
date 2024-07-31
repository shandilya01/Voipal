import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { GetContactListById } from "../../api/getContactList";
import { PushCallNotification } from "../../api/pushCallNotification";
import * as Notifications from "expo-notifications";
import { Link, router, useLocalSearchParams } from "expo-router";
// import * as Crypto from 'expo-crypto';
// import { LinearGradient } from "expo-linear-gradient";

// import { Stack} from "expo-router";

// export default function RootLayout() {
//   return (
    
//   );
// }

const generateRandomUniqueRoomId = () => {
    return "123"
    // return Crypto.randomUUID();
}

export default function Home(){
    const user = useLocalSearchParams();
    const [contactList,setContactList] = useState([])
    const [loader, setLoader] = useState(false)

    const initiateCallPushNotification = async(peerId, peerName) => {
        setLoader(true)
        const roomId = generateRandomUniqueRoomId();
        const resp = await PushCallNotification(user.id, peerId, roomId);
        if (resp.success){
            if (resp.status === 200){
                console.log("Call Request Sent")
                router.push({pathname:"call", params:{peerName:peerName, screenType:"outgoing", roomId:roomId}})
            }else{
                console.log("Peer not available")
                Alert.alert("Peer not available")
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
            <TouchableOpacity onPress={() => { initiateCallPushNotification(item.id, item.name) }} style={styles.cardContainer}>
                <View
                    
                    style={styles.contactItem}
                >
                    <Text style = {styles.contactFirstAlphabet}>
                        {item.name[0]}
                    </Text>

                    <View style = {styles.contactInfo}>
                    <Text style={styles.contactTextName}>{item.name}</Text>
                    <Text style={styles.contactText}>{item.email}</Text>
                    <Text style={styles.contactText}>{item.incantation}</Text>
                    </View>
                </View>
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
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    listContainer: {
        padding: 20,
    },
    cardContainer: {
        borderRadius: 15,
        overflow: "hidden",
        marginVertical: 10,
        elevation: 3, // for shadow on Android
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        padding:10
    },
    contactItem: {
        flex:1,
        flexDirection:"row",
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
        backgroundColor:"#F59D82",
        alignItems:"flex-start",
    },
    contactText: {
        fontSize: 15,
        color: "white",
        textAlign: "center",
    },
    contactTextName: {
        fontSize: 18,
        color: "white",
        textAlign: "center",
        textTransform:"capitalize"
    },
    contactFirstAlphabet:{
        borderRadius:60,
        backgroundColor:"yellow",
        flex:1,
        padding:8,
        textTransform:"capitalize",
        fontSize:40,
        textAlign:"center"
    },
    contactInfo:{
        flex:3,
    }
});