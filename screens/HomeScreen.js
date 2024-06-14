import React , { useState, useEffect } from 'react';
import { doc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function HomeScreen({ userData }) {
  const [todayTotalSpendings, setTodayTotalSpendings] = useState(0);
  
  useEffect(() => {
    const fetchTodayTotalSpendings = async () => {
      const userDocRef = doc(db, 'users', userData.email);
      const today = new Date();
      const todayDateString = today.toDateString();

      const expensesRef = collection(db, `users/${userDocRef.id}/expenses`);
      const q = query(expensesRef, where('date', '==', todayDateString));
      const querySnapshot = await getDocs(q);
      const expenses = [];
      querySnapshot.forEach((doc) => {
        expenses.push(doc.data());
      })
      let total = 0;
      expenses.forEach((expense) => {
        if (expense.type === 'Expenditure') {
          total += parseFloat(expense.amount);
        }
      });

      setTodayTotalSpendings(total);
    };

    fetchTodayTotalSpendings();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.card}>
        <Text>my zoo</Text>
        <View style={styles.counterContainer}>
          <Text> 0</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.spendingText}>Total Spendings Today</Text>
        <Text style={styles.amountText}>${todayTotalSpendings.toFixed(2)}</Text>
        <Text style={styles.budgetText}>You have spent 20% of your total budget today</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.chartTitle}>Today's Spendings</Text>
        
        <View style={styles.labels}>
          <Text style={styles.label}>Income</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  counterContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 3,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  spendingText: {
    fontSize: 18,
  },
  amountText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  budgetText: {
    fontSize: 14,
    color: '#888',
  },
  chartTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  chart: {
    height: 200,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  label: {
    fontSize: 14,
  },
});