import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';

import { MovieDetailScreen } from '../screens/MovieDetailScreen';
import { Movie, SearchIndiv, Series } from '../interfaces/movieInterface';
import { SeriesDetailScreen } from '../screens/SeriesDetailScreen';
import { SearchScreen } from '../screens/SearchScreen';

export type SearchDetailStackParams = {
    SearchScreen: undefined;
    MovieDetailScreen: Movie;
    SeriesDetailScreen: Series;
}

const Stack = createStackNavigator<SearchDetailStackParams>();

export const SearchDetailStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen name="MovieDetailScreen" component={MovieDetailScreen} />
          <Stack.Screen name="SeriesDetailScreen" component={SeriesDetailScreen} />
        </Stack.Navigator>
      );
}
