import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabLayout() {
    return (
        <View style={styles.container}>
            <Tabs
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarActiveTintColor: '#6200EE', // Primary accent color
                    tabBarInactiveTintColor: '#999', // Lighter for inactive items
                    tabBarStyle: {
                        backgroundColor: '#fff',
                        height: 60,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 6,
                        elevation: 8, 
                    },
                    tabBarLabelStyle: {
                        fontSize: 12,
                        textTransform: "capitalize",
                        paddingBottom: 4,
                    },
                    tabBarIcon: ({ color, size }) => {
                        let iconName;

                        if (route.name === 'index') {
                            iconName = 'home-outline';
                        } else if (route.name === 'settings') {
                            iconName = 'settings-outline';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
