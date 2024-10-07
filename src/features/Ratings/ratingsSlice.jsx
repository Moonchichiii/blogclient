import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ratingEndpoints } from '../../api/endpoints';

export const ratePost = createAsyncThunk(
  'ratings/ratePost',
  async ({ postId, value }, { rejectWithValue }) => {
    try {
      const response = await ratingEndpoints.ratePost(postId, value);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while rating the post');
    }
  }
);

const ratingsSlice = createSlice({
  name: 'ratings',
  initialState: {
    ratings: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ratePost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(ratePost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ratings[action.payload.post] = action.payload.value;
      })
      .addCase(ratePost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default ratingsSlice.reducer;