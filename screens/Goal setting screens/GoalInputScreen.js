import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';
import NumberKeyboardModal from './NumberKeyboardModal';

const GoalInputScreen = ({ goal, onSave, onClose, isNewGoal }) => {
  const [amount, setAmount] = useState(goal.amount.replace('$', ''));
  const [category, setCategory] = useState(goal.category || '');
  const [customCategory, setCustomCategory] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const handleSetAmount = (inputAmount) => {
    setAmount(inputAmount);
    setKeyboardVisible(false);
  };

  const handleSave = () => {
    const finalCategory = category === 'Other' ? customCategory : category;
    if (goal.id === '1' && amount) {
      onSave({ amount: `$${amount}`, category: '' });
    } else if (isNewGoal && amount && finalCategory) {
      onSave({ amount: `$${amount}`, category: finalCategory });
    } else if (amount) {
      onSave({ amount: `$${amount}`, category: finalCategory });
    } else {
      alert('Please enter the amount');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.modalView}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Icon name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.centerContainer}>
          <Text style={styles.label}>Amount</Text>
          <TouchableOpacity style={styles.inputButton} onPress={() => setKeyboardVisible(true)}>
            <Text style={styles.input}>{amount}</Text>
          </TouchableOpacity>
          {(goal.id !== '1' || isNewGoal) && (
            <>
              <Text style={styles.label}>Category</Text>
              {goal.id === '2' && <Text style={styles.fixedCategory}>Food</Text>}
              {goal.id === '3' && <Text style={styles.fixedCategory}>Transport</Text>}
              {isNewGoal && (
                <>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={category}
                      onValueChange={(itemValue) => setCategory(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select Category" value="" />
                      <Picker.Item label="Food" value="Food" />
                      <Picker.Item label="Transport" value="Transport" />
                      <Picker.Item label="Entertainment" value="Entertainment" />
                    </Picker>
                  </View>
                  {category === 'Other' && (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Custom Category"
                      value={customCategory}
                      onChangeText={setCustomCategory}
                    />
                  )}
                </>
              )}
            </>
          )}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        <NumberKeyboardModal
          visible={keyboardVisible}
          onClose={() => setKeyboardVisible(false)}
          onSetAmount={handleSetAmount}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  centerContainer: {
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    width: '80%',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    color: '#000',
  },
  fixedCategory: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#6E9277',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picker: {
    width: '100%',
    height: 40,
  },
});

export default GoalInputScreen;
