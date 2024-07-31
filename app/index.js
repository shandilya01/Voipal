import { Link } from "expo-router";
import {  StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() { 

  return (

<View style={styles.container}>
  <Text style={styles.title}>Welcome to Voipal</Text>
  <Text style={styles.subtitle}>Connect with your friends easily!</Text>
  <Link href='signUp' asChild>
  <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>Get Started</Text>
  </TouchableOpacity>
  </Link>
</View>
  );
}


const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      padding: 20,
  },
  title: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#F59D82",
      marginBottom: 10,
  },
  subtitle: {
      fontSize: 18,
      color: "#333",
      textAlign: "center",
      marginBottom: 30,
  },
  button: {
      backgroundColor: "#F59D82",
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 30,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5, // for shadow on Android
  },
  buttonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "600",
  },
});