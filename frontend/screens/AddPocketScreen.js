import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../components/screenWrapper";
import BackButton from "../components/backButton";
import { colors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/loading";
import axios from "axios";
import { pocketType } from "../constants/pocketType";

export default function AddPocketScreen() {
  const [pocketName, setPocketName] = useState("");
  const [target, setTarget] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleAddPocket = async () => {
    if (pocketName && category) {
      try {
        setLoading(true);
        const response = await axios.post("http://localhost:3000/pockets", {
          pocket_name: pocketName,
          target: target,
          pocket_type: category,
        });
        setLoading(false);
        if (response.status === 201) {
          const data = response.data;
          Alert.alert("Create pocket successful", "", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert("Error creating pocket", "", [{ text: "OK" }]);
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error creating pocket", "", [{ text: "OK" }]);
      }
    } else {
      Alert.alert("Pocket Name and Category are required!", "", [
        { text: "OK" },
      ]);
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
              Add Pocket
            </Text>
          </View>

          <View className="flex-row justify-center my-3 mt-5">
            <Image
              className="h-72 w-72"
              source={require("../assets/images/4.png")}
            />
          </View>

          <View className="space-y-2">
            <Text className={`${colors.heading} text-lg font-bold`}>
              Pocket Name
            </Text>
            <TextInput
              value={pocketName}
              onChangeText={(value) => setPocketName(value)}
              className="p-4 bg-white rounded-full mb-3"
            />
            <Text className={`${colors.heading} text-lg font-bold`}>
              target
            </Text>
            <TextInput
              value={target}
              keyboardType="number-pad"
              onChangeText={(value) => setTarget(value)}
              className="p-4 bg-white rounded-full mb-3"
            />
          </View>
          <View className="mx-2">
            <Text className="text-lg font-bold">Category</Text>
            <View className="flex-row flex-wrap items-center">
              {pocketType.map((cat) => {
                let bgColor = "bg-white";
                if (cat.value == category) bgColor = "bg-green-200";
                return (
                  <TouchableOpacity
                    onPress={() => setCategory(cat.value)}
                    key={cat.value}
                    className={`rounded-full ${bgColor} px-4 p-3 mb-2 mr-2`}
                  >
                    <Text className="font-bold">{cat.title}</Text>
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
              onPress={handleAddPocket}
              style={{ backgroundColor: colors.button }}
              className="my-6 rounded-full p-3 shadow-sm mx-2"
            >
              <Text className="text-center text-white text-lg font-bold">
                Add Pocket
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}
