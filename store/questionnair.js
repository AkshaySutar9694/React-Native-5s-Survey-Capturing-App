import { createSlice } from "@reduxjs/toolkit";
import { set_a_questionnair } from "../static/questionsets/set-a";
import { set_b_questionnair } from "../static/questionsets/set-b";
import { set_c_questionnair } from "../static/questionsets/set-c";
import { set_d_questionnair } from "../static/questionsets/set-d";
import { english_set_a_questionnair } from "../static/englishquestionsets/set-a";
import { english_set_b_questionnair } from "../static/englishquestionsets/set-b";
import { english_set_c_questionnair } from "../static/englishquestionsets/set-c";
import { english_set_d_questionnair } from "../static/englishquestionsets/set-d";

const questionnairSlice = createSlice({
  name: "questionnair",
  initialState: {
    selectedQuestionSet: "A",
    currentStepPosition: 0,
    currentSubSectionIndex: 0,
    questionSet: set_a_questionnair,
  },
  reducers: {
    setQuestionSet: (state, action) => {
      if (action.payload.set) {
        switch (action.payload.set) {
          case "A":
            state.questionSet =
              action.payload.language === "english"
                ? english_set_a_questionnair
                : set_a_questionnair;
            state.currentStepPosition = 0;
            state.currentSubSectionIndex = 0;
            state.selectedQuestionSet = "A";
            break;

          case "B":
            state.questionSet =
              action.payload.language === "english"
                ? english_set_b_questionnair
                : set_b_questionnair;
            state.currentStepPosition = 0;
            state.currentSubSectionIndex = 0;
            state.selectedQuestionSet = "B";
            break;

          case "C":
            state.questionSet =
              action.payload.language === "english"
                ? english_set_c_questionnair
                : set_c_questionnair;
            state.currentStepPosition = 0;
            state.currentSubSectionIndex = 0;
            state.selectedQuestionSet = "C";
            break;

          case "D":
            state.questionSet =
              action.payload.language === "english"
                ? english_set_d_questionnair
                : set_d_questionnair;
            state.currentStepPosition = 0;
            state.currentSubSectionIndex = 0;
            state.selectedQuestionSet = "D";
            break;

          default:
            break;
        }
      }
    },

    setCurrentStepPosition: (state, action) => {
      state.currentStepPosition = action.payload.id;
    },
    setCurrentSubSectionIndex: (state, action) => {
      if (action.payload.pressed === "NEXT") {
        if (action.payload.currentSectionIndex === 4) {
          state.currentSubSectionIndex = 0;
        } else {
          state.currentSubSectionIndex = action.payload.currentSectionIndex + 1;
        }
      } else {
        if (
          action.payload.currentSectionIndex !== 0 &&
          state.currentStepPosition !== 0
        ) {
          state.currentStepPosition = state.currentStepPosition - 1;
        } else if (
          action.payload.currentSectionIndex !== 0 &&
          state.currentStepPosition === 0
        ) {
          state.currentStepPosition =
            state.questionSet[state.currentSubSectionIndex - 1].questions
              .length - 1;

          state.currentSubSectionIndex = action.payload.currentSectionIndex - 1;
        } else if (
          action.payload.currentSectionIndex === 0 &&
          state.currentStepPosition !== 0
        ) {
          state.currentStepPosition = state.currentStepPosition - 1;
        }
      }
    },
    setRatingsForQuestion: (state, action) => {
      state.questionSet[state.currentSubSectionIndex].questions[
        state.currentStepPosition
      ].ratings = action.payload.rating;
      state.questionSet[state.currentSubSectionIndex].questions[
        state.currentStepPosition
      ].givenRating = action.payload.givenRating;
    },
    setAverageRatingForSection: (state, action) => {
      state.questionSet[state.currentSubSectionIndex].averageRating =
        action.payload.averageRating;
    },
  },
});

export const setCurrentStepPosition =
  questionnairSlice.actions.setCurrentStepPosition;
export const setCurrentSubSectionIndex =
  questionnairSlice.actions.setCurrentSubSectionIndex;
export const setRatingsForQuestion =
  questionnairSlice.actions.setRatingsForQuestion;
export const setQuestionSet = questionnairSlice.actions.setQuestionSet;
export const setAverageRatingForSection =
  questionnairSlice.actions.setAverageRatingForSection;

export default questionnairSlice.reducer;
