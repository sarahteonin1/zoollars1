import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Button, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, query, where, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import MonthPicker from "./spendings screens/monthpicker";
import YearPicker from "./spendings screens/yearpicker";

const fetchExpensesForMonth = async (userDocRef, year, month) => {
  const expensesRef = collection(db, `users/${userDocRef.id}/expenses`);
  const q = query(expensesRef, where("month", "==", month), where("year", "==", year));

  const querySnapshot = await getDocs(q);

  const expenses = [];
  querySnapshot.forEach((doc) => {
    expenses.push(doc.data());
  })
  return expenses;
};

const formatExpenses = (expenses) => {
  const formattedData = {};

  expenses.forEach((expense) => {
    const date = new Date(expense.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short'
    });
    if (!formattedData[date]) {
      formattedData[date] = { date, entries: [] };
    }
    formattedData[date].entries.push({
      category: expense.category,
      name: expense.description,
      amount: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(expense.amount),
      type: expense.type.toLowerCase(),
    });
  });

  return Object.values(formattedData);
};

const calculateTotals = (expenses) => {
  let totalIncome = 0;
  let totalExpenditure = 0;

  expenses.forEach((expense) => {
    const amount = parseFloat(expense.amount);
    if (expense.type === 'Income') {
      totalIncome += amount;
    } else if (expense.type === 'Expenditure'){
      totalExpenditure += amount;
    }
  });

  const netTotal = totalIncome - totalExpenditure;
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return { 
    totalIncome: formatCurrency(totalIncome), 
    totalExpenditure: formatCurrency(totalExpenditure), 
    netTotal: formatCurrency(netTotal) 
  };
};

