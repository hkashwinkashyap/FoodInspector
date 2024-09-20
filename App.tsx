import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import HomeView from './screens/homeView';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SettingsView from './screens/settingsView';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MealHistoryView from './screens/meanHistoryView';
import SearchView from './screens/searchView';
import {DEFAULT_PROPS} from './utils/constants';
import {Provider} from 'react-redux';
import store, {setColourTheme as setColourThemeInStore} from './utils/store';
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
          screenOptions={{
            tabBarStyle: {
              backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
            },
            tabBarLabelStyle: {
              color: colorScheme === 'dark' ? 'white' : 'black',
              fontSize: DEFAULT_PROPS.MD_FONT_SIZE,
            },
          }}>
          <Tab.Screen
            name="Home"
            component={HomeView}
            options={{
              headerShown: false,
              tabBarIcon: () => (
                <Icon
                  name={'home-outline'}
                  color={colorScheme === 'dark' ? 'white' : 'black'}
                  size={DEFAULT_PROPS.LG_FONT_SIZE}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Search"
            component={SearchView}
            options={{
              headerShown: false,
              tabBarIcon: () => (
                <Icon
                  name={'search-outline'}
                  color={colorScheme === 'dark' ? 'white' : 'black'}
                  size={DEFAULT_PROPS.LG_FONT_SIZE}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Meal History"
            component={MealHistoryView}
            options={{
              headerShown: false,
              tabBarIcon: () => (
                <Icon
                  name={'file-tray-full-outline'}
                  color={colorScheme === 'dark' ? 'white' : 'black'}
                  size={DEFAULT_PROPS.LG_FONT_SIZE}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsView}
            options={{
              headerShown: false,
              tabBarIcon: () => (
                <Icon
                  name={'settings-outline'}
                  color={colorScheme === 'dark' ? 'white' : 'black'}
                  size={DEFAULT_PROPS.LG_FONT_SIZE}
                />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default App;
