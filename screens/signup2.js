import React, { useState } from 'react';
import { Text, View, Image, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function SignupScreen2({ onLogin }) {
    const [name, setName] = useState("");
    const navigation = useNavigation();
    const route = useRoute();
    const email = route.params.email || "";
    const password = route.params.password || "";

    const handleNameChange = (text) => {
        setName(text);
      };
   
    const handleSubmit = () => {
      console.log('Email:', email);
      console.log('Name:', name);
      console.log('Password:', password);
      setDoc(doc(collection(db, 'users'), email), {
          name: name,
          email: email,
          password: password,
          zoollars: 50,
          timestamp: new Date(),
      }).then(() => {
          // Navigate to homescreen on successful submission
          const user = { name, email, password };
          onLogin(user);
          navigation.navigate('Home', {
            screen: 'Home Screen', 
            params: { name, email, password } 
          });
      }).catch((error) => {
          console.error("Error adding user: ", error);
      });
  };

    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container1}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.welcome}>Welcome to Zoollars!</Text>
            <Image source={{uri: "https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fpanda.png?alt=media&token=778d98a1-449b-4f94-bdf4-2d7064e4ebc4"}} 
                style={styles.image}
                resizeMode="contain"
              />
            <Text style={styles.text}>What should we call you?</Text>
            <TextInput
                  style={styles.nameInput}
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={handleNameChange}
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
          </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: 'white',
    marginTop: 120,
  },
  container1: {
    flex: 1,
    backgroundColor: 'white',
  },
  welcome: {
    fontWeight: 'bold',
    fontSize: 30,
    paddingVertical: 20
  },
  image: {
    width: 150,
    height: 150
  },
  text: { // What should we call you?
    fontSize: 23,
    paddingVertical: 20
  },
  nameInput: {
    width: "60%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: { // Submit
    width: "60%",
    backgroundColor: "#6E9277",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
});