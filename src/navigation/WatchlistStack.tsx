import React, { useContext } from 'react'

import { createStackNavigator } from '@react-navigation/stack';

import { MovieDetailScreen } from '../screens/MovieDetailScreen';
import { Movie, Series } from '../interfaces/movieInterface';
import { SeriesDetailScreen } from '../screens/SeriesDetailScreen';
import { WatchListComponent } from '../components/WatchListComponent';

export type WatchlistStackParams = {
    WatchListComponent: undefined;
    MovieDetailScreen: Movie;
    SeriesDetailScreen: Series;
}

const Stack = createStackNavigator<WatchlistStackParams>();

export const WatchlistStack = () => {

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
          <Stack.Screen name="WatchListComponent" component={WatchListComponent} />
          <Stack.Screen name="MovieDetailScreen" component={MovieDetailScreen} />
          <Stack.Screen name="SeriesDetailScreen" component={SeriesDetailScreen} />
        </Stack.Navigator>
      );
}