import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/profile edits/EditPfp';

const Stack = createNativeStackNavigator();

export default function ProfileNav({ userData, onLogout }) {
    const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: 'center',
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={24} color="black" />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen 
        name="ProfileScreen" 
        options={{ headerShown: false }}
      >
        {props => <ProfileScreen {...props} userData={userData} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen 
        name="Edit Profile"
        options={{ 
            title: 'Edit Profile', 
            presentation: 'modal',
        }}
      >
        {props => <EditProfileScreen {...props} userData={userData} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}