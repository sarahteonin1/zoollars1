import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import NumberKeyboardModal from './NumberKeyboardModal';
import { doc, setDoc} from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ensure this is the correct path to your firebaseConfig file

const GoalInputScreen = ({ goal, onSave, onClose, isNewGoal, userData }) => {
  const [amount, setAmount] = useState(goal.amount.replace('$', ''));
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const handleSetAmount = (inputAmount) => {
    setAmount(inputAmount);
    setKeyboardVisible(false);
  };

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, 'users', userData.email);
      const goalDocRef = doc(userDocRef, 'goals', 'monthly goal'); // Assuming 'monthly goal' is your document ID
      const currentTime = new Date();

      const updatedGoalData = {
        amount: `${amount}`,
        hasEdited: goal.hasEdited + 1,
        lastEdit: currentTime.toISOString(),
      };

      await setDoc(goalDocRef, updatedGoalData); // Update goal data in Firestore

      onSave(updatedGoalData); // Callback to update state in parent component
      onClose(); // Close modal after saving

      console.log('Goal updated successfully.');
    } catch (error) {
      console.error('Error updating goal: ', error);
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
          <NumberKeyboardModal
            visible={keyboardVisible}
            onClose={() => setKeyboardVisible(false)}
            onSetAmount={handleSetAmount}
          />
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
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
  pickerContainer: {
    width: '80%',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    borderColor: 'transparent',
  },
  dropdownText: {
    fontSize: 15,
    color: '#000',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: "100%",
  },
  dropdownDropdown: {
    borderColor: '#ccc',
  },
  fixedCategoryContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fixedCategory: {
    fontSize: 16,
    color: '#000',
    padding: 10,
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
});

export default GoalInputScreen;
