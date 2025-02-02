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
            const { item, nutrients } = action.payload; // Extract item & nutrients

            // Convert nutrients' string values to numbers
            const parsedNutrients = {};
            Object.keys(nutrients).forEach((key) => {
                parsedNutrients[key] = isNaN(nutrients[key]) ? nutrients[key] : parseFloat(nutrients[key]);
            });

            // Add item to the meal list
            state.items.push({ item: item, nutrients: parsedNutrients });

            // Update total nutrition dynamically
            Object.keys(parsedNutrients).forEach((key) => {
                if (typeof parsedNutrients[key] === 'number' && !isNaN(parsedNutrients[key])) {
                    state.totalNutrition[key] = (state.totalNutrition[key] || 0) + parsedNutrients[key];
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

// Async Function to Save Meals
export const createMeal = () => async (dispatch, getState) => {
    const { meal } = getState();

    // Get existing meals
    const storedMeals = await AsyncStorage.getItem('meals');
    const meals = storedMeals ? JSON.parse(storedMeals) : [];

    // Generate unique meal name
    const mealName = generateMealName(meals);

    // Create meal object
    const newMeal = { name: mealName, items: meal.items, totalNutrition: meal.totalNutrition };
    const updatedMeals = [...meals, newMeal];

    // Save meal to AsyncStorage
    await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));

    // Clear Redux meal state
    dispatch(clearMeal());
};

// Configure Redux Store
const store = configureStore({
    reducer: {
        macrosData: macrosDataReducer,
        colourTheme: colourThemeReducer,
        meal: mealReducer,
    },
});

export default store;
