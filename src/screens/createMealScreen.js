import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { createMeal } from "../utils/store";
import { DEFAULT_PROPS } from "../utils/constants";
import Icon from "react-native-vector-icons/Ionicons";
import { screenHeight } from "../utils/functions";

const CreateMealScreen = () => {
    const mealItems = useSelector(state => state.meal.items);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const currentTheme = useSelector((state) => state.colourTheme.currentTheme);
    const lastTab = useSelector((state) => state.navigation.lastTab);

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
    const handleCreateMeal = () => {
        dispatch(createMeal());
        navigation.navigate("Home");
    };

    return (
        <SafeAreaView style={[styles.safeArea, {
            backgroundColor: currentTheme === 'dark' ? 'black' : 'white',
        }]} >
            <View style={styles.container}>
                {/* Header with Back Button */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate(lastTab)}>
                        <Icon name="arrow-back"
                            size={DEFAULT_PROPS.XL_FONT_SIZE}
                            color={
                                currentTheme === "dark" ? "white" : "black"
                            } />
                    </TouchableOpacity>
                    <Text style={[styles.title,
                    { color: currentTheme === "dark" ? "white" : "black" }
                    ]}>Meal Summary</Text>
                </View>

                {/* Meal Items List */}
                <FlatList
                    data={groupedItems}
                    keyExtractor={(item, index) => `${item.itemName}-${index}`}
                    renderItem={({ item }) => (
                        <View style={[styles.itemContainer,
                        {
                            backgroundColor: currentTheme === "dark" ? "#333" : "#E0E0E0"
                        }
                        ]}>
                            <Text style={[styles.itemText,
                            {
                                color: currentTheme === "dark" ? "white" : "black"
                            }
                            ]}>{item.itemName} x{item.count}</Text>
                        </View>
                    )}
                />

                {/* Create Meal Button */}
                <TouchableOpacity style={[styles.createButton, {
                    borderColor: currentTheme === "dark" ? 'white' : 'black',
                }]} onPress={handleCreateMeal}>
                    <Text style={[styles.createButtonText,
                    {
                        color: currentTheme === "dark" ? "white" : "black"
                    }
                    ]}>Create Meal</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    safeArea: {
        height: screenHeight(),
        flex: 1
    },
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    title: {
        fontSize: DEFAULT_PROPS.XL_FONT_SIZE,
        marginLeft: 10,
    },
    itemContainer: {
        padding: 12,
        marginVertical: 6,
        borderRadius: 8,
    },
    itemText: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
    },
    createButton: {
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: DEFAULT_PROPS.XS_FONT_SIZE
    },
    createButtonText: {
        fontSize: DEFAULT_PROPS.XL_FONT_SIZE,
        fontWeight: "bold",
    },
});

export default CreateMealScreen;
