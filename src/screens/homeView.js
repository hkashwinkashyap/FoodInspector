import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { screenHeight } from '../utils/functions';
import moment from 'moment';
import { DEFAULT_PROPS } from '../utils/constants';
import MealBasket from '../components/mealBasket';
import NutrientsCards from '../components/nutrientsCards';

import { NativeModules } from 'react-native';
const { EmbeddedLlmModule } = NativeModules;

const HomeView = () => {
    const currentTheme = useSelector(state => state.colourTheme.currentTheme);
    const savedMeals = useSelector(state => state.meal.savedMeals);
    const [greeting, setGreeting] = useState('');

    async function getLlmResponse(prompt) {
        try {
            const response = await EmbeddedLlmModule.processText(prompt);
            console.log('TRACE: Response -', response)
        } catch (error) {
            console.error("ERR: LLM Error:", error);
            return "Error generating response";
        }
    }


    useEffect(() => {
        setGreeting(getGreeting());

        getLlmResponse('Give me nutrition information for 100 g of tangerine in the format of `Calories: kcal, Protein: g, Carbohydrates: g, Fat: g, Vitamin A: µg, Vitamin B12: µg, Vitamin D: µg, Iron: mg, Calcium: mg, Vitamin B1: mg, Vitamin B2: mg, Vitamin B3: mg, Vitamin B5: mg, Vitamin B6: mg, Vitamin C: mg, Vitamin E: mg, Vitamin K: µg, Copper: mg, Magnesium: mg, Potassium: mg, Cholesterol: mg`');
    }, []);

    const getGreeting = () => {
        const hour = moment().hour();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const totalNutrition = savedMeals.reduce((acc, meal) => {
        Object.keys(meal.totalNutrition).forEach(key => {
            acc[key] = parseFloat(((acc[key] || 0) + meal.totalNutrition[key]).toFixed(2));
        });
        return acc;
    }, {});

    return (
        <SafeAreaView style={[styles.safeArea,
        { backgroundColor: currentTheme === 'dark' ? '#121212' : '#F9F9F9' }]}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.greeting,
                    { color: currentTheme === 'dark' ? 'white' : 'black' }]}>
                        {greeting}! 👋
                    </Text>
                    <Text style={[styles.subtitle,
                    { color: currentTheme === 'dark' ? '#ccc' : '#777' }]}>
                        Here's your meal summary for today:
                    </Text>
                </View>
                <View style={{ flex: 9 }}>
                    <NutrientsCards totalNutrition={totalNutrition} />
                </View>
            </View>
            <MealBasket />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        height: screenHeight() * 0.95,
        padding: 12,
        paddingBottom: 15
    },
    container: {
        flex: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flex: 1,
        gap: 10,
        marginBottom: 10
    },
    greeting: {
        fontSize: DEFAULT_PROPS.XXL_FONT_SIZE,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
    }
});

export default HomeView;
