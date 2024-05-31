import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import EditPfp from './profile edits/EditPfp';

export default function ProfileScreen({ userData, onLogout }) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  const handleLogout = () => {
    onLogout();
  };
  
  const handleEditPfp = () => {
    setModalVisible(true);
  };

  const updateProfilePicture = (uri) => {
    setProfilePicture(uri);
  };

  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        <Image
          style={styles.profilePhoto}
          source={{ uri: profilePicture || '/Users/sarahfaith/Documents/zoollars1/assets/defaultpfp.png' }}
        />
      </View>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleEditPfp}>
          <Text style={styles.editPfp}>Edit profile picture</Text>
        </TouchableOpacity>
        <EditPfp
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          onProfilePictureChange={updateProfilePicture}
        />
      </View>
      {modalVisible && <EditPfp modalVisible={modalVisible} setModalVisible={setModalVisible} />}
      <TouchableOpacity style={styles.infoContainer} onPress={handleEditPfp}>
          <Text style={styles.infoText}>Name: </Text>
          <Text style={styles.userName}>{userData.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.infoContainer}>
        <Text style={styles.infoText}>Email: </Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
      </TouchableOpacity>
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