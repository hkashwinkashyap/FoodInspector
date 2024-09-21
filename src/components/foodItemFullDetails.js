import { BlurView } from "@react-native-community/blur";
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { screenHeight, screenWidth } from "../utils/functions";
import { DEFAULT_PROPS } from "../utils/constants";

const FoodItemFullDetails = ({ foodItemName, foodItem, visible, width, height, backgroundColor, onClose }) => {
    return (
        <Modal animationType={'fade'} transparent={true} visible={visible}>
            <TouchableOpacity
                onPress={() => {
                    onClose();
                }}
                activeOpacity={1}>
                <BlurView
                    style={{ ...styles.blurContainer, width: screenWidth(), height: screenHeight() }}
                    blurType={backgroundColor === '#333' ? 'dark' : 'light'}
                    blurAmount={5}>
                    <View style={[styles.modalContainer, {
                        backgroundColor: backgroundColor,
                        width: width,
                        height: height,
                    }]}>
                        <TouchableWithoutFeedback>
                            <View>
                                <Text style={[styles.foodName, { color: backgroundColor === '#333' ? 'white' : 'black' }]}>
                                    {foodItemName.split(' ')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(' ')}
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </BlurView>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = {
    foodName: {
        fontSize: DEFAULT_PROPS.XXL_FONT_SIZE,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    blurContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        borderRadius: 10,
        padding: 16,
    },
};

export default FoodItemFullDetails;