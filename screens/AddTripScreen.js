import {
  View,
  Text,
  Image,
  TextInput,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../components/screenWrapper";
import { colors } from "../theme";
import BackButton from "../components/backButton";
import { useNavigation } from "@react-navigation/native";

export default function AddTripScreen() {
  const [place, setPlace] = useState("");
  const [country, setCountry] = useState("");

  const navigation = useNavigation();

  const handleAddTrip = () => {
    if (place && country) {
      //good to go
      navigation.navigate("Home");
    } else {
      //show error
    }
  };
  return (
    <ScreenWrapper>
      <View className="flex justify-between h-full mx-4">
        <View>
          <View className="relative mt-12">
            <View className="absolute top-0 left-0 z-10">
              <BackButton />
            </View>

            <Text className={`${colors.heading} text-xl font-bold text-center`}>
              Add Trip
            </Text>
          </View>

          <View className="flex-row justify-center my-10 mt-10">
            <Image
              className="h-80 w-80"
              source={require("../assets/images/4.png")}
            />
          </View>
        </View>
        <View className="space-y-20 mx-2">
          <Text className={`${colors.heading}text-lg font-bold`}>
            Where on Earth?
          </Text>
          <TextInput
            value={place}
            onChangeText={(value) => setPlace(value)}
            className="p-6 bg-white rounded-full mb-56 "
          />
          <Text className={`${colors.heading}text-lg font-bold`}>
            Which Country
          </Text>
          <TextInput
            value={country}
            onChangeText={(value) => setCountry(value)}
            className="p-6 bg-white rounded-full mb-10 "
          />
        </View>
      </View>
      <View>
        <TouchableOpacity
          onPress={handleAddTrip}
          style={{ backgroundColor: colors.Button }}
          className="my-6 rounded-full p-3 shadow-sm mx-2"
        >
          <Text className="text-center text-white text-lg font-bold">
            AddTrip
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
