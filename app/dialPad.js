import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, FlatList, TouchableHighlight, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import {getUserByVoipId, getWordList } from '../api/getContactList';
import { HttpStatusCode } from 'axios';
import initiateCallPushNotification from '../hooks/initCallPushNotification';
import { router } from 'expo-router';
import { AppContext } from './appContextProvider';

export default function DialPad() {
  const params = useContext(AppContext)
  const user = params.params.user

  const [isVisible, setIsVisible] = useState(false);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const inputRef = useRef(null)

  const wordList = useRef([])

  useEffect(()=>{
    const populateWordList = async () => {
      const resp = await getWordList()
      if (resp.success && resp.status === HttpStatusCode.Ok){
        wordList.current = resp.data
      }
    };

    populateWordList()
  },[])

  const handleCallDial = async () => {
    const peerVoipId = input
    const resp = await getUserByVoipId(peerVoipId)
    if (resp.success && resp.status === HttpStatusCode.Ok){
      const peer = resp.data
      const notification = await initiateCallPushNotification(user.id, peer.id)
      
      if (notification.success){
          router.push({ pathname: "call", params: { peerName: peer.name, screenType: "outgoing", roomId: notification.roomId } });
      }else{
          Alert.alert(notification.message)
      }
    }else{
      Alert.alert(resp.error)
    }
  }

  const handleInputChange = (text) => {
    setInput(text);
    const arr = text.split('.')
    const suggText = arr[arr.length-1];
    
    const filteredSuggestions = wordList.current.filter((word) =>
      word.startsWith(suggText.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
    
  };

  const handleSuggestionPress = (suggestion) => {
    const arr = input.split('.')
    arr[arr.length-1] = suggestion
    const value = arr.reduce((prev,curr, ind) => {
      prev+=curr; 
      if (ind!=2){
        prev+='.'; 
      }
      return prev
    },"")
    setInput(value); 
    setSuggestions(wordList.current)
  };

  return (
    <>
      <TouchableOpacity style={styles.dialPadButton} onPress={() => setIsVisible(true)}>
        <Ionicons name="call" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
        onShow={()=>{setTimeout(()=>inputRef.current.focus(),50)}}
      >
        <View style={styles.modalContainer}>
          <View style={styles.keyboardContainer}>
          <TextInput
            ref={inputRef}
            autoCapitalize='none'
            style={styles.inputText}
            value={input}
            onChangeText={handleInputChange}
            placeholder="VoipId"
            autoFocus={false}
          />

            {suggestions.length > 0 && (
              <FlatList
                keyboardShouldPersistTaps={"always"}
                keyboardDismissMode='none'
                data={suggestions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableHighlight
                    underlayColor="#f0f0f0"
                    onPress={() => {handleSuggestionPress(item); }}
                  >
                    <Text style={styles.suggestionText}>{item}</Text>
                  </TouchableHighlight>
                )}
                style={styles.suggestionsContainer}
              />
            )}
            <TouchableOpacity style={styles.dialButton} onPress={() => {setIsVisible(false); handleCallDial()}}>
              <Text style={styles.dialButtonText}>Dial</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingCloseButton} onPress={() => setIsVisible(false)}>
              <MaterialIcons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dialPadButton: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardContainer: {
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative', // Add relative positioning to contain absolute positioning
  },
  inputText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#6200EE',
  },
  suggestionsContainer: {
    maxHeight: 150, // Adjust the height as needed
    marginBottom: 20,
  },
  suggestionText: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  dialButton: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  dialButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  floatingCloseButton: {
    position: 'absolute',
    top: -60, // Adjust to be just above the top of the modal
    left: '50%',
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 20,
    elevation: 5,
  },
});
