import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';

const NumberKeyboardModal = ({ visible, onClose, onSetAmount }) => {
  const [input, setInput] = useState('');

  const handlePress = (value) => {
    if (value === 'C') {
      setInput('');
    } else if (value === '←') {
      setInput(input.slice(0, -1));
    } else {
      setInput((prev) => prev + value);
    }
  };

  const handleSubmit = () => {
    onSetAmount(input);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.container}>
          <TouchableWithoutFeedback>
            <View style={styles.keyboard}>
              <Text style={styles.input}>{input}</Text>
              <View style={styles.row}>
                {['1', '2', '3'].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={styles.button}
                    onPress={() => handlePress(value)}
                  >
                    <Text style={styles.buttonText}>{value}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.row}>
                {['4', '5', '6'].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={styles.button}
                    onPress={() => handlePress(value)}
                  >
                    <Text style={styles.buttonText}>{value}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.row}>
                {['7', '8', '9'].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={styles.button}
                    onPress={() => handlePress(value)}
                  >
                    <Text style={styles.buttonText}>{value}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.row}>
                {['C', '0', '←'].map((value) => (
                  <TouchableOpacity
                    key={value}
                    style={styles.button}
                    onPress={() => handlePress(value)}
                  >
                    <Text style={styles.buttonText}>{value}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>Set Amount</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  keyboard: {
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  input: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'right',
    width: '90%',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
  },
  button: {
    width: '30%',
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6e9277',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
  submitButton: {
    marginTop: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: '#6e9277',
    borderRadius: 5,
    alignSelf: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default NumberKeyboardModal;
