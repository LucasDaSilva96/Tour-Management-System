import { createSlice } from "@reduxjs/toolkit";
import { forgetMe, getMe } from "../utils/rememberMe";

const initialState = getMe() || {
  email: "",
  name: "",
  photo: "",
  role: "",
  _id: "",
  token: "",
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "userState",
  initialState,
  reducers: {
    login(state, action) {
      const obj = { ...action.payload, isLoggedIn: true };
      Object.assign(state, obj);
    },
    logOut(state) {
      state = { ...initialState };
      forgetMe();
    },
  },
});

export const { login, logOut } = userSlice.actions;

export const isLoggedIn = (state) => state.currentUser.isLoggedIn;
export const getCurrentUser = (state) => state.currentUser;
export default userSlice.reducer;
