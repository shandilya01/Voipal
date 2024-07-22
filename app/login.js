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
    // channel tells the identity of the notification provider app
    if (Platform.OS === 'android') {
      const channelSetResponse = await Notifications.setNotificationChannelAsync('voipalCall', {
        name: 'voipalCall',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound:"callSound.wav"
      });
      console.log("channelSetResponse", channelSetResponse)
    }
  
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
            setPushToken(token)
          }
        }
    
        askPermissionAndGenToken();
      },[])

    const handleFieldChanges = (fieldName, e) => {
        switch (fieldName){
            case "email":
                setEmail(e)
            case "password":
                setPassword(e)
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
        <View style = {styles.loginContainer} >
            <StatusBar hidden={true} barStyle = "light-content"/>
            <View style = {styles.loginField}>
                <TextInput onChangeText={(e)=>handleFieldChanges("email",e)} placeholder="Email"></TextInput>
            </View>
            <View style = {styles.loginField}>
                <TextInput onChangeText={(e)=>handleFieldChanges("password",e)} placeholder="Password"></TextInput>
            </View>
            <Text style={{color:"pink"}}>{errorMessage!=""?errorMessage:""}</Text>
            <TouchableOpacity style={styles.loginButton} onPress = {()=> handleLogin()}>
                <Text style = {{color:'white'}}>LOGIN</Text>
            </TouchableOpacity>

            <Link href='signUp' asChild replace>
                <TouchableOpacity style={styles.loginButton}>
                    <Text style = {{color:'white'}}>New User?</Text>
                </TouchableOpacity>
            </Link>
        </View>
    )
}

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
