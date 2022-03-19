import React, { useContext } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import { ProfileScreen } from '../screens/ProfileScreen';
import { SeriesScreen } from '../screens/SeriesScreen';
import { MoviesScreen } from '../screens/MoviesScreen';
import { Platform } from 'react-native';
import { DetailStack } from './DetailStack';
import { SearchDetailStack } from './SearchStack';
import { AuthContext } from '../context/AuthContext';

const Tab = createBottomTabNavigator();

export const TabsNavigator = () => {

  const { status } = useContext(AuthContext);

  return (
    <Tab.Navigator
        initialRouteName='MoviesScreen'
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: '#fff',
            tabBarLabelStyle: {
              paddingBottom: ( Platform.OS === 'android' ? 10 : 0 ),
            },
            tabBarStyle: {
              height: ( Platform.OS === 'android' ? 60 : 80 ),
              borderWidth: 0,
              elevation: 0,
              opacity: 0.8,
              backgroundColor: '#0055FF',
            },
        }}
    >
        <Tab.Screen 
          name="SeriesScreen" 
          component={SeriesScreen} 
          options={{ 
            tabBarLabel: 'Series',
            tabBarIcon: ({ color, size }) => (
              <Icon name="tv" color={color} size={size} />
            )
          }} 
        />
        <Tab.Screen 
          name="MoviesScreen" 
          component={MoviesScreen}
          options={{
            tabBarLabel: 'Movies',
            tabBarIcon: ({ color, size }) => (
              <Icon name="film" color={color} size={size} />
            )
          }}
        />
        <Tab.Screen 
          name="DetailStack" 
          component={DetailStack}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            )
          }}
        />
        <Tab.Screen 
          name="SearchDetailStack" 
          component={SearchDetailStack}
          options={{
            tabBarLabel: 'Search',
            tabBarIcon: ({ color, size }) => (
              <Icon name="search" color={color} size={size} />
            )
          }}
        />
        <Tab.Screen 
          name="ProfileScreen" 
          component={ProfileScreen}
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Icon name="person" color={color} size={size} />
            )
          }}
        />
    </Tab.Navigator>
  )
}
