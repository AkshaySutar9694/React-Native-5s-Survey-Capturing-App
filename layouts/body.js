import React, { useState, useRef } from "react";
import RatingComponent from "../components/ratingComponent";
import ModalComp from "../components/modal";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  StatusBar,
  ScrollView,
  Pressable,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import {
  setCurrentStepPosition,
  setCurrentSubSectionIndex,
  setAverageRatingForSection,
} from "../store/questionnair";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function BodyWrapper(props) {
  const navigation = useNavigation();
  const [scoreModalVisible, setScoreModalVisible] = useState(false);
  const [scoreWarningDescription, setScoreWarningDescription] = useState("");
  const [finalSubmitModalVisible, setFinalSubmitModalVisible] = useState(false);
  const scrollViewRef = useRef(null);
  const currentStepPosition = useSelector((state) => {
    return state.questionnair.currentStepPosition;
  });

  const currentSectionIndex = useSelector((state) => {
    return state.questionnair.currentSubSectionIndex;
  });

  const language = useSelector((state) => {
    return state.userData.language;
  });

  const questionSet = useSelector((state) => {
    return state.questionnair.questionSet[currentSectionIndex].questions;
  });

  const currentQuestionRating = useSelector((state) => {
    return state.questionnair.questionSet[currentSectionIndex].questions[
      currentStepPosition
    ].ratings;
  });

  const dispatch = useDispatch();

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const goToNextQuestion = () => {
    scrollToTop();
    if (currentStepPosition === questionSet.length - 1) {
      let totalRating = questionSet.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.ratings;
      }, 0);
      const averageRating = (totalRating / questionSet.length).toFixed(2);
      dispatch(setAverageRatingForSection({ averageRating: averageRating }));
      if (currentSectionIndex === 0 && averageRating < 3) {
        setScoreModalVisible(true);
        setScoreWarningDescription(
          language === "english"
            ? `Your current section rating is ${averageRating} and it need to be greater than 3`
            : `तुम्ही दिलेल्या रेटिंगची सरासरी गुणसंख्या हि ${averageRating} आहे. अपेक्षित गुणसंख्या हि 3 पेक्षा जास्त हवी`
        );
      } else if (currentSectionIndex === 1 && averageRating < 3.5) {
        setScoreModalVisible(true);
        setScoreWarningDescription(
          language === "english"
            ? `Your current section rating is ${averageRating} and it need to be greater than 3.5`
            : `तुम्ही दिलेल्या रेटिंगची सरासरी गुणसंख्या हि ${averageRating} आहे. अपेक्षित गुणसंख्या हि 3.5 पेक्षा जास्त हवी`
        );
      } else if (currentSectionIndex === 2 && averageRating < 4) {
        setScoreModalVisible(true);
        setScoreWarningDescription(
          language === "english"
            ? `Your current section rating is ${averageRating} and it need to be greater than 4`
            : `तुम्ही दिलेल्या रेटिंगची सरासरी गुणसंख्या हि ${averageRating} आहे. अपेक्षित गुणसंख्या हि 4 पेक्षा जास्त हवी`
        );
      } else if (currentSectionIndex === 3 && averageRating < 4) {
        setScoreModalVisible(true);
        setScoreWarningDescription(
          language === "english"
            ? `Your current section rating is ${averageRating} and it need to be greater than 4`
            : `तुम्ही दिलेल्या रेटिंगची सरासरी गुणसंख्या हि ${averageRating} आहे. अपेक्षित गुणसंख्या हि 4 पेक्षा जास्त हवी`
        );
      } else if (currentSectionIndex === 4 && averageRating < 4.5) {
        setScoreModalVisible(true);
        setScoreWarningDescription(
          language === "english"
            ? `Your current section rating is ${averageRating} and it need to be greater than 4.5`
            : `तुम्ही दिलेल्या रेटिंगची सरासरी गुणसंख्या हि ${averageRating} आहे. अपेक्षित गुणसंख्या हि 4.5 पेक्षा जास्त हवी`
        );
      } else {
        if (currentSectionIndex !== 4) {
          dispatch(setCurrentStepPosition({ id: 0 }));
          dispatch(
            setCurrentSubSectionIndex({
              currentSectionIndex: currentSectionIndex,
              pressed: "NEXT",
            })
          );
        } else {
          setFinalSubmitModalVisible(true);
        }
      }
    } else {
      dispatch(setCurrentStepPosition({ id: currentStepPosition + 1 }));
    }
  };

  const goToPreviousQuestion = () => {
    if (currentStepPosition === 0) {
      dispatch(
        setCurrentSubSectionIndex({
          currentSectionIndex: currentSectionIndex,
          pressed: "PREVIOUS",
        })
      );
    } else {
      dispatch(setCurrentStepPosition({ id: currentStepPosition - 1 }));
    }
  };

  const onSubmitButtonHandler = () => {
    setScoreModalVisible(false);
    setFinalSubmitModalVisible(false);
    navigation.navigate("User Feedback");
  };

  const onCancelButtonHandler = () => {
    setScoreModalVisible(false);
  };

  const onFeedbackCancelButtonHandler = () => {
    setFinalSubmitModalVisible(false);
  };

  return (
    <>
      <View style={styles.bodyContainer}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
        >
          <View style={styles.questionContainer}>
            {questionSet.map((item, index) => {
              if (currentStepPosition === index) {
                return (
                  <View key={item.questionno} style={styles.questionWrap}>
                    <View style={styles.questionView}>
                      <Text style={styles.questionText}>{item.question}</Text>
                      <View style={styles.optionContainer}>
                        {item.questionOptions &&
                          item.questionOptions.map((qitem, qindex) => {
                            return (
                              <Text
                                key={qitem + qindex}
                                style={styles.questionTextOptions}
                              >
                                {qindex + 1 + ". " + qitem}
                              </Text>
                            );
                          })}
                      </View>
                    </View>
                    <RatingComponent />
                  </View>
                );
              }
            })}
          </View>
          <View style={styles.nextButtonContainer}>
            <LinearGradient
              colors={
                currentSectionIndex === 0 && currentStepPosition === 0
                  ? ["#727a9a", "#d8dbe9"]
                  : ["#F66750", "#FBBB37"]
              }
              start={[0, 1]}
              end={[1, 0]}
              style={styles.buttonWrap}
            >
              <Pressable
                android_ripple={{
                  color: "#ABA9A9",
                }}
                onPress={goToPreviousQuestion.bind(this)}
                disabled={
                  currentSectionIndex === 0 && currentStepPosition === 0
                }
                style={styles.nextButtonPressable}
              >
                <Text style={styles.nextButtonText}>PREVIOUS</Text>
              </Pressable>
            </LinearGradient>
            <LinearGradient
              colors={
                currentQuestionRating === 0
                  ? ["#727a9a", "#d8dbe9"]
                  : ["#F66750", "#FBBB37"]
              }
              start={[0, 1]}
              end={[1, 0]}
              style={styles.buttonWrap}
            >
              <Pressable
                android_ripple={{
                  color: "#ABA9A9",
                }}
                onPress={goToNextQuestion.bind(this)}
                style={styles.nextButtonPressable}
                disabled={currentQuestionRating === 0}
              >
                <Text style={styles.nextButtonText}>NEXT</Text>
              </Pressable>
            </LinearGradient>
          </View>
        </ScrollView>
        {scoreModalVisible && (
          <ModalComp
            visible={scoreModalVisible}
            type={"error"}
            modalTitle={
              language === "english"
                ? "Your average ratings is low"
                : "अमान्य सरासरी गुणसंख्या"
            }
            modalMessage={scoreWarningDescription}
            buttons={[
              { title: "CANCEL", callBackHandler: onCancelButtonHandler },
              { title: "SUBMIT", callBackHandler: onSubmitButtonHandler },
            ]}
          />
        )}
        {finalSubmitModalVisible && (
          <ModalComp
            visible={finalSubmitModalVisible}
            type={"success"}
            modalTitle={
              language === "english"
                ? "Ready to submit your feedback?"
                : "तुम्ही तुमची प्रतिक्रिया नोंदवू शकता"
            }
            modalMessage={
              language === "english"
                ? "Ratings for all the sections are recorded sucessfully! You can provide your final notes for improvement now."
                : "तुम्ही दिलेल्या प्रत्येक विभागाची रेटिंग्स जतन केली गेली आहे. कृपया तुम्ही तुमची प्रतिक्रिया पुढील प्रमाणे नोंदवा"
            }
            buttons={[
              {
                title: "CANCEL",
                callBackHandler: onFeedbackCancelButtonHandler,
              },
              {
                title: "FEEDBACK",
                callBackHandler: onSubmitButtonHandler,
              },
            ]}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 3.6,
  },

  questionContainer: {
    flex: 4,
    padding: 16,
  },

  nextButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 24,
    gap: 8,
  },

  buttonWrap: {
    height: Dimensions.get("window").height * 0.07,
    width: Dimensions.get("window").width * 0.4,
    borderRadius: 4,
    margin: 8,
  },

  nextButtonPressable: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },

  nextButtonTextDisabled: {},

  nextButtonText: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.05,
    color: "#FFFFFF",
  },

  questionWrap: {
    flex: 1,
  },

  questionView: {
    flex: 1,
    paddingHorizontal: 4,
    paddingLeft: Platform.OS === "android" ? 24 : 20,
    paddingTop: 8,
    flexGrow: 2,
  },

  questionText: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.04,
    color: "#000000",
  },

  optionContainer: {
    paddingVertical: 8,
    paddingHorizontal: "10%",
  },

  questionTextOptions: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.04,
    color: "#000000",
    marginVertical: 8,
  },
});
