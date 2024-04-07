import { configureStore } from "@reduxjs/toolkit";
import IsLoadingReducer from "./loadingSlice";
import ErrorReducer from "./errorSlice";
import UserReducer from "./userSlice";

const store = configureStore({
  reducer: {
    loadingState: IsLoadingReducer,
    errorState: ErrorReducer,
    currentUser: UserReducer,
  },
});

export default store;
