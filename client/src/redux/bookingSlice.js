import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openReservationModal: false,
  openNewReservationModal: false,
  currentSelectedBooking: {},
  currentSelectedBookingModified: false,
  allBookings: [],
};

const bookingSlice = createSlice({
  name: "bookingSlice",
  initialState,
  reducers: {
    toggleReservationModal(state) {
      state.openReservationModal = !state.openReservationModal;
      if (state.openReservationModal === false) {
        state.currentSelectedBookingModified = false;
      }
    },

    toggleNewReservationModal(state) {
      state.openNewReservationModal = !state.openNewReservationModal;
    },

    setCurrentSelectedBooking(state, action) {
      state.currentSelectedBooking = { ...action.payload };
    },
    setAllBookings(state, action) {
      action.payload.forEach((booking) => {
        booking = {
          ...booking,
          start: new Date(booking.start).toISOString(),
          end: new Date(booking.end).toISOString(),
        };
      });

      state.allBookings = action.payload;
    },
    setCurrentSelectedBookingModified(state, action) {
      state.currentSelectedBookingModified = action.payload;
    },
  },
});

export const {
  toggleReservationModal,
  setCurrentSelectedBooking,
  setAllBookings,
  setCurrentSelectedBookingModified,
  toggleNewReservationModal,
} = bookingSlice.actions;

export const getReservationModalStatus = (state) =>
  state.bookingState.openReservationModal;

export const getNewReservationModalStatus = (state) =>
  state.bookingState.openNewReservationModal;

export const getCurrentSelectedBooking = (state) =>
  state.bookingState.currentSelectedBooking;

export const getAllBookings = (state) => state.bookingState.allBookings;
export const getCurrentSelectedBookingModified = (state) =>
  state.bookingState.currentSelectedBookingModified;

export default bookingSlice.reducer;
