import { Link } from "expo-router";
import { Alert, Button, Platform, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useState } from "react";

export default function Index() {

  // useEffect(()=>{
  //   //what to do if app is in background and a notification comes up
  //   const subscriptionBackground = Notifications.addNotificationResponseReceivedListener(
  //     notificationResp => {console.log(notificationResp)}
  //   )


  //   // what to do if app is in foreground and a notification comes up
  //   const subscriptionForeground = Notifications.addNotificationReceivedListener(
  //     notification => {console.log("foreground", notification)}
  //   )
  //   return ()=>{
  //     subscriptionForeground.remove();
  //     subscriptionBackground.remove();
  //   }
  // },[])

  const triggerNotification = () => {
    Notifications.scheduleNotificationAsync({
      content:{
        title:"First Notification",
        body:"My first expo notification!",
        sound:"callSound.wav",
        vibrate:false,
      },
      trigger:{
        seconds:2,
        channelId:"voipalCall",
      }
      })
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit </Text>
      <Link href="/login">Login Page</Link>
    </View>
  );
}
