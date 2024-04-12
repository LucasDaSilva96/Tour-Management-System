import { configureStore } from "@reduxjs/toolkit";
import IsLoadingReducer from "./loadingSlice";
import ErrorReducer from "./errorSlice";
import UserReducer from "./userSlice";
import BookingReducer from "./bookingSlice";

const store = configureStore({
  reducer: {
    loadingState: IsLoadingReducer,
    errorState: ErrorReducer,
    currentUser: UserReducer,
    bookingState: BookingReducer,
  },
});

export default store;
