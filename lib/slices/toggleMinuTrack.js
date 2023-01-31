import { createSlice } from "@reduxjs/toolkit";

export const ToggleMinuTrack = createSlice({
  name: "ToggleMinuTrack",
  initialState: {
    value: false,
  },
  reducers: {
    toggle: (state) => {
      state.value = !state.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggle } = ToggleMinuTrack.actions;

export default ToggleMinuTrack.reducer;
