import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { setRatingsForQuestion } from "../store/questionnair";

const REACTIONS = [
  {
    label: "Terrible",
    marathiLabel: "भयानक",
    normalIcon: (
      <FontAwesome5
        name="angry"
        size={Dimensions.get("window").width * 0.06}
        color="black"
        style={{ opacity: 0.5 }}
      />
    ),
    bigIcon: (
      <FontAwesome5
        name="angry"
        size={Dimensions.get("window").width * 0.12}
        color="white"
      />
    ),
    ratingPoints: 1,
  },
  {
    label: "Bad",
    marathiLabel: "वाईट",
    normalIcon: (
      <FontAwesome5
        name="sad-tear"
        size={Dimensions.get("window").width * 0.06}
        color="black"
        style={{ opacity: 0.5 }}
      />
    ),
    bigIcon: (
      <FontAwesome5
        name="sad-tear"
        size={Dimensions.get("window").width * 0.12}
        color="white"
      />
    ),
    ratingPoints: 2,
  },
  {
    label: "Okay",
    marathiLabel: "ठीक",
    normalIcon: (
      <FontAwesome5
        name="meh"
        size={Dimensions.get("window").width * 0.06}
        color="black"
        style={{ opacity: 0.5 }}
      />
    ),
    bigIcon: (
      <FontAwesome5
        name="meh"
        size={Dimensions.get("window").width * 0.12}
        color="white"
      />
    ),
    ratingPoints: 3,
  },
  {
    label: "Good",
    marathiLabel: "चांगले",
    normalIcon: (
      <FontAwesome5
        name="smile"
        size={Dimensions.get("window").width * 0.06}
        color="black"
        style={{ opacity: 0.5 }}
      />
    ),
    bigIcon: (
      <FontAwesome5
        name="smile"
        size={Dimensions.get("window").width * 0.12}
        color="white"
      />
    ),
    ratingPoints: 4,
  },
  {
    label: "Great",
    marathiLabel: "उत्कृष्ट",
    normalIcon: (
      <FontAwesome5
        name="laugh"
        size={Dimensions.get("window").width * 0.06}
        color="black"
        style={{ opacity: 0.5 }}
      />
    ),
    bigIcon: (
      <FontAwesome5
        name="laugh"
        size={Dimensions.get("window").width * 0.12}
        color="white"
      />
    ),
    ratingPoints: 5,
  },
];
const WIDTH = Dimensions.get("window").width * 0.8;
const DISTANCE = WIDTH / REACTIONS.length;

