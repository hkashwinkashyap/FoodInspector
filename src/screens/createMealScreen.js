import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { createMeal } from "../utils/store";
import { DEFAULT_PROPS } from "../utils/constants";
import Icon from "react-native-vector-icons/Ionicons";

const CreateMealScreen = () => {
    const mealItems = useSelector(state => state.meal.items);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    // Group items to show count (e.g., "Apple x2")
    const groupedItems = mealItems.reduce((acc, item) => {
        const existing = acc.find(i => i.itemName === item.itemName);
        if (existing) {
            existing.count += 1;
        } else {
            acc.push({ ...item, count: 1 });
        }
        return acc;
    }, []);

    // Handle creating meal & navigate home
    const handleCreateMeal = async () => {
        await dispatch(createMeal());
        navigation.navigate("Home");
    };

    return (
        <View style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>Meal Summary</Text>
            </View>

            {/* Meal Items List */}
            <FlatList
                data={groupedItems}
                keyExtractor={(item, index) => `${item.itemName}-${index}`}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.itemName} x{item.count}</Text>
                    </View>
                )}
            />

            {/* Create Meal Button */}
            <TouchableOpacity style={styles.createButton} onPress={handleCreateMeal}>
                <Text style={styles.createButtonText}>Create Meal</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#121212",
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        color: "white",
        marginLeft: 10,
    },
    itemContainer: {
        backgroundColor: "#1E1E1E",
        padding: 12,
        marginVertical: 6,
        borderRadius: 8,
    },
    itemText: {
        color: "white",
        fontSize: 16,
    },
    createButton: {
        backgroundColor: "#FF9800",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    createButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default CreateMealScreen;
