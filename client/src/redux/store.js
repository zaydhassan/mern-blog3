import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = {
  isLogin: localStorage.getItem('isLogin') === 'true', // Handle boolean conversion properly
  user: (() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null; // Parse JSON only if data exists
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null; 
    }
  })(),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    login(state, action) {
      state.isLogin = true;
      state.user = action.payload; 
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout(state) {
      state.isLogin = false;
      state.user = null;
      localStorage.removeItem('isLogin');
      localStorage.removeItem('user');
    },
  },
});

export const authActions = authSlice.actions;

export const store = configureStore({
  reducer: authSlice.reducer,
});
