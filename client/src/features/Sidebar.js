import { createSlice } from "@reduxjs/toolkit";

const MinimizeSlice = createSlice({
  name: 'MinimizeState',
  initialState: false,
  reducers: {
    toggleBoolean: (state) => !state,
    setBoolean: (state, action) => action.payload,
  },
});

export const { toggleBoolean, setBoolean } = MinimizeSlice.actions;
export default MinimizeSlice.reducer;