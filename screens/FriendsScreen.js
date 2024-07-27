import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Image, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const initialPositions = [
  { top: 100, left: 70 },   // Position 1: Top-left
  { top: 120, left: 110 },   // Position 2: Middle-left
  { top: 150, left: 150 },  // Position 3: Top-right
  { top: 170, left: 190 }, // Position 4: Bottom-left
  { top: 120, left: 25 }, // 5
  { top: 145, left: 70 }, // 6
  { top: 170, left: 110 }, // 7
  { top: 190, left: 150 }, // 8
  { top: 80, left: 110 }, // 9
  { top: 110, left: 150 }, // 10
  { top: 130, left: 190 } // 11
];

const FriendsScreen = ({ userData }) => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (userData && userData.email) {
      const fetchFriends = async () => {
        try {
          const userDocRef = doc(db, 'users', userData.email);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userFriends = userDocSnap.data().friends || [];
            const friendsDataPromises = userFriends.map(friendEmail => fetchFriendData(friendEmail));
            const friendsData = await Promise.all(friendsDataPromises);
            setFriends(friendsData.filter(friend => friend !== null));
          }
        } catch (error) {
          console.error('Error fetching friends: ', error);
        }
      };

      fetchFriends();
    }
  }, [userData]);

  const fetchFriendData = async (email) => {
    try {
      const docRef = doc(db, 'users', email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        alert('No such friend!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching friend: ', error);
      return null;
    }
  };

  const handleFriendPress = (friend) => {
    console.log('Selected friend data: ', friend);
    if (!friend.animals) {
      friend.animals = []; // Ensure the animals array is always defined
    }
    setSelectedFriend(friend);
    setModalVisible(true);
  };

  const addFriend = async () => {
    if (email === '') {
      alert("Please enter an email address.");
      return;
    }

    if (userData && email === userData.email) {
      alert("You cannot add yourself as a friend!");
      return;
    }

    const friendData = await fetchFriendData(email);
    if (friendData) {
      if (!friendData.animals) {
        friendData.animals = [];
      }
      setFriends([...friends, friendData]);
      setEmail('');

      // Update the user's friends list in Firestore
      try {
        const userDocRef = doc(db, 'users', userData.email);
        await updateDoc(userDocRef, {
          friends: arrayUnion(email),
        });
      } catch (error) {
        console.error('Error updating friends list: ', error);
      }
    }
  };

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity style={styles.friendItem} onPress={() => handleFriendPress(item)}>
      <View style={styles.friendInfo}>
        <Image source={{ uri: item.profilePicture }} style={styles.friendImage} />
        <View style={styles.friendText}>
          <Text style={styles.friendName}>{item.name}</Text>
          <View style={styles.friendDetails}>
            <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fcapybara.png?alt=media&token=2b826c27-1ef6-4bb0-872d-1a2a28fbf156' }} style={styles.icon} resizeMode='contain' />
            <Text style={styles.animalCount}>{item.animals ? item.animals.length : 0}</Text>
            <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fzoollarslogo.png?alt=media&token=cc11f9c7-83d1-479e-9d7f-32a0b4aa2333' }} style={styles.icon} resizeMode='contain' />
            <Text style={styles.coinCount}>{item.zoollars}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (!userData || !userData.email) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <FlatList
          data={friends}
          renderItem={renderFriendItem}
          keyExtractor={(item) => item.id}
        />
        <View style={styles.addFriendContainer}>
          <TextInput
            placeholder="Enter friend's email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={addFriend}>
            <Text style={styles.addButtonText}>Add Friend</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                {selectedFriend && (
                  <>
                    <Text style={styles.modalZooText}>{selectedFriend.name}'s Zoo</Text>
                    <View style={styles.zooContainer}>
                      <View style={styles.zooWrapper}>
                        <Image
                          source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Femptyzoo.png?alt=media&token=eee4eade-a3e7-411c-9877-a63be4dd1032' }}
                          style={styles.zooBackground}
                          resizeMode="contain"
                        />
                        {selectedFriend.animals.map((animal, index) => (
                          <Image
                            key={index}
                            source={{ uri: animal.imageUrl }}
                            style={[styles.animal, { top: initialPositions[index % initialPositions.length].top, left: initialPositions[index % initialPositions.length].left }]}
                            resizeMode="contain"
                          />
                        ))}
                      </View>
                      <View style={styles.counterContainer}>
                        <Image
                          source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fcapybara.png?alt=media&token=2b826c27-1ef6-4bb0-872d-1a2a28fbf156' }}
                          style={styles.icon}
                          resizeMode="contain"
                        />
                        <Text style={styles.counterText}>{selectedFriend.animals.length}</Text>
                        <Image
                          source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fzoollarslogo.png?alt=media&token=cc11f9c7-83d1-479e-9d7f-32a0b4aa2333' }}
                          style={styles.icon}
                          resizeMode="contain"
                        />
                        <Text style={styles.counterText}>{selectedFriend.zoollars}</Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendText: {
    justifyContent: 'center',
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  friendDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  icon: {
    width: 25,
    height: 25,
    marginHorizontal: 5,
  },
  animalCount: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  coinCount: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  addFriendContainer: {
    padding: 30,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    alignItems: 'center', // Center the content horizontally
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '80%',
  },
  addButton: {
    backgroundColor: '#6E9277',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalZooText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  zooContainer: {
    width: '100%',
    alignItems: 'center',
  },
  zooWrapper: {
    width: 350, // Adjusted to better fit the zoo image size
    height: 350, // Adjusted to better fit the zoo image size
    position: 'relative',
    padding: 10
  },
  zooBackground: {
    width: '100%',
    height: '100%',
  },
  animal: {
    width: 35, // Adjusted the size of the animal images
    height: 35, // Adjusted the size of the animal images
    position: 'absolute',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  counterText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
});

export default FriendsScreen;

