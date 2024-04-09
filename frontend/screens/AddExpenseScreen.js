import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../components/screenWrapper";
import BackButton from "../components/backButton";
import { colors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { categories } from "../constants/index";
import { Alert } from "react-native";
import Loading from "../components/loading";
import axios from "axios";

export default function AddExpenseScreen(props) {
  let { id } = props.route.params;
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  // console.log(id);
  const navigation = useNavigation();

  const handleAddExpense = async () => {
    if (title && amount && category) {
      // const numAmount = (-parseInt(amount));
      if (!isNaN(amount)) {
        setLoading(true);
        const response = await axios.post("http://localhost:3000/expenses", {
          title: title,
          amount: amount,
          category: category,
          pocket_id: id,
          type: "expense"
        });
        updateAmountPocket(id);
        setLoading(false);
        if (response.status == 201) {
          Alert.alert("add expense successful", "", [
            {
              text: "ok",
            },
          ]);
        }
        navigation.goBack();
      } else {
        //show error
        Alert.alert("Please fill amount to number", "", [
          {
            text: "ok",
          },
        ]);
      }
    } else {
      //show error
      Alert.alert("Please fill all the fields", "", [
        {
          text: "ok",
        },
      ]);
    }
  };

  const updateAmountPocket = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:3000/pocket/${id}`, {
        pocket_balance: -amount,
      });      
      // setPockets(response.data);
      } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <ScreenWrapper>
      <View className="flex justify-between h-full mx-4">
        <View>
          <View className="relative mt-5">
            <View className="absolute top-0 left-0 z-50">
              <BackButton />
            </View>

            <Text className={`${colors.heading} text-xl font-bold text-center`}>
              Add Expense
            </Text>
          </View>

          <View className="flex-row justify-center my-3 mt-5">
            <Image
              className="h-72 w-72"
              source={require("../assets/images/expenseBanner.png")}
            />
          </View>

          <View className="space-y-2">
            <Text className={`${colors.heading} text-lg font-bold`}>
              For What?
            </Text>
            <TextInput
              value={title}
              onChangeText={(value) => setTitle(value)}
              className="p-4 bg-white rounded-full mb-3"
            />
            <Text className={`${colors.heading} text-lg font-bold`}>
              How much?
            </Text>
            <TextInput
              value={amount}
              keyboardType="number-pad"
              onChangeText={(value) => setAmount(value)}
              className="p-4 bg-white rounded-full mb-3"
            />
          </View>
          <View className="mx-2 space-x-2">
            <Text className="text-lg font-bold">Category</Text>
            <View className="flex-row flex-wrap items-center">
              {categories.map((cat) => {
                let bgColor = "bg-white";
                if (cat.value == category) bgColor = "bg-green-200";
                return (
                  <TouchableOpacity
                    onPress={() => setCategory(cat.value)}
                    key={cat.value}
                    className={`rounded-full ${bgColor} px-4 p-3 mb-2 mr-2`}
                  >
                    <Text>{cat.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <View>
          {loading ? (
            <Loading />
          ) : (
            <TouchableOpacity
              onPress={handleAddExpense}
              style={{ backgroundColor: colors.button }}
              className="my-6 rounded-full p-3 shadow-sm mx-2"
            >
              <Text className="text-center text-white text-lg font-bold">
                Add Expense
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}
