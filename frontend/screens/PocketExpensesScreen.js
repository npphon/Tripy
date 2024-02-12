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
import { expensesRef, pocketRef } from "../config/firebase";
import { TrashIcon } from "react-native-heroicons/outline";
import {
  doc,
  getDocs,
  query,
  where,
  getDoc,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import axios from 'axios';

export default function PocketExpensesScreen(props) {
  // const { id } = props.route.params;
  const { id, pocket_balance, pocket_name } = props.route.params;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [expenses, setExpenses] = useState([]);
  const [pockets, setPockets] = useState([]);
  
  const fetchExpenses = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/expenses/${id}`);
      setExpenses(response.data)
    } catch (error) {
      console.error('Error fetching pocket:', error);
    }
  };

  const deleteExpensesByPocketId = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/pockets/expenses/${id}`);
    } catch (error) {
      console.error('Error fetching pocket:', error);
    }
  };
  

  const deleteDocument = async (id) => {
    deleteExpensesByPocketId(id)
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

  // const deleteExpensesByPocketId = async () => {
  //   try {
  //     const q = query(expensesRef, where('pocketId', '==', id));
  
  //     const querySnapshot = await getDocs(q);
  
  //     querySnapshot.forEach(async (doc) => {
  //       await deleteDoc(doc.ref);
  //     });
  //   } catch (error) {
  //     console.error('Error deleting documents: ', error);
  //   }
  // };

  useEffect(() => {
    if (isFocused) {
      fetchExpenses(id);
      // fetchPocket();
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
              <Text className={`${colors.heading} text-base pl-14`}>
                {/* {`฿ ${
                  pockets.length > 0
                    ? pockets[0].pocket_balance
                    : "Loading..."
                }`} */}
                {`฿ ${pocket_balance}`}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => buttonDeletePocket()} //มาเขียนfunction ลบ pocket ต่อ
              className="mr-3 mt-3"
            >
              <TrashIcon size="25" color="black" />
            </TouchableOpacity>
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
              onPress={() => navigation.navigate("AddExpense", { id })}
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
