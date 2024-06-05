import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button } from "react-native";
import React, { useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import CalculatorModal from "./budget input screens/CalculatorModal";
import DropDownPicker from 'react-native-dropdown-picker';

export default function BudgetInputScreen() {
  const [isIncome, setIsIncome] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isCalculatorVisible, setCalculatorVisibility] = useState(false);
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([
    { label: 'Category 1', value: 'Category 1' },
    { label: 'Category 2', value: 'Category 2' },
    { label: 'Category 3', value: 'Category 3' },
    // Add more categories as needed
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [description, setDescription] = useState('');

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

  const handleCalculate = (value) => {
    setAmount(value);
    hideCalculator();
  };

  const handleNewCategory = () => {
    if (newCategory.trim() !== '') {
      setCategories([...categories, { label: newCategory, value: newCategory }]);
      setCategory(newCategory);
      setNewCategory('');
    }
  };

  const handleCategoryChange = (item) => {
    console.log('Selected item:', item);
    if (item === 'Add Category') {
      setShowCategoryInput(true);
    } else {
      setCategory(item.value);
    }
  };

  const handleSubmit = () => {
    console.log('Date:', date);
    console.log('Amount:', amount);
    console.log('Category:', category);
    console.log('Description:', description);
  };

  return (
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

      <Text style={styles.dateLabel}>Date</Text>
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

      <Text style={styles.amountLabel}>Amount</Text>
      <TouchableOpacity onPress={showCalculator}>
        <View style={styles.amountInput}>
          <Text style={styles.amountText}>{amount || 'Enter Amount'}</Text>
        </View>
      </TouchableOpacity>
      <CalculatorModal
        isVisible={isCalculatorVisible}
        onClose={hideCalculator}
        onCalculate={handleCalculate}
      />

<Text style={styles.amountLabel}>Category</Text>
      <DropDownPicker
        open={open}
        category={category}
        categories={categories}
        setOpen={setOpen}
        setCategory={setCategory}
        setCategories={setCategories}
        items={[...categories, { label: 'Add Category', value: 'Add Category' }]}
        defaultValue={category}
        onChangeItem={handleCategoryChange}
        placeholder="Select Category"
        style={styles.dropdown}
        textStyle={styles.dropdownText}
        containerStyle={styles.dropdownContainer}
        searchable={false}
      />
      {showCategoryInput && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newCategory}
            onChangeText={setNewCategory}
            placeholder="New Category"
          />
          <Button title="Add" onPress={handleNewCategory} />
        </View>
      )}

      <Text style={styles.amountLabel}>Description</Text>
      <TextInput
        style={styles.descriptionInput}
        placeholder="Write a Description"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};
  
const styles = StyleSheet.create({
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    width: "90%",
    alignSelf: "center",
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 15,
    color: '#000',
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
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 15,
  },
});
