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
import AppLoading from 'expo-app-loading';
import { english } from '../lenguages/english';
import { spanish } from '../lenguages/spanish';

const Tab = createBottomTabNavigator();

export const TabsNavigator = () => {

  const { user, colorScheme, isLoadingUser } = useContext(AuthContext);

  if ( isLoadingUser ) {
    return <AppLoading />
  }

  return (
    <Tab.Navigator
        initialRouteName='DetailStack'
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#fff',
            tabBarActiveBackgroundColor: colorScheme === 'dark' ? '#252525' : '#003AAF',
            tabBarLabelStyle: {
              paddingBottom: ( Platform.OS === 'android' ? 5 : 0 ),
            },
            tabBarStyle: {
              height: ( Platform.OS === 'android' ? 75 : 85 ),
              borderWidth: 0,
              elevation: 0,
              backgroundColor: colorScheme === 'dark' ? '#383838' : '#0055ff',
              borderTopColor: colorScheme === 'dark' ? '#383838' : '#0055ff',
            },
            tabBarItemStyle: {
              borderRadius: 20,
              padding: 6,
              marginTop: 5,
              marginBottom: ( Platform.OS === 'android' ? 6 : 0 ),
              marginHorizontal: 10,
            }
        }}
        sceneContainerStyle={ { backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff' } }
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
            tabBarLabel: user?.settings.leng === 'es-ES' ? spanish.navBarMovies : english.navBarMovies,
            tabBarIcon: ({ color, size }) => (
              <Icon name="film" color={color} size={size} />
            )
          }}
        />
        <Tab.Screen 
          name="DetailStack" 
          component={DetailStack}
          options={{
            tabBarLabel: user?.settings.leng === 'es-ES' ? spanish.navBarHome : english.navBarHome,
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            )
          }}
        />
        <Tab.Screen 
          name="SearchDetailStack" 
          component={SearchDetailStack}
          options={{
            tabBarLabel: user?.settings.leng === 'es-ES' ? spanish.navBarSearch : english.navBarSearch,
            tabBarIcon: ({ color, size }) => (
              <Icon name="search" color={color} size={size} />
            )
          }}
        />
        <Tab.Screen 
          name="ProfileScreen" 
          component={ProfileScreen}
          options={{
            tabBarLabel: user?.settings.leng === 'es-ES' ? spanish.navBarProfile : english.navBarProfile,
            tabBarIcon: ({ color, size }) => (
              <Icon name="person" color={color} size={size} />
            )
          }}
        />
    </Tab.Navigator>
  )
}
