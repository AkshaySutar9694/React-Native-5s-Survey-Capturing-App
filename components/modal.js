import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ModalComp(props) {
  const returnModalIcons = (type) => {
    switch (type) {
      case "warning":
        return <Ionicons name="warning" size={26} color="#FFFFFF" />;

      case "error":
        return (
          <Ionicons
            name="close-circle"
            style={{ left: 1 }}
            size={26}
            color="#FFFFFF"
          />
        );

      case "success":
        return (
          <Ionicons
            name="checkmark-circle"
            style={{ left: 1 }}
            size={26}
            color="#FFFFFF"
          />
        );

      default:
        return <Ionicons name="warning" size={26} color="#FFFFFF" />;
    }
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.visible}
        style={styles.modalContentContainer}
      >
        <View style={styles.warningModalContainer}>
          <View style={styles.modalView}>
            <View style={styles.modalInfoContainer}>
              <View
                style={{
                  ...styles.modalIconContainer,
                  backgroundColor:
                    props.type === "warning"
                      ? "#FEB64E"
                      : props.type === "success"
                      ? "#4BB543"
                      : "#F5745B",
                  borderColor:
                    props.type === "warning"
                      ? "#F2D88D"
                      : props.type === "success"
                      ? "#8FCC8B"
                      : "#FAAB9B",
                }}
              >
                {returnModalIcons(props.type)}
              </View>
              <View>
                <Text style={styles.modalTitle}>{props.modalTitle}</Text>
              </View>
              <Text
                style={{
                  ...styles.modalText,
                  color: props.type === "error" ? "tomato" : "#000",
                }}
              >
                {props.modalMessage}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
              }}
            >
              {props.buttons.map((item, index) => {
                return (
                  <LinearGradient
                    colors={["#F66750", "#FBBB37"]}
                    start={[0, 1]}
                    end={[1, 0]}
                    key={index}
                    style={styles.warningButtonWrap}
                  >
                    <Pressable
                      style={styles.buttonClose}
                      onPress={() => item.callBackHandler()}
                    >
                      <Text style={styles.modalCloseText}>{item.title}</Text>
                    </Pressable>
                  </LinearGradient>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContentContainer: {
    flex: 1,
  },

  warningModalContainer: {
    alignSelf: "center",
    verticalAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    height: Dimensions.get("window").height * 0.32,
    width: Dimensions.get("window").width * 0.82,
    top: Dimensions.get("window").height * 0.4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.26,
    shadowRadius: 3.22,
    elevation: 3,
    borderRadius: 4,
    padding: 8,
  },

  modalView: {
    borderColor: "#F2D88D",
    borderWidth: 3,
    height: "100%",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  modalInfoContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  modalIconContainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    marginBottom: 15,
  },

  modalText: {
    textAlign: "center",
    padding: 4,
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.032,
  },

  modalTitle: {
    textAlign: "center",
    padding: 4,
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.038,
    top: -8,
  },

  warningButtonWrap: {
    height: Dimensions.get("window").height * 0.04,
    width: Dimensions.get("window").width * 0.3,
    marginHorizontal: 8,
  },

  buttonClose: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },

  modalCloseText: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.044,
    color: "#FFFFFF",
  },
});
