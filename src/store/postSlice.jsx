import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postEndpoints } from '../api/endpoints';

// Async thunks for various post-related actions
export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async (_, { rejectWithValue }) => {
      try {
        const response = await postEndpoints.getPosts();
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || 'An error occurred while fetching posts');
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
  async (id, { rejectWithValue }) => {
    try {
      const response = await postEndpoints.disapprovePost(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while disapproving the post');
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  'posts/fetchUserPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postEndpoints.getUserPosts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while fetching user posts');
    }
  }
);

// Initial state for the posts slice
const initialState = {
  posts: [],
  status: 'idle',
  error: null,
};

// Slice for handling posts actions and reducers
const postSlice = createSlice({
    name: 'posts',
    initialState: {
      posts: [],  // Ensure posts are initialized to an empty array
      status: 'idle',
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchPosts.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.posts = action.payload;
        })
        .addCase(fetchPosts.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        })
      // Fetch posts by the current user
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.status = 'succeeded';
      })

      // Create a new post
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })

      // Update a post
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })

      // Delete a post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.id !== action.payload);
      })

      // Approve a post
      .addCase(approvePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })

      // Disapprove a post
      .addCase(disapprovePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      });
  },
});

export default postSlice.reducer;
