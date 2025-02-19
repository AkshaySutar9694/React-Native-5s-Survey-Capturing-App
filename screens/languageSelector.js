import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import RadioGroup from "react-native-radio-buttons-group";
import { useDispatch } from "react-redux";
import { setLanguage } from "../store/userData";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function LanguageSelector({ navigation }) {
  const dispatch = useDispatch();

  const commonStylesForRadioButton = {
    borderColor: "#FFFFFF",
    borderSize: 3,
    size: 30,
    color: "#FFFFFF",
    labelStyle: {
      fontFamily: "montserrat",
      fontSize: Dimensions.get("window").width * 0.05,
      color: "#FFFFFF",
      paddingLeft: 6,
    },
    containerStyle: {
      marginVertical: 16,
    },
  };

  const radioButtons = [
    {
      id: "1",
      label: "English (इंग्रजी)",
      value: "english",
      ...commonStylesForRadioButton,
    },
    {
      id: "2",
      label: "Marathi (मराठी)",
      value: "marathi",
      ...commonStylesForRadioButton,
    },
  ];

  const [isOptionSelected, setIsOptionSelected] = React.useState(false);
  const [selectedLanguage, setSelectedLanguage] = React.useState("");
  const [selectedId, setSelectedId] = React.useState("");

  const onPressRadioButton = (id) => {
    radioButtons.forEach((item) => {
      if (item.id === id) {
        setSelectedLanguage(item.value);
      }
    });
    setIsOptionSelected(true);
    setSelectedId(id);
  };

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
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "50%",
        }}
      >
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1 }}>
            <View style={styles.formBox}>
              <View style={styles.formWrapper}>
                <View style={styles.labelWrapper}>
                  <Text style={styles.labelText}>
                    Select language (भाषा निवडा)
                  </Text>
                </View>
                <View style={styles.inputWrapper}>
                  <RadioGroup
                    radioButtons={radioButtons}
                    onPress={onPressRadioButton}
                    layout={"column"}
                    selectedId={selectedId}
                    containerStyle={styles.radioContainer}
                  />
                </View>
              </View>
            </View>
            <View style={styles.submitButtonBox}>
              <LinearGradient
                colors={
                  isOptionSelected
                    ? ["#F66750", "#FBBB37"]
                    : ["#727a9a", "#d8dbe9"]
                }
                start={[0, 1]}
                end={[1, 0]}
                style={styles.buttonWrap}
              >
                <Pressable
                  android_ripple={{
                    color: "#ABA9A9",
                  }}
                  onPress={() => {
                    if (isOptionSelected) {
                      dispatch(setLanguage({ language: selectedLanguage }));
                      navigation.navigate("User Logger");
                    }
                  }}
                  style={styles.nextButtonPressable}
                >
                  <Text style={styles.nextButtonText}>NEXT</Text>
                </Pressable>
              </LinearGradient>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    padding: 12,
    flexDirection: "column",
  },

  formBox: {
    flex: 1,
  },

  submitButtonBox: {
    flex: 1,
    padding: 12,
    paddingTop: "6%",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  formWrapper: {
    padding: 12,
    marginVertical: 4,
    flex: 1,
  },

  radioContainer: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginVertical: 4,
    paddingVertical: 8,
    alignSelf: "center",
  },

  labelWrapper: {
    marginVertical: 2,
  },

  labelText: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.05,
    color: "#FFFFFF",
  },

  buttonWrap: {
    height: Dimensions.get("window").height * 0.07,
    width: "100%",
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
