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
import selectImage from "../assets/images/selectImage";
import EmptyList from "../components/emptyList";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { ArrowDownTrayIcon } from "react-native-heroicons/outline";
import { ArrowUpTrayIcon } from "react-native-heroicons/outline";
import { DocumentTextIcon } from "react-native-heroicons/outline";
import { ClockIcon } from "react-native-heroicons/outline";
import { ArrowPathIcon } from "react-native-heroicons/outline";
import axios from "axios";

export default function HomeScreen() {
  const navigation = useNavigation();

  const [pockets, setPockets] = useState([]);
  const [cashbox, setCashbox] = useState([]);
  const [sumAllPockets, setSumAllPockets] = useState([]);

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

  const resetDatabase = async () => {
    try {
      const response = await axios.delete("http://localhost:3000/reset");
      Alert.alert("ลบข้อมูลทั้งหมดสำเร็จ", "", [
        {
          text: "ตกลง",
        },
      ]);
      navigation.goBack();
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("reset unsuccessful", "", [
        {
          text: "ตกลง",
        },
      ]);
    }
  };

  const handleReset = async () => {
    Alert.alert("คุณแน่ใจใช่ไหมว่าจะลบข้อมูลทั้งหมด?", "", [
      {
        text: "ยกเลิก",
      },
      { text: "ยืนยันการลบ", onPress: () => resetDatabase() },
    ]);
  };

  useEffect(() => {
    if (isFocused) fetchCashbox();
    fetchSumAllPockets();
    fetchPockets();
  }, [isFocused]);

  return (
    <ScreenWrapper className="flex-1">
      <View className="flex-row justify-between items-center p-4">
        <Text className={`${colors.heading} font-bold text-2xl`}>
          POCKET MONEY MANAGEMENT MY WAY
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
      <View className="justify-center bg-blue-200 rounded-xl mx-4 mb-4 p-4">
        <View className="flex-row items-center">
          <Text className="font-bold text-base">ยอดเงินในบัญชี: </Text>
          <Text className="text-base">
            {` ${
              sumAllPockets.length > 0
                ? sumAllPockets[0].total.toLocaleString("th-TH", {
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
      <View className="justify-center bg-blue-200 rounded-xl mx-4 mb-4 p-4">
        <View className="flex-row justify-between">
          <Text className="mb-0 font-bold text-lg">Cashbox</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-base">
            {` ${
              cashbox.length > 0
                ? cashbox[0].pocket_balance.toLocaleString("th-TH", {
                    style: "currency",
                    currency: "THB",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                : "Loading..."
            }`}
          </Text>
          <View className="flex-row">
            <View className="p-2">
              <ArrowUpTrayIcon
                onPress={() => navigation.navigate("SelectPocket", cashbox[0])}
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
                onPress={() =>
                  navigation.navigate("History", {
                    id: 1,
                    pocket_name: "Cashbox",
                  })
                }
                size="28"
                color="black"
              />
            </View>
            <View className="p-2">
              <DocumentTextIcon
                onPress={() => navigation.navigate("RequestStatement")}
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
        <View style={{ height: 450 }}>
          <FlatList
            data={pockets.filter((item) => item.id !== 1)}
            numColumns={2}
            ListEmptyComponent={
              <EmptyList message={"You haven't created any pocket yet"} />
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
                    <Image
                      className="w-36 h-36 mb-2"
                      source={selectImage(item.pocket_type)}
                    />
                    <Text className={`${colors.heading} font-bold`}>
                      {item.pocket_name}
                    </Text>
                    <View>
                      {item.target ? (
                        <Text className={`${colors.heading} text-xs`}>
                          {`${item.pocket_balance.toLocaleString("th-TH", {
                            style: "currency",
                            currency: "THB",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })} / ${item.target
                            .toLocaleString("th-TH", {
                              style: "currency",
                              currency: "THB",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })
                            .replace("฿", "")}`}
                        </Text>
                      ) : (
                        <Text className={`${colors.heading} text-xs`}>
                          {`${item.pocket_balance.toLocaleString("th-TH", {
                            style: "currency",
                            currency: "THB",
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}`}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
        {/* <TouchableOpacity
          onPress={() => handleReset()}
          className="flex-row justify-end bottom-10 mr-2 bg-white border border-gray-200 rounded-full"
        >
          <ArrowPathIcon size="28" color="black" />
        </TouchableOpacity> */}
        <View className="flex-row justify-end">
          <TouchableOpacity
            onPress={() => handleReset()}
            className="justify-center items-center bottom-10 mr-2 bg-white rounded-full h-10 w-10"
          >
            <ArrowPathIcon size="30" color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}
