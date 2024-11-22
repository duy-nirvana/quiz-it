import { createSlice } from '@reduxjs/toolkit';
import { fetchPersonal } from './personalThunk';

const personalSlice = createSlice({
    name: 'personal',
    initialState: {
        loadingPersonal: 'idle',
        profile: null,
    },
    reducers: {
        clearPersonalData: (state) => {
            state.profile = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPersonal.pending, (state, action) => {
                state.loadingPersonal = 'loading';
            })
            .addCase(fetchPersonal.fulfilled, (state, action) => {
                state.loadingPersonal = 'idle';
                state.profile = action.payload;
            })
            .addCase(fetchPersonal.rejected, (state, action) => {
                state.loadingPersonal = 'idle';
            });
    },
});

const { actions, reducer } = personalSlice;

export const { clearPersonalData } = actions;

export default reducer;
