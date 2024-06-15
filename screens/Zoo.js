import React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

export default function Zoo() {
    return (
        <View style={styles.card}>
        <Text style={styles.zooText}>My Zoo</Text>
        <Image source={{uri: "https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fzoo.png?alt=media&token=3cc5d796-8a37-4409-bef7-509a7bae89d6" }} 
          style={styles.zoo}
          resizeMode='contain'
          />
        <View style={styles.counterContainer}>
          <Image source={{uri: "https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fcapybara.png?alt=media&token=2b826c27-1ef6-4bb0-872d-1a2a28fbf156" }} 
          style={styles.capybara}
          resizeMode='contain'
          />
          <Text style={styles.counterText}>0</Text>
          <Image source={{uri: "https://firebasestorage.googleapis.com/v0/b/zoollars.appspot.com/o/visuals%2Fzoollarslogo.png?alt=media&token=cc11f9c7-83d1-479e-9d7f-32a0b4aa2333" }} 
          style={styles.zoollars}
          resizeMode='contain'
          />
          <Text style={styles.counterText}>0</Text>
        </View>
      </View>

    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 20,
        paddingBottom: 13,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 3,
      },
      zooText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      zoo: {
        height: 200,
        width: 350,
        marginHorizontal: 6,
        alignSelf: 'center',
      },
      capybara: {
        height: 40,
        width: 30,
        marginHorizontal: 6,
      },
      zoollars: {
        height: 40,
        width: 40,
        marginHorizontal: 1,
      },
      counterText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 3,
        marginVertical: 7,
      },
      counterContainer: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flexDirection: 'row',
      },
    });