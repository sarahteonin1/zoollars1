import React , { useState, useEffect } from 'react';
import { doc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BarChart } from "react-native-gifted-charts";
import Zoo from './Zoo';

export default function BudgetScreen({ userData }) {
  const [activePill, setActivePill] = useState('daily');
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

  const handleWeeklyPress = () => {
    setActivePill('weekly');
  };

  const handleMonthlyPress = () => {
    setActivePill('monthly');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Toggle buttons */}
    <View style={styles.toggleContainer}>
      <View style={styles.pillContainer}>
      <TouchableOpacity
        style={[styles.pill, activePill === 'daily' ? styles.activePill : styles.inactivePill]}
        onPress={() => setActivePill('daily')}
      >
        <Text style={activePill === 'daily' ? styles.activeText : styles.inactiveText}>Daily</Text>
      </TouchableOpacity>
      </View>

      <View style={styles.pillContainer}>
      <TouchableOpacity
        style={[styles.pill, activePill === 'weekly' ? styles.activePill : styles.inactivePill]}
        onPress={() => handleWeeklyPress()}
      >
        <Text style={activePill === 'weekly' ? styles.activeText : styles.inactiveText}>Weekly</Text>
      </TouchableOpacity>
      </View>

      <View style={styles.pillContainer}>
      <TouchableOpacity
        style={[styles.pill, activePill === 'monthly' ? styles.activePill : styles.inactivePill]}
        onPress={() => handleMonthlyPress()}
      >
        <Text style={activePill === 'monthly' ? styles.activeText : styles.inactiveText}>Monthly</Text>
      </TouchableOpacity>
      </View>
    </View>

      {/* Zoo Section */}
      <Zoo />

      {/* Chart Section */}
      <View style={styles.card}>
        <Text style={styles.chartTitle}>Today's Spendings</Text>
        
        
        <View style={styles.chartContainer}>
          <BarChart 
          key={JSON.stringify(chartData)}
          data = {chartData}
          frontColor={'#6E9277'}
          barWidth={50}
          spacing={70}
          barBorderTopLeftRadius={4}
          barBorderTopRightRadius={4}
          xAxisLength={310}
          rulesLength={310}
          xAxisLabelTextStyle={styles.label}
          showFractionalValues={false}
          initialSpacing={10}
          noOfSections={4} // Adjust as needed
          renderTooltip={({ value }) => (
            <Text style={{ color: '#000', fontWeight: 'bold', paddingBottom: 2, }}>{value.toFixed(2)}</Text>
          )}
          />
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
  chartTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  chartContainer: {
  },
  label: {
    color: '#000',
    fontSize: 12,
    width: 60,
    alignSelf: 'center',
}
});