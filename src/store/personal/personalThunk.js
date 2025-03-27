import { createAsyncThunk } from '@reduxjs/toolkit';
import { personalApi } from 'api/personalApi';

export const fetchPersonal = createAsyncThunk(
    'personal',
    async (payload, thunkAPI) => {
        try {
            const { data } = await personalApi.personal(payload || {});
            return data;
        } catch (error) {
            thunkAPI.rejectWithValue(error);
        }
    }
);
