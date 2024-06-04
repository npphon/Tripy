import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/screenWrapper";
import { colors } from "../theme";
import selectImage from "../assets/images/selectImage";
import EmptyList from "../components/emptyList";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import axios from "axios";

export default function SelectPocketScreen(props) {
  const navigation = useNavigation();
  const {
    id: excludedId,
    pocket_balance: excludedBalance,
    pocket_name: excludedName,
    pocket_type: excludedType,
  } = props.route.params;
  // console.log(excludedId, excludedBalance, excludedName);
  const [pockets, setPockets] = useState([]);
  // const [cashbox, setCashbox] = useState([]);

  const isFocused = useIsFocused();

  // const fetchCashbox = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:3000/cashbox");
  //     setCashbox(response.data);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  const fetchPockets = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/pockets`);
      setPockets(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isFocused) fetchPockets();
  }, [isFocused]);

  return (
    <ScreenWrapper className="flex-1">
      <View className="flex-row justify-between items-center p-4 mt-4">
        <Text className={`${colors.heading} font-bold text-3xl`}>โอนไป...</Text>
        <TouchableOpacity className="p-2 px-3 bg-white border border-gray-200 rounded-full">
          <Text onPress={() => navigation.goBack()} className={colors.heading}>
            X
          </Text>
        </TouchableOpacity>
      </View>
      <View className="px-4 space-y-3">
        <View className="flex-row justify-between items-center">
          <Text className={`${colors.heading} font-bold text-xl`}>
            Pocket ของฉัน
          </Text>
        </View>
        <View style={{ height: 650 }}>
          <FlatList
            data={pockets.filter((item) => item.id !== excludedId)}
            ListEmptyComponent={
              <EmptyList message={"You haven't created any pocket yet"} />
            }
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            className="mx-1"
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Transfer", {
                      ...item,
                      excludedId,
                      excludedBalance,
                      excludedName,
                    })
                  }
                  className="bg-white p-3 rounded-2xl mb-3"
                >
                  <View className="flex-row">
                    <Image
                      className="w-20 h-20 mb-2"
                      source={selectImage(item.pocket_type)}
                    />
                    <View className="justify-center ml-6">
                      <Text className={`${colors.heading} text-lg font-bold`}>
                        {item.pocket_name}
                      </Text>
                      <Text
                        className={`${colors.heading} text-lg`}
                      >{`${item.pocket_balance
                        .toLocaleString("th-TH", {
                          style: "currency",
                          currency: "THB",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}`}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}
