import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import React, { useState, useEffect } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CalculatorModal from "./budget input screens/CalculatorModal";
import CategoryInput from "./budget input screens/CategoryInput";
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from '../firebaseConfig';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import 'firebase/firestore';

export default function BudgetInputScreen( { userData } ) {
  const [isIncome, setIsIncome] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isCalculatorVisible, setCalculatorVisibility] = useState(false);
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesCollectionRef = collection(doc(db, 'users', userData.email), 'categories');
      const categoriesSnapshot = await getDocs(categoriesCollectionRef);
      const categoriesList = categoriesSnapshot.docs.map(doc => ({ label: doc.data().category, value: doc.data().category }));
      setCategories(categoriesList);
    } catch (error) {
      console.error('Error fetching categories: ', error);
    }
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date.toDateString());
    hideDatePicker();
  };

  const showCalculator = () => {
    setCalculatorVisibility(true);
  };

  const hideCalculator = () => {
    setCalculatorVisibility(false);
  };

  const handleAmountChange = (value) => {
    const cleanedValue = value.replace(/[^0-9.]/g, '');
    const parts = cleanedValue.split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1] || '';
  
    if (integerPart === '') {
      integerPart = '0';
    }
    if (decimalPart === '') {
      decimalPart = '00';
    }
    if (decimalPart.length > 2) {
      decimalPart = decimalPart.slice(0, 2);
    }
    if (decimalPart.length === 1) {
      decimalPart += '0';
    }
    const formattedValue = integerPart + '.' + decimalPart;
    setAmount(formattedValue);
    hideCalculator();
  };

  const handleNewCategoryAdded = async (newCategory) => {
    console.log('New category added:', newCategory); // Log to verify this function is called
    setCategories([...categories, { label: newCategory, value: newCategory }]);
    setCategory(newCategory);
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    console.log('Date:', date);
    console.log('Amount: $', amount);
    console.log('Category:', category);
    console.log('Name:', description);

    if (!description || !category || !date || !amount) {
      alert('Please fill all fields');
      return;
    }

    const userDocRef = doc(db, 'users', userData.email);
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const expenseId = `${formattedDate}_${new Date().getTime()}_${isIncome ? 'Income' : 'Expenditure'}`;
    const expense = {
      id: expenseId,
      type: isIncome ? 'Income' : 'Expenditure',
      category,
      formattedDate: formattedDate,
      date,
      month: new Date(date).getMonth() + 1,
      year: new Date(date).getFullYear(),
      amount,
      description,
      date_added: new Date(),
    };

    try {
      const expensesCollectionRef = collection(userDocRef, 'expenses');
      await setDoc(doc(expensesCollectionRef, expenseId), expense);
      setCategory(null);
      setDescription('');
      setAmount('');
      setDate('');
      console.log('Expense added successfully');
    } catch (error) {
      console.error('Error adding expense: ', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.pill, isIncome ? styles.activePill : styles.inactivePill]}
            onPress={() => setIsIncome(true)}
          >
            <Text style={isIncome ? styles.activeText : styles.inactiveText}>Income</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pill, !isIncome ? styles.activePill : styles.inactivePill]}
            onPress={() => setIsIncome(false)}
          >
            <Text style={!isIncome ? styles.activeText : styles.inactiveText}>Expenditure</Text>
          </TouchableOpacity>
        </View>

        {/* Description Input */}
        <Text style={styles.dateLabel}>Name</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Describe your expense"
          value={description}
          onChangeText={setDescription}
        />

        {/* Date Picker */}
        <Text style={styles.amountLabel}>Date</Text>
        <TouchableOpacity onPress={showDatePicker}>
          <View style={styles.dateInput}>
            <Text style={styles.dateText}>{date || 'Select Date'}</Text>
          </View>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        {/* Amount Input */}
        <Text style={styles.amountLabel}>Amount</Text>
        <TouchableOpacity onPress={showCalculator}>
          <View style={styles.amountInput}>
            <Text style={styles.amountText}>{amount || 'Enter Amount'}</Text>
          </View>
        </TouchableOpacity>
        <CalculatorModal
          isVisible={isCalculatorVisible}
          onClose={hideCalculator}
          onCalculate={(value) => handleAmountChange(value)}
        />

        {/* Category Dropdown */}
        <Text style={styles.amountLabel}>Category</Text>
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
        <TouchableOpacity 
          style={styles.addCategoryButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addCategoryButtonText}>+ Add Category</Text>
        </TouchableOpacity>

        {/* Modal for adding category */}
        <CategoryInput 
          modalVisible={modalVisible} 
          setModalVisible={setModalVisible} 
          userData={userData} 
          onNewCategory={handleNewCategoryAdded} 
        />

        {/* Submit Button */}
        <View style={styles.submitButtonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
        </View>
        
      </View>
    </TouchableWithoutFeedback>

  );
};
  
const styles = StyleSheet.create({
  container1: {
    flex: 1,
    alignItems: "center",
    backgroundColor: 'white',
    marginTop: 50,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 14,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  activePill: {
    backgroundColor: '#6E9277',
  },
  inactivePill: {
    backgroundColor: '#F6F6F6',
  },
  activeText: {
    color: '#fff',
    fontSize: 15,
  },
  inactiveText: {
    color: '#000',
    fontSize: 15,
  },
  dateLabel: {
    fontSize: 15,
    marginBottom: 8,
    paddingLeft: 20,
    paddingTop: 40,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    width: "90%",
    alignSelf: "center",
    borderRadius: 8,
  },
  dateText: {
    fontSize: 15,
    color: '#000',
  },
  amountLabel: {
    fontSize: 15,
    marginBottom: 8,
    paddingLeft: 20,
    paddingTop: 10,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    width: "90%",
    alignSelf: "center",
    borderRadius: 8,
  },
  amountText: {
    fontSize: 15,
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
    width: "90%",
    alignSelf: "center",
  },
  dropdownDropdown: {
    borderColor: '#ccc',
  },
  addCategoryContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 50,
  },
  addCategoryButton: {
    backgroundColor: '#6E9277',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 7,
    marginBottom: 16,
  },
  addCategoryButtonText: {
    color: '#fff',
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    borderBottomWidth: 1,
    flex: 1,
    marginRight: 10,
    paddingVertical: 10,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    width: "90%",
    alignSelf: "center",
    borderRadius: 8,
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: '#6E9277',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
  },
  submitButtonContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
