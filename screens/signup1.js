import React, { useState } from "react";
import { Text, View, Image, TextInput, StyleSheet, Button, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc, collection, getDoc } from 'firebase/firestore';
import 'firebase/firestore';
import { db } from '../firebaseConfig';


export default function SignupScreen1() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const navigation = useNavigation();

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
  };

  const handleSubmit = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

    if (!emailPattern.test(email)) {
      setErrorMessage("Invalid email format");
      return;
    } else {
      setErrorMessage("");
    }

    

    const userDocRef = doc(db, 'users', email);
    
    getDoc(userDocRef).then((userDoc) => {
      if (userDoc.exists()) {
        setErrorMessage("Email already in use");
        setPasswordError(false);
      } else {
        setErrorMessage("");
        if (!passwordPattern.test(password)) {
          setPasswordError(true);
          return;
        } else {
          setPasswordError(false);
          setDoc(userDocRef, {
            email: email,
            password: password,
            timestamp: new Date(),
          }).then(() => {
            navigation.navigate('SignupPage2', { email: email, password: password });
          }).catch((error) => {
            setErrorMessage("Error adding email: " + error.message);
          });
        }
      }
    }).catch((error) => {
      setErrorMessage("Error checking email: " + error.message);
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
          <Text style={styles.text1}>Create an account</Text>
          <Text style={styles.text2}>Enter your email to sign up for Zoollars</Text>
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
          {passwordError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Password must contain:</Text>
              <Text style={styles.errorText}>{`\u2022`} at least 8 characters</Text>
              <Text style={styles.errorText}>{`\u2022`} at least 1 uppercase letter</Text>
              <Text style={styles.errorText}>{`\u2022`} at least 1 lowercase letter</Text>
              <Text style={styles.errorText}>{`\u2022`} at least 1 number</Text>
              <Text style={styles.errorText}>{`\u2022`} at least 1 special character</Text>
            </View>
          )}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Sign up with email</Text>
          </TouchableOpacity>
          <View style={styles.lineContainer}>
            <View style={styles.line} />
            <Text style={styles.text3}>  or continue with  </Text>
            <View style={styles.line} />
          </View>
          
          <TouchableOpacity style={styles.googleButton} >
            <Image source={{uri: "https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fgooglelogo2.png?alt=media&token=f382144d-db56-40cd-999a-6a1699d1b460"}}
            style={styles.image2}
            resizeMode="contain"
            />
            <Text style={styles.google}>Google</Text>
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
    marginTop: 50,
  },
  container1: {
    flex: 1,
    backgroundColor: 'white',
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
  lineContainer: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  text3: { // or continue with
    paddingVertical: 20,
    color: '#828282'
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