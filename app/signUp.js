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
    const [mobileError, setMobileError] = useState("")
    const [apiError, setApiError] = useState("");

    const handleFieldChanges = (fieldName, e) => {
        switch (fieldName){
            case "email":
                setEmail(e)
                break;
            case "password":
                setPassword(e)
                break;
            case "confirmPassword":
                setConfirmPassword(e);
                break;
            case "name":
                setName(e)
                break;
            case "mobile":
                setMobile(e);
                break;
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
            setApiError(resp.error)
        }
    }

    const validateEmail = () => {
        const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (!regEmail.test(email)){
            setEmailError("Invalid Email")
            return false
        }
        setEmailError("")
        return true;
    }

    const validatePassword = () => {
        if(password.length === 0){
            setPasswordError("Password is required");
            return false
        }        
        else if(password.length < 6){
            setPasswordError("Password should be minimum 6 characters");
            return false
        }      
        else if(password.indexOf(' ') >= 0){        
            setPasswordError("Password cannot contain spaces");                    
            return false      
        }
        else if (password!==confirmPassword){
            setPasswordError("Passwords do not match");
            return false
        }
        console.log(password, confirmPassword)
        setPasswordError("")
        return true
    }
    

    const validateMobile = () => {
        if (mobile.length!=10 && mobile.length!=0){
            setMobileError("Please enter valid mobile number")
            return false
        }
        setMobileError("")
        return true
    }

    const validateAllBeforeSubmit = () => {
      validateEmail()
      validateMobile()
      validatePassword()
      return false
    }

    return (
        <View style = {styles.loginContainer} >
            <StatusBar hidden={true} barStyle = "light-content"/>
            <View style = {styles.loginField}>
                <TextInput onChangeText={(e)=>handleFieldChanges("email",e)} placeholder='Email(UserID)'></TextInput>
            </View>
            <View>
                <Text style={styles.redError}>{emailError!==""?emailError:""}</Text>
            </View>

            <View style = {styles.loginField}>
                <TextInput onChangeText={(e)=>handleFieldChanges("name",e) } placeholder='Full Name'></TextInput>
            </View>
            <View style = {styles.loginField}>
                <TextInput onChangeText={(e)=>handleFieldChanges("password",e)} placeholder='Password'></TextInput>
            </View>
            <View>
                <Text style={styles.redError}>{passWordError!==""?passWordError:""}</Text>
            </View>

            <View style = {styles.loginField}>
                <TextInput onChangeText={(e)=>handleFieldChanges("confirmPassword",e)} placeholder='Confirm Password'></TextInput>
            </View>
            <View style = {styles.loginField}>
                <TextInput onChangeText={(e)=>handleFieldChanges("mobile",e)} placeholder='Mobile'></TextInput>
            </View>
            <View>
                <Text style={styles.redError}>{mobileError!==""?mobileError:""}</Text>
            </View>
            
            <View>
                <Text style={styles.redError}>{apiError!==""?apiError:""}</Text>
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
    redError:{
        color:"pink"
    }
})

export default SignUp;