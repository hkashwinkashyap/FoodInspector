import React from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { DEFAULT_PROPS } from "../utils/constants";
import { Badge } from "react-native-elements";
import { useNavigation, useRoute } from "@react-navigation/native";
import { setLastTab } from "../utils/store";
import { screenHeight } from "../utils/functions";

const MealBasket = () => {
    const mealItems = useSelector(state => state.meal.items); // Redux state
    const slideAnim = React.useRef(new Animated.Value(300)).current; // Initial hidden position

    const currentTheme = useSelector((state) => state.colourTheme.currentTheme);

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const route = useRoute()

    // Animate in/out
    React.useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: mealItems.length > 0 ? 0 : 300, // Slide in if items exist
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [mealItems, slideAnim]);

    return (
        <Animated.View style={[styles.buttonContainer,
        { transform: [{ translateX: slideAnim }] },
        { backgroundColor: currentTheme === "dark" ? "#333" : "#E0E0E0" }
        ]}>
            <TouchableOpacity style={styles.toggleButton} onPress={() => {
                dispatch(setLastTab(route.name))
                navigation.navigate("CreateMealScreen")
            }}>
                <Icon name="restaurant-outline" size={DEFAULT_PROPS.XL_FONT_SIZE}
                    color={currentTheme === "dark" ?
                        DEFAULT_PROPS.tabBarBackgroundColorLightMode
                        : DEFAULT_PROPS.tabBarBackgroundColorDarkMode} />
                <Badge value={mealItems.length}
                    status="secondary"
                    containerStyle={styles.badge}
                    badgeStyle={
                        {
                            backgroundColor: currentTheme === "dark" ?
                                DEFAULT_PROPS.tabBarBackgroundColorLightMode
                                : DEFAULT_PROPS.tabBarBackgroundColorDarkMode,
                            transform: [{ scale: 0.8 }]
                        }
                    }
                    textStyle={
                        {
                            color: currentTheme === "dark" ?
                                DEFAULT_PROPS.tabBarBackgroundColorDarkMode
                                : DEFAULT_PROPS.tabBarBackgroundColorLightMode

                        }
                    }
                />
            </TouchableOpacity>
        </Animated.View >
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        position: "absolute",
        right: 0,
        bottom: screenHeight() * 0.1,
        padding: 10,
        borderTopLeftRadius: DEFAULT_PROPS.LG_FONT_SIZE,
        borderBottomLeftRadius: DEFAULT_PROPS.LG_FONT_SIZE,
    },
    toggleButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
    },
    badge: {
        position: 'absolute',
        top: -8,
        right: -8,
        zIndex: 1,
    }
});

export default MealBasket;
