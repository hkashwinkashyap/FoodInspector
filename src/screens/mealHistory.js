import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setSavedMeals } from '../utils/store';
import Icon from 'react-native-vector-icons/Ionicons';
import { exportToCSV, screenHeight } from '../utils/functions';
import { DAILY_INTAKE_UNITS, DEFAULT_PROPS } from '../utils/constants';

const MealHistoryView = () => {
    const dispatch = useDispatch();
    const mealsFromAsyncStorage = useSelector(state => state.meal.savedMeals);
    const currentTheme = useSelector(state => state.colourTheme.currentTheme);
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        if (!mealsFromAsyncStorage) return;
        const orderedMeals = [...mealsFromAsyncStorage].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setMeals(orderedMeals);
    }, [mealsFromAsyncStorage]);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const options = { hour: '2-digit', minute: '2-digit', hour12: true };
        const timeString = date.toLocaleTimeString([], options);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            return `Today at ${timeString}`;
        }
        today.setDate(today.getDate() - 1);
        if (date.toDateString() === today.toDateString()) {
            return `Yesterday at ${timeString}`;
        }
        return date.toLocaleDateString(undefined, { weekday: 'long' }) + ` at ${timeString}`;
    };

    const clearAllMeals = async () => {
        Alert.alert('Clear All Meals', 'Are you sure you want to delete all saved meals?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Yes',
                onPress: async () => {
                    await AsyncStorage.removeItem('meals');
                    dispatch(setSavedMeals([]));
                }
            }
        ]);
    };

    const renderMealItem = ({ item }) => (
        <View style={[styles.mealContainer, { backgroundColor: currentTheme === 'dark' ? '#444' : '#F5F5F5' }]}>
            <Text style={[styles.mealTitle, { color: currentTheme === 'dark' ? 'white' : 'black' }]}>{formatTimestamp(item.timestamp)}</Text>

            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Icon name="list-outline" size={DEFAULT_PROPS.XLS_FONT_SIZE}
                        color={currentTheme === 'dark' ? '#AAA' : '#666'} />
                    <Text style={[styles.sectionTitle,
                    { color: currentTheme === 'dark' ? '#AAA' : '#666' }]}>Items:</Text>
                </View>
                {[...new Set(item.items.map(food => food.itemName))].map((foodName, index) => (
                    <Text key={index} style={[styles.foodItem,
                    { color: currentTheme === 'dark' ? '#FFF' : '#333' }]}>• {foodName}</Text>
                ))}
            </View>

            <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                    <Icon name="barbell-outline" size={DEFAULT_PROPS.XLS_FONT_SIZE}
                        color={currentTheme === 'dark' ? '#AAA' : '#666'} />
                    <Text style={[styles.sectionTitle,
                    { color: currentTheme === 'dark' ? '#AAA' : '#666' }]}>Total Nutrition:</Text>
                </View>
                <View style={styles.nutritionContainer}>
                    {Object.keys(item.totalNutrition).map((nutrient, index) => (
                        <View key={index} style={styles.nutritionItem}>
                            <Text style={[styles.nutrientLabel, { color: currentTheme === 'dark' ? '#CCC' : '#444' }]}>
                                {nutrient === 'Caloric Value' ? 'Calories' : nutrient}:
                            </Text>
                            <Text style={[styles.nutrientValue, { color: currentTheme === 'dark' ? '#FFF' : '#000' }]}>
                                {item.totalNutrition[nutrient]}
                                {DAILY_INTAKE_UNITS[nutrient === 'Caloric Value' ? 'Calories' : nutrient] || 'g'}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.safeAreaView,
        { backgroundColor: currentTheme === 'dark' ? '#121212' : '#F9F9F9' }]}>
            <View style={styles.container}>
                {meals.length > 0 ? (
                    <>
                        <View style={styles.topButtonsContainer}>
                            <TouchableOpacity style={styles.button} onPress={clearAllMeals}>
                                <Icon name="trash-outline" size={DEFAULT_PROPS.LG_FONT_SIZE}
                                    color={currentTheme === 'dark' ? 'white' : 'black'}
                                />
                                <Text style={[styles.buttonText,
                                { color: currentTheme === 'dark' ? 'white' : 'black' }
                                ]}>Clear All Meals</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => exportToCSV(meals)}>
                                <Icon name="share-outline" size={DEFAULT_PROPS.LG_FONT_SIZE}
                                    color={currentTheme === 'dark' ? 'white' : 'black'} />
                                <Text style={[styles.buttonText,
                                { color: currentTheme === 'dark' ? 'white' : 'black' }
                                ]}>Export CSV</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={meals}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderMealItem}
                        />
                    </>
                ) : (
                    <View style={styles.noMealsContainer}>
                        <Icon name="fast-food-outline" size={50} color={currentTheme === 'dark' ? '#AAA' : '#666'} />
                        <Text style={[styles.noMealsText, { color: currentTheme === 'dark' ? 'white' : 'black' }]}>
                            No meals found
                        </Text>
                        <Text style={[styles.noMealsSubText, { color: currentTheme === 'dark' ? '#AAA' : '#666' }]}>
                            Start adding meals to track your nutrition.
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeAreaView: {
        height: screenHeight(),
        flex: 1
    },
    container: {
        flex: 1,
        padding: 16,
    },
    noMealsContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        opacity: 0.8,
    },
    noMealsText: {
        fontSize: DEFAULT_PROPS.XL_FONT_SIZE,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    noMealsSubText: {
        fontSize: DEFAULT_PROPS.MD_FONT_SIZE,
        textAlign: 'center',
        marginTop: 5,
    },
    topButtonsContainer: {
        flexDirection: 'row',
    },
    button: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center',
        marginBottom: 12,
    },
    buttonText: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    mealContainer: {
        padding: 16,
        marginVertical: 8,
        borderRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3
    },
    mealTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    sectionContainer: {
        marginTop: 12,
        paddingVertical: 6,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    foodItem: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
        marginLeft: 8,
    },
    nutritionContainer: {
        marginTop: 6,
    },
    nutritionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    nutrientLabel: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
    },
    nutrientValue: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
        fontWeight: 'bold',
    }
});

export default MealHistoryView;
