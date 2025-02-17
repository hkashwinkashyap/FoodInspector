import { BlurView } from '@react-native-community/blur';
import { Modal, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { screenHeight, screenWidth } from '../utils/functions';
import { DEFAULT_PROPS, KEY_NUTRIENTS_UNITS, MACRO_NUTRIENTS, MICRO_NUTRIENTS, OTHER_CONSTANTS, VITAMINS } from '../utils/constants';
import Icon from 'react-native-vector-icons/Ionicons';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addToMeal } from '../utils/store';

const FoodItemFullDetails = ({
    foodItemName,
    foodItem,
    visible,
    width,
    height,
    backgroundColor,
    onClose
}) => {
    const scrollIndicator = useRef();

    const dispatch = useDispatch();


    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                scrollIndicator.current?.flashScrollIndicators();
            }, 500);
        }
    }, [visible]);

    const renderNutrients = (category, nutrients, units) => (
        <View style={styles.categoryContainer}>
            <View style={{ flexDirection: 'row', gap: 2, alignItems: 'flex-end' }}>
                <Text style={[styles.categoryHeader, { color: backgroundColor === '#333' ? 'white' : 'black' }]}>
                    {category}
                </Text>
                <Text style={{
                    color: backgroundColor === '#333' ? 'white' : 'black',
                    marginBottom: 6,
                }}>
                    {category === 'Macronutrients' ? '(per 100g)' : null}
                </Text>
            </View>
            {Object.keys(nutrients).map((key) => (
                <View key={`category-${key}`} style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '80%' }}>
                        <Text style={[styles.nutrientText, {
                            color: backgroundColor === '#333' ? 'white' : 'black',
                        }]}>
                            {nutrients[key] === 'Caloric Value' ? 'Calories' :
                                nutrients[key] === 'Dietary Fiber' ? 'Fiber' : nutrients[key]}
                        </Text>
                    </View>
                    <View style={{ width: '20%', flexDirection: 'row' }}>
                        <Text style={[styles.nutrientText, {
                            color: backgroundColor === '#333' ? 'white' : 'black',
                        }]}>
                            {foodItem[nutrients[key]] || 'N/A'}
                        </Text>
                        <View style={{ marginLeft: 2 }} />
                        <Text style={[styles.nutrientText, {
                            color: backgroundColor === '#333' ? 'white' : 'black',
                        }]}>
                            {nutrients[key] === 'Caloric Value' ? 'kcal' : units}
                        </Text>
                    </View>
                </View>
            ))}
        </View>
    );

    return (
        <Modal animationType={'fade'} transparent={true} visible={visible}>
            <BlurView
                style={{ ...styles.blurContainer, width: screenWidth(), height: screenHeight() }}
                blurType={backgroundColor === '#333' ? 'dark' : 'light'}
                blurAmount={5}>
                <View style={[styles.modalContainer, {
                    backgroundColor: backgroundColor,
                    width: width,
                    height: height,
                }]}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.headerSection}>
                            <Text style={[styles.foodName, { color: backgroundColor === '#333' ? 'white' : 'black' }]}>
                                {foodItemName.split(' ')
                                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                    .join(' ')}
                            </Text>
                            <TouchableOpacity onPress={onClose}>
                                <Icon name="close-outline" size={DEFAULT_PROPS.XXL_FONT_SIZE} color={backgroundColor === '#333' ? 'white' : 'black'} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            ref={scrollIndicator}
                            contentContainerStyle={{ flexGrow: 1 }}
                            style={[styles.nutrientContainer]}
                            showsVerticalScrollIndicator={true}
                            scrollEnabled={true}
                            nestedScrollEnabled={true}
                        >
                            {renderNutrients('Vitamins', VITAMINS, 'mg')}
                            {renderNutrients('Macronutrients', MACRO_NUTRIENTS, 'g')}
                            {renderNutrients('Micronutrients', MICRO_NUTRIENTS, 'mg')}
                            {renderNutrients('Other', OTHER_CONSTANTS)}
                        </ScrollView>

                        {/* Add to meal */}
                        <TouchableOpacity onPress={() => {
                            // Add to meal
                            dispatch(addToMeal({ itemName: foodItemName, nutrients: foodItem }));
                        }}
                            style={[styles.addToMealButton, {
                                borderColor: backgroundColor === '#333' ? 'white' : 'black',
                            }]}>
                            <View flexDirection={'row'} alignItems={'center'}>
                                <Text style={[styles.nutrientText, {
                                    color: backgroundColor === '#333' ? 'white' : 'black',
                                    fontWeight: 600,
                                }]}>
                                    Add to Meal
                                </Text>
                                <View style={{ marginLeft: 2 }} />
                                <Icon name="add-circle-outline" size={DEFAULT_PROPS.XXL_FONT_SIZE} color={backgroundColor === '#333' ? 'white' : 'black'} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
};

const styles = {
    foodName: {
        fontSize: DEFAULT_PROPS.XXL_FONT_SIZE,
        fontWeight: 'bold',
    },
    blurContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        borderRadius: 10,
        padding: DEFAULT_PROPS.MD_FONT_SIZE,
        marginTop: screenHeight() * 0.04,
        marginBottom: screenHeight() * 0.015,
    },
    nutrientContainer: {
        marginVertical: 10,
        width: '100%',
    },
    categoryContainer: {
        marginVertical: 10,
        alignItems: 'flex-start',
    },
    categoryHeader: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    nutrientText: {
        marginVertical: 5,
    },
    headerSection: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    addToMealButton: {
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
};

export default FoodItemFullDetails;
