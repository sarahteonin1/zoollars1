import React , { useState, useEffect } from 'react';
import { doc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { BarChart } from "react-native-gifted-charts";
import Zoo from './Zoo';

const windowWidth = Dimensions.get('window').width;

export default function HomeScreen({ userData }) {
  const [todayTotalSpendings, setTodayTotalSpendings] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchTodayTotalSpendings = async () => {
      const userDocRef = doc(db, 'users', userData.email);
      const today = new Date();
      const todayDateString = today.toDateString();

      const expensesRef = collection(db, `users/${userDocRef.id}/expenses`);
      const q = query(expensesRef, where('date', '==', todayDateString));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const expenses = [];
        querySnapshot.forEach((doc) => {
          expenses.push(doc.data());
        });

        let total = 0;
        let categorySpendings = {};

        expenses.forEach((expense) => {
          if (expense.type === 'Expenditure') {
            total += parseFloat(expense.amount);
            if (categorySpendings[expense.category]) {
              categorySpendings[expense.category] += parseFloat(expense.amount);
            } else {
              categorySpendings[expense.category] = parseFloat(expense.amount);
            }
          }
        });

        setTodayTotalSpendings(total);

        const formattedChartData = Object.keys(categorySpendings).map(category => ({
          value: categorySpendings[category],
          label: category,
        }));

        setChartData(formattedChartData);
      });

      return () => unsubscribe();
    };

    fetchTodayTotalSpendings();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Zoo Section */}
      <Zoo userData={userData}/>

      {/* Today's Spendings Section */}
      <View style={styles.card}>
        <Text style={styles.spendingText}>Total Spendings Today</Text>
        <Text style={styles.amountText}>${todayTotalSpendings.toFixed(2)}</Text>
        <Text style={styles.budgetText}>You have spent 20% of your total budget today</Text>
      </View>

      {/* Chart Section */}
      <View style={styles.card}>
        <Text style={styles.chartTitle}>Today's Spendings</Text>
        
          <BarChart 
          key={JSON.stringify(chartData)}
          data = {chartData}
          frontColor={'#6E9277'}
          barWidth={50}
          spacing={50}
          barBorderTopLeftRadius={4}
          barBorderTopRightRadius={4}
          xAxisLength={windowWidth - 110}
          rulesLength={windowWidth - 110}
          xAxisLabelTextStyle={styles.label}
          showFractionalValues={false}
          initialSpacing={10}
          noOfSections={4} // Adjust as needed
          renderTooltip={({ value }) => (
            <Text style={{ color: '#000', fontWeight: 'bold', paddingBottom: 2, }}>{value.toFixed(2)}</Text>
          )}
          />
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
  card: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 20,
    paddingBottom: 13,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 3,
  },
  spendingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  amountText: {
    fontSize: 30,
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
    marginBottom: 15,
    fontWeight: 'bold',
  },
  label: {
    color: '#000',
    fontSize: 12,
    width: 60,
    alignSelf: 'center',
}
});