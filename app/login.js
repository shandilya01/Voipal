import { useState ,useEffect} from "react";
import {StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {PostLogin} from '../api/postLogin';
import { Link, router } from "expo-router";

Notifications.setNotificationHandler({
    handleNotification: async() => {
      return {
        shouldShowAlert:true,
        shouldPlaySound:true,
        shouldSetBadge:false,
      };
    }
  })

const getPushNotificationsTokenAsync = async() => {
    // the function expects the permission is granted for notifications
    console.log("getting token")
  
    try{
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      const token = (await Notifications.getExpoPushTokenAsync({projectId})).data
      return token;
    }catch(err){
      console.log("Error", err)
      return null;
    }
  }

export default function Login(){
    const [email ,setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [pushToken, setPushToken] = useState("") // to be changed later

    useEffect(()=>{
        // ask for permissions
        const askPermissionAndGenToken = async() => {
          const {status} = await Notifications.requestPermissionsAsync();
          if(status!=="granted"){
            Alert.alert("Notifications Permissions not granted", "You might miss important calls if the app is in background")
          }else{
            const token = await getPushNotificationsTokenAsync()
            console.log("token ", token)
            setPushToken(token)
          }
        }
    
        askPermissionAndGenToken();
      },[])

    const handleFieldChanges = (fieldName, e) => {
        switch (fieldName){
            case "email":
                setEmail(e)
                break;
            case "password":
                setPassword(e)
                break;
            default:
              break;
        }
    }

    const handleLogin = async() => {
        userObj = {
            email:email,
            password : password,
            pushToken : pushToken,
        }

        const resp = await PostLogin(userObj);
        console.log("handle login response", resp);
        if (resp.success){
            if (resp.status == 200){
                router.replace({pathname:'home', params:resp.data})
            }else{
                setErrorMessage("Credentials Not Found!")
            }
        }else{
            setErrorMessage(resp.error);
        }

    }

    return (
      <View style={styles.loginContainer}>
          <StatusBar hidden={true} barStyle="light-content" />
          <View style={styles.loginField}>
              <TextInput
                  onChangeText={(e) => handleFieldChanges("email", e)}
                  placeholder="Email"
                  style={styles.input}
                  placeholderTextColor="#888"
              />
          </View>
          <View style={styles.loginField}>
              <TextInput
                  onChangeText={(e) => handleFieldChanges("password", e)}
                  placeholder="Password"
                  secureTextEntry
                  style={styles.input}
                  placeholderTextColor="#888"
              />
          </View>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>

          <Link href="signUp" asChild replace>
              <TouchableOpacity style={styles.signupButton}>
                  <Text style={styles.signupText}>New User? Sign Up</Text>
              </TouchableOpacity>
          </Link>
      </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
      flex: 1,
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
  },
  loginField: {
      width: "100%",
      marginBottom: 20,
  },
  input: {
      width: "100%",
      height: 50,
      borderColor: "#ddd",
      borderWidth: 1,
      borderRadius: 25,
      paddingHorizontal: 15,
      fontSize: 16,
      color: "#333",
      backgroundColor: "#f9f9f9",
  },
  errorText: {
      color: "#F59D82",
      fontSize: 14,
      marginBottom: 10,
  },
  loginButton: {
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
  signupButton: {
      marginTop: 15,
  },
  signupText: {
      color: "#F59D82",
      fontSize: 16,
      fontWeight: "600",
  },
});
