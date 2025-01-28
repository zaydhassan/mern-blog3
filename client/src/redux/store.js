import { createSlice, configureStore, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  isLogin: localStorage.getItem('isLogin') === 'true',
  user: (() => {
    try {
      const storedUser = localStorage.getItem('user');
      console.log("Loaded user from localStorage (before parsing):", storedUser);

      return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null; 
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  })(),
};

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/user/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update user.');
      }

      console.log("Updated user from backend:", data.user); 
      return data.user;
    } catch (error) {
      console.error('Update error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      console.log("User received on login:", action.payload); 

      if (!action.payload || !action.payload._id) {
        console.error("Login failed: User data is invalid", action.payload);
        return;
      }

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
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        console.log("Redux state updated with:", action.payload);
        state.user = action.payload;
        if (action.payload) {
          localStorage.setItem('user', JSON.stringify(action.payload));
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        console.error('Failed to update user:', action.payload);
      });
  }
});

export const authActions = authSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer, 
  },
});
