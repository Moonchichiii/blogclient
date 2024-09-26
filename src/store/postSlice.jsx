import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postEndpoints } from '../api/endpoints';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await postEndpoints.getPosts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while fetching posts');
    }
  }
);

export const fetchPost = createAsyncThunk(
  'posts/fetchPost',
  async (id, { rejectWithValue }) => {
    try {
      const response = await postEndpoints.fetchPost(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while fetching the post');
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async (params, { rejectWithValue }) => {
    try {
      const response = await postEndpoints.getUserPosts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while fetching user posts');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postEndpoints.createPost(postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while creating the post');
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const response = await postEndpoints.updatePost(id, postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while updating the post');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id, { rejectWithValue }) => {
    try {
      await postEndpoints.deletePost(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while deleting the post');
    }
  }
);

export const approvePost = createAsyncThunk(
  'posts/approvePost',
  async (id, { rejectWithValue }) => {
    try {
      const response = await postEndpoints.approvePost(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while approving the post');
    }
  }
);

export const disapprovePost = createAsyncThunk(
  'posts/disapprovePost',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await postEndpoints.disapprovePost(id, reason);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while disapproving the post');
    }
  }
);

const initialState = {
  posts: [],
  currentPost: null, 
  totalCount: 0,
  nextUrl: null,
  prevUrl: null,
  status: 'idle',
  error: null,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = action.payload.results;
        state.totalCount = action.payload.count;
        state.nextUrl = action.payload.next;
        state.prevUrl = action.payload.previous;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch posts';
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.posts = Array.isArray(action.payload.results) ? action.payload.results : [];
        state.totalCount = action.payload.count || 0;
        state.nextUrl = action.payload.next || null;
        state.prevUrl = action.payload.previous || null;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch user posts';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.totalCount += 1;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.id !== action.payload);
        state.totalCount -= 1;
      })
      .addCase(approvePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(disapprovePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(fetchPost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPost = action.payload;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;