import 'react-native-gesture-handler';
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native';
import { Entypo, Ionicons, Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';

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

const StackNav = ({ userData }) => {
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

const DrawerNav = ({ onLogout, userData }) => {
  return (
    <Drawer.Navigator 
    initialRouteName="Home"
    screenOptions={{
      headerTintColor: 'black',
      drawerItemStyle: {
        color: 'black',
      },
      drawerType: 'front',
      drawerActiveBackgroundColor: '#F7F7F7',
      drawerActiveTintColor: 'black',
    }}
    >
      <Drawer.Screen 
      name="My Profile"
      >
        {props => <ProfileScreen {...props} userData={userData} onLogout={onLogout}/>}
      </Drawer.Screen> 
      <Drawer.Screen name="Home"
      options={{ headerShown: false,
        drawerIcon: ({ color }) => <Feather name="home" size={24} color="black"  paddingLeft={10}/>,
      }}
      >
        {props => <StackNav {...props} userData={userData} />}
      </Drawer.Screen>
      <Drawer.Screen name="Spendings Overview" component={SpendingScreen} 
      options={{
        drawerIcon: ({ color }) => <FontAwesome5 name="money-bill-alt" size={20} color="black" paddingLeft={10}/>,
      }}
      />
      <Drawer.Screen name="Budget Overview" component={BudgetScreen} />
      <Drawer.Screen name="Goals" component={GoalsScreen} />
      <Drawer.Screen name="Challenges" component={ChallengesScreen} />
      <Drawer.Screen name="Store" component={StoreScreen} 
      options={{
        drawerIcon: ({ color }) => <MaterialIcons name="storefront" size={27} color="black"  paddingLeft={10}/>,
      }}
      />
      <Drawer.Screen name="Friends" component={FriendsScreen} />
    </Drawer.Navigator>
  );
}

const LoginStack = createNativeStackNavigator();

const LoginNav = ({ onLogin }) => {
  const navigation = useNavigation();
  return (
    <LoginStack.Navigator initialRouteName="LoginPage">
      <LoginStack.Screen 
        name="LoginPage" 
        component={LoginScreen} 
        options={{ headerShown: false }}
      />
      <LoginStack.Screen 
        name="SignupPage"
        options={{
          headerShown: true,
          headerLeft: () => {
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
      >
        {props => <SignupScreen {...props} onLogin={onLogin} navigation={navigation} />}
      </LoginStack.Screen>
    </LoginStack.Navigator>
  );
}

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
