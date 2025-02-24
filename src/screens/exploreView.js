import { Animated, Easing, Image, ImageBackground, PanResponder, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useCallback, useEffect, useRef, useState } from "react";
import { addToMeal } from "../utils/store";
import { useDispatch, useSelector } from "react-redux";
import { screenHeight } from "../utils/functions";
import { DEFAULT_PROPS, KEY_NUTRIENTS, KEY_NUTRIENTS_UNITS, KEY_VITAMINS, KEY_VITAMINS_UNITS, MACRO_NUTRIENTS, OTHER_CONSTANTS, PEXELS_API_KEY, PEXELS_API_URL } from "../utils/constants";
import axios from "axios";
import FoodItemFullDetails from "../components/foodItemFullDetails";
import Icon from "react-native-vector-icons/Ionicons";
import MealBasket from "../components/mealBasket";
import NutrientsCards from "../components/nutrientsCards";

const ExploreView = () => {
    const dispatch = useDispatch();

    const macrosData = useSelector((state) => state.macrosData.nutrients)

    const currentTheme = useSelector((state) => state.colourTheme.currentTheme);

    const [randomItems, setRandomItems] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const pan = useRef(new Animated.Value(0)).current;

    const [image, setImage] = useState()

    const [loading, setLoading] = useState(true)

    const [foodItemModalVisible, setFoodItemModalVisible] = useState(false);
    const [selectedFoodItem, setSelectedFoodItem] = useState({});
    const [selectedFoodItemName, setSelectedFoodItemName] = useState('');

    const [addedToMeal, setAddedToMeal] = useState(false);

    useEffect(() => {
        if (macrosData && Object.keys(macrosData).length > 0) {
            const randomOrder = shuffleArray(Object.keys(macrosData));
            setRandomItems(randomOrder);
            setCurrentIndex(0)
        }
    }, [macrosData]);

    const handleAddToMeal = (foodItemName, nutrients) => {
        setAddedToMeal(true);

        setTimeout(() => {
            // Add to meal
            dispatch(addToMeal({ itemName: foodItemName, nutrients: nutrients }));
            setAddedToMeal(false);
        }, 1000);
    }

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const handleViewMore = (foodItem) => {
        setFoodItemModalVisible(true);
        setSelectedFoodItem(macrosData[foodItem]);
        setSelectedFoodItemName(foodItem);
    };

    const getFoodItemCard = (item) => {
        const nutrients = macrosData[item];

        const convertedNutrients = Object.fromEntries(
            Object.entries(nutrients).map(([key, value]) => [key, parseFloat(value)])
        );

        console.log('Converted Nutrients:', convertedNutrients);

        return (
            <View style={styles.foodCard}>
                <TouchableOpacity onPress={() => {
                    handleViewMore(item);
                }}>
                    <View flexDirection={'row'}
                        alignItems={'center'}>
                        <Text style={[styles.foodName, {
                            color: currentTheme === 'dark' ? 'white' : '#333',
                        }]}>{item}</Text>
                        <Icon name="information-circle-outline"
                            size={DEFAULT_PROPS.LG_FONT_SIZE}
                            color={currentTheme === 'dark' ? 'white' : 'black'} />
                    </View>
                </TouchableOpacity>
                <View style={styles.nutrientContainer}>
                    <NutrientsCards totalNutrition={convertedNutrients} hideViewAllMicros={true} />
                </View>
                {/* Add to meal */}
                <TouchableOpacity
                    disabled={addedToMeal}
                    onPress={() => handleAddToMeal(item, nutrients)}
                    style={[styles.addToMealButton, {
                        borderColor: currentTheme === 'dark' ? 'white' : 'black',
                    }]}>
                    <View flexDirection={'row'} alignItems={'center'}>
                        {addedToMeal ? (
                            <>
                                <Text style={[styles.buttonText, {
                                    color: currentTheme === 'dark' ? 'white' : 'black',
                                }]}>
                                    Added to Meal
                                </Text>
                                <View style={{ marginLeft: 2 }} />
                                <Icon name="checkmark-circle-outline" size={DEFAULT_PROPS.XXL_FONT_SIZE} color={currentTheme === 'dark' ? 'white' : 'black'} />
                            </>
                        ) :
                            (
                                <>
                                    <Text style={[styles.buttonText, {
                                        color: currentTheme === 'dark' ? 'white' : 'black',
                                        fontWeight: 600,
                                    }]}>
                                        Add to Meal
                                    </Text>
                                    <View style={{ marginLeft: 2 }} />
                                    <Icon name="add-circle-outline" size={DEFAULT_PROPS.XXL_FONT_SIZE} color={currentTheme === 'dark' ? 'white' : 'black'} />
                                </>
                            )}
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    // Handles the swipe-gesture for the cards
    const panResponder = useCallback(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (evt, gestureState) => {
                    // Restrict to vertical movement
                    return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
                },
                onPanResponderMove: (event, gestureState) => {
                    pan.setValue(gestureState.dy);
                },
                // On release, snap to next card
                onPanResponderRelease: (evt, gestureState) => {
                    if (Math.abs(gestureState.dy) > screenHeight() / 4) {
                        if (gestureState.dy < 0) {
                            // Swipe up detected
                            if (currentIndex < randomItems.length - 1) {
                                setCurrentIndex((prevIndex) => prevIndex + 1);
                                Animated.timing(pan, {
                                    toValue: screenHeight(),
                                    easing: Easing.ease,
                                    duration: 10,
                                    useNativeDriver: true,
                                }).start(finished => {
                                    Animated.spring(pan, {
                                        toValue: 0,
                                        easing: Easing.bounce,
                                        bounciness: 10,
                                        useNativeDriver: true,
                                    }).start();
                                    pan.flattenOffset();
                                });
                            }
                        }
                        if (gestureState.dy > 0) {
                            // Swipe down detected
                            if (currentIndex > 0) {
                                setCurrentIndex((prevIndex) => prevIndex - 1);
                                Animated.timing(pan, {
                                    toValue: -screenHeight(),
                                    easing: Easing.ease,
                                    duration: 10,
                                    useNativeDriver: true,
                                }).start(finished => {
                                    Animated.spring(pan, {
                                        toValue: 0,
                                        easing: Easing.bounce,
                                        bounciness: 10,
                                        useNativeDriver: true,
                                    }).start();
                                    pan.flattenOffset();
                                }
                                );
                            } else {
                                Animated.spring(pan, {
                                    toValue: 0,
                                    easing: Easing.bounce,
                                    bounciness: 10,
                                    useNativeDriver: true,
                                }).start();
                            }
                        }
                    }
                    else {
                        Animated.spring(pan, {
                            toValue: 0,
                            easing: Easing.bounce,
                            bounciness: 10,
                            useNativeDriver: true,
                        }).start();
                    }
                    pan.flattenOffset();
                },
            }),
        [currentIndex, randomItems.length, pan],
    );

    return (
        <SafeAreaView style={[styles.safeArea, {
            backgroundColor: currentTheme === 'dark' ? 'black' : 'white',
        }]}
        >
            <FoodItemFullDetails
                visible={foodItemModalVisible}
                onClose={() => {
                    setFoodItemModalVisible(false);
                    setSelectedFoodItem({});
                    setSelectedFoodItemName('');
                }}
                foodItemName={selectedFoodItemName}
                foodItem={selectedFoodItem}
                width={'90%'}
                height={'80%'}
                backgroundColor={currentTheme === 'dark' ? '#333' : '#f0f0f0'}
            />
            {randomItems.length > 0 && (
                <Animated.View
                    style={[
                        styles.fullViewCard,
                        {
                            transform: [{ translateY: pan }],
                        },
                    ]}
                    {...panResponder().panHandlers}
                >
                    {getFoodItemCard(randomItems[currentIndex])}
                </Animated.View>
            )}
            <MealBasket />
        </SafeAreaView >
    )
}

