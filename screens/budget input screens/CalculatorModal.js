// CalculatorModal.js
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const CalculatorModal = ({ isVisible, onClose, onCalculate }) => {
  const [value, setValue] = useState('');
  
  const handlePress = (input) => {
    if (input === 'C') {
      setValue('');
    } else if (input === '=') {
      try {
        const result = eval(value);
        setValue(result.toString());
      } catch (e) {
        setValue('Error');
      }
    } else if (input === 'Enter') {
      try {
        const result = eval(value);
        setValue(result.toString());
        onCalculate(result.toString());
      } catch (e) {
        setValue('Error');
      }
    } else {
      setValue(value + input);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.calculatorContainer}>
              <Text style={styles.valueText}>{value || '0'}</Text>
              <View style={styles.buttonRow}>
                {['1', '2', '3', '+'].map((item) => (
                  <TouchableOpacity key={item} style={styles.button} onPress={() => handlePress(item)}>
                    <Text style={styles.buttonText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.buttonRow}>
                {['4', '5', '6', '-'].map((item) => (
                  <TouchableOpacity key={item} style={styles.button} onPress={() => handlePress(item)}>
                    <Text style={styles.buttonText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.buttonRow}>
                {['7', '8', '9', '/'].map((item) => (
                  <TouchableOpacity key={item} style={styles.button} onPress={() => handlePress(item)}>
                    <Text style={styles.buttonText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.buttonRow}>
                {['C', '0', '.', '*'].map((item) => (
                  <TouchableOpacity key={item} style={styles.button} onPress={() => handlePress(item)}>
                    <Text style={styles.buttonText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.buttonRow}>
                {['=', 'Enter'].map((item) => (
                  <TouchableOpacity key={item} style={[styles.button, item === 'Enter' ? styles.enterButton : null]} onPress={() => handlePress(item)}>
                    <Text style={[styles.buttonText, item === 'Enter' ? styles.enterText : null]}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  calculatorContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
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
  valueText: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    width: 80,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  enterButton: {
    width: 80,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6E9277',
    borderRadius: 10,
  },
  enterText: {
    fontSize: 16,
    color: '#fff',
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#007BFF',
  },
});

export default CalculatorModal;
