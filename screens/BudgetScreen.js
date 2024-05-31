import { View, Text, StyleSheet } from "react-native";

export default function BudgetScreen() {
    return (
      <View style={styles.container}>
              <Text>Budget Overview Screen</Text>
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