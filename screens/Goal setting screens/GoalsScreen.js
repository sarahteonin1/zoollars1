import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import GoalInputScreen from './GoalInputScreen';
import GoalEditScreen from './GoalEditScreen';
import { doc, setDoc, getDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig'; // Ensure this is the correct path to your firebaseConfig file
import { fetchMonthlyExpenses, fetchUserIncome, calculateSpentPercentage, categorySpent } from './budgetUtils';

const initialGoalsData = [
  {
    id: 'Monthly goal',
    amount: '0',
    hasEdited: 0,
    category: 'Monthly',
    lastEdit: null,
  },
];

export default function GoalsScreen ({ userData }) {
  const [goalsData, setGoalsData] = useState(initialGoalsData);
  const [categoryGoals, setCategoryGoals] = useState([]);
  const [categoryExpenses, setCategoryExpenses] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewGoal, setIsNewGoal] = useState(false);
  const [editedMonthly, setEditedMonthly] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [income, setIncome] = useState(0);

  useEffect(() => {
    const fetchMonthlyGoalData = async () => {
      try {
        const userDocRef = doc(db, 'users', userData.email);
        const goalDocRef = doc(userDocRef, 'goals', 'Monthly goal');
        const goalDoc = await getDoc(goalDocRef);

        if (goalDoc.exists()) {
          const goalData = goalDoc.data();
          setGoalsData([goalData]);
        } else {
          // If the document does not exist, set initial goal data
          await setDoc(goalDocRef, initialGoalsData[0]);
          setGoalsData(initialGoalsData);
        }
      } catch (error) {
        console.error('Error fetching goal data: ', error);
      }
    };

    const unsubscribe = onSnapshot(doc(db, `users/${userData.email}/goals/Monthly goal`), () => {
      fetchMonthlyGoalData();
    });

    return () => unsubscribe();
  }, [userData.email]);

  useEffect(() => { 
    const fetchCategoryGoals = async () => {
      try {
        const userDocRef = doc(db, 'users', userData.email);
        const goalsCollectionRef = collection(userDocRef, 'goals');
        const goalsSnapshot = await getDocs(goalsCollectionRef);
        const categoryGoalsData = goalsSnapshot.docs
          .map(doc => doc.data())
          .filter(goal => goal.category !== 'Monthly');
        setCategoryGoals(categoryGoalsData);

        const expenses = {};
        for (const goal of categoryGoalsData) {
          expenses[goal.category] = (await categorySpent(goal.category, userData.email)).toFixed(2);
        }
        setCategoryExpenses(expenses);
      } catch (error) {
        console.error('Error fetching category goals: ', error);
      }
    };
      
    const unsubscribe = onSnapshot(collection(db, `users/${userData.email}/expenses`), () => {
      fetchCategoryGoals();
    });

    return () => unsubscribe();
  }, [userData.email]);

  useEffect(() => {
    const fetchData = async () => {
      const totalExpenses = await fetchMonthlyExpenses(userData.email);
      const userIncome = await fetchUserIncome(userData.email);
      setTotalExpenditure(totalExpenses);
      setIncome(userIncome);
    };

    const expensesUnsubscribe = onSnapshot(collection(db, `users/${userData.email}/expenses`), () => {
      fetchData();
    });

    return () => expensesUnsubscribe();
  }, [userData.email]);

  const handleEdit = (item) => {
    if (item.hasEdited >= 2) {
      Alert.alert('Edit Restriction', 'You can only edit this goal once within a month of setting it.');
      return;
    }
    setSelectedGoal(item);
    setModalVisible(true);
    setIsNewGoal(false);
  };

  const handleSave = async (oldGoal, newGoal) => {
    const currentTime = new Date();
    const newEditedMonthly = editedMonthly + 1;

    const newGoalData = {
      id: newGoal.id,
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

  const spentPercentage = calculateSpentPercentage(income, parseFloat(goalsData[0].amount), totalExpenditure).toFixed(2);

  const renderCategoryItem = ({ item }) => {
    const categorySpentAmount = categoryExpenses[item.category]|| 0;
    return (
      <View style={styles.card}>
        <Text style={styles.title}>I want to spend a maximum of</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>${item.amount}</Text>
          <Text style={styles.description}>on </Text>
          <Text style={styles.categoryText}>{item.category}</Text>
          <Text style={styles.description}>this month</Text>
        </View>
        <View style={styles.spentContainer}>
          <Text style={styles.spent}>You have spent ${categorySpentAmount} on {item.category} so far</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            setIsEditing(true);
            handleEdit(item);
          }}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {goalsData.map((item) => (
        <View style={styles.card}>
            <Text style={styles.title}>I want to save</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.amount}>${item.amount}</Text>
              <Text style={styles.description}>this month</Text>
            </View>
            <View style={styles.spentContainer}>
                  <Text style={styles.spent}>You have spent {spentPercentage}% of your budget so far</Text>
            </View>
          <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setIsEditing(true);
                handleEdit(item);
              }}
          >
              <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
      ))}

      <FlatList
        data={categoryGoals}
        renderItem={renderCategoryItem}
        keyExtractor={item => item.id}
        ListFooterComponent={() => (
          <TouchableOpacity 
            style={styles.newGoalButton}
            onPress={() => {
              setIsNewGoal(true);
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
    marginHorizontal: 20,
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
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 5,
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
