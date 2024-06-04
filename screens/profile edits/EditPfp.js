import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../../firebaseConfig';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { uploadToFirebase } from '../../firebaseConfig';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

export default function EditPfp({ modalVisible, setModalVisible, onProfilePictureChange, userData }) {
  const translateY = new Animated.Value(1000); // Initial position outside the screen

  useEffect(() => {
    if (modalVisible) {
      slideUp();
    } else {
      resetPosition();
    }
  }, [modalVisible]);

  const slideUp = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideDown = () => {
    Animated.timing(translateY, {
      toValue: 300,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setModalVisible(false));
  };

  const resetPosition = () => {
    Animated.timing(translateY, {
      toValue: 1000,
      duration: 0,
      useNativeDriver: true,
    }).start();
  };

  const updateProfilePictureUrl = async (email, downloadUrl) => {
    try {
      const userDocRef = doc(db, 'users', email);
      await updateDoc(userDocRef, { 
          profilePictureUrl: downloadUrl
        });  
      
      console.log('Profile picture URL updated successfully!');
    } catch (error) {
      console.error('Error updating profile picture URL:', error);
    }
  };

  const changeProfilePicture = async (uri) => {
    const fileName = uri.split("/").pop();
    const uploadResp = await uploadToFirebase(uri, fileName, (v) =>
      console.log(v)
    );

    const storage = getStorage();
    const imageRef = ref(storage, `images/${fileName}`);
    const imageUrl = await getDownloadURL(imageRef);

    console.log(uploadResp);
    console.log(fileName);
    console.log("Download URL:", imageUrl);

    
    updateProfilePictureUrl(userData.email, imageUrl).then(() => {
      onProfilePictureChange(imageUrl);
    });
    slideDown();
  };
  

  const choosePicture = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      const { uri } = pickerResult.assets[0];
      console.log('Selected/captured image URI:', uri);
      changeProfilePicture(uri);
    } else {
      console.log('Image selection/capture was cancelled or URI is missing.');
    }
  };

  const takePicture = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera is required!');
      return;
    }

      const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        aspect: [1, 1],
        quality: 1,
      });

      if (!pickerResult.cancelled) {
        const { uri } = pickerResult.assets[0];
        changeProfilePicture(uri);
      }
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={slideDown}
        />
        <Animated.View style={[styles.modalView, { transform: [{ translateY }] }]}>
          <Button title="Take Photo" onPress={takePicture} />
          <Button title="Choose from Library" onPress={choosePicture} />
          <TouchableOpacity onPress={slideDown} style={styles.cancelButton}>
            <Text style={{ color: 'red', fontSize: 18}}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 35,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
});