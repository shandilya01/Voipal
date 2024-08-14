import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {refreshVoipIdById} from '../../api/getContactList'
import { HttpStatusCode } from 'axios';
import * as SecureStorage from 'expo-secure-store';
import { router, useLocalSearchParams } from 'expo-router';
import { AppContext } from '../appContextProvider';

export default function Settings() {
    const params = useContext(AppContext)
    console.log("params", params)
    const user = params.params.user

    const [userId, setUserId] = useState(user.id);
    const [voipId,setVoipId] = useState(user.voipId);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    const refreshVoipId = async() => {
        const newIdResponse = await refreshVoipIdById(userId)
        if (newIdResponse.success && newIdResponse.status===HttpStatusCode.Ok){
            setVoipId(newIdResponse.data);
        }
    };

    const handleLogout = () => {
        SecureStorage.deleteItemAsync("email")
        SecureStorage.deleteItemAsync("password")
        router.replace("/")
    }

    return (
        <View style={styles.container}>
            <View style = {styles.contentContainer}>
                <Text style={styles.screenHeader}>Settings</Text>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>VoipId</Text>
                    <View style={styles.row}>
                        <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
                            <TextInput
                                style={[styles.input, styles.scrollableInput]}
                                value={voipId}
                                editable={false}
                                multiline={false}
                            />
                        </ScrollView>
                        <TouchableOpacity style={styles.refreshButton} onPress={refreshVoipId}>
                            <Ionicons name="refresh-outline" size={24} color="#6200EE" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        placeholderTextColor="#888"
                        editable={false}
                    />
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        keyboardType="email-address"
                        editable={false}
                    />
                </View>
            </View>

            <View style={styles.logoutContainer}>
                <TouchableOpacity style={styles.logoutButton} onPress = {handleLogout}>
                    <Text>Logout</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#fff',
    },
    contentContainer:{
        flex:10,
    },
    screenHeader: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
        fontFamily: "Vidaloka-Regular",
    },
    fieldContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 18,
        color: "#333",
        backgroundColor: "#f9f9f9",
    },
    scrollableInput: {
        width: 'auto',
        minWidth: 100,
        paddingRight: 10,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    scrollContainer: {
        flexGrow: 1,
    },
    refreshButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
    },
    logoutContainer:{
        flex:1,
    },
    logoutButton:{
        backgroundColor:"pink",
        height:40,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:10,
    }

});
