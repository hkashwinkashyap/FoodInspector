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

const colourThemeSlice = createSlice({
    name: 'colourTheme',
    initialState: {
        currentTheme: {},
    },
    reducers: {
        setColourTheme(state, action) {
            state.currentTheme = action.payload;
        },
        clearColourTheme(state, action) {
            state.currentTheme = {};
        },
    },
});

export const { setColourTheme, clearColourTheme } = colourThemeSlice.actions;
export const colourThemeReducer = colourThemeSlice.reducer;

// Configure the Redux store
const store = configureStore({
    reducer: {
        macrosData: macrosDataReducer,
        colourTheme: colourThemeReducer,
    },
});

export default store;
