import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';

const GoalInputScreen = ({ goal, onSave, onClose }) => {
  const [amount, setAmount] = useState(goal.amount.replace('$', '')); // Default to $0 if empty
  const [category, setCategory] = useState(goal.category || '');

  const handleSave = () => {
    if (goal.id === '1' && amount) {
      onSave({ amount: `$${amount}`, category: goal.category });
    } else if (amount && category) {
      onSave({ amount: `$${amount}`, category });
    } else {
      alert('Please enter both amount and category');
    }
  };

  return (
    <View style={styles.modalView}>
      <TouchableOpacity style={styles.backButton} onPress={onClose}>
        <Icon name="chevron-back-outline" size={24} color="black"/>
      </TouchableOpacity>
      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Enter Amount"
      />
      {goal.id !== '1' && (
        <>
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Food" value="Food" />
              <Picker.Item label="Transport" value="Transport" />
              <Picker.Item label="Entertainment" value="Entertainment" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </>
      )}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    width: '80%',
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    height: 40,
  },
  saveButton: {
    backgroundColor: '#6E9277',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '80%',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default GoalInputScreen;
