import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';

import { MovieDetailScreen } from '../screens/MovieDetailScreen';
import { Movie } from '../interfaces/movieInterface';
import { MoviesScreen } from '../screens/MoviesScreen';

export type MovieSeenDetailStackParams = {
    MoviesScreen: undefined;
    MovieDetailScreen: Movie;
}

const Stack = createStackNavigator<MovieSeenDetailStackParams>();

export const MovieSeenStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
          <Stack.Screen name="MoviesScreen" component={MoviesScreen} />
          <Stack.Screen name="MovieDetailScreen" component={MovieDetailScreen} />
        </Stack.Navigator>
      );
}
