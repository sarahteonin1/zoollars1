import 'react-native-gesture-handler';
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native';
import { Entypo, Ionicons, Feather } from '@expo/vector-icons';
import React, { useEffect } from "react";
import { TouchableOpacity, StyleSheet } from 'react-native';
import LoginScreen from './screens/login';
import SignupScreen from './screens/signup';


import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import SpendingScreen from './SpendingScreen';
import BudgetScreen from './BudgetScreen';
import GoalsScreen from './GoalsScreen';
import ChallengesScreen from './ChallengesScreen';
import FriendsScreen from './FriendsScreen';
import StoreScreen from './StoreScreen';
import AddExpenditureScreen from './AddExpenditure';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const StackNav = () => {
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Feather name="menu" size={24} color="black" paddingLeft={10} />
          </TouchableOpacity>
        ),
        headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Add Expenditure')}
            >
              <Entypo 
              name="circle-with-plus" 
              size={28} 
              color="#6E9277"
              paddingRight={10} 
              />
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={({ route }) => ({
          title: route.params ? `Welcome, ${route.params.name}` : 'Welcome',
        })}
        />
        <Stack.Screen name="Add Expenditure" component={AddExpenditureScreen} 
          options={{
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
            headerRight: () => null,
            headerTitle: '', 
            presentation: 'modal',
          }}
        />
    </Stack.Navigator>
  );
}



const LoginStack = createNativeStackNavigator();

const DrawerNav = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="My Profile" component={ProfileScreen} />
      <Drawer.Screen name="Home" 
      component={StackNav} 
      options={{ headerShown: false}}
      />
      <Drawer.Screen name="Spendings Overview" component={SpendingScreen} />
      <Drawer.Screen name="Budget Overview" component={BudgetScreen} />
      <Drawer.Screen name="Goals" component={GoalsScreen} />
      <Drawer.Screen name="Challenges" component={ChallengesScreen} />
      <Drawer.Screen name="Store" component={StoreScreen} />
      <Drawer.Screen name="Friends" component={FriendsScreen} />
    </Drawer.Navigator>
  );
}
export default function App() {
  return (
  <NavigationContainer>
    <LoginStack.Navigator initialRouteName="LoginPage">
      <LoginStack.Screen 
        name="LoginPage" 
        component={LoginScreen} 
        options={{ headerShown: false }}
      />
      <LoginStack.Screen 
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
    </LoginStack.Navigator>
    <DrawerNav />
    </NavigationContainer>
  );
}
