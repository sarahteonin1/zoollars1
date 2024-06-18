import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native';

const challenges = [
  { id: '1', text: 'Save 10% more than goal', reward: 100 },
  { id: '2', text: 'Spend below your budget', reward: 150 },
  { id: '3', text: 'Make 5 friends on Zoollars!', reward: 200 },
  { id: '4', text: 'Buy your first animal <3', reward: 0, completed: true },
  { id: '5', text: 'Become a zoo expert and buy 5 animals!', reward: 300 },
  { id: '6', text: 'Save 20% more than your goal', reward: 350 },
  { id: '7', text: 'Save 50% of your income', reward: 400 }
];

const ChallengesScreen = ({ userData }) => {
  const renderItem = ({ item }) => (
    <View style={styles.challengeItem}>
      <Text style={styles.challengeText}>{item.text}</Text>
      {item.reward > 0 ? (
        <Pressable style={styles.rewardButton}>
          <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fzoollarslogo.png?alt=media&token=cc11f9c7-83d1-479e-9d7f-32a0b4aa2333' }} style={styles.coinIcon} />
          <Text style={styles.rewardText}>{item.reward}</Text>
        </Pressable>
      ) : (
        <View style={styles.checkMark}>
          <Text style={styles.checkMarkText}>✓</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.coinsContainer}>
        <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fzoollarslogo.png?alt=media&token=cc11f9c7-83d1-479e-9d7f-32a0b4aa2333' }} style={styles.coinIcon} />
        <Text style={styles.coinsText}>{userData.zoollars}</Text>
      </View>
      <FlatList
        data={challenges}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6e9277',
    padding: 9,
    borderRadius: 20,
    alignSelf: 'flex-end',
    marginBottom: 20, // Add margin to separate from challenges list
  },
  coinsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 5,
  },
  challengeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  challengeText: {
    fontSize: 16,
    flexShrink: 1,
  },
  rewardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6e9277',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  rewardText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  coinIcon: {
    width: 20,
    height: 20,
  },
  checkMark: {
    backgroundColor: '#6e9277',
    padding: 10,
    borderRadius: 20, // To make it circular
    justifyContent: 'center',
    alignItems: 'center',
    width: 40, // Adjust width and height for better appearance
    height: 40,
  },
  checkMarkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ChallengesScreen;
