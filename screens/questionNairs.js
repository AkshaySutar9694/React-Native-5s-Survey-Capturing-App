import React, { useLayoutEffect, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  Dimensions,
  Button,
  View,
} from "react-native";
import Header from "../layouts/header";
import BodyWrapper from "../layouts/body";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import ModalComp from "../components/modal";
import { StackActions } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

export default function Questionnairs(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const questionSet = route.params?.pressedItem?.questionSet;
  const [backWarningModalVisible, setBackWarningModalVisible] = useState(false);

  const questionSetObjects = useSelector((state) => {
    return state.questionnair.questionSet[0].questions;
  });

  const language = useSelector((state) => {
    return state.userData.language;
  });

  useLayoutEffect(() => {
    if (route.params.givenRating !== questionSetObjects[0].givenRating) {
      navigation.setParams({ givenRating: questionSetObjects[0].givenRating });
    }
    navigation.setOptions({
      title:
        language === "english"
          ? `Questionnair Set - ${route.params.pressedItem.questionSet}`
          : `प्रश्नसंच - ${route.params.pressedItem.questionSet}`,
      headerLeft: () => {
        return (
          <Pressable
            onPress={() => {
              if (route.params.givenRating === null) {
                navigation.dispatch(StackActions.pop());
              } else {
                setBackWarningModalVisible(true);
              }
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
  }, [questionSet, navigation, route, questionSetObjects]);

  const onOkButtonHandler = () => {
    navigation.dispatch(StackActions.pop());
    setBackWarningModalVisible(false);
  };

  const onCancelButtonHandler = () => {
    setBackWarningModalVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <BodyWrapper />
      {backWarningModalVisible && (
        <ModalComp
          visible={backWarningModalVisible}
          type={"warning"}
          modalTitle={language === "english" ? "Caution" : "महत्वाची सुचना"}
          modalMessage={
            language === "english"
              ? "Your all changes will not be saved !"
              : "आपण दिलेल्या रेटिंग्स चा डेटा नष्ट होऊन जाईल"
          }
          buttons={[
            { title: "OK", callBackHandler: onOkButtonHandler },
            { title: "CANCEL", callBackHandler: onCancelButtonHandler },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionCloseIconContainer: {
    paddingHorizontal: 10,
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
