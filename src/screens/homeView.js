import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { screenHeight } from '../utils/functions';
import moment from 'moment';
import { DEFAULT_PROPS } from '../utils/constants';
import MealBasket from '../components/mealBasket';
import NutrientsCards from '../components/nutrientsCards';

const HomeView = () => {
    const currentTheme = useSelector(state => state.colourTheme.currentTheme);
    const savedMeals = useSelector(state => state.meal.savedMeals);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        setGreeting(getGreeting());
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
                <NutrientsCards totalNutrition={totalNutrition} />
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
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
