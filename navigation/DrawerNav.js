import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native';
import { Feather, FontAwesome6, FontAwesome5, FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import ProfileNav from './ProfileNav';
import SpendingScreen from '../screens/SpendingScreen';
import BudgetScreen from '../screens/BudgetScreen';
import GoalsScreen from '../screens/Goal setting screens/GoalsScreen';
import ChallengesScreen from '../screens/ChallengesScreen';
import StoreScreen from '../screens/StoreScreen';
import FriendsScreen from '../screens/FriendsScreen';
import HomeNav from '../navigation/HomeNav';

const Drawer = createDrawerNavigator();

const CustomHeader = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
    <Feather name="menu" size={24} color="black" style={{ paddingLeft: 20 }} />
  </TouchableOpacity>
);

export default function DrawerNav({ onLogout, userData, onPurchase, purchasedAnimal }) {
  return (
    <Drawer.Navigator 
      initialRouteName="Home"
      screenOptions={({ navigation }) => ({
        headerLeft: () => <CustomHeader navigation={navigation} />,
        headerTintColor: 'black',
        drawerItemStyle: { color: 'black' },
        drawerType: 'front',
        drawerActiveBackgroundColor: '#F7F7F7',
        drawerActiveTintColor: 'black',
      })}
    >
      <Drawer.Screen 
        name="My Profile"
      >
        {props => <ProfileNav {...props} userData={userData} onLogout={onLogout}/>}
      </Drawer.Screen> 
      <Drawer.Screen 
        name="Home"
        options={{ 
          headerShown: false,
          drawerIcon: ({ color }) => <Feather name="home" size={24} color="black" paddingLeft={10} />,
        }}
      >
        {props => <HomeNav {...props} userData={userData} purchasedAnimal={purchasedAnimal} />}
      </Drawer.Screen>
      <Drawer.Screen 
        name="Spendings Overview"
        options={{
          drawerIcon: ({ color }) => <FontAwesome5 name="money-bill-alt" size={20} color="black" paddingLeft={10} />,
        }}
      >
        {props => <SpendingScreen {...props} userData={userData} />}
      </Drawer.Screen>
      <Drawer.Screen 
        name="  Budget Overview"
        options={{
          drawerIcon: ({ color }) => <FontAwesome name="dollar" size={22} color="black" paddingLeft={16} />,
        }}
      >
        {props => <BudgetScreen {...props} userData={userData} />}
      </Drawer.Screen>
      <Drawer.Screen 
        name="Goals"
        options={{
          drawerIcon: ({ color }) => <FontAwesome5 name="money-bill-alt" size={20} color="black" paddingLeft={10} />,
        }}
      >
        {props => <GoalsScreen {...props} userData={userData} />}
      </Drawer.Screen>
      <Drawer.Screen 
        name="Challenges" 
        options={{
          drawerIcon: ({ color }) => <FontAwesome6 name="list-check" size={22} color="black" paddingLeft={13} />,
        }}
      >
        {props => <ChallengesScreen {...props} userData={userData} />}
      </Drawer.Screen>
      <Drawer.Screen 
        name="Store" 
        options={{
          drawerIcon: ({ color }) => <MaterialIcons name="storefront" size={27} color="black" paddingLeft={10} />,
        }}
      >
        {props => <StoreScreen {...props} userData={userData} onPurchase={onPurchase} />}
      </Drawer.Screen>
      <Drawer.Screen 
        name="Friends" 
        options={{
          drawerIcon: ({ color }) => <Ionicons name="people-outline" size={27} color="black" paddingLeft={10} />,
        }}
        >
                  {props => <FriendsScreen {...props} userData={userData} />}

        </Drawer.Screen>
    
    </Drawer.Navigator>
  );
}
