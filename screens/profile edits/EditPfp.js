import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function EditPfp({ modalVisible, setModalVisible, onProfilePictureChange }) {
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

  const changeProfilePicture = async (source) => {
    onProfilePictureChange(source);
    slideDown(); 
  };

  const choosePicture = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      changeProfilePicture(pickerResult.uri);
    }
    setModalVisible(false);
  };

  const takePicture = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access camera is required!');
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      changeProfilePicture(pickerResult.uri);
    }
    setModalVisible(false);
  };

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          slideDown();
        }}
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