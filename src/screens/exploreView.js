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

    useEffect(() => {
        if (macrosData && Object.keys(macrosData).length > 0) {
            const randomOrder = shuffleArray(Object.keys(macrosData));
            setRandomItems(randomOrder);
            setCurrentIndex(0)
        }
    }, [macrosData]);

    useEffect(() => {
        const fetchImage = async () => {
            setLoading(true)
            try {
                const response = await axios.get(PEXELS_API_URL, {
                    headers: {
                        Authorization: PEXELS_API_KEY,
                    },
                    params: {
                        query: randomItems[currentIndex],
                        per_page: 2,
                    },
                });
                if (response.data.photos.length > 0) {
                    setImage(response.data.photos[0].src.original);
                } else {
                    setImage(null);
                }
            } catch (error) {
                console.error('Error fetching image from Pexels:', error);
                setImage(null);
            } finally {
                setLoading(false);
            }
        };

        if (randomItems.length > 0) {
            fetchImage()
        }

    }, [randomItems, currentIndex])

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

        return (
            <View style={[styles.foodCard, {
                backgroundColor: currentTheme === 'dark' ? '#002021' : 'white',
                shadowColor: currentTheme === 'dark' ? 'white' : '#333',
            }]}>
                <Text style={[styles.foodName, {
                    color: currentTheme === 'dark' ? 'white' : '#333',
                }]}>{item}</Text>
                <View style={styles.image} width={'100%'} alignItems={'center'} justifyContent={'center'} height={screenHeight() * 0.3}>
                    {!loading ? (
                        <ImageBackground
                            source={{ uri: image }}
                            style={{ width: '100%', height: '100%' }}
                            imageStyle={{ borderRadius: 10 }}
                        >
                            {/* Overlay text box */}
                            <View style={styles.overlayTextBox}>
                                <Text style={styles.overlayText}>
                                    {DEFAULT_PROPS.imageOverlayText}
                                </Text>
                            </View>
                        </ImageBackground>
                    ) : (
                        <Text>{DEFAULT_PROPS.loadingText}.</Text>
                    )}
                </View>
                <View flexDirection={'column'}>
                    <View style={styles.nutrientContainer}>
                        <View flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} marginBottom={5}>
                            <Text style={[styles.nutrientHeading, {
                                color: currentTheme === 'dark' ? 'white' : '#333',
                                marginVertical: 4,
                            }]}>Nutrition Information</Text>
                            <TouchableOpacity onPress={() => {
                                handleViewMore(item);
                            }}
                                style={[styles.addToMealButton, {
                                    borderColor: currentTheme === 'dark' ? 'white' : 'black',
                                }]}>
                                <View flexDirection={'row'} alignItems={'center'}>
                                    <Text style={[styles.buttonText, {
                                        color: currentTheme === 'dark' ? 'white' : 'black',
                                        fontWeight: 600,
                                    }]}>
                                        View More
                                    </Text>
                                    <View style={{ marginLeft: 2 }} />
                                    <Icon name="information-circle-outline" size={DEFAULT_PROPS.XL_FONT_SIZE} color={currentTheme === 'dark' ? 'white' : 'black'} />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View flexDirection={'row'} alignItems={'flex-end'}>
                            <Text style={[styles.nutrientText, {
                                color: currentTheme === 'dark' ? 'white' : '#333',
                                marginVertical: 4,
                            }]}>Macro Nutrients</Text>
                            <Text style={[styles.nutrientUnitsText, {
                                color: currentTheme === 'dark' ? 'white' : '#333',
                                marginVertical: 6,
                            }]}>(per 100g)</Text>
                        </View>
                        {/* Nutrients */}
                        <View
                            flexDirection={'row'}
                            borderRadius={10}
                            borderWidth={1}
                            width={'100%'}
                            marginVertical={10}
                            padding={6}
                            borderColor={currentTheme === 'dark' ? 'white' : '#333'}
                            alignItems={'center'}>
                            {(KEY_NUTRIENTS).map((_, index) => (
                                <View width={`${100 / KEY_NUTRIENTS.length}%`} key={`nutrient-${index}`} alignItems={'center'} justifyContent={'center'}>
                                    <View>
                                        <Text style={[styles.nutrientText, {
                                            color: currentTheme === 'dark' ? 'white' : '#333',
                                        }]}>
                                            {KEY_NUTRIENTS[index] === MACRO_NUTRIENTS.DIETARY_FIBER ? 'Fiber' : KEY_NUTRIENTS[index]}
                                        </Text>
                                        <View flexDirection={'row'} alignItems={'flex-end'} justifyContent={'center'}>
                                            <Text style={[styles.nutrientText, {
                                                color: currentTheme === 'dark' ? 'white' : '#333',
                                            }]}>
                                                {nutrients[KEY_NUTRIENTS[index] === 'Calories' ? 'Caloric Value' : KEY_NUTRIENTS[index]]}
                                            </Text>
                                            <Text style={[styles.nutrientUnitsText, {
                                                color: currentTheme === 'dark' ? 'white' : '#333',
                                            }
                                            ]}>
                                                {KEY_NUTRIENTS[index] === 'Calories' ? KEY_NUTRIENTS_UNITS[0] : KEY_NUTRIENTS_UNITS[1]}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                        <View marginVertical={4} />
                        {/* Vitamins */}
                        <View flexDirection={'row'} alignItems={'flex-end'}>
                            <Text style={[styles.nutrientText, {
                                color: currentTheme === 'dark' ? 'white' : '#333',
                                marginVertical: 4,
                            }]}>Vitamins</Text>
                        </View>
                        <View
                            flexDirection={'row'}
                            borderRadius={10}
                            borderWidth={1}
                            width={'100%'}
                            marginVertical={10}
                            padding={6}
                            borderColor={currentTheme === 'dark' ? 'white' : '#333'}
                            alignItems={'center'}>
                            {(KEY_VITAMINS).map((_, index) => (
                                <View width={`${100 / KEY_VITAMINS.length}%`} key={`nutrient-${index}`} alignItems={'center'} justifyContent={'center'}>
                                    <Text style={[styles.nutrientText, {
                                        color: currentTheme === 'dark' ? 'white' : '#333',
                                    }]}>
                                        {KEY_VITAMINS[index]}
                                    </Text>
                                    <View flexDirection={'row'} alignItems={'flex-end'} justifyContent={'center'}>
                                        <Text style={[styles.nutrientText, {
                                            color: currentTheme === 'dark' ? 'white' : '#333',
                                        }]}>
                                            {nutrients[`Vitamin ${KEY_VITAMINS[index]}`]}
                                        </Text>
                                        <Text style={[styles.nutrientUnitsText, {
                                            color: currentTheme === 'dark' ? 'white' : '#333',
                                        }
                                        ]}>
                                            {KEY_VITAMINS_UNITS}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Add to meal */}
                <TouchableOpacity onPress={() => {
                    // Add to meal
                    dispatch(addToMeal({ itemName: item, nutrients: nutrients }));
                }}
                    style={[styles.addToMealButton, {
                        borderColor: currentTheme === 'dark' ? 'white' : 'black',
                    }]}>
                    <View flexDirection={'row'} alignItems={'center'}>
                        <Text style={[styles.buttonText, {
                            color: currentTheme === 'dark' ? 'white' : 'black',
                            fontWeight: 600,
                        }]}>
                            Add to Meal
                        </Text>
                        <View style={{ marginLeft: 2 }} />
                        <Icon name="add-circle-outline" size={DEFAULT_PROPS.XXL_FONT_SIZE} color={currentTheme === 'dark' ? 'white' : 'black'} />
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
                width={'92%'}
                height={'90%'}
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
    },
    fullViewCard: {
        height: '100%',
    },
    image: {
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 10,
        position: 'relative',
    },
    foodCard: {
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 15,
        borderRadius: 10,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    foodName: {
        fontSize: DEFAULT_PROPS.XXL_FONT_SIZE,
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform: 'capitalize',
    },
    nutrientContainer: {
        flexDirection: 'column',
        marginVertical: 10,
    },
    nutrientHeading: {
        fontSize: DEFAULT_PROPS.XL_FONT_SIZE,
        marginVertical: 4,
        fontWeight: 500,
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
