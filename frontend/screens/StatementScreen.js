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
import { useNavigation, useIsFocused } from "@react-navigation/native";
import BackButton from "../components/backButton";
import Loading from "../components/loading";
import axios from "axios";

export default function StatementScreen(props) {
  const { selectedMonth, selectedYear } = props.route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);

  const [beginningBalance, setBeginningBalance] = useState(0);
  const [expenses, setExpenses] = useState([]);

  const fetchExpenseAndBalanceData = async () => {
    try {
      setLoading(true);
      const expenseResponse = await axios.get(
        `http://localhost:3000/expensesByTime?month=${selectedMonth}&year=${selectedYear}`
      );
      setExpenses(expenseResponse.data);

      const balanceResponse = await axios.get(
        `http://localhost:3000/beginningBalance?month=${selectedMonth}&year=${selectedYear}`
      );
      setBeginningBalance(balanceResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseAndBalanceData();
  }, [selectedMonth, selectedYear, isFocused]);

  let currentBalance = 0;

  if (beginningBalance.length > 0) {
    currentBalance = beginningBalance[0].balance;
  }

  const expensesWithBalance = expenses.map((expense) => {
    const balance = currentBalance + expense.amount;
    currentBalance = balance;
    return { ...expense, balance };
  });

  return (
    <ScreenWrapper>
      <View className="flex px-4 mx-2 justify-between">
        <View>
          <View className="relative mt-5">
            <View className="absolute top-2 left-0 z-50">
              <BackButton />
            </View>
            <View className="border-b-2 pb-2 mt-16">
              <Text className={`${colors.heading} text-xl font-bold`}>
                Statement ของเดือนที่ {selectedMonth} ปี {selectedYear}
              </Text>
            </View>
          </View>
        </View>
        <View>
          <ScrollView horizontal={true}>
            <View style={{ height: 650 }}>
              <FlatList
                data={expensesWithBalance} // ใช้ข้อมูล expenses เป็นข้อมูลที่จะแสดงใน FlatList
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  return (
                    <View>
                      <View>
                        {item.amount >= 0 ? (
                          <View style={styles.row}>
                            <Text style={[styles.column, styles.dateColumn]}>
                              {item.create_at}
                            </Text>
                            <Text
                              style={[styles.column, styles.descriptionColumn]}
                            >
                              {item.title}
                            </Text>
                            <Text style={[styles.column, styles.incomeColumn]}>
                              {item.amount}
                            </Text>
                            <Text style={[styles.column, styles.expenseColumn]}>
                              -
                            </Text>
                            <Text style={[styles.column, styles.balanceColumn]}>
                              {item.balance}
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.row}>
                            <Text style={[styles.column, styles.dateColumn]}>
                              {item.create_at}
                            </Text>
                            <Text
                              style={[styles.column, styles.descriptionColumn]}
                            >
                              {item.title}
                            </Text>
                            <Text style={[styles.column, styles.incomeColumn]}>
                              -
                            </Text>
                            <Text style={[styles.column, styles.expenseColumn]}>
                              {item.amount}
                            </Text>
                            <Text style={[styles.column, styles.balanceColumn]}>
                              {item.balance}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                }}
                ListHeaderComponent={() => (
                  <View>
                    <View style={[styles.row, styles.header]}>
                      <Text style={[styles.column, styles.headerText]}>
                        วันที่
                      </Text>
                      <Text
                        className="ml-14"
                        style={[styles.column, styles.headerText]}
                      >
                        ชื่อรายการ
                      </Text>
                      <Text
                        className="ml-12"
                        style={[styles.column, styles.headerText]}
                      >
                        รายรับ
                      </Text>
                      <Text
                        className="ml-6"
                        style={[styles.column, styles.headerText]}
                      >
                        รายจ่าย
                      </Text>
                      <Text style={[styles.column, styles.headerText]}>
                        ยอดคงเหลือ
                      </Text>
                    </View>
                    <View style={[styles.row]}>
                      <Text style={[styles.column, styles.dateColumn]}>
                        {beginningBalance && beginningBalance.length > 0
                          ? `${beginningBalance[0].year}-${beginningBalance[0].month}`
                          : ""}
                      </Text>
                      <Text style={[styles.column, styles.descriptionColumn]}>
                        ยอดยกมา
                      </Text>
                      <Text style={[styles.column, styles.incomeColumn]}>
                        -
                      </Text>
                      <Text style={[styles.column, styles.expenseColumn]}>
                        -
                      </Text>
                      <Text style={[styles.column, styles.balanceColumn]}>
                        {beginningBalance && beginningBalance.length > 0
                          ? `${beginningBalance[0].balance}`
                          : ""}
                      </Text>
                    </View>
                  </View>
                )}
                style={{ width: "100%" }}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  column: {
    flex: 1,
    textAlign: "center",
  },
  header: {
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 2,
    borderBottomColor: "#999",
  },
  headerText: {
    fontWeight: "bold",
  },
  dateColumn: {
    width: 100, // กำหนดความกว้างของคอลัมน์วันที่
  },
  descriptionColumn: {
    width: 150, // กำหนดความกว้างของคอลัมน์ชื่อรายการ
  },
  incomeColumn: {
    width: 100, // กำหนดความกว้างของคอลัมน์รายรับ
  },
  expenseColumn: {
    width: 100, // กำหนดความกว้างของคอลัมน์รายจ่าย
  },
  balanceColumn: {
    width: 100, // กำหนดความกว้างของคอลัมน์ยอดคงเหลือ
  },
});
