import React from 'react';
import { TextInput } from 'react-native';
import Colors from '@/constants/Colors';
import { StyleSheet } from 'react-native';

const LocationInput = ({ location }: { location: { latitude: string; longitude: string } | null }) => {
  return (
    null
    /*
    <TextInput
      placeholder="Position (Latitude, Longitude)"
      style={styles.input}
      value={location ? `${location.latitude} ${location.longitude}` : ''}
      placeholderTextColor={Colors.grey}
      editable={false}
    />
    */
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
    color:Colors.black,
    width: '100%',
  },
});

export default LocationInput;
