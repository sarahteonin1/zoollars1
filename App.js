import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SpendingScreen from './SpendingScreen';
import BudgetScreen from './BudgetScreen';
import GoalsScreen from './GoalsScreen';
import ChallengesScreen from './ChallengesScreen';
import FriendsScreen from './FriendsScreen';
import StoreScreen from './StoreScreen';


const StackNav = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        statusBarColor: '6E9277',
        headerStyle: {
          backgroundColor: '6E9277'
        },
        headerTintColor: '6E9277',
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Spendings Overview" component={SpendingScreen} />
      <Stack.Screen name="Budget Overview" component={BudgetScreen} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="Challenges" component={ChallengesScreen} />
      <Stack.Screen name="Store" component={StoreScreen} />
      <Stack.Screen name="Friends" component={FriendsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const Drawer = createDrawerNavigator();
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="My Profile" component={ProfileScreen} />
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Spendings Overview" component={SpendingScreen} />
        <Drawer.Screen name="Budget Overview" component={BudgetScreen} />
        <Drawer.Screen name="Goals" component={GoalsScreen} />
        <Drawer.Screen name="Challenges" component={ChallengesScreen} />
        <Drawer.Screen name="Store" component={StoreScreen} />
        <Drawer.Screen name="Friends" component={FriendsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
