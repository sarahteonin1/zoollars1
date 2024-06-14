import React from 'react';
import { View, Modal, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function MonthPicker({ visible, selectedMonth, onMonthChange, onClose }) {
    return (
        <Modal
          visible={visible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modal}>
            <Picker
              selectedValue={selectedMonth}
              onValueChange={onMonthChange}
              style={styles.picker}
            >
                <Picker.Item label="Java" value="java" />
              {/*
              {Array.from({ length: 12 }, (_, i) => (
                <Picker.Item key={i} label={new Date(0, i).toLocaleString('default', { month: 'long' })} value={i} />
              ))}
              */}
            </Picker>
            <Button title="Close" onPress={onClose} />
          </View>
        </Modal>
      );
    }
    
    const styles = StyleSheet.create({
      modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      picker: {
        marginBottom: 20,
      },
    });