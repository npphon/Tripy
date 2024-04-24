import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/screenWrapper";
import { colors } from "../theme";
import EmptyList from "../components/emptyList";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import BackButton from "../components/backButton";
import ExpenseCard from "../components/expenseCard";
import axios from "axios";

export default function HistoryScreen(props) {
  const { id, pocket_balance, pocket_name, target } = props.route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [expenses, setExpenses] = useState([]);
  const [pockets, setPockets] = useState([]);

  const fetchPocket = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/pockets/${id}`);
      setPockets(response.data);
    } catch (error) {
      console.error("Error fetching pocket:", error);
    }
  };

  const fetchExpenses = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/expenses/${id}`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expense:", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchExpenses(id);
      fetchPocket(id);
      // console.log(pockets);
    }
  }, [isFocused]);

  return (
    <ScreenWrapper className="flex-1">
      <View className="px-4">
        <View className="relative mt-5">
          <View className="absolute top-2 left-0 z-50">
            <BackButton />
          </View>
          <View className="border-b-2 pb-2 flex-row justify-between">
            <View>
              <Text className={`${colors.heading} text-xl font-bold pl-14`}>
                {pocket_name}
              </Text>
              <View>
                <Text className={`${colors.heading} text-base pl-14`}>
                  {`${
                    pockets.length > 0
                      ? pockets[0].pocket_balance.toLocaleString("th-TH", {
                          style: "currency",
                          currency: "THB",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })
                      : "Loading..."
                  }`}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex-row justify-center items-center rounded-xl mb-4">
          {/* <Image className="w-80 h-80"source={require("../assets/images/7.png")}/> */}
        </View>
        <View className="space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className={`${colors.heading} font-bold text-xl`}>
              History
            </Text>
          </View>
          <View style={{ height: "84%" }}>
            <FlatList
              data={expenses}
              ListEmptyComponent={
                <EmptyList message={"You haven't recorded any expenses yet"} />
              }
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              className="mx-1"
              renderItem={({ item }) => {
                return <ExpenseCard item={item} />;
              }}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
