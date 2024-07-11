import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DropDownPicker from 'react-native-dropdown-picker';
import NumberKeyboardModal from './NumberKeyboardModal';
import { doc, collection, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ensure this is the correct path to your firebaseConfig file

const GoalInputScreen = ({ onSave, onClose, isNewGoal, userData }) => {
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesCollectionRef = collection(doc(db, 'users', userData.email), 'categories');
      const goalsCollectionRef = collection(doc(db, 'users', userData.email), 'goals');

      const [categoriesSnapshot, goalsSnapshot] = await Promise.all([
        getDocs(categoriesCollectionRef),
        getDocs(goalsCollectionRef)
      ]);

      const existingGoals = goalsSnapshot.docs.map(doc => doc.data().category);
      const categoriesList = categoriesSnapshot.docs
        .map(doc => ({ label: doc.data().category, value: doc.data().category }))
        .filter(category => !existingGoals.includes(category.value));

      setCategories(categoriesList);
    } catch (error) {
      console.error('Error fetching categories: ', error);
    }
  };

  const handleSetAmount = (inputAmount) => {
    setAmount(inputAmount);
    setKeyboardVisible(false);
  };

  const handleSave = async () => {
    if (amount === 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    if (category === '') {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    
    try {
      const userDocRef = doc(db, 'users', userData.email);
      const currentTime = new Date();

      const newGoalData = {
        id: `${category} goal`,
        amount: amount,
        hasEdited: 1,
        category: category,
        lastEdit: currentTime.toISOString(),
      };

      const goalDocRef = doc(userDocRef, 'goals', newGoalData.id);

      await setDoc(goalDocRef, newGoalData); // Save data to Firestore

      onSave(newGoalData); // Callback to update state in parent component
      onClose(); // Close modal after saving
    } catch (error) {
      console.error('Error saving goal: ', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.modalView}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Icon name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.centerContainer}>
          {/* Amount */}
          <Text style={styles.label}>Amount</Text>
          <TouchableOpacity style={styles.inputButton} onPress={() => setKeyboardVisible(true)}>
            <Text style={styles.input}>{amount}</Text>
          </TouchableOpacity>
          <NumberKeyboardModal
            visible={keyboardVisible}
            onClose={() => setKeyboardVisible(false)}
            onSetAmount={handleSetAmount}
          />
          {/* Category */}
          <Text style={styles.label}>Category</Text>
            <DropDownPicker
              open={open}
              value={category}
              items={categories}
              setOpen={setOpen}
              setValue={setCategory}
              setItems={setCategories}
              placeholder="Select Category"
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              containerStyle={styles.dropdownContainer}
              dropDownContainerStyle={styles.dropdownDropdown}
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
    width: "80%",
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
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GoalInputScreen;
