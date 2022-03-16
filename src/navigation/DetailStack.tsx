import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen } from '../screens/HomeScreen';
import { MovieDetailScreen } from '../screens/MovieDetailScreen';
import { Movie, Series } from '../interfaces/movieInterface';
import { SeriesDetailScreen } from '../screens/SeriesDetailScreen';

export type DetailStackParams = {
    HomeScreen: undefined;
    MovieDetailScreen: Movie;
    SeriesDetailScreen: Series;
}

const Stack = createStackNavigator<DetailStackParams>();

export const DetailStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="MovieDetailScreen" component={MovieDetailScreen} />
          <Stack.Screen name="SeriesDetailScreen" component={SeriesDetailScreen} />
        </Stack.Navigator>
      );
}
