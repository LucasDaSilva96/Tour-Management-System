import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  errorFound: false,
  errorMessage: "",
};

const errorSlice = createSlice({
  name: "errorState",
  initialState,
  reducers: {
    setError(state, action) {
      state.errorFound = true;
      state.errorMessage = action.payload.message;
    },
    resetError(state) {
      state.errorFound = false;
      state.errorMessage = "";
    },
  },
});

export const { setError, resetError } = errorSlice.actions;

export const getErrorState = (state) => state.errorState.errorFound;
export const getErrorMessage = (state) => state.errorState.errorMessage;

export default errorSlice.reducer;
