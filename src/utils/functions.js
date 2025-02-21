import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import { readString } from 'react-native-csv';
import RNFS from 'react-native-fs';
import { setSavedMeals } from './store';


export const ParseCSV = (csvContent) => {
    try {
        // Parse CSV content
        const { data } = readString(csvContent, { header: false, skipEmptyLines: true });

        // Skip the header row
        const headers = data[0]; // Assuming the first row is the header
        const result = {};

        // Iterate over each row of data
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const foodName = row[2]; // Assuming the food name is in the third column (index 2)

            if (foodName) {
                // Create a JSON object for nutrients, using column indices
                const nutrients = {
                    'Caloric Value': row[3], // 4th column (index 3)
                    'Fat': row[4], // 5th column (index 4)
                    'Saturated Fats': row[5], // 6th column (index 5)
                    'Monounsaturated Fats': row[6], // 7th column (index 6)
                    'Polyunsaturated Fats': row[7], // 8th column (index 7)
                    'Carbohydrates': row[8], // 9th column (index 8)
                    'Sugars': row[9], // 10th column (index 9)
                    'Protein': row[10], // 11th column (index 10)
                    'Dietary Fiber': row[11], // 12th column (index 11)
                    'Cholesterol': row[12], // 13th column (index 12)
                    'Sodium': row[13], // 14th column (index 13)
                    'Water': row[14], // 15th column (index 14)
                    'Vitamin A': row[15], // 16th column (index 15)
                    'Vitamin B1': row[16], // 17th column (index 16)
                    'Vitamin B11': row[17], // 18th column (index 17)
                    'Vitamin B12': row[18], // 19th column (index 18)
                    'Vitamin B2': row[19], // 20th column (index 19)
                    'Vitamin B3': row[20], // 21st column (index 20)
                    'Vitamin B5': row[21], // 22nd column (index 21)
                    'Vitamin B6': row[22], // 23rd column (index 22)
                    'Vitamin C': row[23], // 24th column (index 23)
                    'Vitamin D': row[24], // 25th column (index 24)
                    'Vitamin E': row[25], // 26th column (index 25)
                    'Vitamin K': row[26], // 27th column (index 26)
                    'Calcium': row[27], // 28th column (index 27)
                    'Copper': row[28], // 29th column (index 28)
                    'Iron': row[29], // 30th column (index 29)
                    'Magnesium': row[30], // 31st column (index 30)
                    'Manganese': row[31], // 32nd column (index 31)
                    'Phosphorus': row[32], // 33rd column (index 32)
                    'Potassium': row[33], // 34th column (index 33)
                    'Selenium': row[34], // 35th column (index 34)
                    'Zinc': row[35], // 36th column (index 35)
                    'Nutrition Density': row[36], // 37th column (index 36)
                };

                // Add the food data to the result object
                result[foodName] = nutrients;
            }
        }

        return result;
    } catch (error) {
        console.error('Error parsing CSV:', error);
        return {};
    }
};

export const LoadCSV = async () => {
    try {
        const files = [
            'FOOD-DATA-GROUP1.csv',
            'FOOD-DATA-GROUP2.csv',
            'FOOD-DATA-GROUP3.csv',
            'FOOD-DATA-GROUP4.csv',
            'FOOD-DATA-GROUP5.csv',
        ];

        const allData = await Promise.all(
            files.map(async (fileName) => {
                const filePath = `${RNFS.MainBundlePath}/${fileName}`;
                const exists = await RNFS.exists(filePath);

                if (exists) {
                    const fileContents = await RNFS.readFile(filePath, 'utf8');
                    return ParseCSV(fileContents);
                } else {
                    console.error(`File does not exist: ${filePath}`);
                    return {};
                }
            })
        );

        // Combine data from all files
        const combined = allData.reduce((acc, data) => ({ ...acc, ...data }), {});

        return combined;
    } catch (err) {
        console.error('Error loading CSV files:', err);
    }
};

/**
 * Function to return size of screen width.
 *
 * Returns: Screen Width (Number)
 */
export const screenWidth = () => {
    return Dimensions.get('window').width;
};

/**
 * Function to return size of screen height.
 *
 * Returns: Screen Height (Number)
 */
export const screenHeight = () => {
    return Dimensions.get('window').height;
};

// Generate Meal Name (Based on Time & Count)
export const getMealPeriod = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'morning';
    if (hours < 17) return 'afternoon';
    if (hours < 21) return 'evening';
    return 'night';
};

export const getFormattedDate = () => {
    const today = new Date();
    return `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
};

export const generateMealName = (existingMeals) => {
    const period = getMealPeriod();
    const date = getFormattedDate();
    const filteredMeals = existingMeals.filter(meal => meal.name.includes(`${period}-meal-${date}`));

    let mealNumber = filteredMeals.length + 1;
    let suffix = mealNumber === 1 ? '' : `${mealNumber}th-`;
    if (mealNumber === 2) suffix = '2nd-';
    if (mealNumber === 3) suffix = '3rd-';

    return `${suffix}${period}-meal-${date}`;
};