export default function RatingComponent(props) {
  const currentStepPosition = useSelector((state) => {
    return state.questionnair.currentStepPosition;
  });

  const currentSectionIndex = useSelector((state) => {
    return state.questionnair.currentSubSectionIndex;
  });

  const questionSet = useSelector((state) => {
    return state.questionnair.questionSet[currentSectionIndex].questions;
  });

  const language = useSelector((state) => {
    return state.userData.language;
  });

  const currentQuestionRating = useSelector((state) => {
    return state.questionnair.questionSet[currentSectionIndex].questions[
      currentStepPosition
    ].ratings;
  });

  const dispatch = useDispatch();
  const [rating, setRating] = useState(currentQuestionRating);

  const returnInfoLines = () => {
    if (rating === 0) {
      return (
        <>
          <View style={styles.info_placeholder_points}>
            <Text style={styles.info_placeholder_mainpoints}>0</Text>
            <Text style={styles.info_placeholder_totalpoints}>
              {language === "english" ? "out of five" : "पाच पैकी"}
            </Text>
          </View>
          <View style={styles.info_placeholder}>
            <Text style={styles.info_placeholder_text}>
              {language === "english"
                ? "Please click on any of the icons below to provide your rating!"
                : "कृपया तुमचे रेटिंग देण्यासाठी खालील कोणत्याही चिन्हावर क्लिक करा!"}
            </Text>
          </View>
        </>
      );
    } else {
      return (
        <>
          <View style={styles.info_points}>
            <Text style={styles.info_givenpoints}>
              {language === "english" ? "Given" : "दिलेले रेटिंग"}
            </Text>
            <Text style={styles.info_mainpoints}>{rating}</Text>
            <Text style={styles.info_totalpoints}>
              {language === "english" ? "out of five" : "पाच मधील"}
            </Text>
          </View>
        </>
      );
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.infoText}>{returnInfoLines()}</View>
      <View
        style={{
          ...styles.wrap,
          justifyContent: rating !== 0 ? "flex-start" : "center",
        }}
      >
        <View style={styles.line} />
        <View style={styles.reactions}>
          {REACTIONS.map((reaction) => {
            return (
              <TouchableOpacity
                key={reaction.ratingPoints}
                onPress={() => {
                  setRating(reaction.ratingPoints);
                  dispatch(
                    setRatingsForQuestion({
                      rating: reaction.ratingPoints,
                      givenRating: reaction.ratingPoints,
                    })
                  );
                }}
              >
                <View style={styles.smileyWrap}>
                  <View
                    style={
                      rating === reaction.ratingPoints
                        ? styles.bigSmiley
                        : styles.smiley
                    }
                  >
                    {rating === reaction.ratingPoints
                      ? reaction.bigIcon
                      : reaction.normalIcon}
                  </View>
                  <Text
                    style={[
                      styles.reactionText,
                      rating === reaction.ratingPoints && {
                        color: "#FEB64E",
                        fontWeight: "bold",
                        fontSize: Dimensions.get("window").width * 0.04,
                      },
                    ]}
                  >
                    {language === "english"
                      ? reaction.label
                      : reaction.marathiLabel}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const size = Dimensions.get("window").width * 0.096;

const styles = StyleSheet.create({
  container: {
    flex: 3,
    flexGrow: 5,
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "transparent",
    padding: 16,
  },

  infoText: {
    flex: 2,
    flexGrow: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "100%",
    width: "100%",
    paddingVertical: 16,
    marginVertical: 4,
  },

  info_placeholder: {
    flex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  info_placeholder_text: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.04,
    textAlign: "center",
    color: "#d4d2d2",
  },

  info_placeholder_points: {
    flexDirection: "row",
    height: "100%",
    width: "100%",
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  info_placeholder_mainpoints: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.2,
    textAlign: "center",
    color: "#d4d2d2",
  },

  info_placeholder_totalpoints: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.06,
    textAlign: "center",
    color: "#d4d2d2",
    position: "relative",
    top: "4%",
  },

  info_points: {
    flexDirection: "row",
    height: "100%",
    width: "100%",
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  info_mainpoints: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.3,
    textAlign: "center",
    color: "#210e01",
  },

  info_totalpoints: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.06,
    textAlign: "center",
    color: "#210e01",
    position: "relative",
    top: "8%",
    marginLeft: 5,
  },

  info_givenpoints: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.06,
    textAlign: "center",
    color: "#210e01",
    position: "relative",
    top: "-10%",
    marginRight: 5,
  },

  wrap: {
    flex: 1,
    flexGrow: 2,
    paddingVertical: 16,
    marginVertical: 4,
    height: "100%",
    width: WIDTH,
  },

  reactions: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },

  smileyWrap: {
    width: DISTANCE,
    height: DISTANCE,
    justifyContent: "center",
    alignItems: "center",
  },

  smiley: {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: "#c7ced3",
    justifyContent: "center",
    alignItems: "center",
  },

  bigSmiley: {
    width: DISTANCE,
    height: DISTANCE,
    borderRadius: DISTANCE / 2,
    backgroundColor: "#FEB64E",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.26,
    shadowRadius: 3.22,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
  },

  reactionText: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.03,
    textAlign: "center",
    color: "#999",
    fontWeight: "400",
    marginTop: 5,
  },
});
