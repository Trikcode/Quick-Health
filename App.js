import { StyleSheet, Text, View } from "react-native";
import SignUp from "./Auth/SignUp";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import HomePage from "./Home/HomePage";
import Login from "./Auth/Login";
import Police from "./Home/Police";
import ResetPassword from "./Auth/ResetPassword";
import FlashMessage from "react-native-flash-message";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={Login}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="HomePage"
              component={HomePage}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Police"
              component={Police}
              options={{
                headerShown: true,
                title: "Location",
              }}
            />
            <Stack.Screen
              name="PasswordReset"
              component={ResetPassword}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
          <FlashMessage position="top" />
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
