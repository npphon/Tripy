import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../components/screenWrapper";
import { colors } from "../theme";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import BackButton from "../components/backButton";
import Loading from "../components/loading";
import axios from "axios";
import { Dropdown } from "react-native-element-dropdown";

export default function RequestStatementScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [years, setYears] = useState([])

  const fetchYear = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/yearBeginningBalance`);
      setYears(response.data);
    } catch (error) {
      console.error("Error fetching pocket:", error);
    }
  };

  // สร้างรายการปี (ในที่นี้คือ 2020 - 2025)
  // const years = Array.from(new Array(4), (_, index) => {
  //   const year = new Date().getFullYear() - 3 + index;
  //   return { label: year.toString(), value: year.toString() };
  // });

  

  const months = [
    { label: "ม.ค.", value: "01" },
    { label: "ก.พ.", value: "02" },
    { label: "มี.ค.", value: "03" },
    { label: "เม.ย.", value: "04" },
    { label: "พ.ค.", value: "05" },
    { label: "มิ.ย.", value: "06" },
    { label: "ก.ค.", value: "07" },
    { label: "ส.ค.", value: "08" },
    { label: "ก.ย.", value: "09" },
    { label: "ต.ค.", value: "10" },
    { label: "พ.ย.", value: "11" },
    { label: "ธ.ค.", value: "12" },
  ];

  const handleRequestStatement = async () => {
    if (selectedMonth && selectedYear) {
      navigation.navigate("Statement", { selectedMonth, selectedYear });
    } else {
      Alert.alert("month and year are required!", "", [{ text: "OK" }]);
    }
  };

  useEffect(() => {
    fetchYear();
  }, []);

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
                Request Statement
              </Text>
            </View>
          </View>
          <View className="flex-row">
            <View className="w-1/2">
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={months}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="เดือน"
                value={selectedMonth}
                onChange={(item) => {
                  setSelectedMonth(item.value);
                }}
              />
            </View>
            <View className="w-1/2">
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={years}
                maxHeight={300}
                labelField="year"
                valueField="year"
                placeholder="ปี"
                value={selectedYear}
                onChange={(item) => {
                  setSelectedYear(item.year);
                }}
              />
            </View>
          </View>
        </View>

        <View>
          {loading ? (
            <Loading />
          ) : (
            <TouchableOpacity
              onPress={handleRequestStatement}
              style={{ backgroundColor: colors.button }}
              className="my-6 rounded-full p-3 shadow-sm mx-2"
            >
              <Text className="text-center text-white text-lg font-bold">
                Request Statement
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
