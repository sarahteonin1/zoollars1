import React, { useState, useEffect } from 'react';
import { doc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { BarChart } from "react-native-gifted-charts";
import Zoo from './Zoo';

const windowWidth = Dimensions.get('window').width;

export default function BudgetScreen({ userData }) {
  const [activePill, setActivePill] = useState('daily');
  const [totalSpendings, setTotalSpendings] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [weeklySpendingData, setWeeklySpendingData] = useState([]);
  const [monthlySpendingData, setMonthlySpendingData] = useState([]);
  const [savingsData, setSavingsData] = useState([]);

  useEffect(() => {
    if (activePill === 'daily') {
      fetchTodayTotalSpendings();
    } else if (activePill === 'weekly') {
      fetchWeeklyTotalSpendings();
      fetchWeeklySpendingByDay();
    } else if (activePill === 'monthly') {
      fetchMonthlyTotalSpendings();
      fetchMonthlySpendingByMonth();
    }
  }, [activePill]);

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

      setTotalSpendings(total);

      const formattedChartData = Object.keys(categorySpendings).map(category => ({
        value: categorySpendings[category],
        label: category,
      }));

      setChartData(formattedChartData);
    });

    return () => unsubscribe();
  };

  const fetchWeeklyTotalSpendings = async () => {
    const userDocRef = doc(db, 'users', userData.email);
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
  
    const expensesRef = collection(db, `users/${userDocRef.id}/expenses`);
    const q = query(expensesRef, where('date', '>=', startOfWeek), where('date', '<=', endOfWeek));
  
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const expenses = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.date = new Date(data.date); // Ensure date is in Date format
        expenses.push(data);
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
  
      setTotalSpendings(total);
  
      const formattedChartData = Object.keys(categorySpendings).map(category => ({
        value: categorySpendings[category],
        label: category,
      }));
  
      setChartData(formattedChartData);
    });
  
    return () => unsubscribe();
  };
  
