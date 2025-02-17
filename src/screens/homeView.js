import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MealBasket from '../components/mealBasket';
import { screenHeight } from '../utils/functions';
import { useSelector } from 'react-redux';

const HomeView = () => {
    const currentTheme = useSelector((state) => state.colourTheme.currentTheme);

    return (
        <SafeAreaView style={[styles.safeArea, {
            backgroundColor: currentTheme === 'dark' ? 'black' : 'white',
        }]} >
            <View>
                <Text>
                    Meal History
                </Text>
            </View>
            <MealBasket />
        </SafeAreaView >
    );
};

export default HomeView;

const styles = StyleSheet.create({
    safeArea: {
        height: screenHeight(),
    },
    fullViewCard: {
        height: '100%',
    }
})