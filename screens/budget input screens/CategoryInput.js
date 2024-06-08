import React, { useState, useEffect } from "react";
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { db } from '../../firebaseConfig';
import { doc, collection, setDoc } from 'firebase/firestore';
export default function CategoryInput({ modalVisible, setModalVisible, userData, onNewCategory }) {
  const [category, setCategory] = useState('Enter a category');

  const handleNewCategory = (text) => {
    setCategory(text);
  };

  const handleSubmit = async (text) => {
    if (text.length === 0) {
        Alert.alert('Error', 'Please enter a category');
        return;
    }

    const userDocRef = doc(db, 'users', userData.email);
    const categoryId = `${category}`;
    const newCategory = {
        category: category,
      date_added: new Date(),
    };

    try {
      const newCategoryCollectionRef = collection(userDocRef, 'categories');
      await setDoc(doc(newCategoryCollectionRef, categoryId), newCategory);
      console.log('Category added successfully');
      onNewCategory(categoryId);
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding category: ', error);
    }
  };

  return (
    <View >
    <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <TouchableOpacity
            style={styles.centeredView}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder={'Enter a category'}
              onChangeText={handleNewCategory}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.confirm}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 20,
    width: 250,
    borderRadius: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#6E9277",
    width: 250,
    height: 45,
  },
  confirm: {
    color: 'white',
    textAlign: 'center',
    fontSize: 17,
  }
});