export default ExploreView

const styles = StyleSheet.create({
    safeArea: {
        height: screenHeight(),
        flex: 1,
    },
    fullViewCard: {
        maxHeight: screenHeight() * 0.8,
        flexGrow: 1,
    },
    image: {
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 10,
        position: 'relative',
    },
    foodCard: {
        padding: 10,
        marginHorizontal: 5,
        borderRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    foodName: {
        fontSize: DEFAULT_PROPS.XL_FONT_SIZE,
        fontWeight: 'bold',
        textTransform: 'capitalize',
        marginRight: 4,
    },
    nutrientContainer: {
        flexDirection: 'column',
        paddingBottom: 10,
    },
    nutrientHeading: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
    },
    nutrientText: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
        marginVertical: 4,
    },
    nutrientUnitsText: {
        fontSize: DEFAULT_PROPS.MD_FONT_SIZE,
        marginVertical: 6,
        paddingLeft: 2,
    },
    addToMealButton: {
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        marginVertical: 5,
    },
    overlayTextBox: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: DEFAULT_PROPS.imageOverlayBlur,
        padding: 10,
        borderRadius: 5,
        blurRadius: 5,
    },
    overlayText: {
        color: 'white',
        fontSize: DEFAULT_PROPS.SM_FONT_SIZE,
        fontWeight: 'bold',
    },
});
