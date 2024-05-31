import 'react-native-gesture-handler';
import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native';
import { Entypo, Ionicons, Feather, FontAwesome, FontAwesome5, FontAwesome6, MaterialIcons } from '@expo/vector-icons';

import LoginScreen from './screens/login';
import SignupScreen1 from './screens/signup1';
import SignupScreen2 from './screens/signup2';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import EditProfileScreen from './EditProfileScreen';
import SpendingScreen from './SpendingScreen';
import BudgetScreen from './BudgetScreen';
import GoalsScreen from './GoalsScreen';
import ChallengesScreen from './ChallengesScreen';
import FriendsScreen from './FriendsScreen';
import StoreScreen from './StoreScreen';
import AddExpenditureScreen from './AddExpenditure';

const Stack = createNativeStackNavigator();


const StackNav = ({ userData }) => {
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

const Drawer = createDrawerNavigator();
const CustomHeader = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
    <Feather name="menu" size={24} color="black" style={{ paddingLeft: 20 }} />
  </TouchableOpacity>
);

const DrawerNav = ({ onLogout, userData }) => {
  return (
    <Drawer.Navigator 
    initialRouteName="Home"
    screenOptions={({ navigation }) => ({
      headerLeft: () => <CustomHeader navigation={navigation} />,
      headerTintColor: 'black',
      drawerItemStyle: {
        color: 'black',
      },
      drawerType: 'front',
      drawerActiveBackgroundColor: '#F7F7F7',
      drawerActiveTintColor: 'black',
    })}
    >
      <Drawer.Screen 
      name="My Profile"
      >
        {props => <ProfileScreen {...props} userData={userData} onLogout={onLogout}/>}
      </Drawer.Screen> 
      <Drawer.Screen name="Home"
      options={{ headerShown: false,
        drawerIcon: ({ color }) => <Feather name="home" size={24} color="black" paddingLeft={10}/>,
      }}
      >
        {props => <StackNav {...props} userData={userData} />}
      </Drawer.Screen>
      <Drawer.Screen name="Spendings Overview" component={SpendingScreen} 
      options={{
        drawerIcon: ({ color }) => <FontAwesome5 name="money-bill-alt" size={20} color="black" paddingLeft={10}/>,
      }}
      />
      <Drawer.Screen name="  Budget Overview" component={BudgetScreen} 
      options={{
        drawerIcon: ({ color }) => <FontAwesome name="dollar" size={22} color="black" paddingLeft={15}/>,
      }}
      />
      <Drawer.Screen name="Goals" component={GoalsScreen} 
      options={{
        drawerIcon: ({ color }) => <FontAwesome5 name="flag" size={22} color="black" paddingLeft={13}/>,
      }}
      />
      <Drawer.Screen name="Challenges" component={ChallengesScreen} 
      options={{
        drawerIcon: ({ color }) => <FontAwesome6 name="list-check" size={22} color="black" paddingLeft={13}/>,
      }}
      />
      <Drawer.Screen name="Store" component={StoreScreen} 
      options={{
        drawerIcon: ({ color }) => <MaterialIcons name="storefront" size={27} color="black" paddingLeft={10}/>,
      }}
      />
      <Drawer.Screen name="Friends" component={FriendsScreen}
      options={{
        drawerIcon: ({ color }) => <Ionicons name="people-outline" size={27} color="black"  paddingLeft={10}/>,
      }}
      />
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
        options={{ headerShown: false }}
      >
        {props => <LoginScreen {...props} onLogin={onLogin} navigation={navigation} />}
      </LoginStack.Screen>  
      <LoginStack.Screen 
        name="SignupPage1" 
        component={SignupScreen1} 
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
      />
      <LoginStack.Screen 
        name="SignupPage2"
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
        {props => <SignupScreen2 {...props} onLogin={onLogin} navigation={navigation} />}
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
