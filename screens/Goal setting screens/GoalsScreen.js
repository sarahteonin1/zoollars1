import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, Alert } from 'react-native';
import GoalInputScreen from './GoalInputScreen';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '/Users/rakshanaravichandran/Desktop/zoollars1/firebaseConfig.js'; // Ensure this is the correct path to your firebaseConfig file

const initialGoalsData = [
  {
    id: '1',
    title: 'I want to save',
    amount: '$0',
    description: 'this month',
    spent: '0% of your budget so far',
    editText: 'Edit',
    hasEdited: false,
    lastEdit: null,
  },
];

const GoalsScreen = () => {
  const [goalsData, setGoalsData] = useState(initialGoalsData);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isNewGoal, setIsNewGoal] = useState(false);

  useEffect(() => {
    const checkEditRestriction = async () => {
      const newData = await Promise.all(
        goalsData.map(async (goal) => {
          const docRef = doc(db, "goals", goal.id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            return { ...goal, ...docSnap.data() };
          }
          return goal;
        })
      );
      setGoalsData(newData);
    };
    checkEditRestriction();
  }, []);

  const handleSave = async (id, newGoal) => {
    const currentTime = new Date();
    let newGoalData;

    if (isNewGoal) {
      id = (goalsData.length + 1).toString();
      newGoalData = {
        id,
        title: `I want to spend a maximum of`,
        amount: newGoal.amount,
        category: newGoal.category,
        description: 'this month',
        spent: `$0 on ${newGoal.category} so far`,
        editText: 'Edit',
        lastEdit: currentTime.toISOString(),
        hasEdited: false,
      };
    } else {
      const goalToUpdate = goalsData.find(goal => goal.id === id);
      newGoalData = {
        ...goalToUpdate,
        ...newGoal,
        spent: id === '1' ? '0% of your budget so far' : `$0 on ${newGoal.category} so far`,
        lastEdit: currentTime.toISOString(),
        hasEdited: true,
      };
    }

    const newData = isNewGoal
      ? [...goalsData, newGoalData]
      : goalsData.map((item) =>
          item.id === id ? newGoalData : item
        );

    setGoalsData(newData);
    setModalVisible(false);
    setIsNewGoal(false);

    try {
      const docRef = doc(db, 'goals', id);
      await setDoc(docRef, newGoalData);
      console.log('Document written with ID: ', id);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const handleEdit = (item) => {
    const currentTime = new Date();
    const lastEditTime = new Date(item.lastEdit);
    const timeDifference = Math.abs(currentTime - lastEditTime);
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    if (item.id === '1' && (!item.hasEdited || timeDifference >= oneMonth)) {
      // Allow editing for the first time or after one month for the monthly goal
      setSelectedGoal(item);
      setModalVisible(true);
    } else if (item.hasEdited && timeDifference < oneMonth) {
      Alert.alert(
        'Edit Restriction',
        'You can only edit this goal once within a month of setting it.'
      );
      return;
    } else {
      setSelectedGoal(item);
      setModalVisible(true);
    }
  };

  const renderGoalItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.goalTextContainer}>
        <Text style={styles.title}>
          {item.title}{' '}
          <Text style={styles.amount}>{item.amount}</Text>{' '}
          {item.description}{' '}
          {item.category && (
            <Text>
              on <Text style={styles.categoryText}>{item.category}</Text>
            </Text>
          )}
        </Text>
        <Text style={styles.spent}>You have spent {item.spent}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEdit(item)}
      >
        <Text style={styles.editText}>{item.editText}</Text>
      </TouchableOpacity>
    </View>
  );

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
              setIsNewGoal(true);
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
        <GoalInputScreen
          goal={selectedGoal}
          onSave={(newGoal) => handleSave(selectedGoal.id, newGoal)}
          onClose={() => setModalVisible(false)}
          isNewGoal={isNewGoal}
        />
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
  amount: {
    fontSize: 24,
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

export default GoalsScreen;
