import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { PieChart, LineChart } from 'react-native-gifted-charts';
import Colors from '@/constants/Colors';
import { ExpenseType } from '@/types';
import dbPromise from '@/scripts/database';
import { useFocusEffect } from 'expo-router';

interface PieChartDataType {
  value: number;
  color: string;
  text: string;
  category: string;
}

const GraphsPage = () => {
  const [pieData, setPieData] = useState<PieChartDataType[]>([]);
  const [lineChartData, setLineChartData] = useState<Record<string, any[]>>({});
  const [daysOfMonth, setDaysOfMonth] = useState<string[]>([]);
  const [maxValue, setMaxValue] = useState(0);

  const categories = ['Housing', 'Food', 'Transport', 'Entertainment', 'Health', 'Travel'] as const;
  const categoryColors: Record<typeof categories[number], string> = {
    Housing: Colors.tintColor,
    Food: Colors.blue,
    Transport: '#FFA500',
    Entertainment: '#FF4500',
    Health: '#32CD32',
    Travel: '#1E90FF',
  };

  // Load data for the PieChart
  const loadPieChartData = async () => {
    try {
      const db = await dbPromise;
      const result = await db.getAllAsync('SELECT * FROM expenses');
      const expenses = result as ExpenseType[];

      const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);

      const totalExpenses = Object.values(categoryTotals).reduce((sum, total) => sum + total, 0);

      const pieChartData = categories.map((category) => ({
        value: categoryTotals[category] || 0,
        color: categoryColors[category],
        text: `${Math.round((categoryTotals[category] / totalExpenses) * 100)}%`,
        category,
      }));

      setPieData(pieChartData);
    } catch (error) {
      console.error('Error loading PieChart data:', error);
    }
  };

  // Helper function to generate LineChart data for each category
  const generateLineData = (expenses: ExpenseType[], category: string, daysInMonth: number) => {
    let highestExpense = 0;

    const lineData = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const dayExpenses = expenses.filter(
        (expense) =>
          expense.category === category &&
          new Date(expense.date).getMonth() === new Date().getMonth() &&
          new Date(expense.date).getDate() === day
      );
      const totalAmountForDay = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      highestExpense = Math.max(highestExpense, totalAmountForDay);

      return {
        value: totalAmountForDay,
        dataPointText: totalAmountForDay > 0 ? totalAmountForDay.toString() : '',
      };
    });

    return { lineData, highestExpense };
  };

  // Load LineChart data for all categories
  const loadLineChartData = async () => {
    try {
      const db = await dbPromise;
      const result = await db.getAllAsync('SELECT * FROM expenses');
      const expenses = result as ExpenseType[];

      const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      setDaysOfMonth(Array.from({ length: daysInMonth }, (_, index) => (index + 1).toString()));

      let maxExpense = 0;
      const newLineChartData: Record<string, any[]> = {};

      categories.forEach((category) => {
        const { lineData, highestExpense } = generateLineData(expenses, category, daysInMonth);
        newLineChartData[category] = lineData;
        maxExpense = Math.max(maxExpense, highestExpense);
      });

      setLineChartData(newLineChartData);
      setMaxValue(maxExpense);
    } catch (error) {
      console.error('Error loading LineChart data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPieChartData();
      loadLineChartData();
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Expense Distribution</Text>

        <View style={styles.chartContainer}>
          <PieChart
            data={pieData}
            donut
            radius={100}
            innerRadius={70}
            innerCircleColor={Colors.black}
            centerLabelComponent={() => (
              <View>
                <Text style={styles.centerLabelText}>Expenses</Text>
              </View>
            )}
          />
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          {pieData.map((item) => (
            <View key={item.category} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.category}: {item.text}</Text>
            </View>
          ))}
        </View>

        {/* LineChart */}
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Monthly Expense Trend</Text>
          <LineChart
            data={lineChartData.Housing}
            data2={lineChartData.Food}
            data3={lineChartData.Transport}
            data4={lineChartData.Entertainment}
            data5={lineChartData.Health}
            maxValue={maxValue}
            noOfSections={5}
            spacing={35}
            yAxisColor={Colors.white}
            xAxisColor={Colors.white}
            yAxisTextStyle={{ color: Colors.white }}
            xAxisLabelTextStyle={{ color: Colors.white }}
            xAxisLabelTexts={daysOfMonth}
            dataPointsColor={Colors.white}
            color1={categoryColors.Housing}
            color2={categoryColors.Food}
            color3={categoryColors.Transport}
            color4={categoryColors.Entertainment}
            color5={categoryColors.Health}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default GraphsPage;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 30,
    backgroundColor: Colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  centerLabelText: {
    fontSize: 16,
    color: Colors.white,
  },
  legendContainer: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  legendText: {
    color: Colors.white,
    fontSize: 16,
  },
});
