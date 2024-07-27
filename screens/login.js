import React, { useState } from "react";
import { Text, View, Image, TextInput, StyleSheet, Button, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc, collection, getDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { db } from '../firebaseConfig';


export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleSubmit = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setErrorMessage("Invalid email format");
      return;
    }

    const userDocRef = doc(db, 'users', email);
    
    getDoc(userDocRef).then((userDoc) => {
      if (!userDoc.exists()) {
        setErrorMessage("Email not in use");
      } else {
        const userData = userDoc.data();
        if (userData.password !== password) {
          setErrorMessage("Incorrect password");
          return;
        } else {
          onLogin(userData);
          navigation.navigate('Home', { userData: userData });
        }
      }
    }).catch((error) => {
      setErrorMessage("Error checking email: ", error);
    });
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container1}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.zoollars}>Zoollars</Text>
          <Image source={{uri: "https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fzoollarslogo.png?alt=media&token=cc11f9c7-83d1-479e-9d7f-32a0b4aa2333"}} 
          style={styles.image}
          resizeMode="contain"
          />
          <Text style={styles.text1}>Hey there!</Text>
          <Text style={styles.text2}>Please enter your email to continue</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="Enter your email"
            value={email}
            onChangeText={handleEmailChange}
          />
          <TextInput
            style={styles.emailInput}
            placeholder="Enter your password"
            value={password}
            onChangeText={handlePasswordChange}
          />
          <View style={styles.errorContainer}>
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Login with email</Text>
          </TouchableOpacity>

          <View style={styles.inlineTextContainer}>
            <Text style={styles.text3}>Don't have an account?</Text>
            <TouchableOpacity style={styles.button2} onPress={() => navigation.navigate('SignupPage1')}>
              <Text style={styles.hyperlinkText}>Sign up now</Text>
            </TouchableOpacity>
          </View>

        
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'white'
  },
  container1: {
    flex: 1,
  },
  zoollars: {
    fontWeight: 'bold',
    fontSize: 30,
    paddingVertical: 5
  },
  image: {
    width: 140,
    height: 140
  },
  text1: { // create an account
    fontWeight: 'bold',
    fontSize: 23,
    paddingVertical: 5
  },
  text2: { // enter your email...
    fontSize: 18,
    paddingBottom: 24
  },
  emailInput: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: { // sign up with email
    width: "80%",
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
 
  inlineTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
  },
  text3: { // Dont have an account?
    color: '#828282'
  },
  hyperlinkText: { // Sign up now
    color: '#008EE2',
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
  text4: { // or continue with
    paddingVertical: 20,
    color: '#828282'
  },
  lineContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  line: {
    height: 1,
    backgroundColor: "#D3D3D3",
    flex: 1,
    marginVertical: 30,
  },
  googleButton: { // sign up with email
    width: "80%",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#E5E4E2",
    paddingVertical: 10,
    borderRadius: 8,
  },
  google: {
    color: "black",
    textAlign: "center",
    marginTop: 5
  },
  image2: { // google logo
    width: 40,
    height: 25
  },
  errorContainer: {
    width: '80%',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
})