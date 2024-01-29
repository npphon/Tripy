import { View, Text } from "react-native";
import React from "react";
import { colors } from "../theme";

export default function ExpenseCard({ item }) {
  return (
    <View className="flex-row justify-between items-center p-3 mb-3 bg-red-300 rounded-2xl">
      <View>
        <Text className={`${colors}`}>{item.title}</Text>
        <Text>{item.category}</Text>
      </View>
      <View>
        <Text>${item.amount}</Text>
      </View>
    </View>
  );
}
