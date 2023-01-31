import { createSlice } from "@reduxjs/toolkit";
import { encryptName } from "helpers/encryptions";

const storage = (state) => {
  localStorage.setItem(encryptName("config"), JSON.stringify(state));
};

export const ConfigSlice = createSlice({
  name: "config",
  initialState: {
    darkMode: false,
    language: "en",
  },
  reducers: {
    darkMode: (state) => {
      state.darkMode = !state.darkMode;
      storage(state);
    },
    setConfig: (state, action) => {
      Object.assign(state, action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { darkMode, setConfig } = ConfigSlice.actions;

export default ConfigSlice.reducer;
