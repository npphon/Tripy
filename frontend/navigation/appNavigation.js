import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import AddPocketScreen from "../screens/AddPocketScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import PocketExpensesScreen from "../screens/PocketExpensesScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen options={{headerShown: false}} name="Welcome" component={WelcomeScreen} />
        <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
        <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen options={{headerShown: false}} name="AddPocket" component={AddPocketScreen} />
        <Stack.Screen options={{headerShown: false}} name="AddExpense" component={AddExpenseScreen} />
        <Stack.Screen options={{headerShown: false}} name="PocketExpenses" component={PocketExpensesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
