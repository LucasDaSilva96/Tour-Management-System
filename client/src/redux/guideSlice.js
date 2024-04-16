import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allGuides: [],
  selectedGuide: {},
};

const guideSlice = createSlice({
  name: "guides",
  initialState,
  reducers: {
    setAllGuides(state, action) {
      state.allGuides = action.payload;
    },

    setSelectedGuide(state, action) {
      state.selectedGuide = action.payload;
    },
  },
});

export const { setAllGuides, setSelectedGuide } = guideSlice.actions;

export const getAllGuides = (state) => state.guideState.allGuides;
export const getSelectedGuide = (state) => state.guideState.selectedGuide;

export default guideSlice.reducer;
