import React from "react";
import { StyleSheet, Text, View, Alert, Pressable } from "react-native";
import { ExpenseType } from "@/types";
import Colors from "@/constants/Colors";
import {
  DollarIcon,
  Food,
  Garbage,
  Travel,
  Transport,
  Entertainement,
  Others,
  Housing,
  Health
} from "@/constants/Icons";
import { Link } from "expo-router";

const getMonthName = () => {
  const date = new Date();
  return date.toLocaleString('en-US', { month: 'long' }); // Obtient le nom du mois en anglais
};

const ExpenseBlock = ({ expenses, onDelete }: { expenses: ExpenseType[], onDelete: (id: number) => void }) => {
  return (
    <View style={styles.spendingSectionWrapper}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>
          Expenses for <Text style={{ fontWeight: "700" }}>{getMonthName()}</Text>
        </Text>
        <Link href="/addExpense" style={styles.btnWrapper}>
          <Text style={styles.buttonText}>Add Expense</Text>
        </Link>
      </View>
      {expenses.map((item) => {
        let icon = <DollarIcon width={22} height={22} color={Colors.white} />;

        // Affichage conditionnel des icônes en fonction de la catégorie
        if (item.category === "Housing") {
          icon = <Housing width={22} height={22} />;
        } else if (item.category === "Food") {
          icon = <Food width={22} height={22}/>;
        } else if (item.category === "Transport") {
          icon = <Transport width={22} height={22} />;
        } else if (item.category === "Entertainment") {
          icon = <Entertainement width={22} height={22}  />;
        } else if (item.category === "Health") {
          icon = <Health width={22} height={22} />;
        } else if (item.category === "Travel") {
          icon = <Travel width={22} height={22}  />;
        } else if (item.category === "Others") {
          icon = <Others width={22} height={22}  />;
        }

        return (
          <View key={item.id} style={styles.spendingWrapper}>
            <View style={styles.iconWrapper}>{icon}</View>
            <View style={styles.textWrapper}>
              <View style={{ gap: 5 }}>
                <Text style={styles.itemName}>{item.category}</Text>
                <Text style={{ color: Colors.white }}>{new Date(item.date).toLocaleDateString()}</Text>
              </View>
              <Text style={styles.itemName}>${item.amount.toFixed(2)}</Text>
              
              {/* Pressable only around the Garbage icon */}
              <Pressable
                onPress={() => {
                  Alert.alert(
                    "Delete the expense",
                    "Are you sure?",
                    [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", onPress: () => onDelete(item.id) },
                    ]
                  );
                }}
              >
                <Garbage width={22} height={22}  />
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  spendingSectionWrapper: {
    marginVertical: 20,
    alignItems: "flex-start",
  },
  spendingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  iconWrapper: {
    backgroundColor: Colors.grey,
    padding: 15,
    borderRadius: 50,
    marginRight: 10,
  },
  textWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "600",
  },
  btnWrapper: {
    borderColor: "#666",
    borderWidth: 1,
    padding: 8,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default ExpenseBlock;
