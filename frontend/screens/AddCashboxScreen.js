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

export default function AddCashboxScreen() {
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleAddCashbox = async () => {
    if (balance) {
      try {
        setLoading(true);
        const response = await axios.patch("http://localhost:3000/cashbox/1", {
          balance: balance,
        });
        addExpense()
        setLoading(false);
        if (response.status === 201) {
          const data = response.data;
          Alert.alert("add cashbox successful", "", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert("Error creating cashbox", "", [{ text: "OK" }]);
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error creating cashbox", "", [{ text: "OK" }]);
      }
    } else {
      Alert.alert("cashbox Balance are required!", "", [
        { text: "OK" },
      ]);
    }
  };

  const addExpense = async () => {
    try {
      const response = await axios.post("http://localhost:3000/expenses", {
        title: "เงินเข้าสำเร็จ",
        amount: balance, 
        category: "other",
        pocket_id: 1,
        type: 'income'
      });
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
              Add Cashbox
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
              How much?
            </Text>
            <TextInput
              value={balance}
              keyboardType="number-pad"
              onChangeText={(value) => setBalance(value)}
              className="p-4 bg-white rounded-full mb-3"
            />
          </View>
        </View>

        <View>
          {loading ? (
            <Loading />
          ) : (
            <TouchableOpacity
              onPress={handleAddCashbox}
              style={{ backgroundColor: colors.button }}
              className="my-6 rounded-full p-3 shadow-sm mx-2"
            >
              <Text className="text-center text-white text-lg font-bold">
                Add Cashbox
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}
