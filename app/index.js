import { registerRootComponent } from "expo";
import { Link ,Router, Slot, useRouter} from "expo-router";
import { Alert, Button, Platform, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useState } from "react";

export default function Index() { 
  const router = useRouter()

  

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
    <View>
      <Link href='login' asChild>
      <Button title="Login"></Button>
      </Link>
    </View>
  );
}
