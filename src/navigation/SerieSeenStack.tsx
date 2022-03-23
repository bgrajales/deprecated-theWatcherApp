import React from 'react'

import { createStackNavigator } from '@react-navigation/stack';

import { SeriesDetailScreen } from '../screens/SeriesDetailScreen';
import { Series } from '../interfaces/movieInterface';
import { SeriesScreen } from '../screens/SeriesScreen';

export type SeriesSeenDetailStackParams = {
    SeriesScreen: undefined;
    SeriesDetailScreen: Series;
}

const Stack = createStackNavigator<SeriesSeenDetailStackParams>();

export const SerieSeenStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
          <Stack.Screen name="SeriesScreen" component={SeriesScreen} />
          <Stack.Screen name="SeriesDetailScreen" component={SeriesDetailScreen} />
        </Stack.Navigator>
      );
}
