import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNav from './navigation/DrawerNav';
import LoginNav from './navigation/LoginNav';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [userData, setUserData] = React.useState(null);

  const handleLogin = (user) => {
    setUserData(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUserData(null);
    setIsLoggedIn(false);
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <DrawerNav userData={userData} onLogout={handleLogout} />
      ) : (
        <LoginNav onLogin={handleLogin} />
      )}
    </NavigationContainer>
  );
}

