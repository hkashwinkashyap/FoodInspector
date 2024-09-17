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
import {DEFAULT_PROPS} from './constants';
import {Provider} from 'react-redux';
import store from './utils/store';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={{
            tabBarStyle: {backgroundColor: 'black'},
            tabBarLabelStyle: {
              color: 'white',
              fontSize: DEFAULT_PROPS.MD_FONT_SIZE,
            },
          }}>
          <Tab.Screen
            name="Home"
            component={HomeView}
            options={{
              headerShown: false,
              // tabBarIcon: () => (
              //   <Icon name="home" color={'white'} size={DEFAULT_PROPS.MD_FONT_SIZE}/>
              // )
            }}
          />
          <Tab.Screen
            name="Search"
            component={SearchView}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Meal History"
            component={MealHistoryView}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsView}
            options={{headerShown: false}}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
