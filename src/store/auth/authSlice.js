import { createSlice } from '@reduxjs/toolkit';
import { fetchLogin } from './authThunk';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loadingLogin: 'idle',
        access_token: localStorage.getItem('access_token') || null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLogin.pending, (state, action) => {
                state.loadingLogin = 'loading';
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                const { access_token } = action.payload;
                state.loadingLogin = 'idle';
                state.access_token = access_token;

                localStorage.setItem('access_token', access_token);
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                state.loadingLogin = 'idle';
            });
    },
});

const { action, reducer } = authSlice;

export default reducer;
