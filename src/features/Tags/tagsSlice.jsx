import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tagEndpoints } from '../../api/endpoints';

export const createTag = createAsyncThunk(
  'tags/createTag',
  async ({ contentType, objectId, taggedUserId }, { rejectWithValue }) => {
    try {
      const response = await tagEndpoints.createTag(contentType, objectId, taggedUserId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while creating the tag');
    }
  }
);

const tagsSlice = createSlice({
  name: 'tags',
  initialState: {
    tags: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTag.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { content_type, object_id } = action.payload;
        if (!state.tags[content_type]) {
          state.tags[content_type] = {};
        }
        if (!state.tags[content_type][object_id]) {
          state.tags[content_type][object_id] = [];
        }
        state.tags[content_type][object_id].push(action.payload);
      })
      .addCase(createTag.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default tagsSlice.reducer;