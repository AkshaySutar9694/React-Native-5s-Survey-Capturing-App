import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

export default function FinalWordsViewer({ navigation }) {
  const language = useSelector((state) => {
    return state.userData.language;
  });

  return (
    <LinearGradient
      colors={["#FBBB37", "#F88B45"]}
      start={[0, 1]}
      end={[1, 0]}
      style={{
        ...styles.headerContainer,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "50%",
        }}
      >
        <View style={styles.iconContainer}>
          <Ionicons
            name="checkmark-circle"
            style={{ left: 1 }}
            size={40}
            color="#FFFFFF"
          />
        </View>
        <View style={styles.wordsContainer}>
          <Text style={styles.wordsStyle}>
            {language === "english" ? "Thank you!" : "धन्यवाद"}
          </Text>
          <Text style={styles.wordsStyle}>
            {language === "english"
              ? "Your 5S survey is recorded sucessfully."
              : "तुम्ही दिलेले रेटिंग्स जतन केले गेले जातील"}
          </Text>
          <View style={styles.submitButtonBox}>
            <LinearGradient
              colors={["#F66750", "#FBBB37"]}
              start={[0, 1]}
              end={[1, 0]}
              style={styles.buttonWrap}
            >
              <Pressable
                android_ripple={{
                  color: "#ABA9A9",
                }}
                onPress={() => {
                  navigation.navigate("Survey Areas");
                }}
                style={styles.nextButtonPressable}
              >
                <Text style={styles.nextButtonText}>SUBMIT ANOTHER SURVEY</Text>
              </Pressable>
            </LinearGradient>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    padding: 12,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  iconContainer: {
    height: 70,
    width: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 8,
    marginBottom: 15,
    backgroundColor: "#4BB543",
    borderColor: "#8FCC8B",
  },

  wordsContainer: { flex: 1 },

  wordsStyle: {
    textAlign: "center",
    padding: 4,
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.062,
    color: "white",
  },

  buttonWrap: {
    height: Dimensions.get("window").height * 0.07,
    width: "90%%",
    borderRadius: 4,
    margin: 8,
  },

  nextButtonPressable: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#FFFFFF",
  },

  nextButtonText: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.05,
    color: "#FFFFFF",
  },
});
