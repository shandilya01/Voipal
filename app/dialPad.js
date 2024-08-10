import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput } from 'react-native';

export default function DialPad() {
  const [isVisible, setIsVisible] = useState(false);
  const [input, setInput] = useState("");

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
      >
        <View style={styles.modalContainer}>
          <View style={styles.keyboardContainer}>
            <TextInput
              style={styles.inputText}
              value={input}
              onChangeText={setInput}
              autoFocus={true} // Focus automatically when modal opens
              placeholder="Incantation"
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsVisible(false)}>
              <Text style={styles.closeButtonText}>Dial</Text>
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
  dialPadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  },
  inputText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#6200EE',
  },
  closeButton: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
