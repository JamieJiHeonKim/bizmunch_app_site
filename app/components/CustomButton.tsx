import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
}

const CustomButton: React.FC<ButtonProps> = ({ onPress, title }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#c65102",
    padding: 6,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default CustomButton;
