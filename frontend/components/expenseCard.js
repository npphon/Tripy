import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { categoryBG, colors } from "../theme";
import { TrashIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";

import axios from "axios";

export default function ExpenseCard({ item }) {
  const id = item.id;
  const type = item.type;
  const navigation = useNavigation();

  const updateAmountPocket = async () => {
    const dateObject = new Date(item.created_at);

    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1; // เริ่มนับเดือนจาก 0 ดังนั้นต้องบวก 1 เพื่อให้ได้เดือนที่ถูกต้อง

    try {
      let updatedAmount = item.amount;
      if (item.type === "expense") {
        updatedAmount = item.amount;
      } else if (item.type === "income") {
        updatedAmount = -item.amount;
      }
      const response = await axios.patch(
        `http://localhost:3000/pocket/${item.pocket_id}`,
        {
          pocket_balance: updatedAmount,
        }
      );
      const responseUpdateBeginningBalance = await axios.patch(
        `http://localhost:3000/beginningBalance`,
        {
          month: month,
          year: year,
          amount: updatedAmount,
        }
      );
      // setPockets(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateTransferPocket = async () => {
    try {
      let updatedAmount = item.amount;
      if (item.type === "expense") {
        updatedAmount = item.amount; // ถ้าเป็น expense ให้ใส่ลบลงไปใน pocket_balance
      } else if (item.type === "income") {
        updatedAmount = -item.amount; // ถ้าเป็น expense ให้ใส่ลบลงไปใน pocket_balance
      }
      const response = await axios.patch(
        `http://localhost:3000/pocket/${item.pocket_id}`,
        {
          pocket_balance: updatedAmount,
        }
      );
      const response_transfer = await axios.patch(
        `http://localhost:3000/pocket/${item.transfer_pocket_id}`,
        {
          pocket_balance: -updatedAmount,
        }
      );
      // setPockets(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteExpense = async (id) => {
    updateAmountPocket();
    const response = await axios.delete(`http://localhost:3000/expenses/${id}`);
    if (response.status == 200) {
      Alert.alert("delete expense successful", "", [
        {
          text: "ok",
        },
      ]);
      navigation.goBack();
    } else {
      //show error
      Alert.alert("delete expense unsuccessful", "", [
        {
          text: "ok",
        },
      ]);
    }
  };

  const deleteExpenseByTransferId = async (transfer_id) => {
    updateTransferPocket();

    const response = await axios.delete(
      `http://localhost:3000/expenses/transfer/${transfer_id}`
    );
    if (response.status == 200) {
      Alert.alert("delete expense successful", "", [
        {
          text: "ok",
        },
      ]);
      navigation.goBack();
    } else {
      //show error
      Alert.alert("delete expense unsuccessful", "", [
        {
          text: "ok",
        },
      ]);
    }
  };

  const handleDeleteExpense = async () => {
    if (item.transfer_id) {
      console.log(item.transfer_id);
      deleteExpenseByTransferId(item.transfer_id);
    } else {
      deleteExpense(id);
    }
  };

  const buttonDeleteExpense = async () => {
    Alert.alert("Are you sure?", "", [
      { text: "delete expense", onPress: () => handleDeleteExpense() },
      {
        text: "Cancel",
      },
    ]);
  };
  return (
    <View
      style={{ backgroundColor: categoryBG[item.category] }}
      className="p-3 mb-3 bg-red-300 rounded-2xl"
    >
      <View>
        <Text className={`${colors.heading} font-bold`}>{item.title}</Text>
      </View>

      <View className="flex-row justify-between items-center mt-1">
        <Text className="">{item.created_at}</Text>
        <View className="flex-row">
          {type == "expense" ? (
            <Text>-{item.amount} บาท</Text>
          ) : (
            <Text>{item.amount} บาท</Text>
          )}
          {/* <Text className="">{item.amount} บาท</Text> */}
          <TouchableOpacity
            onPress={() => buttonDeleteExpense()}
            className="ml-1"
          >
            <TrashIcon size="23" color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
