import React from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function WorkAreaItemRenderer(props) {
  return (
    <LinearGradient
      colors={["#534666", "#CD7672"]}
      start={[0, 1]}
      end={[1, 0]}
      style={styles.workItem}
    >
      <Pressable
        onPress={() => {
          props.onPress(props.item);
        }}
      >
        <View style={styles.srnoWrapper}>
          <Text style={styles.srNoItemText}>{props.srno}</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.nameWrapper}>
          <Text style={styles.workItemText}>{props.areaName}</Text>
        </View>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  workItem: {
    padding: 12,
    margin: 8,
    borderWidth: 2,
    borderRadius: 4,
    flex: 1,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.26,
    shadowRadius: 3.22,
    elevation: 3,
    backgroundColor: "#FBBB37",
  },

  srnoWrapper: {
    marginVertical: 4,
    height: Dimensions.get("window").width * 0.07,
    width: Dimensions.get("window").width * 0.07,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  nameWrapper: {
    marginVertical: 4,
  },

  line: {
    marginVertical: 8,
    height: 2,
    backgroundColor: "#FFFFFF",
    width: "100%",
  },

  workItemText: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.04,
    color: "#FFFFFF",
  },

  srNoItemText: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.04,
    color: "#FFFFFF",
  },
});