const fetchWeeklySpendingByDay = async () => {
  const userDocRef = doc(db, 'users', userData.email);
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const expensesRef = collection(db, `users/${userDocRef.id}/expenses`);
  const q = query(expensesRef, where('date', '>=', startOfWeek), where('date', '<=', endOfWeek));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const expenses = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.date = data.date.toDate ? data.date.toDate() : new Date(data.date); // Convert Firestore Timestamp to Date
      expenses.push(data);
    });

    let daySpendings = {};

    expenses.forEach((expense) => {
      if (expense.type === 'Expenditure') {
        const day = expense.date.getDay();
        if (daySpendings[day]) {
          daySpendings[day] += parseFloat(expense.amount);
        } else {
          daySpendings[day] = parseFloat(expense.amount);
        }
      }
    });

    const formattedChartData = Object.keys(daySpendings).map(day => ({
      value: daySpendings[day],
      label: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day],
    }));

    setWeeklySpendingData(formattedChartData);
  });

  return () => unsubscribe();
};


  const fetchMonthlyTotalSpendings = async () => {
    const userDocRef = doc(db, 'users', userData.email);
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const expensesRef = collection(db, `users/${userDocRef.id}/expenses`);
    const q = query(expensesRef, where('date', '>=', startOfMonth.toDateString()), where('date', '<=', endOfMonth.toDateString()));

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

      setTotalSpendings(total);

      const formattedChartData = Object.keys(categorySpendings).map(category => ({
        value: categorySpendings[category],
        label: category,
      }));

      setChartData(formattedChartData);
    });

    return () => unsubscribe();
  };

  const fetchMonthlySpendingByMonth = async () => {
    const userDocRef = doc(db, 'users', userData.email);

    const expensesRef = collection(db, `users/${userDocRef.id}/expenses`);
    const q = query(expensesRef);

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const expenses = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.date = new Date(data.date); // Convert string to Date
        expenses.push(data);
      });

      let monthSpendings = {};

      expenses.forEach((expense) => {
        if (expense.type === 'Expenditure') {
          const month = expense.date.getMonth();
          if (monthSpendings[month]) {
            monthSpendings[month] += parseFloat(expense.amount);
          } else {
            monthSpendings[month] = parseFloat(expense.amount);
          }
        }
      });

      const formattedChartData = Object.keys(monthSpendings).map(month => ({
        value: monthSpendings[month],
        label: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month],
      }));

      setMonthlySpendingData(formattedChartData);
    });

    return () => unsubscribe();
  };

  const handleWeeklyPress = () => {
    setActivePill('weekly');
  };

  const handleMonthlyPress = () => {
    setActivePill('monthly');
  };

  return (
    <View style={styles.container}>
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
            onPress={handleWeeklyPress}
          >
            <Text style={activePill === 'weekly' ? styles.activeText : styles.inactiveText}>Weekly</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pillContainer}>
          <TouchableOpacity
            style={[styles.pill, activePill === 'monthly' ? styles.activePill : styles.inactivePill]}
            onPress={handleMonthlyPress}
          >
            <Text style={activePill === 'monthly' ? styles.activeText : styles.inactiveText}>Monthly</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Zoo Section */}
        <Zoo />

        {/* Scrollable Chart Section */}
        <View style={styles.card}>
          <Text style={styles.chartTitle}>
            {activePill === 'daily' ? "Today's Spendings" : activePill === 'weekly' ? "This Week's Spendings" : "This Month's Spendings"}
          </Text>
          <BarChart 
            key={JSON.stringify(chartData)}
            data={chartData}
            frontColor={'#6E9277'}
            barWidth={50}
            spacing={70}
            barBorderTopLeftRadius={4}
            barBorderTopRightRadius={4}
            xAxisLength={windowWidth - 110}
            rulesLength={windowWidth - 110}
            xAxisLabelTextStyle={styles.label}
            showFractionalValues={false}
            initialSpacing={10}
            noOfSections={4} // Adjust as needed
            renderTooltip={({ value }) => (
              <Text style={{ color: '#000', fontWeight: 'bold', paddingBottom: 2 }}>{value.toFixed(2)}</Text>
            )}
          />
        </View>

        {activePill === 'weekly' && (
          <View style={styles.card}>
            <Text style={styles.chartTitle}>Spending by Day</Text>
            <BarChart 
              key={JSON.stringify(weeklySpendingData)}
              data={weeklySpendingData}
              frontColor={'#6E9277'}
              barWidth={50}
              spacing={70}
              barBorderTopLeftRadius={4}
              barBorderTopRightRadius={4}
              xAxisLength={windowWidth - 110}
              rulesLength={windowWidth - 110}
              xAxisLabelTextStyle={styles.label}
              showFractionalValues={false}
              initialSpacing={10}
              noOfSections={4} // Adjust as needed
              renderTooltip={({ value }) => (
                <Text style={{ color: '#000', fontWeight: 'bold', paddingBottom: 2 }}>{value.toFixed(2)}</Text>
              )}
            />
          </View>
        )}

        {activePill === 'monthly' && (
          <>
            <View style={styles.card}>
              <Text style={styles.chartTitle}>Spending by Month</Text>
              <BarChart 
                key={JSON.stringify(monthlySpendingData)}
                data={monthlySpendingData}
                frontColor={'#6E9277'}
                barWidth={50}
                spacing={70}
                barBorderTopLeftRadius={4}
                barBorderTopRightRadius={4}
                xAxisLength={windowWidth - 110}
                rulesLength={windowWidth - 110}
                xAxisLabelTextStyle={styles.label}
                showFractionalValues={false}
                initialSpacing={10}
                noOfSections={4} // Adjust as needed
                renderTooltip={({ value }) => (
                  <Text style={{ color: '#000', fontWeight: 'bold', paddingBottom: 2 }}>{value.toFixed(2)}</Text>
                )}
              />
            </View>
            <View style={styles.card}>
              <Text style={styles.chartTitle}>Savings by Month</Text>
              <BarChart 
                key={JSON.stringify(savingsData)}
                data={savingsData}
                frontColor={'#6E9277'}
                barWidth={50}
                spacing={70}
                barBorderTopLeftRadius={4}
                barBorderTopRightRadius={4}
                xAxisLength={windowWidth - 110}
                rulesLength={windowWidth - 110}
                xAxisLabelTextStyle={styles.label}
                showFractionalValues={false}
                initialSpacing={10}
                noOfSections={4} // Adjust as needed
                renderTooltip={({ value }) => (
                  <Text style={{ color: '#000', fontWeight: 'bold', paddingBottom: 2 }}>{value.toFixed(2)}</Text>
                )}
              />
            </View>
          </>
        )}
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
  scrollContent: {
    paddingBottom: 20,
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
  label: {
    color: '#000',
    fontSize: 12,
    width: 60,
    alignSelf: 'center',
  }
});
