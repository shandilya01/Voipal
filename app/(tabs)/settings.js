import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {refreshIncantationById} from '../../api/getContactList'
import { HttpStatusCode } from 'axios';
export default function Settings() {
    const [userId, setUserId] = useState("123456789012345678901234567890");
    const [incantation,setIncantation] = useState("old.random.inc");
    const [name, setName] = useState("John Doe");
    const [email, setEmail] = useState("john.doe@example.com");
    const [birthdate, setBirthdate] = useState("1990-01-01");

    const refreshIncantation = async() => {
        const newIdResponse = await refreshIncantationById(userId)
        if (newIdResponse.success && newIdResponse.status===HttpStatusCode.Ok){
            setIncantation(newIdResponse.data);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.screenHeader}>Settings</Text>

            <View style={styles.fieldContainer}>
                <Text style={styles.label}>Incantation</Text>
                <View style={styles.row}>
                    <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
                        <TextInput
                            style={[styles.input, styles.scrollableInput]}
                            value={incantation}
                            editable={false}
                            multiline={false}
                        />
                    </ScrollView>
                    <TouchableOpacity style={styles.refreshButton} onPress={refreshIncantation}>
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#fff',
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
});