export default function SpendingScreen({ userData }) {
  const [activePill, setActivePill] = useState('total');
  const [data, setData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [yearPickerVisible, setYearPickerVisible] = useState(false);
  const [totals, setTotals] = useState({ totalIncome: 0, totalExpenditure: 0, netTotal: 0 });

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const handleMonthPress = () => {
    setMonthPickerVisible(true);
  };

  const handleYearPress = () => {
    setYearPickerVisible(true);
  };

  const handleMonthChange = (itemValue) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(itemValue);
    setCurrentMonth(newDate);
    setMonthPickerVisible(false);
  };

  const handleYearChange = (itemValue) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(itemValue);
    setCurrentMonth(newDate);
    setYearPickerVisible(false);
  };

  const handleIncomePress = () => {
    setActivePill('income');
  };

  const handleExpenditurePress = () => {
    setActivePill('expenditure');
  };

  const renderItem = ({ item }) => (
    <View>
      <Text style={styles.date}>{item.date}</Text>
      <View style={styles.line} />
      {item.entries.map((entry, index) => (
        <View key={index}>
          <View style={styles.entry}>
            <View style={styles.categoryContainer}>
              <Text style={styles.category}>{entry.category}</Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{entry.name}</Text>
            </View>
            <View style={styles.amountContainer}>
              <Text style={[styles.amount, entry.type === 'income' ? styles.income : styles.expenditure]}>{entry.amount}</Text>
            </View>
          </View>
          <View style={styles.line} />
        </View>
      ))}
      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={[styles.totalAmount,
        item.entries.reduce((acc, entry) => entry.type === 'income' ? acc + parseFloat(entry.amount.slice(1)) : acc - parseFloat(entry.amount.slice(1)), 0) >= 0 ? styles.income : styles.expenditure
      ]}>
        ${Math.abs(item.entries.reduce((acc, entry) => entry.type === 'income' ? acc + parseFloat(entry.amount.slice(1)) : acc - parseFloat(entry.amount.slice(1)), 0)).toFixed(2)}
      </Text>
      </View>
    </View>
  );
  
  useEffect(() => {
    const fetchAndCalculateTotals = async () => {
      try {
        const userDocRef = doc(db, 'users', userData.email);
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1; // January is 0 in JavaScript Date object

        const expenses = await fetchExpensesForMonth(userDocRef, year, month);
        const formattedExpenses = formatExpenses(expenses);
        setData(formattedExpenses);

        const calculatedTotals = calculateTotals(expenses);
        setTotals(calculatedTotals);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    fetchAndCalculateTotals();
  }, [userData.email, currentMonth]);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity onPress={handlePreviousMonth}>
        <Ionicons name="chevron-back-outline" size={24} color="black"/>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleMonthPress}>
        <Text style={styles.headerTitle}>
          {currentMonth.toLocaleString('default', { month: 'long' })}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleYearPress}>
        <Text style={styles.headerTitle}>
          {currentMonth.getFullYear()}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNextMonth}>
        <Ionicons name="chevron-forward-outline" size={24} color="black"/>
      </TouchableOpacity>
    </View>

    {/* Toggle buttons */}
    <View style={styles.toggleContainer}>
      <View style={styles.pillContainer}>
      <TouchableOpacity
        style={[styles.pill, activePill === 'income' ? styles.activePill : styles.inactivePill]}
        onPress={() => handleIncomePress()}
      >
        <Text style={activePill === 'income' ? styles.activeText : styles.inactiveText}>Income</Text>
      </TouchableOpacity>
      <Text style={styles.incomeText}>{totals.totalIncome}</Text>
      </View>

      <View style={styles.pillContainer}>
      <TouchableOpacity
        style={[styles.pill, activePill === 'expenditure' ? styles.activePill : styles.inactivePill]}
        onPress={() => handleExpenditurePress()}
      >
        <Text style={activePill === 'expenditure' ? styles.activeText : styles.inactiveText}>Expenditure</Text>
      </TouchableOpacity>
      <Text style={styles.expenditureText}>{totals.totalExpenditure}</Text>
      </View>

      <View style={styles.pillContainer}>
      <TouchableOpacity
        style={[styles.pill, activePill === 'total' ? styles.activePill : styles.inactivePill]}
        onPress={() => setActivePill('total')}
      >
        <Text style={activePill === 'total' ? styles.activeText : styles.inactiveText}>Total</Text>
      </TouchableOpacity>
      <Text style={styles.totalText}>{totals.netTotal}</Text>
      </View>
    </View>

    {/* List of entries */}
    <ScrollView>
      <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
      />
    </ScrollView>

    {/* Month Picker */}
      <MonthPicker
      visible={monthPickerVisible}
      selectedMonth={currentMonth.getMonth()}
      onMonthChange={handleMonthChange}
      onClose={() => setMonthPickerVisible(false)}
    />

    {/* Year Picker */}
    <YearPicker
      visible={yearPickerVisible}
      selectedYear={currentMonth.getFullYear()}
      onYearChange={handleYearChange}
      onClose={() => setYearPickerVisible(false)}
    />
  </View>
  );
}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 16,
    },
    headerButton: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginLeft: 6,
      marginRight: 6,
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
    pillContainer: {
      alignItems: 'center',
    },
    totalsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingLeft: 72,
      paddingRight: 62,
    },
    incomeText: {
      fontSize: 16,
      color: 'green',
      fontWeight: 'bold',
      paddingTop: 10,
    },
    expenditureText: {
      fontSize: 16,
      color: 'red',
      fontWeight: 'bold',
      paddingTop: 10,
    },
    totalText: {
      fontSize: 16,
      color: 'blue',
      fontWeight: 'bold',
      paddingTop: 10,
    },
    categoryContainer: {
      width: 100,
      padding:0,
    },
    nameContainer: {
      width: 180,
    },
    amountContainer: {
      alignItems: 'flex-end',
      width: 85,
    },
    date: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 8,
    },
    line: {
      height: 1,
      backgroundColor: '#ccc',
      marginVertical: 8,
    },
    entry: {
      flexDirection: 'row',
      paddingVertical: 8,
    },
    category: {
      fontSize: 16,
    },
    name: {
      fontSize: 16,
    },
    amount: {
      fontSize: 16,
    },
    income: {
      color: 'green',
    },
    expenditure: {
      color: 'red',
    },
    totalContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    totalAmount: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'blue',
    },
  });
  