import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { screenHeight } from '../utils/functions';
import moment from 'moment';
import { ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { DAILY_INTAKE, DAILY_INTAKE_UNITS, DEFAULT_PROPS } from '../utils/constants';

const HomeView = () => {
    const currentTheme = useSelector(state => state.colourTheme.currentTheme);
    const savedMeals = useSelector(state => state.meal.savedMeals);
    const [greeting, setGreeting] = useState('');
    const [showAllMicros, setShowAllMicros] = useState(false);

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

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {/* Macros */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle,
                    { color: currentTheme === 'dark' ? 'white' : 'black' }]}>
                        Macros
                    </Text>
                    <View style={styles.gridContainer}>
                        {["Calories", "Protein", "Carbohydrates", "Fat"].map(key => (
                            <View key={key} style={[styles.nutrientCard, { backgroundColor: currentTheme === 'dark' ? '#333' : '#FFF' }]}>
                                <Text style={[styles.nutrientTitle, { color: currentTheme === 'dark' ? 'white' : 'black' }]}>{key}</Text>
                                <ProgressBar progress={(totalNutrition[
                                    key === "Calories" ? "Caloric Value" : key] || 0) / DAILY_INTAKE[key]}
                                    color="#4CAF50" style={styles.progressBar} />
                                <Text style={[styles.nutrientValue, { color: currentTheme === 'dark' ? '#ddd' : '#555' }]}>
                                    {totalNutrition[key === "Calories" ? "Caloric Value" : key] || 0}
                                    {DAILY_INTAKE_UNITS[key === "Calories" ? "Caloric Value" : key]} / {DAILY_INTAKE[key]} {DAILY_INTAKE_UNITS[key]}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Micros */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle,
                    { color: currentTheme === 'dark' ? 'white' : 'black' }]}>
                        Micros
                    </Text>
                    <View style={styles.gridContainer}>
                        {["Iron", "Calcium", "Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"].map(key => (
                            <View key={key} style={[styles.nutrientCard, { backgroundColor: currentTheme === 'dark' ? '#333' : '#FFF' }]}>
                                <Text style={[styles.nutrientTitle,
                                { color: currentTheme === 'dark' ? 'white' : 'black' }]}>
                                    {key}
                                </Text>
                                <ProgressBar progress={(totalNutrition[key] || 0) / DAILY_INTAKE[key]} color="#FF9800" style={styles.progressBar} />
                                <Text style={[styles.nutrientValue,
                                { color: currentTheme === 'dark' ? '#ddd' : '#555' }]}>
                                    {totalNutrition[key] || 0} {DAILY_INTAKE_UNITS[key]} / {DAILY_INTAKE[key]} {DAILY_INTAKE_UNITS[key]}
                                </Text>
                            </View>
                        ))}
                    </View>
                    {!showAllMicros && (
                        <TouchableOpacity
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            onPress={() => setShowAllMicros(true)}
                            style={{ width: '100%', alignItems: 'center', marginTop: 10 }}>
                            <Icon name='chevron-down-outline'
                                size={DEFAULT_PROPS.XL_FONT_SIZE}
                                color={currentTheme === 'dark' ? 'white' : 'black'} />
                        </TouchableOpacity>
                    )}

                    {showAllMicros && (
                        <View style={styles.gridContainer}>
                            {["Vitamin B1", "Vitamin B2", "Vitamin B6", "Vitamin E", "Vitamin K", "Magnesium"].map(key => (
                                <View key={key} style={[styles.nutrientCard, { backgroundColor: currentTheme === 'dark' ? '#333' : '#FFF' }]}>
                                    <Text style={[styles.nutrientTitle,
                                    { color: currentTheme === 'dark' ? 'white' : 'black' }]}>
                                        {key}
                                    </Text>
                                    <ProgressBar progress={(totalNutrition[key] || 0) / DAILY_INTAKE[key]} color="#FF9800" style={styles.progressBar} />
                                    <Text style={[styles.nutrientValue,
                                    { color: currentTheme === 'dark' ? '#ddd' : '#555' }]}
                                    >{totalNutrition[key] || 0} {DAILY_INTAKE_UNITS[key]} / {DAILY_INTAKE[key]} {DAILY_INTAKE_UNITS[key]}
                                    </Text>
                                </View>
                            ))}
                            <TouchableOpacity
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                onPress={() => setShowAllMicros(false)}
                                style={{ width: '100%', alignItems: 'center', marginTop: 10 }}>
                                <Icon name='chevron-up-outline'
                                    size={DEFAULT_PROPS.XL_FONT_SIZE}
                                    color={currentTheme === 'dark' ? 'white' : 'black'} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
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
        paddingTop: 20,
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
