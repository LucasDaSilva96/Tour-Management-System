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

    setCurrentSelectedBooking(state, action) {
      state.currentSelectedBooking = { ...action.payload };
    },
    setAllBookings(state, action) {
      const obj = action.payload.map((el) => {
        el.start = new Date(el.start).toISOString();
        el.end = new Date(el.end).toISOString();
        return el;
      });

      state.allBookings = obj;
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
