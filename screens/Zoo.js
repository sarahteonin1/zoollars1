import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

const initialPositions = [
  { top: 100, left: 70 },   // Position 1: Top-left
  { top: 120, left: 110 },  // Position 2: Middle-left
  { top: 150, left: 150 },  // Position 3: Top-right
  { top: 170, left: 190 },  // Position 4: Bottom-left
  { top: 120, left: 25 },   // Position 5
  { top: 145, left: 70 },   // Position 6
  { top: 170, left: 110 },  // Position 7
  { top: 190, left: 150 },  // Position 8
  { top: 80, left: 110 },   // Position 9
  { top: 110, left: 150 },  // Position 10
  { top: 130, left: 190 }   // Position 11
];

export default function Zoo({ userData, purchasedAnimal }) {
  const [animals, setAnimals] = useState(userData.animals || []);

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
        {animals.map((animal, index) => (
          <Image
            key={index}
            source={{ uri: animal.imageUrl }}
            style={[
              styles.animal,
              {
                top: (animal.position && animal.position.top) || initialPositions[index % initialPositions.length].top,
                left: (animal.position && animal.position.left) || initialPositions[index % initialPositions.length].left
              }
            ]}
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

