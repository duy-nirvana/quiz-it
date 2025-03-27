import { createSlice } from '@reduxjs/toolkit';
import { fetchGoogleLogin, fetchLogin, fetchLoginGoogle } from './authThunk';
import { deleteCookie, getCookie, setCookie } from 'utils';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loadingLogin: 'idle',
        access_token: getCookie('access_token') || null,
    },
    reducers: {
        clearAuthData: (state) => {
            state.access_token = null;
            deleteCookie('access_token');
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLogin.pending, (state, action) => {
                state.loadingLogin = 'loading';
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                const { access_token } = action.payload;
                state.loadingLogin = 'idle';
                state.access_token = access_token;

                setCookie('access_token', access_token, { path: '/' });
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                state.loadingLogin = 'idle';
            });
        builder
            .addCase(fetchGoogleLogin.pending, (state, action) => {
                state.loadingLogin = 'loading';
            })
            .addCase(fetchGoogleLogin.fulfilled, (state, action) => {
                const { access_token } = action.payload;
                state.loadingLogin = 'idle';
                state.access_token = access_token;

                setCookie('access_token', access_token, { path: '/' });
            })
            .addCase(fetchGoogleLogin.rejected, (state, action) => {
                state.loadingLogin = 'idle';
            });
    },
});

const { actions, reducer } = authSlice;

export const { clearAuthData } = actions;

export default reducer;
