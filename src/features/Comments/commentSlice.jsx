import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { commentEndpoints } from '../../api/endpoints';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await commentEndpoints.getComments(postId);
      return { postId, comments: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while fetching comments');
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await commentEndpoints.createComment(postId, { content, post: postId });
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while adding the comment');
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await commentEndpoints.updateComment(commentId, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while updating the comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await commentEndpoints.deleteComment(commentId);
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred while deleting the comment');
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        console.log("Received comments:", action.payload);
        state.status = 'succeeded';
        state.comments[action.payload.postId] = action.payload.comments;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        if (!state.comments[postId]) {
          state.comments[postId] = [];
        }
        state.comments[postId].unshift(comment);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const postId = updatedComment.post;
        const commentIndex = state.comments[postId].findIndex(comment => comment.id === updatedComment.id);
        if (commentIndex !== -1) {
          state.comments[postId][commentIndex] = updatedComment;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const deletedCommentId = action.payload;
        Object.keys(state.comments).forEach(postId => {
          state.comments[postId] = state.comments[postId].filter(comment => comment.id !== deletedCommentId);
        });
      });
  },
});

export default commentsSlice.reducer;