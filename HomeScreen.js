import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { useRoute } from '@react-navigation/native';

export default function HomeScreen() {
    const route = useRoute();
    const { name } = route.params || { name: 'Guest' }; // Default to 'Guest' if name is not passed

    return (
        <View style={styles.container}>
            <Text>My zoo</Text>
            <Text>Total spending today</Text>
            <Text>Today's spendings</Text>
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
  });
  