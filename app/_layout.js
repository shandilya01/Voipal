import React, { useEffect } from 'react';
import { Slot, router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { Platform, SafeAreaView, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {

    const lastNotificationResponse = Notifications.useLastNotificationResponse()

    // calls up when a call notification comes up from killed state/background state
    useEffect(()=>{
        if (lastNotificationResponse!=undefined && lastNotificationResponse!=null){
        router.replace({pathname:"call", params:{...lastNotificationResponse.notification.request.content?.data, screenType:"incoming"}})
        }
        
    },[lastNotificationResponse])

    // what to do if app is in foreground and a call notification comes up
    useEffect(()=>{
        
        const subscriptionForeground = Notifications.addNotificationReceivedListener(
        notification => {
            if (notification!=undefined && notification!=null){
            router.replace({pathname:"call", params:{...notification.request.content?.data, screenType:"incoming"}})
            }
        }
        )

        // channel tells the identity of the notification provider app
    
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('voipalCall', {
            name: 'voipalCall',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            sound:"call_sound.wav"
          });
        }

        return ()=>{
        subscriptionForeground.remove();
        }
    },[])

  return (
    <SafeAreaView style={{ flex: 1  , marginVertical:20}}>
      <StatusBar style = {{ color :"black"}}/>
      <View style={{ flex: 1, justifyContent: 'flex-start', padding: 16 }}>
        <Slot/>
      </View>
    </SafeAreaView>
  );
}
