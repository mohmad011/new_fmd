import { createSlice } from "@reduxjs/toolkit";

export const mainMap = createSlice({
  name: "mainMap",
  initialState: {
    myMap: null,
  },
  reducers: {
    setMap: (state, action) => {
      state.myMap = null;
      state.myMap = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setMap } = mainMap.actions;

export default mainMap.reducer;
