import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/screenWrapper";
import { colors } from "../theme";
import EmptyList from "../components/emptyList";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import BackButton from "../components/backButton";
import ExpenseCard from "../components/expenseCard";
import { db, expensesRef, pocketRef } from "../config/firebase";
import {
  doc,
  getDocs,
  query,
  where,
  getDoc,
  orderBy,
} from "firebase/firestore";

export default function PocketExpensesScreen(props) {
  const { id, pocketName, amount } = props.route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [expenses, setExpenses] = useState([]);
  const [pockets, setPockets] = useState([]);

  const fetchExpenses = async () => {
    const q = query(
      expensesRef, 
      where("pocketId", "==", id),
      orderBy('createAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    let data = [];
    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
      data.push({ ...doc.data(), id: doc.id });
    });
    setExpenses(data);
  };

  const fetchPocket = async () => {
    const documentRef = doc(pocketRef, id);
    const documentSnapshot = (await getDoc(documentRef)).data();
    setPockets(documentSnapshot)
  };

  useEffect(() => {
    if (isFocused) {
      fetchExpenses();
      fetchPocket();
    }
  }, [isFocused]);
  return (
    <ScreenWrapper className="flex-1">
      <View className="px-4">
        <View className="relative mt-5">
          <View className="absolute top-2 left-0 z-50">
            <BackButton />
          </View>
          <View className="border-b-2 pb-2">
            <Text className={`${colors.heading} text-xl font-bold pl-14`}>
              {pocketName}
            </Text>
            <Text className={`${colors.heading} text-base pl-14`}>
              {`฿ ${pockets.amount}`}
            </Text>
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
                navigation.navigate("AddExpense", { id, pocketName, amount })
              }
              className="p-2 px-3 bg-white border border-gray-200 rounded-full"
            >
              <Text className={colors.heading}>Add Expenses</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: "100%" }}>
            <FlatList
              data={expenses}
              ListEmptyComponent={
                <EmptyList message={"You haven't recorded any expenses yet"} />
              }
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={true}
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
