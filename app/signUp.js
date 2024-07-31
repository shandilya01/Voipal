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
    const [passwordError, setPasswordError] = useState("");
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
      var validated = validateEmail()
      validated&=validateMobile()
      validated&=validatePassword()
      return validated
    }

    return (
        <View style={styles.signUpContainer}>
            <StatusBar hidden={true} barStyle="dark-content" />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Email (UserID)'
                    onChangeText={(e) => handleFieldChanges("email", e)}
                    placeholderTextColor="#888"
                />
                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Full Name'
                    onChangeText={(e) => handleFieldChanges("name", e)}
                    placeholderTextColor="#888"
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    secureTextEntry
                    onChangeText={(e) => handleFieldChanges("password", e)}
                    placeholderTextColor="#888"
                />
                {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Confirm Password'
                    secureTextEntry
                    onChangeText={(e) => handleFieldChanges("confirmPassword", e)}
                    placeholderTextColor="#888"
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Mobile'
                    keyboardType='numeric'
                    onChangeText={(e) => handleFieldChanges("mobile", e)}
                    placeholderTextColor="#888"
                />
                {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}
            </View>

            {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}

            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>

            <Link href='login' asChild replace>
                <TouchableOpacity style={styles.loginRedirectButton}>
                    <Text style={styles.redirectText}>Already Registered? Login</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    signUpContainer: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    inputContainer: {
        width: "100%",
        marginBottom: 15,
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 25,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
        color: "#333",
    },
    errorText: {
        color: "#F59D82",
        fontSize: 14,
        marginTop: 5,
        textAlign: "left",
        alignSelf: "stretch",
        paddingHorizontal: 15,
    },
    signUpButton: {
        width: "100%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F59D82",
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
    loginRedirectButton: {
        marginTop: 15,
    },
    redirectText: {
        color: "#F59D82",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default SignUp;