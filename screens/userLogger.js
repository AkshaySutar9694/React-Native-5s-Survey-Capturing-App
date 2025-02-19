import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../store/userData";
import { Formik } from "formik";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Ionicons } from "@expo/vector-icons";
import { StackActions } from "@react-navigation/native";

export default function UserLogger({ navigation }) {
  const dispatch = useDispatch();

  const language = useSelector((state) => {
    return state.userData.language;
  });

  const formValidationSchema = yup.object().shape({
    name: yup
      .string()
      .required(
        language === "english"
          ? "Employee name is required"
          : "असेसरचे नाव टाकणे गरजेचे आहे"
      ),
    verifiermail: yup
      .string()
      .email(
        language === "english"
          ? "Please enter valid email id"
          : "अयोग्य ई-मेल आयडी"
      )
      .required(
        language === "english"
          ? "Verifier email id is rerequired"
          : "व्हेरीफायर ई-मेल आयडी टाकणे गरजेचे आहे"
      ),
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: language === "english" ? "User Logger" : "असेसरची नोंद",
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
          paddingTop: "40%",
        }}
      >
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <Formik
            initialValues={{ name: "", verifiermail: "" }}
            validationSchema={formValidationSchema}
            onSubmit={(values) => {
              dispatch(setUserData({ userObject: values }));
              navigation.navigate("Survey Areas");
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={{ flex: 1 }}>
                <View style={styles.formBox}>
                  <View style={styles.formWrapper}>
                    <View style={styles.labelWrapper}>
                      <Text style={styles.labelText}>
                        {language === "english"
                          ? "Assessor Name"
                          : "असेसरचे नाव"}
                      </Text>
                    </View>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.inputComponent}
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        value={values.name}
                        placeholder={
                          language === "english"
                            ? "Enter Name"
                            : "असेसरचे नाव उदा. अमित पाटील"
                        }
                        placeholderTextColor="#8A8888"
                      />
                    </View>
                    {touched.name && errors.name && (
                      <View>
                        <Text style={styles.errorText}>{errors.name}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.formWrapper}>
                    <View style={styles.labelWrapper}>
                      <Text style={styles.labelText}>
                        {language === "english"
                          ? "Verifier email id"
                          : "व्हेरीफायर ई-मेल आयडी"}
                      </Text>
                    </View>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.inputComponent}
                        onChangeText={handleChange("verifiermail")}
                        onBlur={handleBlur("verifiermail")}
                        value={values.verifiermail}
                        placeholder={
                          language === "english"
                            ? "Enter verifier email id"
                            : "तुम्ही तुमची अस्सेसमेन्ट कोणाला पाठवू इच्छिता ?"
                        }
                        placeholderTextColor="#8A8888"
                      />
                    </View>
                    {touched.verifiermail && errors.verifiermail && (
                      <View>
                        <Text style={styles.errorText}>
                          {errors.verifiermail}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.submitButtonBox}>
                  <LinearGradient
                    colors={
                      Object.keys(errors).length === 0 && touched.name
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
                      onPress={handleSubmit}
                      style={styles.nextButtonPressable}
                    >
                      <Text style={styles.nextButtonText}>NEXT</Text>
                    </Pressable>
                  </LinearGradient>
                </View>
              </View>
            )}
          </Formik>
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
    paddingTop: "8%",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  formWrapper: {
    padding: 12,
    marginVertical: 4,
    flex: 1,
  },

  labelWrapper: {
    marginVertical: 2,
  },

  labelText: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.05,
    color: "#FFFFFF",
  },

  errorText: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.04,
    color: "red",
  },

  inputWrapper: {
    marginVertical: 2,
  },

  inputComponent: {
    height: 56,
    width: Dimensions.get("window").width * 0.85,
    borderRadius: 4,
    borderColor: "#8A8888",
    padding: 10,
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.04,
    color: "#000000",
    backgroundColor: "#FEF4DF",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.26,
    shadowRadius: 3.22,
    elevation: 3,
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
