import { createSlice } from "@reduxjs/toolkit";
const userDataSlice = createSlice({
  name: "userState",
  initialState: {
    language: "",
    name: "",
    verifiermail: "",
    area: "",
  },
  reducers: {
    setLanguage: (state, action) => {
      if (action.payload.language) {
        state.language = action.payload.language;
      }
    },
    setUserData: (state, action) => {
      if (action.payload.userObject) {
        state.name = action.payload.userObject.name;
        state.verifiermail = action.payload.userObject.verifiermail;
      }
    },
    setAreaName: (state, action) => {
      if (action.payload.areaName) {
        state.area = action.payload.areaName;
      }
    },
  },
});

export const setLanguage = userDataSlice.actions.setLanguage;
export const setUserData = userDataSlice.actions.setUserData;
export const setAreaName = userDataSlice.actions.setAreaName;

export default userDataSlice.reducer;
