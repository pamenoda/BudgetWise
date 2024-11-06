import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import Colors from '@/constants/Colors';
import ExpenseBlock from '@/components/ExpenseBlock';
import dbPromise from '@/scripts/database'; 
import { ExpenseType } from "@/types";
import { useFocusEffect } from 'expo-router';

const Index = () => {
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);

  // Combine database logic into one helper function
  const loadExpenses = async () => {
    const today = new Date();
    try {
      const db = await dbPromise;

      // If today is the first day of the month, clear all expenses
      if (today.getDate() === 1) {
        await db.execAsync('DELETE FROM expenses');
        Alert.alert('Reset', 'All expenses have been cleared for the new month.');
      }

      // Fetch all expenses
      const result = (await db.getAllAsync('SELECT * FROM expenses')) as ExpenseType[];
      setExpenses(result);

      // Calculate total amount
      const total = result.reduce((sum: number, expense: ExpenseType) => sum + (expense.amount || 0), 0);
      setTotalAmount(total);

    } catch (error) {
      console.error("Error during expense loading or reset:", error);
    }
  };

  // Memoize totalAmount for rendering optimization
  const totalAmountDisplay = useMemo(() => totalAmount.toFixed(2), [totalAmount]);

  const handleDeleteExpense = useCallback(async (expenseId: number) => {
    try {
      const db = await dbPromise;
      await db.execAsync(`DELETE FROM expenses WHERE id = ${expenseId}`);
      loadExpenses(); // Refresh expenses after deletion
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>My <Text style={styles.bold}>Expenses</Text></Text>
            <Text style={styles.totalAmount}>${totalAmountDisplay}</Text>
          </View>
        </View>
        <ExpenseBlock expenses={expenses} onDelete={handleDeleteExpense} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 30,
  },
  titleContainer: {
    gap: 10,
  },
  title: {
    color: Colors.white,
    fontSize: 16,
  },
  bold: {
    fontWeight: '700',
  },
  totalAmount: {
    color: Colors.white,
    fontSize: 36,
    fontWeight: '700',
  },
});

export default Index;
