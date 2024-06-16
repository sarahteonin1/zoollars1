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
  },
  keyboard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  submitButton: {
    width: '40%',
    marginTop: 10,
    marginBottom: 10,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6E9277',
    borderRadius: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default NumberKeyboardModal;
