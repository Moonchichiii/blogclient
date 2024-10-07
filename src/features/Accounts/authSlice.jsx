import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { authEndpoints } from '../../api/endpoints';

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
    accessToken: Cookies.get('access_token'),
    refreshToken: Cookies.get('refresh_token'),
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    refreshTokenSuccess: (state, action) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
    },
  },
});

export const { loginStart, loginSuccess, refreshTokenSuccess, logoutSuccess } = authSlice.actions;
export default authSlice.reducer;
