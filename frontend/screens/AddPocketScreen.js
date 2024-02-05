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
import { addDoc } from "firebase/firestore";
import { pocketRef } from "../config/firebase";

export default function AddPocketScreen() {
  const [pocketName, setPocketName] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const handleAddPocket = async () => {
    if (pocketName) {
      //good to go
      // navigation.navigate("Home");
      setLoading(true);
      let doc = await addDoc(pocketRef, {
        pocketName,
        amount,
      });
      setLoading(false);
      if (doc && doc.id) {
        Alert.alert("create pocket successful", "", [
          {
            text: "ok",
          },
        ]);
      }
      navigation.goBack();
    } else {
      // show error
      Alert.alert("Place and Country are required!", "", [
        {
          text: "ok",
        },
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
