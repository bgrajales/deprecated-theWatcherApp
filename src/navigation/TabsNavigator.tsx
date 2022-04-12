import React, { useContext } from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import { ProfileScreen } from '../screens/ProfileScreen';
import { Platform } from 'react-native';
import { DetailStack } from './DetailStack';
import { SearchDetailStack } from './SearchStack';
import { AuthContext } from '../context/AuthContext';
import { MovieSeenStack } from './MovieSeenStack';
import { SerieSeenStack } from './SerieSeenStack';

const Tab = createBottomTabNavigator();

export const TabsNavigator = () => {

  const { status } = useContext(AuthContext);

  return (
    <Tab.Navigator
        initialRouteName='DetailStack'
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#fff',
            tabBarActiveBackgroundColor: '#003AAF',
            tabBarLabelStyle: {
              paddingBottom: ( Platform.OS === 'android' ? 10 : 0 ),
            },
            tabBarStyle: {
              height: ( Platform.OS === 'android' ? 60 : 85 ),
              borderWidth: 0,
              elevation: 0,
              backgroundColor: '#0055FF',
            },
            tabBarItemStyle: {
              borderRadius: 20,
              padding: 6,
              marginTop: 5,
              marginHorizontal: 10,
            }
        }}
    >
        <Tab.Screen 
          name="SerieSeenStack" 
          component={SerieSeenStack} 
          options={{ 
            tabBarLabel: 'Series',
            tabBarIcon: ({ color, size }) => (
              <Icon name="tv" color={color} size={size} />
            )
          }} 
        />
        <Tab.Screen 
          name="MovieSeenStack" 
          component={MovieSeenStack}
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
