import { configureStore } from "@reduxjs/toolkit";
import IsLoadingReducer from "./loadingSlice";
import UserReducer from "./userSlice";
import BookingReducer from "./bookingSlice";
import GuideReducer from "./guideSlice";

const store = configureStore({
  reducer: {
    loadingState: IsLoadingReducer,
    currentUser: UserReducer,
    bookingState: BookingReducer,
    guideState: GuideReducer,
  },
});

export default store;
