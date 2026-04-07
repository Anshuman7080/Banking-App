// store/overviewSlice.js
import { createSlice } from "@reduxjs/toolkit";

const overviewSlice = createSlice({
  name: "overview",
  initialState: { data: null },
  reducers: {
    setOverview: (state, action) => { state.data = action.payload; },
    clearOverview: (state) => { state.data = null; },
  },
});

export const { setOverview, clearOverview } = overviewSlice.actions;
export default overviewSlice.reducer;