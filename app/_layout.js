import React, { useEffect } from 'react';
import { Slot, Stack, router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { Platform, View, ImageBackground, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppContextProvider } from './appContextProvider';
import { LinearGradient } from 'expo-linear-gradient';

export default function Layout() {
    const lastNotificationResponse = Notifications.useLastNotificationResponse();

    // Calls up when a call notification comes up from killed state/background state
    useEffect(() => {
        if (lastNotificationResponse != undefined && lastNotificationResponse != null) {
            router.replace({
                pathname: "call",
                params: { ...lastNotificationResponse.notification.request.content?.data, screenType: "incoming" }
            });
        }
    }, [lastNotificationResponse]);

    // What to do if app is in foreground and a call notification comes up
    useEffect(() => {
        const subscriptionForeground = Notifications.addNotificationReceivedListener(
            notification => {
                if (notification != undefined && notification != null) {
                    router.replace({
                        pathname: "call",
                        params: { ...notification.request.content?.data, screenType: "incoming" }
                    });
                }
            }
        );

        // Channel tells the identity of the notification provider app
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('voipalCall', {
                name: 'voipalCall',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
                sound: "call_sound.wav"
            });
        }

        return () => {
            subscriptionForeground.remove();
        }
    }, []);

    return (
        <AppContextProvider>
            <LinearGradient
                colors={['#8EC5FC', '#A1C4FD', '#E0C3FC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.backgroundImage}
                >
                <StatusBar style="auto" translucent backgroundColor="transparent" />
                <SafeAreaView style={styles.overlay}>
                    {/* <Stack screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="index" />
                        <Stack.Screen name="(tabs)" />
                        <Stack.Screen name="login" />
                        <Stack.Screen name="signUp" />
                    </Stack> */}
                    <Slot/>
                </SafeAreaView>
                </LinearGradient>
        </AppContextProvider>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    overlay: {
        flex: 1,
    },
});
