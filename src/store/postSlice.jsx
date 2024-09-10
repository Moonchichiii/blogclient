import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api/apiConfig';


export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await api.get('/api/posts/');
  return response.data;
});

export const createPost = createAsyncThunk('posts/createPost', async (postData) => {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    if (postData.image) {
      formData.append('image', postData.image);
    }
  
    const response = await api.post('/api/posts/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  });

export const updatePost = createAsyncThunk('posts/updatePost', async ({ id, postData }) => {
  const response = await api.put(`/api/posts/${id}/`, postData);
  return response.data;
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id) => {
  await api.delete(`/api/posts/${id}/`);
  return id;
});

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
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
        state.error = action.error.message;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(post => post.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post.id !== action.payload);
      });
  }
});

export default postSlice.reducer;