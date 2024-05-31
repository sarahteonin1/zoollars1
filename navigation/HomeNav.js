import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Feather, Entypo, Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import AddExpenditureScreen from '../screens/AddExpenditureScreen';

const Stack = createNativeStackNavigator();

export default function HomeNav({ userData }) {
    const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
            <Feather name="menu" size={24} color="black" />
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
        name="Home Screen" 
        component={HomeScreen}
        options={{
          title: userData ? `Welcome, ${userData.name}!` : 'Welcome!',
        }}
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