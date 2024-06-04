import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, } from "react-native";
import { Entypo } from '@expo/vector-icons';
import EditPfp from './profile edits/EditPfp';
import EditName from './profile edits/EditName';
import ImageViewer from "./profile edits/ImageViewer";

export default function ProfileScreen({ userData, onLogout }) {
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(userData);

  const handleLogout = () => {
    onLogout();
  };
  
  const handleEditPfp = () => {
    setPhotoModalVisible(true);
  };

  const handleEditName = () => {
    setNameModalVisible(true);
  };

  const updateProfilePicture = async (uri) => { 
    setProfilePicture(uri);
  };

  const handleUpdateUserData = (updatedUserData) => {
    setCurrentUserData(updatedUserData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        <ImageViewer
          placeholderImageSource={{ uri: 'https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fdefaultpfp.png?alt=media&token=5fa32e68-1728-4224-9795-2710d371fa1d' }}
          selectedImage={profilePicture || userData.profilePictureUrl}
        />
      </View>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleEditPfp}>
          <Text style={styles.editPfp}>Edit profile picture</Text>
        </TouchableOpacity>
        <EditPfp
          modalVisible={photoModalVisible}
          setModalVisible={setPhotoModalVisible}
          onProfilePictureChange={updateProfilePicture}
          userData={currentUserData}
        />
      </View>
      {nameModalVisible && (
        <EditName 
          modalVisible={nameModalVisible}
          setModalVisible={setNameModalVisible} 
          userData={currentUserData}
          onUpdateUserData={handleUpdateUserData}
        />)}
      <TouchableOpacity style={styles.infoContainer} onPress={handleEditName}>
          <Text style={styles.infoText}>Name: </Text>
          <Text style={styles.userName}>{currentUserData.name}</Text>
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Email: </Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
      </View>
      <TouchableOpacity style={styles.zooContainer}>
        <Text style={styles.infoText}>My Zoo</Text>
        <Entypo name="chevron-small-right" size={24} color="black"/>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
  
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    height: '100%',
  },
  photoContainer: {
    height: 120,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#828282',
    paddingVertical: 15,
    paddingTop: 40,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 50, 
  },
  profileContainer: {
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
    paddingBottom: 30,
  },
  editPfp: { 
    color: '#008EE2',
    justifyContent: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
  },
  zooContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
    paddingRight: 10,
  },
  infoText: {
    fontWeight: 'bold',
    paddingLeft: 20,
    fontSize: 15,
  },
  userName: {
    paddingLeft: 90,
    fontSize: 15,
  },
  userEmail: {
    paddingLeft: 93,
    fontSize: 15,
  },
  buttonContainer: {
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logout: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#6E9277',
    paddingHorizontal: 20,
    padding: 5,
    borderRadius: 20,
  },
});