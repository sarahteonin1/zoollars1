import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, Modal, TouchableOpacity } from 'react-native';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ensure this is the correct path to your firebaseConfig file

const initialChallenges = [
  { id: '1', text: 'Save 10% more than goal', reward: 100, completed: false },
  { id: '2', text: 'Spend below your budget', reward: 150, completed: false },
  { id: '3', text: 'Make 5 friends on Zoollars!', reward: 200, completed: false },
  { id: '4', text: 'Buy your first animal <3', reward: 200, completed: false },
  { id: '5', text: 'Become a zoo expert and buy 5 animals!', reward: 300, completed: false },
  { id: '6', text: 'Save 20% more than your goal', reward: 350, completed: false },
  { id: '7', text: 'Save 50% of your income', reward: 400, completed: false }
];

const ChallengesScreen = ({ userData }) => {
  const [challenges, setChallenges] = useState(initialChallenges);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', userData.email); // Use email as the document ID
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userChallenges = userDoc.data().challenges || {};
          const updatedChallenges = initialChallenges.map(challenge => ({
            ...challenge,
            completed: userChallenges[challenge.id] || false
          }));
          setChallenges(updatedChallenges);
        }
      } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
      }
    };
    fetchUserData();
  }, [userData]);

  const handleRedeem = (challenge) => {
    setSelectedChallenge(challenge);
    setModalVisible(true);
  };

  const confirmRedeem = async () => {
    if (selectedChallenge) {
      const updatedChallenges = challenges.map(challenge =>
        challenge.id === selectedChallenge.id
          ? { ...challenge, completed: true }
          : challenge
      );
      setChallenges(updatedChallenges);
      userData.zoollars += selectedChallenge.reward;

      const userRef = doc(db, 'users', userData.email); // Use email as the document ID
      try {
        await setDoc(userRef, {
          zoollars: userData.zoollars,
          challenges: updatedChallenges.reduce((acc, challenge) => {
            acc[challenge.id] = challenge.completed;
            return acc;
          }, {})
        }, { merge: true });
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    }
    setModalVisible(false);
    setSelectedChallenge(null);
  };

  const renderItem = ({ item }) => (
    <View style={styles.challengeItem}>
      <Text style={styles.challengeText}>{item.text}</Text>
      {!item.completed ? (
        <Pressable
          style={[styles.rewardButton, styles.disabledButton]}
          disabled={true}
        >
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

  if (!userData) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.coinsContainer}>
        <Text style={styles.coinsText}>Coins: {userData.zoollars || 0}</Text>
      </View>
      <FlatList
        data={challenges}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      {modalVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Redeem {selectedChallenge?.reward} coins?</Text>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmRedeem}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
    alignItems: 'center',
    marginBottom: 20, // Add margin to separate from challenges list
  },
  coinsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#6e9277',
    padding: 10,
    borderRadius: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default ChallengesScreen;
