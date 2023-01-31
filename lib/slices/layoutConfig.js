import { createSlice } from "@reduxjs/toolkit";

export const LayoutConfigSlice = createSlice({
  name: "layout-config",
  initialState: {
    sidebar: true,
    header: false
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebar = !state.sidebar;
    },
    sidebarMini: (state) => {
      state.sidebar = true;
    },
    toggleHead: (state) => {
      state.header = !state.header;
    },
  },
});

// Action creators are generated for each case reducer function
export const { toggleSidebar, sidebarMini, toggleHead } = LayoutConfigSlice.actions;

export default LayoutConfigSlice.reducer;
