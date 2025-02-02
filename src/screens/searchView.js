import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, TextInput, FlatList, Text, TouchableOpacity, View, StyleSheet, useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DEFAULT_PROPS } from '../utils/constants'; // Assuming constants are available
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import FoodItemFullDetails from '../components/foodItemFullDetails';
import { screenHeight, screenWidth } from '../utils/functions';

const SearchView = () => {
    const macrosData = useSelector((state) => state.macrosData.nutrients);
    const currentTheme = useSelector((state) => state.colourTheme.currentTheme);

    const searchInputRef = useRef(null);

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const [foodItemModalVisible, setFoodItemModalVisible] = useState(false);
    const [selectedFoodItem, setSelectedFoodItem] = useState({});
    const [selectedFoodItemName, setSelectedFoodItemName] = useState('');

    const handleSearch = (text) => {
        setQuery(text);

        if (!text) {
            setSuggestions([]);
            return;
        }

        // Filter suggestions based on input
        const filteredSuggestions = Object.keys(macrosData).filter((item) =>
            item.toLowerCase().includes(text.toLowerCase())
        );

        setSuggestions(filteredSuggestions.sort());
    };

    const focusSearchInput = () => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const handleViewFoodItem = (foodItem) => {
        setFoodItemModalVisible(true);
        setSelectedFoodItem(macrosData[foodItem]);
        setSelectedFoodItemName(foodItem);
    };

    useFocusEffect(React.useCallback(() => {
        focusSearchInput();
    }, []));

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme === 'dark' ? 'black' : 'white' }]}>
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
            {/* Search Input */}
            <View style={[styles.searchBar, {
                borderColor: currentTheme === 'dark' ? '#ccc' : '#333',
            }]}>
                <Icon name="search-outline" size={DEFAULT_PROPS.LG_FONT_SIZE} color={currentTheme === 'dark' ? 'white' : 'black'} />
                <TextInput
                    ref={searchInputRef}
                    style={[styles.searchInput, { color: currentTheme === 'dark' ? 'white' : 'black' }]}
                    placeholder="Search..."
                    placeholderTextColor={currentTheme === 'dark' ? '#888' : '#aaa'}
                    value={query}
                    onChangeText={handleSearch}
                    inputMode={'search'}
                />
                {query !== null && query.length > 0 ? (
                    <TouchableOpacity onPress={() => {
                        setQuery('');
                        setSuggestions([]);
                        focusSearchInput();
                    }}>
                        <Icon name="close-outline" size={DEFAULT_PROPS.LG_FONT_SIZE} color={currentTheme === 'dark' ? 'white' : 'black'} />
                    </TouchableOpacity>
                ) : null}
            </View>

            {/* Suggestions List */}
            <FlatList
                data={suggestions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <View>
                        <TouchableOpacity onPress={() => {
                            handleViewFoodItem(item);
                        }}
                            style={styles.suggestionItem}>
                            <Text style={[styles.suggestionText, {
                                color: currentTheme === 'dark' ? '#fff' : '#333',
                            }]}>{item}</Text>
                        </TouchableOpacity>
                        <View style={{ height: 1, backgroundColor: currentTheme === 'dark' ? '#333' : '#ccc' }} />
                    </View>
                )}
                ListEmptyComponent={
                    query.length > 0 ? <Text style={[styles.noResultText, {
                        color: currentTheme === 'dark' ? '#fff' : '#333',
                    }]}>No Suggestions Found</Text> : null
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginHorizontal: 10,
        marginBottom: 20,
    },
    searchInput: {
        marginLeft: 10,
        flex: 1,
        fontSize: DEFAULT_PROPS.MD_FONT_SIZE,
    },
    suggestionItem: {
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    suggestionText: {
        fontSize: DEFAULT_PROPS.MD_FONT_SIZE,
    },
    noResultText: {
        textAlign: 'center',
        fontSize: DEFAULT_PROPS.MD_FONT_SIZE,
        marginTop: 20,
    },
});

export default SearchView;
