import { registerRootComponent } from "expo";
import { Link ,Router, Slot, useRouter} from "expo-router";
import { Alert, Button, Platform, Pressable, Text, View } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useEffect, useState } from "react";

export default function Index() { 
  

  const triggerNotification = () => {
    Notifications.scheduleNotificationAsync({
      content:{
        title:"First Notification",
        body:"My first expo notification!",
        sound:"call_sound.wav",
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
      <Pressable>
        <Text>Login</Text>
      </Pressable>
      </Link>
    </View>
  );
}
