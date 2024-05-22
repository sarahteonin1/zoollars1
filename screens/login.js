import React, { useState } from "react";
import { Text, View, Image, TextInput, StyleSheet, Button, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from "react-native";
import { useNavigation } from '@react-navigation/native';


export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const handleEmailChange = (text) => {
    setEmail(text);
  };

  const handleSubmit = () => {
    console.log('Email:', email);
    navigation.navigate('SignupPage');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container1}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.zoollars}>Zoollars</Text>
          <Image source={{uri: "/Users/sarahfaith/Documents/zoollars1/assets/zoollarslogo.png"}} 
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
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Sign up with email</Text>
          </TouchableOpacity>
          <View style={styles.lineContainer}>
            <View style={styles.line} />
            <Text style={styles.text3}>  or continue with  </Text>
            <View style={styles.line} />
          </View>
          
          <TouchableOpacity style={styles.googleButton} >
            <Image source={{uri: "/Users/sarahfaith/Documents/zoollars1/assets/googlelogo2.png"}}
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
  }
})