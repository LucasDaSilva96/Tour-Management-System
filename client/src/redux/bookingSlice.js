import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openReservationModal: false,
  currentSelectedBooking: {},
  allBookings: [],
};

const bookingSlice = createSlice({
  name: "bookingSlice",
  initialState,
  reducers: {
    toggleReservationModal(state) {
      state.openReservationModal = !state.openReservationModal;
    },
    // TODO Loop through the action.payload and change the start and end date to ISO 8601 format
    setCurrentSelectedBooking(state, action) {
      state.currentSelectedBooking = { ...action.payload };
    },
    setAllBookings(state, action) {
      state.allBookings = action.payload;
    },
  },
});

export const {
  toggleReservationModal,
  setCurrentSelectedBooking,
  setAllBookings,
} = bookingSlice.actions;

export const getReservationModalStatus = (state) =>
  state.bookingState.openReservationModal;

export const getCurrentSelectedBooking = (state) =>
  state.bookingState.currentSelectedBooking;

export const getAllBookings = (state) => state.bookingState.allBookings;

export default bookingSlice.reducer;
