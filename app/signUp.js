import React, {useState, useEffect} from 'react';

import {View,
    Text,
    Keyboard,
    StyleSheet,
    StatusBar,
    TextInput,
    Button,
    TouchableOpacity,
    Alert
} from 'react-native';

import {PostSignUp} from '../api/postSignUp';
import { Link, router } from 'expo-router';

const SignUp = () => {
    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState(""); // optional Field

    const [emailError , setEmailError] = useState("");
    const [passWordError, setPasswordError] = useState("");

    const handleFieldChanges = (fieldName, e) => {
        switch (fieldName){
            case "email":
                setEmail(e)
            case "password":
                setPassword(e)
            case "confirmPassword":
                setConfirmPassword(e);
            case "name":
                setName(e)
            case "mobile":
                setMobile(e);
        }
    }

    const handleSignUp = async() => {
        if (!validateAllBeforeSubmit()){
            return
        }
        userObj = {
            name : name,
            password : password,
            email : email,
            mobile : mobile,
        }
        const resp = await PostSignUp(userObj);
        if (resp.success && resp.status==200){
            router.replace("login")
        }else{
            Alert.alert("Couldnt sign you up!")
        }
    }

    const validateEmail = () => {

    }

    const validatePassword = () => {

    }
    
    const validatePasswordMatch = () => {

    }

    const validateMobile = () => {

    }

    const validateAllBeforeSubmit = () => {
        return true;
    }

    return (
        <View style = {styles.loginContainer} >
            <StatusBar hidden={true} barStyle = "light-content"/>
            <View style = {styles.loginField}>
                <TextInput onChangeText={(e)=>handleFieldChanges("email",e)} placeholder='Email(UserID)'></TextInput>
            </View>
            <View style = {styles.loginField}>
                <TextInput onChangeText={(e)=>handleFieldChanges("name",e) } placeholder='Full Name'></TextInput>
            </View>
            <View style = {styles.loginField}>
                <TextInput onChangeText={(e)=>handleFieldChanges("password",e)} placeholder='Password'></TextInput>
            </View>
            <View style = {styles.loginField}>
                <TextInput onChangeText={(e)=>handleFieldChanges("confirmPassword",e)} placeholder='Confirm Password'></TextInput>
            </View>
            <View style = {styles.loginField}>
                <TextInput onChangeText={(e)=>handleFieldChanges("mobile",e)} placeholder='Mobile'></TextInput>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress = {()=> handleSignUp()}>
                <Text style = {{color:'white'}}>SIGN UP</Text>
            </TouchableOpacity>

            <Link href='login' asChild replace>
                <TouchableOpacity style={styles.loginButton}>
                    <Text style = {{color:'white'}}>Already Registered?</Text>
                </TouchableOpacity>
            </Link>

        </View>
    )
};

const styles = StyleSheet.create({
    loginContainer:{
        flex:1,
        backgroundColor: "grey",
        alignItems:"center",
    },
    loginField:{
        flex:1,
        backgroundColor:"grey",
        flexDirection:"row",
    },
    loginButton: {
        width: "80%",
        borderRadius: 25,
        minWidth : 250,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        backgroundColor: "purple",
      },
})

export default SignUp;