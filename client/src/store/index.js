import { configureStore } from "@reduxjs/toolkit";
import MinimizeReducer from "../features/Sidebar.js"

const store = configureStore({
  reducer: {
    MinimizeState: MinimizeReducer,
  },
});

export default store;