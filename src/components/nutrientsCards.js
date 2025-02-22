import { useSelector } from "react-redux";
import { DAILY_INTAKE, DAILY_INTAKE_UNITS, DEFAULT_PROPS } from "../utils/constants";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { ProgressBar } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";

const NutrientsCards = ({
    totalNutrition,
    hideViewAllMicros = false,
}) => {
    const currentTheme = useSelector((state) => state.colourTheme.currentTheme);

    const [showAllMicros, setShowAllMicros] = useState(false);

    return (
        <ScrollView contentContainerStyle={styles.contentContainer}>
            {/* Macros */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle,
                { color: currentTheme === 'dark' ? 'white' : 'black' }]}>
                    Macros
                </Text>
                <View style={styles.gridContainer}>
                    {["Calories", "Protein", "Carbohydrates", "Fat"].map(key => (
                        <View key={key} style={[styles.nutrientCard, { backgroundColor: currentTheme === 'dark' ? '#333' : '#FFF' }]}>
                            <Text style={[styles.nutrientTitle, { color: currentTheme === 'dark' ? 'white' : 'black' }]}>{key}</Text>
                            <ProgressBar progress={(totalNutrition[
                                key === "Calories" ? "Caloric Value" : key] || 0) / DAILY_INTAKE[key]}
                                color="#4CAF50" style={styles.progressBar} />
                            <Text style={[styles.nutrientValue, { color: currentTheme === 'dark' ? '#ddd' : '#555' }]}>
                                {totalNutrition[key === "Calories" ? "Caloric Value" : key] || 0}
                                {DAILY_INTAKE_UNITS[key === "Calories" ? "Caloric Value" : key]} / {DAILY_INTAKE[key]} {DAILY_INTAKE_UNITS[key]}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Micros */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle,
                { color: currentTheme === 'dark' ? 'white' : 'black' }]}>
                    Micros
                </Text>
                <View style={styles.gridContainer}>
                    {["Iron", "Calcium", "Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"].map(key => (
                        <View key={key} style={[styles.nutrientCard, { backgroundColor: currentTheme === 'dark' ? '#333' : '#FFF' }]}>
                            <Text style={[styles.nutrientTitle,
                            { color: currentTheme === 'dark' ? 'white' : 'black' }]}>
                                {key}
                            </Text>
                            <ProgressBar progress={(totalNutrition[key] || 0) / DAILY_INTAKE[key]} color="#FF9800" style={styles.progressBar} />
                            <Text style={[styles.nutrientValue,
                            { color: currentTheme === 'dark' ? '#ddd' : '#555' }]}>
                                {totalNutrition[key] || 0} {DAILY_INTAKE_UNITS[key]} / {DAILY_INTAKE[key]} {DAILY_INTAKE_UNITS[key]}
                            </Text>
                        </View>
                    ))}
                </View>
                {!showAllMicros && !hideViewAllMicros && (
                    <TouchableOpacity
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        onPress={() => setShowAllMicros(true)}
                        style={{ width: '100%', alignItems: 'center', marginTop: 10 }}>
                        <Icon name='chevron-down-outline'
                            size={DEFAULT_PROPS.XL_FONT_SIZE}
                            color={currentTheme === 'dark' ? 'white' : 'black'} />
                    </TouchableOpacity>
                )}

                {showAllMicros && !hideViewAllMicros && (
                    <View style={styles.gridContainer}>
                        {["Vitamin B1", "Vitamin B2", "Vitamin B6", "Vitamin E", "Vitamin K", "Magnesium"].map(key => (
                            <View key={key} style={[styles.nutrientCard, { backgroundColor: currentTheme === 'dark' ? '#333' : '#FFF' }]}>
                                <Text style={[styles.nutrientTitle,
                                { color: currentTheme === 'dark' ? 'white' : 'black' }]}>
                                    {key}
                                </Text>
                                <ProgressBar progress={(totalNutrition[key] || 0) / DAILY_INTAKE[key]} color="#FF9800" style={styles.progressBar} />
                                <Text style={[styles.nutrientValue,
                                { color: currentTheme === 'dark' ? '#ddd' : '#555' }]}
                                >{totalNutrition[key] || 0} {DAILY_INTAKE_UNITS[key]} / {DAILY_INTAKE[key]} {DAILY_INTAKE_UNITS[key]}
                                </Text>
                            </View>
                        ))}
                        <TouchableOpacity
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            onPress={() => setShowAllMicros(false)}
                            style={{ width: '100%', alignItems: 'center', marginTop: 10 }}>
                            <Icon name='chevron-up-outline'
                                size={DEFAULT_PROPS.XL_FONT_SIZE}
                                color={currentTheme === 'dark' ? 'white' : 'black'} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    )
}

export default NutrientsCards;

const styles = StyleSheet.create({
    contentContainer: {
        paddingTop: 10,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 20,
    },
    nutrientTitle: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
        fontWeight: 'bold',
    },
    nutrientValue: {
        fontSize: DEFAULT_PROPS.MD_FONT_SIZE,
    },
    greeting: {
        fontSize: DEFAULT_PROPS.XXL_FONT_SIZE,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: DEFAULT_PROPS.LG_FONT_SIZE,
    },
    sectionTitle: {
        fontSize: DEFAULT_PROPS.XL_FONT_SIZE,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    nutrientCard: {
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        width: '48%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        marginVertical: 5,
    }
});