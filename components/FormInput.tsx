import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

const FormInput = ({ placeholder, value, onChangeText, editable = true }: { placeholder: string, value: string, onChangeText: (text: string) => void, editable?: boolean }) => {
  return (
    <TextInput
      placeholder={placeholder}
      style={styles.input}
      placeholderTextColor={Colors.grey}
      value={value}
      keyboardType='numeric'
      onChangeText={onChangeText}
      editable={editable}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.grey,
    marginBottom: 20, // Augmentation de l'espacement
    padding: 15, // Plus de padding
    borderRadius: 10, // Bordures plus arrondies
    backgroundColor: Colors.white,
    color: Colors.black,
    fontSize: 16, // Texte plus grand
    width: '100%',
  },
});

export default FormInput;
