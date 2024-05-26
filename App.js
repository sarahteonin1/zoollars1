import React, { useEffect } from "react";
import { TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/login';
import SignupScreen from './screens/signup';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPage">
        <Stack.Screen 
          name="LoginPage" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SignupPage" 
          component={SignupScreen}
          options={{
            headerShown: true,
            headerLeft: () => {
              const navigation = useNavigation();
              return(
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                >
                  <Ionicons name="chevron-back-outline" size={24} color="black"/>
                </TouchableOpacity>
              );
            },
            headerTitle: '', 
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
