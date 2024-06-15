import React , { useState, useEffect } from 'react';
import { doc, getDocs, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BarChart } from "react-native-gifted-charts";

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
      <View style={styles.card}>
        <Text style={styles.zooText}>My Zoo</Text>
        <Image source={{uri: "https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fzoo.png?alt=media&token=3cc5d796-8a37-4409-bef7-509a7bae89d6" }} 
          style={styles.zoo}
          resizeMode='contain'
          />
        <View style={styles.counterContainer}>
          <Image source={{uri: "https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fcapybara.png?alt=media&token=2b826c27-1ef6-4bb0-872d-1a2a28fbf156" }} 
          style={styles.capybara}
          resizeMode='contain'
          />
          <Text style={styles.counterText}>0</Text>
          <Image source={{uri: "https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fzoollarslogo.png?alt=media&token=cc11f9c7-83d1-479e-9d7f-32a0b4aa2333" }} 
          style={styles.zoollars}
          resizeMode='contain'
          />
          <Text style={styles.counterText}>0</Text>
        </View>
      </View>

      {/* Today's Spendings Section */}
      <View style={styles.card}>
        <Text style={styles.spendingText}>Total Spendings Today</Text>
        <Text style={styles.amountText}>${todayTotalSpendings.toFixed(2)}</Text>
        <Text style={styles.budgetText}>You have spent 20% of your total budget today</Text>
      </View>

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
  zooText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  zoo: {
    height: 200,
    width: 350,
    marginHorizontal: 6,
    alignSelf: 'center',
  },
  capybara: {
    height: 40,
    width: 30,
    marginHorizontal: 6,
  },
  zoollars: {
    height: 40,
    width: 40,
    marginHorizontal: 1,
  },
  counterText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 3,
    marginVertical: 7,
  },
  counterContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexDirection: 'row',
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
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
  chartContainer: {
  },
  label: {
    color: '#000',
    fontSize: 12,
    width: 60,
    alignSelf: 'center',
}
});