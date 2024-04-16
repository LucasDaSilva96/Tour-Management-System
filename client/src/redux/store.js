import { configureStore } from "@reduxjs/toolkit";
import IsLoadingReducer from "./loadingSlice";
import ErrorReducer from "./errorSlice";
import UserReducer from "./userSlice";
import BookingReducer from "./bookingSlice";
import GuideReducer from "./guideSlice";

const store = configureStore({
  reducer: {
    loadingState: IsLoadingReducer,
    errorState: ErrorReducer,
    currentUser: UserReducer,
    bookingState: BookingReducer,
    guideState: GuideReducer,
  },
});

export default store;
