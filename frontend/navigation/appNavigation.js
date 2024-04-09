import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import AddPocketScreen from "../screens/AddPocketScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";
import PocketExpensesScreen from "../screens/PocketExpensesScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import AddCashboxScreen from "../screens/AddCashboxScreen"
import SelectPocketScreen from "../screens/SelectPocketScreen"
import TransferScreen from "../screens/TransferScreen"
import HistoryScreen from "../screens/HistoryScreen"
import RequestStatementScreen from "../screens/RequestStatementScreen"
import StatementScreen from "../screens/StatementScreen"

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen options={{headerShown: false}} name="Welcome" component={WelcomeScreen} />
        <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
        <Stack.Screen options={{headerShown: false}} name="History" component={HistoryScreen} />
        <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen options={{headerShown: false}} name="AddPocket" component={AddPocketScreen} />
        <Stack.Screen options={{headerShown: false}} name="AddExpense" component={AddExpenseScreen} />
        <Stack.Screen options={{headerShown: false}} name="PocketExpenses" component={PocketExpensesScreen} />
        <Stack.Screen options={{headerShown: false}} name="AddCashbox" component={AddCashboxScreen} />
        <Stack.Screen options={{headerShown: false}} name="SelectPocket" component={SelectPocketScreen} />
        <Stack.Screen options={{headerShown: false}} name="Transfer" component={TransferScreen} />
        <Stack.Screen options={{headerShown: false}} name="RequestStatement" component={RequestStatementScreen} />
        <Stack.Screen options={{headerShown: false}} name="Statement" component={StatementScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
