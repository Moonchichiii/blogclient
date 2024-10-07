import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/Accounts/authSlice';
import userReducer from '../features/Profile/hooks/profileSlice';
import postReducer from '../features/Posts/postSlice';
import commentReducer from '../features/Comments/commentSlice';
import ratingReducer from '../features/Ratings/ratingsSlice';
import tagReducer from '../features/Tags/tagsSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);


export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: userReducer,
    posts: postReducer,
    comments: commentReducer,
    ratings: ratingReducer,
    tags: tagReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);
