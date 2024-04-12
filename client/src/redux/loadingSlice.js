import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

const isLoadingSlice = createSlice({
  name: "isLoadingState",
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = true;
    },
    notLoading(state, action) {
      state.isLoading = false;
    },
  },
});

export const { setIsLoading, notLoading } = isLoadingSlice.actions;

export const getLoadingState = (state) => state.loadingState.isLoading;

export default isLoadingSlice.reducer;
