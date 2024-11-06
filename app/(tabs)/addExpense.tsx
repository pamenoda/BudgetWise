import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import Colors from '@/constants/Colors';
import FormInput from '@/components/FormInput';
import CategoryPicker from '@/components/CategoryPicker';
import DatePickerInput from '@/components/DatePickerInput';
import LocationInput from '@/components/LocationInput';
import * as Location from 'expo-location';
import dbPromise from '@/scripts/database';  // Import your database script
import { useRouter } from 'expo-router'; // Import useRouter for navigation


const AddExpenseForm = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState<{ latitude: string; longitude: string } | null>(null);
  const router = useRouter(); // Initialize router for navigation

  // Request location permission once when the component mounts
  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Reset form fields after successful submission
  const resetForm = () => {
    setAmount('');
    setCategory('');
    setDate(new Date());
    setLocation(null);
  };

  // Request permission to access location and get the user's current location
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to add an expense.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude.toString(),
        longitude: currentLocation.coords.longitude.toString(),
      });
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  // Insert expense into the database
  const insertExpense = async () => {
    if (!amount || !category || !location) {
      Alert.alert('Incomplete Form', 'Please fill in all fields before submitting.');
      return;
    }

    try {
      const db = await dbPromise;
      const insertQuery = `INSERT INTO expenses (amount, category, date, latitude, longitude) 
        VALUES (${parseFloat(amount)}, '${category}', '${date.toISOString()}', '${location?.latitude}', '${location?.longitude}')`;

      await db.execAsync(insertQuery);

      Alert.alert('Success', 'Expense saved successfully!');
      resetForm();
      router.push('/');
    } catch (error) {
      console.error('Error inserting expense:', error);
      Alert.alert('Error', 'Failed to save the expense. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Add Expense</Text>
        <FormInput 
          placeholder="Amount" 
          value={amount} 
          onChangeText={setAmount} 
        />
        <CategoryPicker category={category} setCategory={setCategory} />
        <DatePickerInput date={date} setDate={setDate} />
        <LocationInput location={location} />
        <View style={styles.buttonContainer}>
          <Button title="Save" onPress={insertExpense} color={Colors.tintColor} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: 'center',
  },
  buttonContainer: {
    marginTop: 30,
    backgroundColor: Colors.tintColor,
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28, 
    fontWeight: 'bold', 
    color: Colors.white, 
    marginBottom: 20, 
    alignSelf: 'center', 
    textTransform: 'uppercase', 
    letterSpacing: 1.5, 
  },
});

export default AddExpenseForm;
