import React, { useContext } from 'react'

import { createStackNavigator } from '@react-navigation/stack';

import { MovieDetailScreen } from '../screens/MovieDetailScreen';
import { Movie, SearchIndiv, Series } from '../interfaces/movieInterface';
import { SeriesDetailScreen } from '../screens/SeriesDetailScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { AuthContext } from '../context/AuthContext';

export type SearchDetailStackParams = {
    SearchScreen: undefined;
    MovieDetailScreen: Movie;
    SeriesDetailScreen: Series;
}

const Stack = createStackNavigator<SearchDetailStackParams>();

export const SearchDetailStack = () => {

    const { colorScheme } = useContext( AuthContext )

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: {
                    backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff'
                },
            }}
        >
          <Stack.Screen name="SearchScreen" component={SearchScreen} />
          <Stack.Screen name="MovieDetailScreen" component={MovieDetailScreen} />
          <Stack.Screen name="SeriesDetailScreen" component={SeriesDetailScreen} />
        </Stack.Navigator>
      );
}
