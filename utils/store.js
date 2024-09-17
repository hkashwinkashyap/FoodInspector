import { configureStore, createSlice } from '@reduxjs/toolkit';

// Define a slice for Macros state
const macrosDataSlice = createSlice({
    name: 'macrosData',
    initialState: {
        nutrients: {},
    },
    reducers: {
        setMacrosData(state, action) {
            state.nutrients = action.payload;
        },
        clearMacrosData(state, action) {
            state.nutrients = {};
        },
    },
});

export const { setMacrosData, clearMacrosData } = macrosDataSlice.actions;
export const macrosDataReducer = macrosDataSlice.reducer;

// Configure the Redux store
const store = configureStore({
    reducer: {
        macrosData: macrosDataReducer,
    },
});

export default store;
