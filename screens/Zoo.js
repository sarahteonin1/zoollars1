import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialPositions = [
  { top: 125, left: 25 },   // Position 1
  { top: 100, left: 75 },   // Position 2
  { top: 75, left: 125 },  // Position 3
  { top: 55, left: 160 },  // Position 4
];

export default function Zoo({ userData, purchasedAnimal }) {
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const storedAnimals = await AsyncStorage.getItem('animals');
        if (storedAnimals) {
          setAnimals(JSON.parse(storedAnimals));
        }
      } catch (error) {
        console.error('Failed to load animals from storage', error);
      }
    };

    loadAnimals();
  }, []);

  useEffect(() => {
    if (purchasedAnimal) {
      const nextPosition = initialPositions[animals.length % initialPositions.length];
      const newAnimal = {
        id: animals.length,
        imageUrl: purchasedAnimal.imageUrl,
        position: nextPosition,
      };
      const updatedAnimals = [...animals, newAnimal];
      setAnimals(updatedAnimals);

      const saveAnimals = async () => {
        try {
          await AsyncStorage.setItem('animals', JSON.stringify(updatedAnimals));
        } catch (error) {
          console.error('Failed to save animals to storage', error);
        }
      };

      saveAnimals();
    }
  }, [purchasedAnimal]);

  return (
    <View style={styles.card}>
      <Text style={styles.zooText}>My Zoo</Text>
      <View style={styles.zooContainer}>
        <Image
          source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Femptyzoo.png?alt=media&token=eee4eade-a3e7-411c-9877-a63be4dd1032' }}
          style={styles.zooBackground}
          resizeMode="contain"
        />
        {animals.map((animal) => (
          <Image
            key={animal.id}
            source={{ uri: animal.imageUrl }}
            style={[styles.animal, animal.position]}
          />
        ))}
      </View>
      <View style={styles.counterContainer}>
        <Image
          source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fcapybara.png?alt=media&token=2b826c27-1ef6-4bb0-872d-1a2a28fbf156' }}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.counterText}>{animals.length}</Text>
        <Image
          source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fzoollarslogo.png?alt=media&token=cc11f9c7-83d1-479e-9d7f-32a0b4aa2333' }}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.counterText}>{userData.zoollars}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    alignItems: 'center',
    position: 'relative', // Ensure relative positioning
  },
  zooText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  zooContainer: {
    width: 350, // Adjusted to better fit the zoo image size
    height: 350, // Adjusted to better fit the zoo image size
    position: 'relative',
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
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
  counterText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
});

