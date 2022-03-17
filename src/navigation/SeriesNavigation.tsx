import React from 'react'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { EpisodesScreen } from '../screens/EpisodesScreen';
import { SeriesDetailsComponent } from '../components/SeriesDetailsComponent';

const Tab = createMaterialTopTabNavigator();

interface Props {
    seriesId: number;
}

export const SeriesNavigator = ({ seriesId }: Props) => {
  return (
    <Tab.Navigator
        initialRouteName="SeriesDetailScreen"
        sceneContainerStyle={{ backgroundColor: '#fff' }}
        screenOptions={{
            swipeEnabled: false,
        }}
    >
        <Tab.Screen name="SeriesDetailsComponent" options={{ title: 'Details' }}>
            {
                () => <SeriesDetailsComponent seriesId={seriesId} />
            }
        </Tab.Screen>
        <Tab.Screen name="EpisodesScreen" options={{ title: 'Episodes' }}>
            {
                () => <EpisodesScreen seriesId={seriesId} />
            }
        </Tab.Screen>
    </Tab.Navigator>
  )
}
