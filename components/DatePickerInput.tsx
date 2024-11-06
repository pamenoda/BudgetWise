import React, { useState } from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '@/constants/Colors';
import { StyleSheet } from 'react-native';

const DatePickerInput = ({ date, setDate }: { date: Date, setDate: (date: Date) => void }) => {
  const [showPicker, setShowPicker] = useState(false);

  // Calculate the last day of the current month
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const toggleDatePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChangeDate = (event: any, selectedDate: Date | undefined) => {
    if (event.type === 'set') {
      setDate(selectedDate || date);
      if (Platform.OS === 'android') toggleDatePicker();
    } else {
      toggleDatePicker();
    }
  };

  return (
    <View>
      {showPicker ? (
        <DateTimePicker
          mode="date"
          display="spinner"
          value={date}
          onChange={onChangeDate}
          maximumDate={lastDayOfMonth} // Set maximum date to the last day of the current month
        />
      ) : (
        <Pressable onPress={toggleDatePicker}>
          <TextInput
            placeholder="Date"
            style={styles.input}
            placeholderTextColor={Colors.grey}
            value={date.toLocaleDateString()}
            editable={false}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: Colors.grey,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.white,
    color: Colors.black,
    width: '100%',
  },
});

export default DatePickerInput;
