import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  StatusBar,
  Dimensions,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector, useDispatch } from "react-redux";
import { Formik } from "formik";
import * as yup from "yup";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as MailComposer from "expo-mail-composer";
import { Entypo } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { StackActions } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import XLSX from "xlsx";
import * as FileSystem from "expo-file-system";

export default function FeedbackListner({ navigation }) {
  const questionSet = useSelector((state) => {
    return state.questionnair;
  });

  const userData = useSelector((state) => {
    return state.userData;
  });

  const language = useSelector((state) => {
    return state.userData.language;
  });

  const formValidationSchema = yup.object().shape({
    improvement: yup.string().required("Improvement info is required"),
    goodpractices: yup.string().required("Good practices info is required"),
  });

  const [fileData, setFileData] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: language === "english" ? "User Feedback" : "प्रतिक्रिया",
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

  const exportDataToExcel = () => {
    let wb = XLSX.utils.book_new();

    let sectionWiseData = [];

    questionSet.questionSet.map((item, index) => {
      let sectionDataObject = {};
      sectionDataObject["Section Name"] = item.name;
      sectionDataObject["Average Ratings"] = item.averageRating;
      sectionWiseData.push(sectionDataObject);
    });

    let questionsetSheet = XLSX.utils.json_to_sheet([
      { "Question Set": questionSet.selectedQuestionSet },
    ]);
    XLSX.utils.book_append_sheet(wb, questionsetSheet, "Question Set");

    let sectionsSheet = XLSX.utils.json_to_sheet(sectionWiseData);
    XLSX.utils.book_append_sheet(wb, sectionsSheet, "Section Data");

    questionSet.questionSet.map((item, index) => {
      if (item.averageRating !== 0) {
        let questionWiseData = [];
        item.questions.map((qitem, qindex) => {
          let questionDataObject = {};
          questionDataObject["Question No."] = qitem.questionno;
          questionDataObject["Question"] = qitem.question;
          questionDataObject["Rating"] = qitem.ratings;
          questionWiseData.push(questionDataObject);
        });
        let qustionsSheet = XLSX.utils.json_to_sheet(questionWiseData);
        XLSX.utils.book_append_sheet(
          wb,
          qustionsSheet,
          item.name.substring(0, 31)
        );
      }
    });

    const wbout = XLSX.write(wb, {
      type: "base64",
      bookType: "xlsx",
    });

    const fileUri =
      Platform.OS === "ios"
        ? FileSystem.documentDirectory + `${userData.name}.xlsx`
        : FileSystem.cacheDirectory + `${userData.name}.xlsx`;

    FileSystem.writeAsStringAsync(fileUri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    })
      .then((r) => {
        console.log("Success");
      })
      .catch((e) => {
        console.log("Error", e);
      });
  };

  const uploadImages = useCallback(async () => {
    try {
      const response = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: false, // Ensures file is not duplicated
      });
      if (response.type === "success") {
        let filesCopy = [...fileData];
        filesCopy.push({ fileName: response.name, fileUri: response.uri });
        setFileData(filesCopy);
      }
    } catch (err) {
      console.warn(err);
    }
  }, [fileData]);

  const removeFile = (fileItem) => {
    let filesCopy = [...fileData];
    filesCopy = filesCopy.filter((item) => item.fileName !== fileItem.fileName);
    setFileData(filesCopy);
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
          paddingTop: "20%",
        }}
      >
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <Formik
            initialValues={{ improvement: "", goodpractices: "" }}
            validationSchema={formValidationSchema}
            onSubmit={async (values) => {
              let responseToSend = "5S survey details for below user. \r\n";
              responseToSend =
                responseToSend + `User name - ${userData.name} \r\n`;

              responseToSend =
                responseToSend +
                `Selected area for survey - ${userData.area} \r\n \r\n`;

              responseToSend =
                responseToSend +
                `Selected Question Set - ${questionSet.selectedQuestionSet} \r\n`;

              responseToSend =
                responseToSend +
                `\n\nFeedback provided by user is as below\r\n`;
              responseToSend =
                responseToSend +
                `\t1. Improvement area (सुधारणा) - ${values.improvement}\r\n`;
              responseToSend =
                responseToSend +
                `\t2. Good practices in each stage (चांगल्या पद्धती) - ${values.goodpractices}\r\n`;

              if (Platform.OS === "android") {
                try {
                  let isPermitedExternalStorage =
                    await PermissionsAndroid.check(
                      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                    );

                  if (!isPermitedExternalStorage) {
                    const granted = await PermissionsAndroid.request(
                      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                      {
                        title: "Storage permission needed",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK",
                      }
                    );

                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                      exportDataToExcel();
                    }
                  } else {
                    exportDataToExcel();
                  }
                } catch (e) {
                  console.error("Error while checking permission", e);
                }
              } else {
                exportDataToExcel(); // Directly call function on iOS
              }

              const getValidAttachments = async (fileData, userData) => {
                let attachments = fileData.map((item) => item.fileUri);

                // Determine file storage location based on platform
                const excelFilePath =
                  Platform.OS === "ios"
                    ? FileSystem.documentDirectory + `${userData.name}.xlsx`
                    : FileSystem.cacheDirectory + `${userData.name}.xlsx`;

                // Check if Excel file exists before attaching
                const fileInfo = await FileSystem.getInfoAsync(excelFilePath);
                if (fileInfo.exists) {
                  attachments.push(excelFilePath);
                } else {
                  console.warn("Excel file not found, skipping attachment.");
                }

                // Verify each file before returning
                const validAttachments = [];
                for (let file of attachments) {
                  const info = await FileSystem.getInfoAsync(file);
                  if (info.exists) {
                    validAttachments.push(file);
                  } else {
                    console.warn(`Skipping invalid attachment: ${file}`);
                  }
                }

                return validAttachments;
              };

              getValidAttachments(fileData, userData).then(
                (attachmentsToSend) => {
                  MailComposer.composeAsync({
                    recipients: [userData.verifiermail],
                    subject: `ORG 5S SURVEY SUBMITTED BY - ${userData.name}`,
                    body: responseToSend,
                    attachments: attachmentsToSend,
                  })
                    .then((data) => {
                      console.log("Email sent successfully:", data);
                    })
                    .catch((error) => {
                      console.error("Error sending email:", error);
                    });
                }
              );
              navigation.navigate("Final Words");
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
                          ? "Improvement Area"
                          : "गरजेच्या सुधारणा"}
                      </Text>
                    </View>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.inputComponent}
                        multiline={true}
                        numberOfLines={5}
                        textAlignVertical={"top"}
                        blurOnSubmit={true}
                        onChangeText={handleChange("improvement")}
                        onBlur={handleBlur("improvement")}
                        value={values.improvement}
                        placeholder={
                          language === "english"
                            ? "Improvements to be done"
                            : "प्रत्येक विभागात कराव्या लागणाऱ्या गरजेच्या सुधारणा"
                        }
                        placeholderTextColor="#8A8888"
                      />
                    </View>
                  </View>
                  <View style={styles.formWrapper}>
                    <View style={styles.labelWrapper}>
                      <Text style={styles.labelText}>
                        {language === "english"
                          ? "Good practices in each stage"
                          : "चांगल्या पद्धती"}
                      </Text>
                    </View>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.inputComponent}
                        multiline={true}
                        blurOnSubmit={true}
                        textAlignVertical={"top"}
                        numberOfLines={5}
                        onChangeText={handleChange("goodpractices")}
                        onBlur={handleBlur("goodpractices")}
                        value={values.goodpractices}
                        placeholder={
                          language === "english"
                            ? "Some good practices you liked in any stage"
                            : "प्रत्येक विभागातील तुम्हाला आवडलेल्या चांगल्या पद्धती"
                        }
                        placeholderTextColor="#8A8888"
                      />
                    </View>
                  </View>
                  <View style={styles.formWrapper}>
                    <View style={styles.labelWrapper}>
                      <Text style={styles.labelText}>
                        {language === "english"
                          ? "Uploaded Images are here"
                          : "अपलोड केलेल्या फाइल्स खालील प्रमाणे"}
                      </Text>
                      <View>
                        {fileData.length === 0 ? (
                          <View style={styles.uploadedFileContainer}>
                            <Text style={styles.uploadedFilePlaceholderText}>
                              {language === "english"
                                ? "No files are selected yet !"
                                : "कोणतीही फाईल निवडली नाही !"}
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.uploadedFileContainer}>
                            {fileData.map((item, index) => {
                              return (
                                <View
                                  key={index}
                                  style={styles.uploadedFileItem}
                                >
                                  <View style={styles.filename}>
                                    <Entypo
                                      name="attachment"
                                      size={24}
                                      color="#45B39D"
                                      style={{ position: "absolute", left: 0 }}
                                    />
                                    <Text
                                      numberOfLines={1}
                                      style={styles.uploadedFileText}
                                    >
                                      {item.fileName}
                                    </Text>
                                  </View>
                                  <View style={styles.filecloseicon}>
                                    <Pressable
                                      android_ripple={{
                                        color: "#ABA9A9",
                                      }}
                                      onPress={() => {
                                        removeFile(item);
                                      }}
                                    >
                                      <FontAwesome
                                        name="close"
                                        size={24}
                                        color="tomato"
                                      />
                                    </Pressable>
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={styles.inputWrapper}>
                      <LinearGradient
                        colors={["#F66750", "#FBBB37"]}
                        start={[0, 1]}
                        end={[1, 0]}
                        style={styles.uploadButtonWrap}
                      >
                        <Pressable
                          android_ripple={{
                            color: "#ABA9A9",
                          }}
                          onPress={() => {
                            uploadImages();
                          }}
                          style={styles.uploadButtonPressable}
                        >
                          <Text style={styles.nextButtonText}>
                            Upload Images
                          </Text>
                        </Pressable>
                      </LinearGradient>
                    </View>
                  </View>
                </View>
                <View style={styles.submitButtonBox}>
                  <LinearGradient
                    colors={
                      Object.keys(errors).length === 0 &&
                      touched.improvement &&
                      touched.goodpractices
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
                      <Text style={styles.nextButtonText}>
                        SUBMIT YOUR RATINGS
                      </Text>
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
    flex: 3,
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
    width: "100%",
  },

  inputWrapper: {
    marginVertical: 2,
    width: "100%",
  },

  inputComponent: {
    height: 120,
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
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.26,
    shadowRadius: 3.22,
    elevation: 5,
    borderColor: "#FEF4DF",
  },

  uploadButtonWrap: {
    height: Dimensions.get("window").height * 0.06,
    width: "80%",
    alignSelf: "center",
    borderRadius: 4,
    margin: 8,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.26,
    shadowRadius: 3.22,
    elevation: 5,
    borderColor: "#FEF4DF",
  },

  uploadButtonPressable: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#FFFFFF",
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
    textAlign: "center",
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

  uploadedFileContainer: {
    paddingHorizontal: 8,
    marginVertical: 10,
  },

  uploadedFilePlaceholderText: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.04,
    color: "#5D6D7E",
  },

  uploadedFileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "100%",
    padding: 4,
  },

  uploadedFileText: {
    fontFamily: "montserrat",
    fontSize: Dimensions.get("window").width * 0.04,
    color: "#FFFFFF",
    paddingLeft: 10,
    left: 20,
  },

  filename: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "80%",
  },

  filecloseicon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
