import React, { useEffect } from "react";
import { StyleSheet, View, SafeAreaView, StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SurveyAreas from "./screens/surveyAreas";
import Questionnairs from "./screens/questionNairs";
import UserLogger from "./screens/userLogger";
import FeedbackListner from "./screens/feedbackListner";
import FinalWordsViewer from "./screens/finalWords";
import * as ScreenOrientation from "expo-screen-orientation";
import LanguageSelector from "./screens/languageSelector";

export default function App() {
  const Stack = createStackNavigator();

  const [fontsLoaded] = useFonts({
    montserrat: require("./assets/fonts/montserrat.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider style={styles.appContainer}>
      <StatusBar barStyle="dark-content" />
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: "#FEF4DF" },
            }}
          >
            <Stack.Screen
              name="Language Selector"
              component={LanguageSelector}
            />
            <Stack.Screen name="User Logger" component={UserLogger} />
            <Stack.Screen name="Survey Areas" component={SurveyAreas} />
            <Stack.Screen name="Questionnairs" component={Questionnairs} />
            <Stack.Screen name="User Feedback" component={FeedbackListner} />
            <Stack.Screen
              name="Final Words"
              component={FinalWordsViewer}
              options={{
                headerLeft: () => null,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#FEF4DF",
  },
});
