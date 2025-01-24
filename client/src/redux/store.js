import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = {
  isLogin: localStorage.getItem('isLogin') === 'true' ? true : false
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login(state) {
      state.isLogin = true;
      localStorage.setItem('isLogin', 'true');
    },
    logout(state) {
      state.isLogin = false;
      localStorage.removeItem('isLogin');
    },
  },
});

export const authActions = authSlice.actions;

export const store = configureStore({
  reducer: authSlice.reducer,
});
