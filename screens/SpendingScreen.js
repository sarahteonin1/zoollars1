import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import React, { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function SpendingScreen() {
  const [activePill, setActivePill] = useState('total');
  const [data, setData] = useState([
    { date: '01 May', entries: [{ category: 'Food', name: 'Pasta Express', amount: '$5.00', type: 'expenditure' }, { category: 'Transport', name: 'Grab', amount: '$20.00', type: 'expenditure' }, { category: 'Allowance', name: 'Weekly', amount: '$300.00', type: 'income' }] },
    { date: '02 May', entries: [{ category: 'Food', name: 'Ban Mian', amount: '$5.00', type: 'expenditure' }, { category: 'Household', name: 'Groceries', amount: '$80.00', type: 'expenditure' }] },
  ]);

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
        <Text style={styles.totalAmount}>${item.entries.reduce((acc, entry) => entry.type === 'income' ? acc + parseFloat(entry.amount.slice(1)) : acc - parseFloat(entry.amount.slice(1)), 0).toFixed(2)}</Text>
      </View>
    </View>
  );

  const totals = {
    income: 300, // Example amount, replace with actual data
    expenditure: 110, // Example amount, replace with actual data
    total: 190 // Example amount, replace with actual data
  };
  
    return (
      <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <View style={styles.pillContainer}>
        <TouchableOpacity
          style={[styles.pill, activePill === 'income' ? styles.activePill : styles.inactivePill]}
          onPress={() => setActivePill('income')}
        >
          <Text style={activePill === 'income' ? styles.activeText : styles.inactiveText}>Income</Text>
        </TouchableOpacity>
        <Text style={styles.incomeText}>${totals.income}</Text>
        </View>

        <View style={styles.pillContainer}>
        <TouchableOpacity
          style={[styles.pill, activePill === 'expenditure' ? styles.activePill : styles.inactivePill]}
          onPress={() => setActivePill('expenditure')}
        >
          <Text style={activePill === 'expenditure' ? styles.activeText : styles.inactiveText}>Expenditure</Text>
        </TouchableOpacity>
        <Text style={styles.expenditureText}>${totals.expenditure}</Text>
        </View>

        <View style={styles.pillContainer}>
        <TouchableOpacity
          style={[styles.pill, activePill === 'total' ? styles.activePill : styles.inactivePill]}
          onPress={() => setActivePill('total')}
        >
          <Text style={activePill === 'total' ? styles.activeText : styles.inactiveText}>Total</Text>
        </TouchableOpacity>
        <Text style={styles.totalText}>${totals.total}</Text>
        </View>
      </View>

      <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
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
  