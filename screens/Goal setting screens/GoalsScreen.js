import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Modal } from 'react-native';
import GoalInputScreen from './GoalInputScreen';

const initialGoalsData = [
  {
    id: '1',
    title: 'I want to save',
    amount: '$0',
    description: 'this month',
    spent: '0%',
    editText: 'Edit',
  },
  {
    id: '2',
    title: 'I want to spend a maximum of',
    amount: '$0',
    category: 'Food',
    description: 'this month',
    spent: '$0 on food so far',
    editText: 'Edit',
  },
  {
    id: '3',
    title: 'I want to spend a maximum of',
    amount: '$0',
    category: 'Transport',
    description: 'this month',
    spent: '$0 on food so far',
    editText: 'Edit',
  },
];

const GoalsScreen = () => {
  const [goalsData, setGoalsData] = useState(initialGoalsData);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);

  const handleAmountChange = (text, id) => {
    const newData = goalsData.map(item =>
      item.id === id ? { ...item, amount: text } : item
    );
    setGoalsData(newData);
  };

  const handleCategoryChange = (text, id) => {
    const newData = goalsData.map(item =>
      item.id === id ? { ...item, category: text } : item
    );
    setGoalsData(newData);
  };

  const handleSave = (id, newGoal) => {
    const newData = goalsData.map(item =>
      item.id === id ? { ...item, ...newGoal } : item
    );
    setGoalsData(newData);
    setModalVisible(false);
  };

  const renderGoalItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        {item.title} 
        <Text style={styles.amount}>{item.amount}</Text>
        {item.description}
      </Text>
      {item.category && 
        <Text style={styles.category}>
          on <Text style={styles.categoryText}>{item.category}</Text>
        </Text>
      }
      <Text style={styles.spent}>You have spent {item.spent}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          setSelectedGoal(item);
          setModalVisible(true);
        }}
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
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  category: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
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
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#6E9277',
    alignSelf: 'flex-start',
  },
  editText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default GoalsScreen;
