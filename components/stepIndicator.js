import React, { useState, useEffect } from "react";
import StepIndicator from "react-native-step-indicator";
import { customStyles } from "../helpers/mockdata";
import { StyleSheet } from "react-native";

export default function StepIndicatorComp(props) {
  const createLabels = () => {
    let queationLabelArray = [];
    for (let i = 0; i < props.totalQuestion; i++) {
      let stringToPush = "Q" + (i + 1);
      queationLabelArray.push(stringToPush);
    }
    return queationLabelArray;
  };

  let [questionsLabel, setQuestionsLabel] = useState(createLabels());

  useEffect(() => {
    setQuestionsLabel(createLabels());
  }, [props.totalQuestion]);

  return (
    <>
      <StepIndicator
        stepCount={props.totalQuestion}
        customStyles={customStyles}
        currentPosition={props.currentStepPosition}
        labels={questionsLabel}
      />
    </>
  );
}

const styles = StyleSheet.create({});
