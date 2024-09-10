import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userEndpoints } from '../api/endpoints';

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching current user...');
      const response = await userEndpoints.getCurrentUser();
      console.log('Fetch current user response:', response);
      return response.data;
    } catch (error) {
      console.log('Fetch current user error:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('Updating user profile...');
      const response = await userEndpoints.updateProfile(userData);
      console.log('Update user profile response:', response);
      return response.data;
    } catch (error) {
      console.log('Update user profile error:', error);
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      console.log('Setting user:', action.payload);
      state.user = action.payload;
    },
    clearUser: (state) => {
      console.log('Clearing user...');
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        console.log('Fetching current user pending...');
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        console.log('Fetch current user fulfilled:', action.payload);
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        console.log('Fetch current user rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserProfile.pending, (state) => {
        console.log('Updating user profile pending...');
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        console.log('Update user profile fulfilled:', action.payload);
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        console.log('Update user profile rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;