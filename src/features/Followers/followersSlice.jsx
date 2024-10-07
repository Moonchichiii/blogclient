import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { followerEndpoints } from '../../api/endpoints';

export const followUser = createAsyncThunk(
    'followers/followUser',
    async (followedId, { rejectWithValue }) => {
        try {
            const response = await followerEndpoints.followUser(followedId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to follow user');
        }
    }
);

export const unfollowUser = createAsyncThunk(
    'followers/unfollowUser',
    async (followedId, { rejectWithValue }) => {
        try {
            const response = await followerEndpoints.unfollowUser(followedId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to unfollow user');
        }
    }
);

const followerSlice = createSlice({
    name: 'followers',
    initialState: { /* initial state */ },
    reducers: { /* reducers */ },
    extraReducers: (builder) => {
        builder
            .addCase(followUser.fulfilled, (state, action) => {
                // handle followUser success
            })
            .addCase(followUser.rejected, (state, action) => {
                // handle followUser failure
            })
            .addCase(unfollowUser.fulfilled, (state, action) => {
                // handle unfollowUser success
            })
            .addCase(unfollowUser.rejected, (state, action) => {
                // handle unfollowUser failure
            });
    },
});

export default followerSlice.reducer;
