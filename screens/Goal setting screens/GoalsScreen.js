import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Alert, ActivityIndicator} from 'react-native';
import GoalInputScreen from './GoalInputScreen';
import GoalEditScreen from './GoalEditScreen';
import { doc, setDoc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';

const initialGoalsData = [
  {
    id: 'monthly goal',
    amount: '0',
    hasEdited: 0,
    category: 'Monthly',
    lastEdit: null,
  },
];

export default function GoalsScreen({ userData }) {
  const [goalsData, setGoalsData] = useState(initialGoalsData);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewGoal, setIsNewGoal] = useState(false);
  const [editedMonthly, setEditedMonthly] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(0);

  useEffect(() => {
    const userDocRef = doc(db, 'users', userData.email);
    const goalsCollectionRef = collection(userDocRef, 'goals');

    const unsubscribe = onSnapshot(goalsCollectionRef, (snapshot) => {
      const goals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const monthlyGoal = goals.find(goal => goal.category === 'Monthly');
      const categoryGoals = goals.filter(goal => goal.category !== 'Monthly');
  
      console.log('Fetched goals:', goals); // Debug log
      console.log('Monthly Goal:', monthlyGoal); // Debug log
      console.log('Category Goals:', categoryGoals); // Debug log

      const sortedGoals = [monthlyGoal, ...categoryGoals].filter(Boolean);
      console.log('Sorted Goals:', sortedGoals);
      setGoalsData(sortedGoals);

      if (monthlyGoal) {
        setMonthlyAmount(monthlyGoal.amount);
        setEditedMonthly(monthlyGoal.hasEdited);
      }
    });

    return () => unsubscribe();
  }, [userData.email]);

 useEffect(() => {
    const fetchDataAndCalculate = async () => {
      try {
        const expensesCollectionRef = collection(doc(db, 'users', userData.email), 'expenses');
        const expensesSnapshot = await getDocs(expensesCollectionRef);
        const expenses = expensesSnapshot.docs.map(doc => doc.data());

        const totalIncome = expenses
          .filter(expense => expense.type === 'Income')
          .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

        const totalExpenditure = expenses
          .filter(expense => expense.type === 'Expenditure')
          .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

        const percentageSpent = totalIncome > 0 ? ((totalExpenditure / totalIncome) * 100).toFixed(2) : 0;

        const updatedGoalsData = goalsData.map(goal => {
          if (goal.id === 'monthly goal') {
            return {
              ...goal,
              spent: `${percentageSpent}%`,
            };
          } else {
            const categoryExpenditure = expenses
              .filter(expense => expense.type === 'Expenditure' && expense.category === goal.category)
              .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

            return {
              ...goal,
              spent: `$${categoryExpenditure.toFixed(2)} on ${goal.category} so far`,
            };
          }
        });

        setGoalsData(updatedGoalsData);
      } catch (error) {
        console.error('Error fetching and calculating data: ', error);
      }
    };
    if (goalsData.length > 1) {
      fetchDataAndCalculate();
    }
  }, [goalsData, userData.email]);


  const handleSave = async (oldGoal, newGoal) => {
    const currentTime = new Date();
    const newEditedMonthly = editedMonthly + 1;

    const newGoalData = {
      id: oldGoal.id,
      amount: newGoal.amount,
      hasEdited: newEditedMonthly,
      category: newGoal.category || oldGoal.category,
      lastEdit: currentTime.toISOString(),
    };

    if (newGoal.category) {
      // Category goal
      newGoalData.id = `${newGoal.category} goal`;
    }
  
    setEditedMonthly(newEditedMonthly);
    setGoalsData(prevGoals => {
      const updatedGoals = prevGoals.filter(goal => goal.id !== newGoalData.id);
      return [...updatedGoals, newGoalData];
    });
  
    try {
      const userDocRef = doc(db, 'users', userData.email);
      const goalDocRef = doc(userDocRef, 'goals', newGoalData.id);
  
      await setDoc(goalDocRef, newGoalData); // Save data to Firestore

      setEditedMonthly(newEditedMonthly);
      setModalVisible(false);
      setIsNewGoal(false);
    } catch (error) {
      console.error('Error updating goal: ', error);
    }
  };

  const handleEdit = (item) => {
    if (item.hasEdited >= 2) {
      Alert.alert('Edit Restriction', 'You can only edit this goal once within a month of setting it.');
      return;
    }
    setSelectedGoal(item);
    setIsEditing(true);
    setModalVisible(true);
  };
  
  const renderGoalItem = ({ item }) => {
    console.log('Rendering Goal:', item);

    if (item.category === 'Monthly') {
      return (
        <View style={styles.card}>
          <View style={styles.goalTextContainer}>
            <Text style={styles.title}>I want to save</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.amount}>${monthlyAmount}</Text>
              <Text style={styles.description}>this month</Text>
            </View>
            <View style={styles.spentContainer}>
              <Text style={styles.spent}>You have spent {item.spent} of your budget so far</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.card}>
          <View style={styles.goalTextContainer}>
            <Text style={styles.title}>I want to spend a maximum of</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.amount}>${item.amount}</Text>
              <Text style={styles.description}>on {item.category} this month</Text>
            </View>
            <View style={styles.spentContainer}>
              <Text style={styles.spent}>You have spent {item.spent}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(item)}
          >
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={goalsData}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListFooterComponent={() => (
          <TouchableOpacity
            style={styles.newGoalButton}
            onPress={() => {
              setSelectedGoal({ id: '', title: '', amount: '$0', category: '', description: '', spent: '', editText: 'Save' });
              setIsEditing(false);
              setModalVisible(true);
            }}
          >
            <Text style={styles.newGoalButtonText}>+ Add New Goal</Text>
          </TouchableOpacity>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        {isEditing ? (
          <GoalEditScreen
            goal={selectedGoal}
            onSave={(newGoal) => handleSave(selectedGoal, newGoal)}
            onClose={() => setModalVisible(false)}
            userData={userData}
          />
        ) : (
          <GoalInputScreen
            goal={selectedGoal}
            onSave={(newGoal) => handleSave(selectedGoal, newGoal)}
            onClose={() => setModalVisible(false)}
            isNewGoal={true}
            userData={userData}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  list: {
    paddingHorizontal: 20,
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
    position: 'relative',
  },
  goalTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  description: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  spentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 5, // Add space around amount
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  spent: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  editButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#6E9277',
  },
  editText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  newGoalButton: {
    backgroundColor: '#6E9277',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    alignSelf: 'center', // Center horizontally
  },
  newGoalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
});