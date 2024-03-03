import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/screenWrapper";
import { colors } from "../theme";
import randomImage from "../assets/images/randomImage";
import EmptyList from "../components/emptyList";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { PlusCircleIcon } from "react-native-heroicons/outline";
import { ArrowDownTrayIcon } from "react-native-heroicons/outline";
import { ArrowUpTrayIcon } from "react-native-heroicons/outline";
import { ClockIcon } from "react-native-heroicons/outline";
import axios from "axios";

export default function HomeScreen() {
  const navigation = useNavigation();

  const [pockets, setPockets] = useState([]);
  const [cashbox, setCashbox] = useState([]);
  const [sumAllPockets, setSumAllPockets] = useState([])

  const isFocused = useIsFocused();

  const fetchCashbox = async () => {
    try {
      const response = await axios.get("http://localhost:3000/pockets/1");
      setCashbox(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPockets = async () => {
    try {
      const response = await axios.get("http://localhost:3000/pockets");
      setPockets(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchSumAllPockets = async () => {
    try {
      const response = await axios.get("http://localhost:3000/sumAllPockets");
      setSumAllPockets(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isFocused) fetchCashbox();
    fetchSumAllPockets();
    fetchPockets();
  }, [isFocused]);

  return (
    <ScreenWrapper className="flex-1">
      <View className="flex-row justify-between items-center p-4">
        <Text className={`${colors.heading} font-bold text-3xl`}>
          Split Pocket
        </Text>
        <TouchableOpacity className="p-2 px-3 bg-white border border-gray-200 rounded-full">
          <Text
            onPress={() => navigation.navigate("Welcome")}
            className={colors.heading}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      <View className="justify-center bg-blue-200 rounded-xl mx-4 mb-4 p-6">
        <Text className="mb-4">Cashbox</Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-base">
            {`฿ ${
              cashbox.length > 0 ? cashbox[0].pocket_balance : "Loading..."
            }`}
          </Text>
          <View className="flex-row">
            <View className="p-2">
              <ArrowUpTrayIcon
                onPress={() => navigation.navigate("SelectPocket", cashbox[0] )}
                size="28"
                color="black"
              />
            </View>
            <View className="p-2">
              <ArrowDownTrayIcon
                onPress={() => navigation.navigate("AddCashbox")}
                size="28"
                color="black"
              />
            </View>
            <View className="ml-2 p-2">
            <ClockIcon
                onPress={() => navigation.navigate("PocketExpenses", {id: 1 , pocket_name: "Cashbox"})}
                size="28"
                color="black"
              />
            </View>
          </View>
        </View>
      </View>
      <View className="px-4 space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className={`${colors.heading} font-bold text-xl`}>Pockets</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("AddPocket")}
            className="p-2 px-3 bg-white border border-gray-200 rounded-full"
          >
            <Text className={colors.heading}>Add Pocket</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 550 }}>
          <FlatList
            data={pockets.filter((item) => item.id !== 1)}
            numColumns={2}
            ListEmptyComponent={
              <EmptyList message={"You haven't recorded any trips yet"} />
            }
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={{
              justifyContent: "space-between",
            }}
            className="mx-1"
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("PocketExpenses", { ...item })
                  }
                  className="bg-white p-3 rounded-2xl mb-3"
                >
                  <View>
                    <Image className="w-36 h-36 mb-2" source={randomImage()} />
                    <Text className={`${colors.heading} font-bold`}>
                      {item.pocket_name}
                    </Text>
                    <Text
                      className={`${colors.heading} text-xs`}
                    >{`฿ ${item.pocket_balance}`}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          <View className="justify-between bg-blue-200 rounded-xl mx-4 mb-4 p-4">
        <Text className="pb-1">ยอดเงินในบัญชี</Text>
          <Text className="text-base">
            {`฿ ${
              sumAllPockets.length > 0 ? sumAllPockets[0].total : "Loading..."
            }`}
          </Text>
      </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
