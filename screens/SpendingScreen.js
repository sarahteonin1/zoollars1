import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from "react-native";
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Swipeable } from 'react-native-gesture-handler';

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
      id: expense.id,
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
  const [totals, setTotals] = useState({ totalIncome: 0, totalExpenditure: 0, netTotal: 0 });

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
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

  const renderItem = ({ item }) => {
    // Filter entries based on the active pill
    const filteredEntries = item.entries.filter(entry => activePill === 'total' || entry.type === activePill);
  
    // If no entries match the active pill, don't render this date
    if (filteredEntries.length === 0) {
      return null;
    }
  
    // Calculate the total for the current date's entries
    const totalForDate = filteredEntries.reduce((acc, entry) => {
      return entry.type === 'income' ? acc + parseFloat(entry.amount.slice(1)) : acc - parseFloat(entry.amount.slice(1));
    }, 0);
  
    const renderRightActions = (entry) => (
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteEntry(entry)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    );
  
    return (
      <View>
        <Text style={styles.date}>{item.date}</Text>
        <View style={styles.line} />
        {filteredEntries.map((entry, index) => (
          <Swipeable
            key={index}
            renderRightActions={() => renderRightActions(entry, handleDeleteEntry)}
          >
            <View style={styles.entry}>
              <View style={styles.categoryContainer}>
                <Text style={styles.category}>{entry.category}</Text>
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{entry.name}</Text>
              </View>
              <View style={styles.amountContainer}>
                <Text style={[
                  styles.amount,
                  entry.type === 'income' ? styles.income : styles.expenditure
                ]}>
                  {parseFloat(entry.amount) >= 0 ? '+' : ''}{entry.amount.replace('-', '')}
                </Text>
              </View>
            </View>
            <View style={styles.line} />
          </Swipeable>
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={[
            styles.totalAmount,
            totalForDate >= 0 ? styles.income : styles.expenditure
          ]}>
            ${Math.abs(totalForDate).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };
  
  const handleDeleteEntry = async (entryToDelete) => {
    try {
      const updatedData = data.map(item => {
        const filteredEntries = item.entries.filter(entry => entry !== entryToDelete);
        return { ...item, entries: filteredEntries };
      }).filter(item => item.entries.length > 0);
  
      setData(updatedData);
  
      await deleteEntryFromDatabase(entryToDelete);
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };
  
  const deleteEntryFromDatabase = async (entryToDelete) => {
    console.log(entryToDelete);
    console.log(entryToDelete.id);
    const userDocRef = doc(db, 'users', userData.email, 'expenses', entryToDelete.id);
    await deleteDoc(userDocRef);
  };

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
      
      
        <Text style={styles.headerTitle}>
          {currentMonth.toLocaleString('default', { month: 'long' })}
        </Text>
      
      
        <Text style={styles.headerTitle}>
          {currentMonth.getFullYear()}
        </Text>
      
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
      flex: 2,
      paddingVertical: 10,
    },
    nameContainer: {
      flex: 4,
      paddingVertical: 10,
    },
    amountContainer: {
      flex: 2,
      alignItems: 'flex-end',
      paddingVertical: 10,
    },
    date: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 8,
    },
    line: {
      height: 1,
      backgroundColor: '#ccc',
    },
    entry: {
      flexDirection: 'row',
      paddingVertical: 8,
      alignContent: 'space-between',
      alignItems: 'center',
    },
    category: {
      fontSize: 16,
    },
    name: {
      fontSize: 16,
    },
    amount: {
      fontSize: 16,
      maxWidth: '100%', 
      numberOfLines: 1,
      ellipsizeMode: 'tail',
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
    deleteButton: {
      backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center',
      width: 75,
      height: '100%',
    },
    deleteButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
  