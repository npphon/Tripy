import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import ScreenWrapper from "../components/screenWrapper";
import { colors } from "../theme";
import randomImage from "../assets/images/randomImage";
import BackButton from "../components/backButton";
import EmptyList from "../components/emptyList";
import { useNavigation } from "@react-navigation/native";
import ExpenseCard from "../components/expenseCard";
const items = [
  {
    id: 1,
    title:'ate sandwitch',
    amount:4,
    category: 'food',
  },
  {
    id: 2,
    title:'bought a jaket',
    amount:50,
    category: 'shopping',
  },
  {
    id: 3,
    title:'watched  movie',
    amount:100,
    category: 'entertainment',
  },
];

export default function TripExpensesScreen() {
  const navigation = useNavigation();
  return (
    <ScreenWrapper className="flex-1">
      <View className="px-4">
        <View className="relative mt-5">
          <View className="absolute top-0 left-0 z-10">
            <BackButton />
          </View>

          <Text className={`${colors.heading} text-xl font-bold text-center`}>
            Add Trip
          </Text>
        </View>
        <View className="flex justify-center items-center rounded-xl  mb-4">
          <Image
            className="w-80 h-80"
            source={require("../assets/images/7.png")}
          />
        </View>
        <View className="space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className={`${colors.heading} font-bold text-xl `}>
              Expenses
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddTrip")}
              className="p-2 px-3 bg-white border border-gray-200 rounded-full"
            >
              <Text className={colors.heading}>Add Expense</Text>
            </TouchableOpacity>
          </View>
          <View style={{ heading: 430 }}>
            <FlatList
              data={items}
              ListEmptyComponent={
                <EmptyList message={"You haven't recorded any Expenses yet"} />
              }
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              className="mx-1"
              renderItem={({ item }) => {
                return (
                <ExpenseCard item={item} /> 
                );
              }}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
