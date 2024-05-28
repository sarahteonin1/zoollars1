import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ProfileScreen({ userData, onLogout }) {
  const navigation = useNavigation();
  const handleLogout = () => {
    // Perform logout logic here
    
    onLogout();
  };
  
  return (
    <View style={styles.container}>
      <Text>Name: {userData.name}</Text>
      <Text>Email: {userData.email}</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.logout}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logout: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#6E9277',
    paddingHorizontal: 20,
    padding: 5,
    borderRadius: 20,
  },
});