import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Dimensions,
  Pressable,
} from "react-native";
import { workAreas } from "../static/work-areas";
import WorkAreaItemRenderer from "../components/workAreaItemRenderer";
import { LinearGradient } from "expo-linear-gradient";
import StatusBarHeight from "@expo/status-bar-height";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSelector, useDispatch } from "react-redux";
import { setQuestionSet } from "../store/questionnair";
import { setAreaName } from "../store/userData";
import { StackActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function SurveyAreas({ navigation }) {
  // const [statusBarHeight, setStatusBarHeight] = useState(0);  will add when needed
  // const [headerHeightToSet, setHeaderHeight] = useState(0);   will add when needed
  const headerHeight = useHeaderHeight();
  const dispatch = useDispatch();

  const currentStepPosition = useSelector((state) => {
    return state.questionnair.currentStepPosition;
  });

  const currentSectionIndex = useSelector((state) => {
    return state.questionnair.currentSubSectionIndex;
  });

  const questionSetObjects = useSelector((state) => {
    return state.questionnair.questionSet[currentSectionIndex].questions;
  });

  const currentQuestionRating = useSelector((state) => {
    return state.questionnair.questionSet[currentSectionIndex].questions[
      currentStepPosition
    ].ratings;
  });

  const language = useSelector((state) => {
    return state.userData.language;
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: language === "english" ? "Area of Assessment" : "असेसमेंट एरिया",
      headerLeft: () => {
        return (
          <Pressable
            onPress={() => {
              navigation.dispatch(StackActions.pop());
            }}
            style={styles.backButton}
          >
            <Ionicons
              name="chevron-back"
              size={Dimensions.get("window").width * 0.045}
              color="#059DF8"
            />
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        );
      },
    });
  }, []);

  const itemRenderer = (item) => {
    const onPressHandler = (pressedItem) => {
      dispatch(
        setQuestionSet({ set: pressedItem.questionSet, language: language })
      );
      dispatch(
        setAreaName({
          areaName: "english" ? pressedItem.name : pressedItem.marathiname,
        })
      );
      navigation.navigate("Questionnairs", {
        pressedItem: pressedItem,
      });
    };

    return (
      <WorkAreaItemRenderer
        areaName={
          language === "english" ? item.item.name : item.item.marathiname
        }
        srno={item.item.srno}
        onPress={onPressHandler}
        item={item.item}
      />
    );
  };

  // will add below code when needed !

  // useEffect(() => {
  //   if (Platform.OS === "ios") {
  //     const getStatusBarHeight = async () => {
  //       const height = await StatusBarHeight.getAsync();
  //       setStatusBarHeight(height);
  //     };
  //     getStatusBarHeight();
  //   } else {
  //     setStatusBarHeight(StatusBar.currentHeight);
  //   }
  //   setHeaderHeight(headerHeight);
  // }, []);

  return (
    <LinearGradient
      colors={["#FBBB37", "#F88B45"]}
      start={[0, 1]}
      end={[1, 0]}
      style={{
        ...styles.headerContainer,
      }}
    >
      <FlatList
        data={workAreas}
        keyExtractor={(item) => item.srno}
        renderItem={itemRenderer}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    padding: 24,
  },

  backButton: {
    flexDirection: "row",
    height: Dimensions.get("window").height * 0.04,
    width: Dimensions.get("window").width * 0.2,
    justifyContent: "center",
    alignItems: "center",
    padding: 4,
  },

  backButtonText: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.04,
    color: "#059DF8",
  },
});
