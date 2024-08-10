import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Modal, Animated, Easing } from "react-native";
import { GetContactListById } from "../../api/getContactList";
import { PushCallNotification } from "../../api/pushCallNotification";
import { router, useLocalSearchParams } from "expo-router";
import * as Crypto from 'expo-crypto';
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import DialPad from "../dialPad";

const generateRandomUniqueRoomId = () => {
    return Crypto.randomUUID();
}

export default function Index() {
    const user = useLocalSearchParams();
    const [contactList, setContactList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [isDialPadVisible, setIsDialPadVisible] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    const initiateCallPushNotification = async (peerId, peerName) => {
        setLoader(true);
        const roomId = generateRandomUniqueRoomId();
        const resp = await PushCallNotification(user.id, peerId, roomId);
        if (resp.success) {
            if (resp.status === 200) {
                console.log("Call Request Sent");
                router.push({ pathname: "call", params: { peerName: peerName, screenType: "outgoing", roomId: roomId } });
            } else {
                console.log("Peer not available");
                Alert.alert("Peer not available");
            }
        } else {
            console.log("Push notification failed");
            Alert.alert(resp.error);
        }
        setLoader(false);
    }

    useEffect(() => {
        const populateContacts = async () => {
            setLoader(true);
            const resp = await GetContactListById(user.id);
            if (resp.success && resp.status == 200) {
                setContactList(resp.data);
            } else {
                Alert.alert("Could not fetch Contacts!");
            }
            setLoader(false);
        }
        populateContacts();
    }, []);

    const openDialPad = () => {
        setIsDialPadVisible(true);
        Animated.timing(animation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
        }).start();
    };

    const closeDialPad = () => {
        Animated.timing(animation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.in(Easing.ease),
        }).start(() => setIsDialPadVisible(false));
    };

    const slideUp = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0], // Adjust to control the sliding range
    });

    const renderContactItem = ({ item }) => (
        <TouchableOpacity onPress={() => initiateCallPushNotification(item.id, item.name)} style={styles.cardContainer}>
            <LinearGradient
                colors={['#8EC5FC', '#E0C3FC']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.contactItem}
            >
                <Text style={styles.contactFirstAlphabet}>{item.name[0]}</Text>
                <View style={styles.contactInfo}>
                    <Text style={styles.contactTextName}>{item.name}</Text>
                    <Text style={styles.contactText}>{item.email}</Text>
                    <Text style={styles.contactText}>{item.incantation}</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.screenHeader}>all contacts</Text>
            {loader ? (
                <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />
            ) : (
                <FlatList
                    data={contactList}
                    renderItem={renderContactItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}

            <View style={styles.dialButton} onPress={openDialPad}>
                <DialPad></DialPad>
            </View>

            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    screenHeader: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        textTransform: "capitalize",
        fontFamily: "Vidaloka-Regular", 
    },
    loader: {
        flex: 1,
        justifyContent: "center",
    },
    listContainer: {
        paddingBottom: 20,
    },
    cardContainer: {
        borderRadius: 15,
        overflow: "hidden",
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4, 
    },
    contactItem: {
        flexDirection: "row",
        padding: 15,
        alignItems: "center",
        borderRadius: 15,
    },
    contactFirstAlphabet: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#FFF",
        color: "#6200EE",
        fontSize: 30,
        textAlign: "center",
        lineHeight: 60,
        fontWeight: "bold",
        marginRight: 15,
    },
    contactInfo: {
        flex: 1,
    },
    contactTextName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    contactText: {
        fontSize: 16,
        color: "#555",
    },
    dialButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#6200EE',
        padding: 20,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dialPadContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
    },
    dialPadText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});
