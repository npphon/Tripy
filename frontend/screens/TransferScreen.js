import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/screenWrapper";
import { colors } from "../theme";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import BackButton from "../components/backButton";
import Loading from "../components/loading";
import axios from "axios";
import UUIDGenerator from "react-native-uuid";

export default function TransferScreen(props) {
  // const { id } = props.route.params;
  const { id, pocket_balance, pocket_name } = props.route.params;
  const { excludedId, excludedBalance, excludedName } = props.route.params;
  // console.log("id",id, pocket_balance, pocket_name);
  // console.log(excludedId, excludedBalance, excludedName);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMoveMoney = async () => {
    if (amount) {
      try {
        setLoading(true);
        const response = await axios.post("http://localhost:3000/moveMoney", {
          sourcePocketId: excludedId,
          targetPocketId: id,
          amountToMove: amount,
        });
        const uuid = UUIDGenerator.v4().substring(0, 8);
        addExpense(
          excludedName,
          pocket_name,
          amount,
          id,
          "income",
          uuid,
          excludedId
        );
        addExpense(
          excludedName,
          pocket_name,
          amount,
          excludedId,
          "expense",
          uuid,
          id
        );
        setLoading(false);
        Alert.alert("move money successful", "", [
          { text: "OK", onPress: () => navigation.navigate("Home") },
        ]);
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error moving money", "", [{ text: "OK" }]);
      }
    } else {
      Alert.alert("amount are required!", "", [{ text: "OK" }]);
    }
  };

  const addExpense = async (
    from_pocket,
    to_pocket,
    amount,
    id,
    type,
    transfer_id,
    transfer_pocket_id
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/expensesMoveMoney",
        {
          title: `ย้ายเงินจาก ${from_pocket} ไป ${to_pocket} สำเร็จ`,
          amount: amount,
          category: "other",
          pocket_id: id,
          type: type,
          transfer_id: transfer_id,
          transfer_pocket_id: transfer_pocket_id,
        }
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect(() => {
  //   if (isFocused) {
  // fetchPocket();
  //   }
  // }, [isFocused]);

  return (
    <ScreenWrapper>
      <View className="flex h-full px-4 mx-2 justify-between">
        <View>
          <View className="relative mt-5">
            <View className="absolute top-2 left-0 z-50">
              <BackButton />
            </View>
            <View className="border-b-2 pb-2 mt-16">
              <Text className={`${colors.heading} text-xl font-bold`}>
                {pocket_name}
              </Text>
            </View>
          </View>
          <View className="space-y-3 mt-6">
            <Text className={`${colors.heading} text-lg font-bold`}>
              จำนวนเงิน
            </Text>
            <TextInput
              value={amount}
              placeholder="฿ 0.00"
              keyboardType="number-pad"
              onChangeText={(value) => setAmount(value)}
              className="p-4 bg-white rounded-full mb-3"
            />
            <Text>
              จาก {excludedName} : {excludedBalance.toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </Text>
          </View>
        </View>

        <View>
          {loading ? (
            <Loading />
          ) : (
            <TouchableOpacity
              onPress={handleMoveMoney}
              style={{ backgroundColor: colors.button }}
              className="my-6 rounded-full p-3 shadow-sm mx-2"
            >
              <Text className="text-center text-white text-lg font-bold">
                ยืนยัน
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}
