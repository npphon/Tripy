import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { categoryBG, colors } from "../theme";
import { TrashIcon } from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";

import axios from "axios";

export default function ExpenseCard({ item }) {
  const id = item.id;
  const navigation = useNavigation();

  const deleteExpense = async (id) => {
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

  const buttonDeleteExpense = async () => {
    Alert.alert("Are you sure?", "", [
      { text: "delete expense", onPress: () => deleteExpense(id) },
      {
        text: "Cancel",
      },
    ]);
  };
  return (
    <View
      style={{ backgroundColor: categoryBG[item.category] }}
      className="flex-row justify-between items-center p-3 mb-3 bg-red-300 rounded-2xl"
    >
      <View>
        <Text className={`${colors.heading} font-bold`}>{item.title}</Text>
        <Text>{item.create_at}</Text>
        {/* <Text className={`${colors.heading} text-xs`}>{item.category}</Text> */}
      </View>
      <View className="flex-row">
        <Text className="pt-4 pr-2">{item.amount} บาท</Text>
        <TouchableOpacity
          onPress={() => buttonDeleteExpense()}
          className="pt-4"
        >
          <TrashIcon size="23" color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
