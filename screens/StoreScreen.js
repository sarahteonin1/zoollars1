import React, { useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const animals = [
  { id: 1, name: 'capybara', description: 'I am a capybara! I\'m shy and I like to take long naps zzz', price: 100, imageUrl: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fcapybara.png?alt=media&token=8db9894d-64fd-4e26-817e-66d6c620c9d6' },
  { id: 2, name: 'panda', description: 'I am a panda! I like to munch on my bamboo', price: 100, imageUrl: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fpanda.png?alt=media&token=778d98a1-449b-4f94-bdf4-2d7064e4ebc4' },
  { id: 3, name: 'sheep', description: 'I am a sheep! baa baa WHITE sheep I have a lot of wool...', price: 100, imageUrl: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fsheep.png?alt=media&token=5a15bfe9-1826-4979-a10a-554e8b3633ae' },
  { id: 4, name: 'parrot', description: 'I am a parrot! I\'m always here to talk to you!', price: 200, imageUrl: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fparrot.png?alt=media&token=5d3a106d-d683-42d6-aee6-d8724ff94a13' },
  { id: 5, name: 'koala', description: 'I am a koala! I\'m cuddly and I love warm hugs', price: 200, imageUrl: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fkoala.png?alt=media&token=1aa66b57-2182-402e-b6dd-4ebe577a5ae6' },
  { id: 6, name: 'otter', description: 'I am an otter! I like to swim with my sisters and brothers', price: 200, imageUrl: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fotter.png?alt=media&token=3368f167-0fc2-4609-a24b-799ce56bea10' },
  { id: 7, name: 'tiger', description: 'I am a tiger! You may think I\'m scary but I\'m just a big cat', price: 300, imageUrl: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Ftiger.png?alt=media&token=6551d599-42f6-47d4-8427-4579f594bf09' },
  { id: 8, name: 'fox', description: 'I am a fox! I love to do my morning stretches', price: 300, imageUrl: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Ffox.png?alt=media&token=49eb430a-5a5f-4ccf-96b1-cd89361ffffd' },
  { id: 9, name: 'elephant', description: 'I am an elephant! I like peanuts and bananas', price: 300, imageUrl: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Felephant.png?alt=media&token=9afbe45c-73d3-4365-b9a2-3d5f47d9a60f' },
  { id: 10, name: 'giraffe', description: 'I am a giraffe! I can help you reach high places!', price: 300, imageUrl: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fgiraffe.png?alt=media&token=339d9f4a-dbef-4114-bd21-06e8e93f578d' },
];

const StoreScreen = ({ userData, onPurchase }) => {
  const [userCoins, setUserCoins] = useState(userData.zoollars);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePurchase = (animal) => {
    setSelectedAnimal(animal);
    setShowConfirmModal(true);
  };

  const confirmPurchase = async () => {
    if (selectedAnimal && userCoins >= selectedAnimal.price) {
      const newCoins = userCoins - selectedAnimal.price;
      setUserCoins(newCoins);

      // Update the userData object
      const updatedUserData = { ...userData, zoollars: newCoins };

      try {
        await setDoc(doc(db, 'users', userData.email), updatedUserData);
      } catch (error) {
        console.error("Error updating user data: ", error);
      }

      setShowConfirmModal(false);
      setShowSuccessModal(true);

      // Add the purchased animal to the zoo
      onPurchase(selectedAnimal);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } else {
      alert("You do not have enough coins!");
      setShowConfirmModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.coinsText}>Coins: </Text>
        <Text style={styles.coins}>{userCoins}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.grid}>
          {animals.map(animal => (
            <View key={animal.id} style={styles.item}>
              <Image source={{ uri: animal.imageUrl }} style={styles.image} />
              <Text style={styles.description}>{animal.description}</Text>
              <TouchableOpacity style={styles.button} onPress={() => handlePurchase(animal)}>
                <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fzoollarslogo.png?alt=media&token=cc11f9c7-83d1-479e-9d7f-32a0b4aa2333' }} style={styles.logo} />
                <Text style={styles.buttonText}>{animal.price}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedAnimal && (
              <>
                <Text style={styles.modalTitle}>Buy {selectedAnimal.name}?</Text>
                <Image source={{ uri: selectedAnimal.imageUrl }} style={styles.modalImage} />
                <TouchableOpacity style={styles.modalButton} onPress={confirmPurchase}>
                  <Text style={styles.modalButtonText}>Confirm</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Successful Purchase!</Text>
            <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2FFrame%20(1).png?alt=media&token=680a9768-4973-4c0b-b467-c0795e72102b' }} style={styles.successImage} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  coinsText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  coins: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  scrollView: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  item: {
    width: (Dimensions.get('window').width / 2) - 32,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 16,
    margin: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 3,
    position: 'relative',
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#6E9277',
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
    fontWeight: 'bold'
  },
  logo: {
    width: 16,
    height: 16,
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
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalImage: {
    width: 60,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#6E9277',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginTop: 20,
  },
});

export default StoreScreen;
