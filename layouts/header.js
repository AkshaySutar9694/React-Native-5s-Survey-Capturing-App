import React, { useState, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
} from "react-native";
import StepIndicatorComp from "../components/stepIndicator";
import { LinearGradient } from "expo-linear-gradient";

//import StatusBarHeight from "@expo/status-bar-height";
import { useSelector } from "react-redux";

export default function Header({ navigation }) {
  //const [statusBarHeight, setStatusBarHeight] = useState(0); will add when needed

  const currentStepPosition = useSelector((state) => {
    return state.questionnair.currentStepPosition;
  });

  const currentSectionIndex = useSelector((state) => {
    return state.questionnair.currentSubSectionIndex;
  });

  const questionSet = useSelector((state) => {
    return state.questionnair.questionSet[currentSectionIndex].questions;
  });

  const questionSubSectionName = useSelector((state) => {
    return state.questionnair.questionSet[currentSectionIndex].name;
  });

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
  // }, []);

  return (
    <>
      <LinearGradient
        colors={["#FBBB37", "#F88B45"]}
        start={[0, 1]}
        end={[1, 0]}
        style={{ ...styles.headerContainer }} // will add header padding here as paddingTop: statusBarHeight
      >
        <View style={styles.headingTextContainer}>
          <View style={styles.sectionNameContainer}>
            <Text style={styles.sectionText}>{questionSubSectionName}</Text>
          </View>
        </View>
        <View style={styles.stepContainer}>
          <StepIndicatorComp
            currentStepPosition={currentStepPosition}
            totalQuestion={questionSet.length}
          />
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
  },

  headingTextContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sectionNameContainer: {
    marginHorizontal: "2%",
  },

  sectionText: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.055,
    color: "#FFFFFF",
  },

  sectionCloseIconContainer: {
    justifyContent: "flex-start",
    paddingTop: 2,
  },

  stepContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 24,
  },
});
