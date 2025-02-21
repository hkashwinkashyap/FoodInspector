import { configureStore, createSlice } from '@reduxjs/toolkit';
import { generateMealName } from './functions';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Meal Slice - Handles Meals & Nutritional Calculations
const mealSlice = createSlice({
    name: 'meal',
    initialState: {
        items: [], // Added food items
        totalNutrition: {}, // Aggregated nutrient values
        savedMeals: [], // Stored meals from AsyncStorage
    },
    reducers: {
        // Add Food to Meal (Updates Nutrition)
        addToMeal(state, action) {
            const { itemName, nutrients } = action.payload; // Extract item & nutrients

            // Convert nutrients' string values to numbers and round to 2 decimal places
            const parsedNutrients = {};
            Object.keys(nutrients).forEach((key) => {
                if (!isNaN(nutrients[key])) {
                    parsedNutrients[key] = parseFloat(nutrients[key]).toFixed(2);
                    parsedNutrients[key] = parseFloat(parsedNutrients[key]); // Convert back to number
                } else {
                    parsedNutrients[key] = nutrients[key];
                }
            });

            // Add item to the meal list
            state.items.push({ itemName: itemName, nutrients: parsedNutrients });

            // Update total nutrition dynamically
            Object.keys(parsedNutrients).forEach((key) => {
                if (typeof parsedNutrients[key] === 'number' && !isNaN(parsedNutrients[key])) {
                    state.totalNutrition[key] = parseFloat(((state.totalNutrition[key] || 0) + parsedNutrients[key]).toFixed(2));
                }
            });

            console.log('Items:', state.items);
            console.log('Total Nutrition:', state.totalNutrition);
        },

        // Remove Food from Meal
        removeFromMeal(state, action) {
            const { item, nutrients } = action.payload; // Extract item & nutrients

            // Convert nutrients' string values to numbers
            const parsedNutrients = {};
            Object.keys(nutrients).forEach((key) => {
                parsedNutrients[key] = isNaN(nutrients[key]) ? nutrients[key] : parseFloat(nutrients[key]);
            });

            // Subtract nutrition for the removed item
            Object.keys(parsedNutrients).forEach((key) => {
                if (typeof parsedNutrients[key] === 'number' && !isNaN(parsedNutrients[key])) {
                    state.totalNutrition[key] = Math.max((state.totalNutrition[key] || 0) - parsedNutrients[key], 0);
                }
            });

            // Remove the item from the meal
            state.items = state.items.filter(existingItem => existingItem.food !== item.food);
        },


        // Clear Current Meal
        clearMeal(state) {
            state.items = [];
            state.totalNutrition = {};
        },

        // Load Meals from AsyncStorage
        setSavedMeals(state, action) {
            state.savedMeals = action.payload;
        },

        // Add New Meal to Redux (after creation)
        addNewMeal(state, action) {
            state.savedMeals.push(action.payload);
        },
    },
});

export const { addToMeal, removeFromMeal, clearMeal, setSavedMeals, addNewMeal } = mealSlice.actions;
export const mealReducer = mealSlice.reducer;

export const createMeal = () => async (dispatch, getState) => {
    const { meal } = getState();

    // Get existing meals from AsyncStorage
    const storedMeals = await AsyncStorage.getItem('meals');
    const meals = storedMeals ? JSON.parse(storedMeals) : [];

    // Generate unique meal name
    const mealName = generateMealName(meals);

    // Create new meal object with timestamp
    const newMeal = {
        name: mealName,
        items: meal.items,
        totalNutrition: meal.totalNutrition,
        timestamp: new Date().toISOString() // Add timestamp
    };

    const updatedMeals = [...meals, newMeal];

    // Save updated meals to AsyncStorage
    await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));

    // Update Redux state
    dispatch(setSavedMeals(updatedMeals));  // Update saved meals in Redux
    dispatch(clearMeal()); // Clear current meal
};

// Function to load meals from AsyncStorage on app startup
export const loadSavedMeals = () => async (dispatch) => {
    const storedMeals = await AsyncStorage.getItem('meals');
    const meals = storedMeals ? JSON.parse(storedMeals) : [];

    dispatch(setSavedMeals(meals)); // Update Redux state
};

const navigationSlice = createSlice({
    name: "navigation",
    initialState: {
        lastTab: "Home", // Default to Home
    },
    reducers: {
        setLastTab: (state, action) => {
            state.lastTab = action.payload;
        },
    },
});

export const { setLastTab } = navigationSlice.actions;
export const navigationReducer = navigationSlice.reducer;

// Configure Redux Store
const store = configureStore({
    reducer: {
        macrosData: macrosDataReducer,
        colourTheme: colourThemeReducer,
        meal: mealReducer,
        navigation: navigationReducer
    },
});

export default store;
