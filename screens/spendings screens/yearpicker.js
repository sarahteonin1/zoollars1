import React from 'react';
import { View, Modal, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function YearPicker({ visible, selectedYear, onYearChange, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modal}>
        <Picker
          selectedValue={selectedYear}
          onValueChange={onYearChange}
        >
          {Array.from({ length: 21 }, (_, i) => (
            <Picker.Item key={i} label={(selectedYear - 10 + i).toString()} value={selectedYear - 10 + i} />
          ))}
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
});