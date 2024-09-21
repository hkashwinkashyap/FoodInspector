import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import HomeView from './src/screens/homeView';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SettingsView from './src/screens/settingsView';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MealHistoryView from './src/screens/meanHistoryView';
import SearchView from './src/screens/searchView';
import {DEFAULT_PROPS} from './src/utils/constants';
import {Provider} from 'react-redux';
import store, {
  setColourTheme as setColourThemeInStore,
} from './src/utils/store';
import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const dispath = store.dispatch;

  const colorScheme = useColorScheme();
  dispath(setColourThemeInStore(colorScheme));

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({route}) => ({
            tabBarStyle: {
              backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
            },
            tabBarLabelStyle: {
              color: colorScheme === 'dark' ? 'white' : '#333',
              fontSize: DEFAULT_PROPS.MD_FONT_SIZE,
              fontWeight: 'normal',
            },
            tabBarIcon: ({focused}) => {
              let iconName;
              switch (route.name) {
                case 'Home':
                  iconName = 'home-outline';
                  break;
                case 'Search':
                  iconName = 'search-outline';
                  break;
                case 'Meal History':
                  iconName = 'file-tray-full-outline';
                  break;
                case 'Settings':
                  iconName = 'settings-outline';
                  break;
                default:
                  iconName = 'home-outline';
              }
              return (
                <Icon
                  name={iconName}
                  color={colorScheme === 'dark' ? 'white' : '#333'}
                  size={
                    focused
                      ? DEFAULT_PROPS.XL_FONT_SIZE
                      : DEFAULT_PROPS.MD_FONT_SIZE
                  }
                />
              );
            },
            tabBarButton: props => (
              <TouchableOpacity
                onPress={props.onPress}
                style={{
                  backgroundColor:
                    props.accessibilityState?.selected ?? false
                      ? colorScheme === 'dark'
                        ? DEFAULT_PROPS.tabBarBackgroundColorDarkMode
                        : DEFAULT_PROPS.tabBarBackgroundColorLightMode
                      : 'transparent',
                  borderRadius: DEFAULT_PROPS.LG_FONT_SIZE,
                  width: '25%',
                  height: '100%',
                  padding: 4,
                }}>
                {props.children}
              </TouchableOpacity>
            ),
          })}>
          <Tab.Screen
            name="Home"
            component={HomeView}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Search"
            component={SearchView}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Meal History"
            component={MealHistoryView}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsView}
            options={{
              headerShown: false,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
