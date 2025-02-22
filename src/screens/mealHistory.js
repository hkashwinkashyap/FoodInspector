import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, SafeAreaView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setSavedMeals } from '../utils/store';
import Icon from 'react-native-vector-icons/Ionicons';
import { screenHeight } from '../utils/functions';

const MealHistoryView = () => {
    const dispatch = useDispatch();
    const mealsFromAsyncStorage = useSelector(state => state.meal.savedMeals);

    const [meals, setMeals] = React.useState([...mealsFromAsyncStorage].sort((a, b) => a.timestamp - b.timestamp));

    // Clear all meals with confirmation
    const clearAllMeals = async () => {
        Alert.alert(
            'Clear All Meals',
            'Are you sure you want to delete all saved meals?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes',
                    onPress: async () => {
                        await AsyncStorage.removeItem('meals');
                        dispatch(setSavedMeals([]));
                    }
                }
            ]
        );
    };

    const renderMealItem = ({ item }) => (
        <View style={styles.mealContainer}>
            <Text style={styles.mealTitle}>{item.name}</Text>
            <Text style={styles.timestamp}>{new Date(item.timestamp).toLocaleString()}</Text>
            <Text style={styles.sectionTitle}>Items:</Text>
            {item.items.map((food, index) => (
                <Text key={index} style={styles.foodItem}>• {food.itemName}</Text>
            ))}
            <Text style={styles.sectionTitle}>Total Nutrition:</Text>
            {Object.keys(item.totalNutrition).map((nutrient, index) => (
                <Text key={index} style={styles.nutrientItem}>
                    {nutrient}: {item.totalNutrition[nutrient]}
                </Text>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.safeAreaVIew}>
            <View style={styles.container}>
                <TouchableOpacity style={styles.clearButton} onPress={clearAllMeals}>
                    <Icon name="trash-outline" size={24} color="white" />
                    <Text style={styles.clearButtonText}>Clear All Meals</Text>
                </TouchableOpacity>
                <FlatList
                    data={meals}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderMealItem}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeAreaVIew: {
        height: screenHeight() * 0.95
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8'
    },
    clearButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
        justifyContent: 'center',
        marginBottom: 10
    },
    clearButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8
    },
    mealContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    mealTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5
    },
    timestamp: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 10
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginTop: 5
    },
    foodItem: {
        fontSize: 14,
        marginLeft: 10
    },
    nutrientItem: {
        fontSize: 14,
        marginLeft: 10,
        color: '#4CAF50'
    }
});

export default MealHistoryView;
