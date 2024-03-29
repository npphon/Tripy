import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/screenWrapper";
import { colors } from "../theme";
import EmptyList from "../components/emptyList";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import BackButton from "../components/backButton";
import ExpenseCard from "../components/expenseCard";
import Loading from "../components/loading";
import axios from "axios";
import { Typography } from "react-native-typography";

export default function StatementScreen(props) {
  const { selectedMonth, selectedYear } = props.route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  const [beginningBalance, setBeginningBalance] = useState([]);
  const [expense, setExpenses] = useState([]);

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  

  const expenses = [
    { date: '2024-03-29', description: 'ค่าอาหาร', income: 0, expense: 500, balance: -500 },
    { date: '2024-03-30', description: 'เงินเดือน', income: 10000, expense: 0, balance: 10000 },
    { date: '2024-03-31', description: 'ค่าเช่า', income: 0, expense: 2000, balance: -2000 },
    { date: '2024-04-01', description: 'โบนัส', income: 3000, expense: 0, balance: 3000 },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableData}>{item.name}</Text>
      <Text style={styles.tableData}>
        {item.type === "income" ? item.amount.toFixed(2) : "-"}
      </Text>
      <Text style={styles.tableData}>
        {item.type === "expense" ? item.amount.toFixed(2) : "-"}
      </Text>
      <Text style={styles.tableData}>{totalBalance.toFixed(2)}</Text>
    </View>
  );

  console.log(selectedMonth);
  console.log(selectedYear);

  const getExpenseByTime = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/expensesByTime?month=${selectedMonth}&year=${selectedYear}`
      );
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const getBalanceBegin = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/beginningBalance?month=${selectedMonth}&year=${selectedYear}`
      );
      setBeginningBalance(response.data);
    } catch (error) {
      console.error("Error fetching beginningBalance:", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      getExpenseByTime();
      getBalanceBegin();
      console.log(expenses);
      console.log(beginningBalance);
    }
  }, [isFocused]);
  return (
    <View style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.column}>{item.date}</Text>
            <Text style={styles.column}>{item.description}</Text>
            <Text style={styles.column}>{item.income}</Text>
            <Text style={styles.column}>{item.expense}</Text>
            <Text style={styles.column}>{item.balance}</Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.column, styles.headerText]}>วันที่</Text>
            <Text style={[styles.column, styles.headerText]}>ชื่อรายการ</Text>
            <Text style={[styles.column, styles.headerText]}>รายรับ</Text>
            <Text style={[styles.column, styles.headerText]}>รายจ่าย</Text>
            <Text style={[styles.column, styles.headerText]}>ยอดคงเหลือ</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  column: {
    flex: 1,
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 2,
    borderBottomColor: '#999',
  },
  headerText: {
    fontWeight: 'bold',
  },
});
