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
import { TrashIcon } from "react-native-heroicons/outline";
import { ArrowUpTrayIcon } from "react-native-heroicons/outline";
import axios from "axios";

export default function PocketExpensesScreen(props) {
  const { id, pocket_balance, pocket_name, target, pocket_type } = props.route.params;
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

  // get expenses by pocket_id
  const fetchExpenses = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/expenses/${id}`);
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expense:", error);
    }
  };

  const deleteExpensesByPocketId = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/pockets/expenses/${id}`
      );
    } catch (error) {
      console.error("Error delete expense:", error);
    }
  };

  const deleteDocument = async (id) => {
    const deleteExpense = await deleteExpensesByPocketId(id);
    const response = await axios.delete(`http://localhost:3000/pockets/${id}`);
    if (response.status == 200) {
      Alert.alert("delete pockets successful", "", [
        {
          text: "ok",
        },
      ]);
      navigation.goBack();
    } else {
      //show error
      Alert.alert("delete pockets unsuccessful", "", [
        {
          text: "ok",
        },
      ]);
    }
  };

  const buttonDeletePocket = async () => {
    Alert.alert("Are you sure?", "", [
      {
        text: "Cancel",
      },
      { text: "delete pocket", onPress: () => deleteDocument(id) },
    ]);
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
                {/* {pockets.length > 0 ? pockets[0].pocket_name : "Loading" } */}
                {pocket_name}
              </Text>
              <View>
                {target ? (
                  <Text className={`${colors.heading} text-base pl-14`}>
                    {`฿ ${
                      pockets.length > 0
                        ? pockets[0].pocket_balance
                        : "Loading..."
                    } / ${target}`}
                  </Text>
                ) : (
                  <Text className={`${colors.heading} text-base pl-14`}>
                    {`฿ ${
                      pockets.length > 0
                        ? pockets[0].pocket_balance
                        : "Loading..."
                    }`}
                  </Text>
                )}
              </View>
            </View>
            <View className="flex-row">
              <View className="mr-3 mt-3">
                <ArrowUpTrayIcon
                  onPress={() =>
                    navigation.navigate("SelectPocket", {
                      id,
                      pocket_balance,
                      pocket_name,
                      pocket_type
                    })
                  }
                  size="28"
                  color="black"
                />
              </View>
              <TouchableOpacity
                onPress={() => buttonDeletePocket()}
                className="mr-3 mt-3"
              >
                <TrashIcon size="25" color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="flex-row justify-center items-center rounded-xl mb-4">
          {/* <Image className="w-80 h-80"source={require("../assets/images/7.png")}/> */}
        </View>
        <View className="space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className={`${colors.heading} font-bold text-xl`}>
              Expenses
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AddExpense", { id, pocket_name })
              }
              className="p-2 px-3 bg-white border border-gray-200 rounded-full"
            >
              <Text className={colors.heading}>Add Expenses</Text>
            </TouchableOpacity>
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
