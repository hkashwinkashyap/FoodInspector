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

        // Remove Food from Meal (Updates Nutrition)
        removeFromMeal(state, action) {
            console.log('Removing from meal:', action.payload);

            const itemName = action.payload; // Extract item name
            const itemIndex = state.items.findIndex((item) => item.itemName === itemName);

            if (itemIndex === -1) {
                console.warn(`Item ${itemName} not found in meal.`);
                return;
            }

            // Get the first matching item to remove
            const itemToRemove = state.items[itemIndex];

            // Subtract its nutrients from totalNutrition
            Object.keys(itemToRemove.nutrients).forEach((key) => {
                if (typeof itemToRemove.nutrients[key] === 'number' && !isNaN(itemToRemove.nutrients[key])) {
                    state.totalNutrition[key] = parseFloat(Math.max((state.totalNutrition[key] || 0) - itemToRemove.nutrients[key], 0).toFixed(2));
                }
            });

            // Remove only ONE instance of the item
            state.items.splice(itemIndex, 1);

            console.log('Updated Items:', state.items);
            console.log('Updated Total Nutrition:', state.totalNutrition);
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
