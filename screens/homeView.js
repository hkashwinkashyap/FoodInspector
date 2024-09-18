import { Animated, Easing, FlatList, Image, PanResponder, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useCallback, useEffect, useRef, useState } from "react";
import { setMacrosData as setMacrosDataInStore } from "../utils/store";
import { useDispatch, useSelector } from "react-redux";
import { LoadCSV, screenHeight, screenWidth } from "../utils/functions";
import { KEY_NUTRIENTS, KEY_VITAMINS, PEXELS_API_KEY, PEXELS_API_URL } from "../utils/constants";
import axios from "axios";


const HomeView = () => {
    const dispatch = useDispatch();

    const macrosData = useSelector((state) => state.macrosData.nutrients)

    const [randomItems, setRandomItems] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const pan = useRef(new Animated.Value(0)).current;

    const [image, setImage] = useState()

    const [loading, setLoading] = useState(true)


    useEffect(() => {
        const loadMacrosData = async () => {
            // Dispatch the combined data to Redux store
            dispatch(setMacrosDataInStore(await LoadCSV()));
        }

        loadMacrosData()
    }, []);

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
                        per_page: 1,
                    },
                });
                console.log(response.data.photos[0])
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

    const getFoodItemCard = (item) => {
        const nutrients = macrosData[item];

        return (
            <View style={styles.foodCard}>
                <Text style={styles.foodName}>{item}</Text>
                <View style={styles.image} width={'100%'} alignItems={'center'} justifyContent={'center'} height={screenHeight() * 0.4}>
                    {!loading ? (
                        <Image source={{ uri: image }} width={'100%'} height={screenHeight() * 0.4} />
                    ) : (
                        <Text>Loading...</Text>
                    )}

                </View>
                <View flexDirection={'column'}>
                    <View style={styles.nutrientContainer} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                        {(KEY_NUTRIENTS).map((_, index) => (
                            <View alignItems={'center'} justifyContent={'center'}>
                                <Text style={styles.nutrientText}>
                                    {KEY_NUTRIENTS[index]}
                                </Text>
                                <Text style={styles.nutrientText}>
                                    {nutrients[KEY_NUTRIENTS[index] === 'Calories' ? 'Caloric Value' : KEY_NUTRIENTS[index]]}
                                </Text>
                                <View marginVertical={10} />
                                <Text style={styles.nutrientText}>
                                    Vitamin {KEY_VITAMINS[index]}
                                </Text>
                                <Text style={styles.nutrientText}>
                                    {nutrients[`Vitamin ${KEY_VITAMINS[index]}`]}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
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
                            }
                        }
                        if (gestureState.dy > 0) {
                            // Swipe down detected
                            if (currentIndex > 0) {
                                setCurrentIndex((prevIndex) => prevIndex - 1);
                            }
                        }
                    }
                    Animated.spring(pan, {
                        toValue: 0,
                        easing: Easing.bounce,
                        bounciness: 10,
                        useNativeDriver: true,
                    }).start();
                    pan.flattenOffset();
                },
            }),
        [currentIndex, randomItems.length, pan],
    );

    return (
        <SafeAreaView style={styles.safeArea}>
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
        </SafeAreaView >
    )
}

export default HomeView

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'black',
    },
    fullViewCard: {
        height: screenHeight(),
    },
    image: {
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 10
    },
    foodCard: {
        backgroundColor: '#fff',
        padding: 20,
        marginVertical: 10,
        marginHorizontal: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    foodName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textTransform: 'capitalize',
    },
    nutrientContainer: {
        flexDirection: 'column',
        marginVertical: 10,
    },
    nutrientText: {
        fontSize: 16,
        color: '#555',
        marginVertical: 4,
    },
});
