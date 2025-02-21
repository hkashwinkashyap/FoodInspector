import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import MealBasket from '../components/mealBasket';
import { screenHeight } from '../utils/functions';
import { useSelector } from 'react-redux';

const SettingsView = () => {
    const currentTheme = useSelector((state) => state.colourTheme.currentTheme);

    return (
        <SafeAreaView style={[styles.safeArea, {
            backgroundColor: currentTheme === 'dark' ? 'black' : 'white',
        }]}>
            <View>
                <Text>
                    Settings
                </Text>
            </View>
            <MealBasket />
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    safeArea: {
        height: screenHeight(),
    },
})

export default SettingsView;
