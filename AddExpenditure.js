import { View, Text, StyleSheet } from "react-native";

export default function AddExpenditureScreen() {
    return (
      <View style={styles.container}>
              <Text>Add Expenditure</Text>
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