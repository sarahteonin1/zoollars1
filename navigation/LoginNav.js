import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from '../screens/login';
import SignupScreen1 from '../screens/signup1';
import SignupScreen2 from '../screens/signup2';

const LoginStack = createNativeStackNavigator();

export default function LoginNav({ onLogin }) {
  const navigation = useNavigation();
  return (
    <LoginStack.Navigator initialRouteName="LoginPage">
      <LoginStack.Screen 
        name="LoginPage"
        options={{ headerShown: false }}
      >
        {props => <LoginScreen {...props} onLogin={onLogin} navigation={navigation} />}
      </LoginStack.Screen>  
      <LoginStack.Screen 
        name="SignupPage1" 
        component={SignupScreen1} 
        options={{
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerTitle: '', 
        }}
      />
      <LoginStack.Screen 
        name="SignupPage2"
        options={{
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerTitle: '', 
        }}
      >
        {props => <SignupScreen2 {...props} onLogin={onLogin} navigation={navigation} />}
      </LoginStack.Screen>
    </LoginStack.Navigator>
  );
}