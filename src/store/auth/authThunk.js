import { createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from 'api';

export const fetchLogin = createAsyncThunk(
    'auth/fetchLogin',
    async (payload, thunkAPI) => {
        try {
            const { data } = await authApi.login(payload);
            return data;
        } catch (error) {
            thunkAPI.rejectWithValue(error);
        }
    }
);

export const fetchGoogleLogin = createAsyncThunk(
    'auth/fetchGoogleLogin',
    async (payload, thunkAPI) => {
        try {
            const { data } = await authApi.googleLogin(payload);
            return data;
        } catch (error) {
            thunkAPI.rejectWithValue(error);
        }
    }
);
