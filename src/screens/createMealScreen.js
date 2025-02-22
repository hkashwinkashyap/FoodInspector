import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Animated, Pressable } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { addToMeal, createMeal, removeFromMeal } from "../utils/store"; // Added removeItem action
import { DAILY_INTAKE, DAILY_INTAKE_UNITS, DEFAULT_PROPS } from "../utils/constants";
import Icon from "react-native-vector-icons/Ionicons";
import { screenHeight } from "../utils/functions";
import { ProgressBar } from "react-native-paper";

const CreateMealScreen = () => {
    const mealItems = useSelector(state => state.meal.items);
    const totalNutrition = useSelector(state => state.meal.totalNutrition);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const currentTheme = useSelector((state) => state.colourTheme.currentTheme);
    const lastTab = useSelector((state) => state.navigation.lastTab);

    const scrollIndicator = useRef();
    const [mealCreated, setMealCreated] = useState(false);
    const [mealDeleted, setMealDeleted] = useState(false);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // Group items while maintaining order
    const groupedItems = [];
    const itemMap = new Map();

    mealItems.forEach((item) => {
        if (itemMap.has(item.itemName)) {
            const existing = itemMap.get(item.itemName);
            existing.count += 1;
            existing.calories += item.nutrients["Caloric Value"];
            existing.protein += item.nutrients["Protein"];
            existing.fat += item.nutrients["Fat"];
            existing.carbs += item.nutrients["Carbohydrates"];
        } else {
            const newItem = { ...item, count: 1 };
            itemMap.set(item.itemName, newItem);
            groupedItems.push(newItem); // Maintain insertion order
        }
    });

    // Handle removing an item
    const handleRemoveItem = (itemName) => {
        dispatch(removeFromMeal(itemName)); // Dispatch Redux action to remove

        if (mealItems.length === 1) {
            setMealDeleted(true);
            // Animate out
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 2000,
                useNativeDriver: true,
            }).start(() => {
                navigation.navigate(lastTab);
                setMealDeleted(false);
                fadeAnim.setValue(1);
            }, 1000);
        }
    };

    // Handle adding an item
    const handleAddItem = (item) => {
        dispatch(addToMeal({ itemName: item.itemName, nutrients: item["nutrients"] })); // Dispatch Redux action to add
    };

    // Handle creating meal & navigate home
    const handleCreateMeal = () => {
        setMealCreated(true);
        dispatch(createMeal());

        // Animate out
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
        }).start(() => {
            navigation.navigate("Home");
            setMealCreated(false);
            fadeAnim.setValue(1);
        }, 1000);
    };

    useEffect(() => {
        setTimeout(() => {
            scrollIndicator.current?.flashScrollIndicators();
        }, 500);
    }, []);

    return (
        <SafeAreaView style={[styles.safeArea, {
            backgroundColor: currentTheme === 'dark' ? 'black' : 'white',
        }]}>
            <View style={styles.container}>
                {/* Header with Back Button */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate(lastTab)}>
                        <Icon name="arrow-back"
                            size={DEFAULT_PROPS.XL_FONT_SIZE}
                            color={currentTheme === "dark" ? "white" : "black"} />
                    </TouchableOpacity>
                    <Text style={[styles.title, { color: currentTheme === "dark" ? "white" : "black" }]}>
                        Meal Summary
                    </Text>
                </View>

                {/* Macros Summary */}
                <View style={styles.nutritionSummary}>
                    <Text style={[styles.sectionTitle, { color: currentTheme === "dark" ? "white" : "black" }]}>
                        Macros
                    </Text>
                    <View style={styles.gridContainer}>
                        {["Calories", "Protein", "Carbohydrates", "Fat"].map((key) => (
                            <View key={key} style={[styles.nutrientCard, { backgroundColor: currentTheme === "dark" ? "#333" : "#FFF" }]}>
                                <Text style={[styles.nutrientTitle, { color: currentTheme === "dark" ? "white" : "black" }]}>
                                    {key}
                                </Text>
                                <ProgressBar
                                    progress={(totalNutrition[key === "Calories" ? "Caloric Value" : key] || 0) / DAILY_INTAKE[key]}
                                    color="#4CAF50"
                                    style={styles.progressBar}
                                />
                                <Text style={[styles.nutrientValue, { color: currentTheme === "dark" ? "#ddd" : "#555" }]}>
                                    {totalNutrition[key === "Calories" ? "Caloric Value" : key] || 0}
                                    {DAILY_INTAKE_UNITS[key]} / {DAILY_INTAKE[key]} {DAILY_INTAKE_UNITS[key]}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.listContainer}>
                    {/* Meal Items List */}
                    <FlatList
                        ref={scrollIndicator}
                        style={{ paddingBottom: 10 }}
                        data={groupedItems}
                        showsVerticalScrollIndicator={true}
                        keyExtractor={(item, index) => `${item.itemName}-${index}`}
                        renderItem={({ item, index }) => (
                            <View style={[styles.itemContainer,
                            { backgroundColor: currentTheme === "dark" ? "#333" : "#E0E0E0" }
                            ]}>
                                {/* Serial Number */}
                                <Text style={[styles.serialNumber,
                                {
                                    color: currentTheme === "dark" ? "white" : "black",
                                    flex: 1
                                }
                                ]}>
                                    {index + 1}.
                                </Text>

                                <View style={{
                                    alignItems: "center",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    flex: 11,
                                }}>
                                    {/* Item Name */}
                                    <View
                                        flex={4}
                                        alignItems={'center'}
                                        paddingRight={5}
                                        gap={10}
                                    >
                                        <Text numberOfLines={1}
                                            style={[styles.itemText,
                                            {
                                                color: currentTheme === "dark" ? "white" : "black",
                                            }
                                            ]}>
                                            {item.itemName}
                                        </Text>
                                        <Text style={[styles.itemText,
                                        {
                                            color: currentTheme === "dark" ? "white" : "black",
                                            fontSize: DEFAULT_PROPS.MD_FONT_SIZE,
                                        }
                                        ]}>
                                            (
                                            {<Text style={[styles.itemText,
                                            {
                                                color: currentTheme === "dark" ? "white" : "black",
                                                fontWeight: "bold",
                                                fontSize: DEFAULT_PROPS.MD_FONT_SIZE
                                            }
                                            ]}>
                                                {item.count * 100} g
                                            </Text>}
                                            )
                                        </Text>
                                    </View>

                                    <View style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 10,
                                    }}>
                                        {/* Buttons */}
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: "100%"
                                        }}>
                                            {/* Decrease Count Button */}
                                            <TouchableOpacity
                                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                onPress={() => handleRemoveItem(item.itemName)}>
                                                <Icon name="remove-circle-outline" size={DEFAULT_PROPS.XL_FONT_SIZE}
                                                    color={currentTheme == "dark" ? "white" : "black"} />
                                            </TouchableOpacity>
                                            {/* Add Count Button */}
                                            <TouchableOpacity
                                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                onPress={() => handleAddItem(item)}>
                                                <Icon name="add-circle-outline" size={DEFAULT_PROPS.XL_FONT_SIZE}
                                                    color={currentTheme == "dark" ? "white" : "black"} />
                                            </TouchableOpacity>
                                        </View>

                                        {/* Item Count & Calories */}
                                        <Text style={[styles.itemText,
                                        {
                                            color: currentTheme === "dark" ? "white" : "black",
                                            fontSize: DEFAULT_PROPS.MD_FONT_SIZE,
                                            fontWeight: "bold"
                                        }
                                        ]}>
                                            {item.count * item["nutrients"]["Caloric Value"]} kcal
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>

                {/* Create Meal Button */}
                <TouchableOpacity style={[styles.createButton, {
                    borderColor: currentTheme === "dark" ? 'white' : 'black',
                }]}
                    onPress={handleCreateMeal}
                    disabled={mealCreated}>
                    {mealCreated ? (
                        <Icon name="bag-check-outline" size={DEFAULT_PROPS.XL_FONT_SIZE}
                            color={currentTheme === "dark" ? "white" : "black"} />
                    ) : (
                        <>
                            <Icon name="checkmark-outline" size={DEFAULT_PROPS.XL_FONT_SIZE}
                                color={currentTheme === "dark" ?
                                    DEFAULT_PROPS.tabBarBackgroundColorLightMode
                                    : DEFAULT_PROPS.tabBarBackgroundColorDarkMode} />
                            <Text style={[styles.createButtonText,
                            { color: currentTheme === "dark" ? "white" : "black" }
                            ]}>
                                Create Meal
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
            {mealCreated && (
                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                    <View style={styles.blurContainer}>
                        <Icon name="bag-check-outline" size={100}
                            color={currentTheme === "dark" ? "white" : "black"} />
                    </View>
                </Animated.View>
            )}
            {mealDeleted && (
                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                    <View style={styles.blurContainer}>
                        <Icon name="bag-remove-outline" size={100}
                            color={currentTheme === "dark" ? "white" : "black"} />
                    </View>
                </Animated.View>
            )}
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    safeArea: {
        height: screenHeight(),
        flex: 1
    },
    container: {
        height: "100%",
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 16,
    },
    title: {
        fontSize: DEFAULT_PROPS.XL_FONT_SIZE,
        marginLeft: 10,
    },
    nutritionSummary: {
        padding: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: DEFAULT_PROPS.XL_FONT_SIZE,
        fontWeight: "bold",
        marginBottom: 10,
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    nutrientCard: {
        width: "48%",  // Ensures 2 cards per row
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    nutrientTitle: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
        fontWeight: "bold",
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        marginVertical: 5,
    },
    nutrientValue: {
        fontSize: DEFAULT_PROPS.MD_FONT_SIZE,
    },
    listContainer: {
        flex: 20,
        padding: 10
    },
    itemContainer: {
        padding: 10,
        marginVertical: 6,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    serialNumber: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
        fontWeight: "bold",
        marginRight: 5,
    },
    itemText: {
        fontSize: DEFAULT_PROPS.XL_FONT_SIZE,
        textAlign: "center"
    },
    createButton: {
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: DEFAULT_PROPS.XS_FONT_SIZE,
        flexDirection: 'row',
        gap: 10,
        flex: 1,
    },
    createButtonText: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
        fontWeight: "bold",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    blurContainer: {
        width: 150,
        height: 150,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: 80,
        justifyContent: "center",
        alignItems: "center",
    },

});

export default CreateMealScreen;
