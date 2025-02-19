import { configureStore } from "@reduxjs/toolkit";
import questionnairReducer from "./questionnair";
import userDataReducer from "./userData";
export const store = configureStore({
  reducer: {
    questionnair: questionnairReducer,
    userData: userDataReducer,
  },
});
