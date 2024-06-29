import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNav from './navigation/DrawerNav';
import LoginNav from './navigation/LoginNav';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure this path is correct

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [purchasedAnimal, setPurchasedAnimal] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoggedIn && userData?.email) {
        const userDoc = await getDoc(doc(db, 'users', userData.email));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, [isLoggedIn, userData?.email]);

  const handleLogin = (user) => {
    setUserData(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUserData(null);
    setIsLoggedIn(false);
  };

  const handlePurchase = (animal) => {
    setPurchasedAnimal(animal);
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <DrawerNav 
          userData={userData} 
          onLogout={handleLogout} 
          onPurchase={handlePurchase} 
          purchasedAnimal={purchasedAnimal} 
        />
      ) : (
        <LoginNav onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
}
