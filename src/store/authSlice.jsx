import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { authEndpoints } from '../api/endpoints';

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Logging out user...');
      await authEndpoints.logout();
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      console.log('User logged out successfully.');
    } catch (error) {
      console.error('Logout failed:', error);
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'auth/deleteAccount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authEndpoints.deleteAccount();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to delete account.');
    }
  }
);

export const setupTwoFactor = createAsyncThunk(
  'auth/setupTwoFactor',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authEndpoints.setupTwoFactor();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to set up 2FA.');
    }
  }
);

export const updateEmail = createAsyncThunk(
  'auth/updateEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authEndpoints.updateEmail({ email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to update email.');
    }
  }
);



const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!Cookies.get('access_token'),
    loading: false,
    error: null,
    accessToken: Cookies.get('access_token'),
    refreshToken: Cookies.get('refresh_token'),
  },
  reducers: {
    loginStart: (state) => {
      console.log('Login started...');
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      console.log('Login successful.');
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    loginFailure: (state, action) => {
      console.error('Login failed:', action.payload);
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      console.log('Clearing error...');
      state.error = null;
    },
    refreshTokenSuccess: (state, action) => {
      console.log('Refreshing access token...');
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    logoutSuccess: (state) => {
      console.log('Logout successful.');
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.pending, (state) => {
        console.log('Logging out user...');
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        console.log('User logged out successfully.');
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        console.error('Logout failed:', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  clearError,
  refreshTokenSuccess,
  logoutSuccess
} = authSlice.actions;

export { logoutUser as logout };
export default authSlice.reducer;