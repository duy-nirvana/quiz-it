import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import personalReducer from './personal/personalSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        personal: personalReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});
