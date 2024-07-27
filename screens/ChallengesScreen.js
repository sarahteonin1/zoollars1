import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, Modal, TouchableOpacity } from 'react-native';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const initialChallenges = [
  { id: '1', text: 'Save 10% more than goal', reward: 100, completed: false, redeemed: false },
  { id: '2', text: 'Spend below your budget', reward: 150, completed: false, redeemed: false },
  { id: '3', text: 'Make 5 friends on Zoollars!', reward: 200, completed: false, redeemed: false },
  { id: '4', text: 'Buy your first animal <3', reward: 200, completed: false, redeemed: false },
  { id: '5', text: 'Become a zoo expert and buy 5 animals!', reward: 300, completed: false, redeemed: false },
  { id: '6', text: 'Save 20% more than your goal', reward: 350, completed: false, redeemed: false },
  { id: '7', text: 'Save 50% of your income', reward: 400, completed: false, redeemed: false }
];

const ChallengesScreen = ({ userData }) => {
  const [challenges, setChallenges] = useState(initialChallenges);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  useEffect(() => {
    if (!userData) return;

    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', userData.email);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userChallenges = userDoc.data().challenges || {};
          const updatedChallenges = initialChallenges.map(challenge => ({
            ...challenge,
            completed: userChallenges[challenge.id]?.completed || false,
            redeemed: userChallenges[challenge.id]?.redeemed || false
          }));
          setChallenges(updatedChallenges);
        }
      } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
      }
    };
    fetchUserData();
  }, [userData]);

  useEffect(() => {
    if (!userData) return;

    const checkChallengeCompletion = async () => {
      try {
        const userRef = doc(db, 'users', userData.email);
        const userDoc = await getDoc(userRef);
        const userDataFetched = userDoc.data();

        const goalsDoc = await getDoc(doc(db, 'users', userData.email, 'goals', 'Monthly goal'));
        const monthlyGoal = goalsDoc.exists() ? parseFloat(goalsDoc.data().amount) : 0;

        const { totalExpenditure } = await fetchMonthlyExpenses(userData.email);
        const { totalIncome } = await fetchUserIncome(userData.email);

        const savings = totalIncome - totalExpenditure;
        const percentageSaved = (monthlyGoal > 0) ? (savings / monthlyGoal) * 100 : 0;

        const updatedChallenges = challenges.map(challenge => {
          let completed = false;
          if (challenge.id === '1' && percentageSaved >= 10) {
            completed = true;
          } else if (challenge.id === '2' && savings >= monthlyGoal) {
            completed = true;
          } else if (challenge.id === '3' && userDataFetched.friends && userDataFetched.friends.length >= 5) {
            completed = true;
          } else if (challenge.id === '4' && userDataFetched.animals && userDataFetched.animals.length >= 1) {
            completed = true;
          } else if (challenge.id === '5' && userDataFetched.animals && userDataFetched.animals.length >= 5) {
            completed = true;
          } else if (challenge.id === '6' && percentageSaved >= 20) {
            completed = true;
          } else if (challenge.id === '7' && totalExpenditure <= totalIncome / 2) {
            completed = true;
          }
          return { ...challenge, completed, redeemed: challenge.redeemed || false };
        });
        setChallenges(updatedChallenges);

        // Save the updated challenges to Firestore
        await setDoc(userRef, {
          challenges: updatedChallenges.reduce((acc, challenge) => {
            acc[challenge.id] = { completed: challenge.completed, redeemed: challenge.redeemed };
            return acc;
          }, {})
        }, { merge: true });
      } catch (error) {
        console.error("Error checking challenge completion:", error);
      }
    };

    checkChallengeCompletion();
  }, [challenges, userData]);

  const handleRedeem = (challenge) => {
    setSelectedChallenge(challenge);
    setModalVisible(true);
  };

  const confirmRedeem = async () => {
    if (selectedChallenge) {
      const updatedChallenges = challenges.map(challenge =>
        challenge.id === selectedChallenge.id
          ? { ...challenge, completed: true, redeemed: true } // Mark as redeemed
          : challenge
      );
      setChallenges(updatedChallenges);
      userData.zoollars += selectedChallenge.reward;

      const userRef = doc(db, 'users', userData.email);
      try {
        await setDoc(userRef, {
          zoollars: userData.zoollars,
          challenges: updatedChallenges.reduce((acc, challenge) => {
            acc[challenge.id] = { completed: challenge.completed, redeemed: challenge.redeemed };
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
      {item.redeemed ? (
        <View style={styles.checkMark}>
          <Text style={styles.checkMarkText}>✓</Text>
        </View>
      ) : (
        <Pressable
          style={[styles.rewardButton, item.completed ? styles.completedButton : styles.disabledButton]}
          disabled={!item.completed}
          onPress={() => item.completed && handleRedeem(item)}
        >
          <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fzoollarslogo.png?alt=media&token=cc11f9c7-83d1-479e-9d7f-32a0b4aa2333' }} style={styles.coinIcon} />
          <Text style={styles.rewardText}>{item.reward}</Text>
        </Pressable>
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
    marginBottom: 20,
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
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  completedButton: {
    backgroundColor: '#6e9277',
  },
  disabledButton: {
    backgroundColor: '#ccc',
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
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
    alignItems: 'center',
  },
  checkMarkText: {
    color: '#6e9277',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
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
  },
});

export default ChallengesScreen;

async function fetchMonthlyExpenses(userEmail) {
  const expensesRef = collection(db, `users/${userEmail}/expenses`);
  const querySnapshot = await getDocs(expensesRef);
  let totalExpenditure = 0;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.type === 'Expenditure') {
      totalExpenditure += parseFloat(data.amount);
    }
  });

  return { totalExpenditure };
}

async function fetchUserIncome(userEmail) {
  const incomeRef = collection(db, `users/${userEmail}/income`);
  const querySnapshot = await getDocs(incomeRef);
  let totalIncome = 0;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.type === 'Income') {
      totalIncome += parseFloat(data.amount);
    }
  });

  return { totalIncome };
}

