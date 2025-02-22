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
            <MealBasket />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        height: screenHeight(),
        padding: 20,
    },
    header: {
        marginBottom: 20,
        gap: 10,
    },
    contentContainer: {
        paddingTop: 10,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 20,
    },
    nutrientTitle: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
        fontWeight: 'bold',
    },
    nutrientValue: {
        fontSize: DEFAULT_PROPS.MD_FONT_SIZE,
    },
    greeting: {
        fontSize: DEFAULT_PROPS.XXL_FONT_SIZE,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
    },
    sectionTitle: {
        fontSize: DEFAULT_PROPS.XL_FONT_SIZE,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    nutrientCard: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        width: '48%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        marginVertical: 5,
    }
});

export default HomeView;
