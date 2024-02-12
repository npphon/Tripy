import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/screenWrapper";
import { colors } from "../theme";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import BackButton from "../components/backButton";
import Loading from "../components/loading";
import axios from "axios";

export default function TransferScreen(props) {
  // const { id } = props.route.params;
  const { id, pocket_balance, pocket_name } = props.route.params;
  const { excludedId, excludedBalance, excludedName } = props.route.params;
  // console.log(id, pocket_balance, pocket_name);
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
        setLoading(false);
        if (response.status === 200) {
          Alert.alert("move money successful", "", [
            { text: "OK", onPress: () => navigation.navigate("Home")},
          ]);
        } else {
          Alert.alert("Error moving money", "", [{ text: "OK" }]);
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error moving money", "", [{ text: "OK" }]);
      }
    } else {
      Alert.alert("amount are required!", "", [
        { text: "OK" },
      ]);
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
              จาก {excludedName} : ฿ {excludedBalance}
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
