import React, { useContext } from 'react'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { EpisodesScreen } from '../screens/EpisodesScreen';
import { SeriesDetailsComponent } from '../components/SeriesDetailsComponent';
import { AuthContext } from '../context/AuthContext';

const Tab = createMaterialTopTabNavigator();

interface Props {
    seriesId: number;
}

export const SeriesNavigator = ({ seriesId }: Props) => {

    const { colorScheme } = useContext(AuthContext);

  return (
    <Tab.Navigator
        initialRouteName="SeriesDetailScreen"
        sceneContainerStyle={{
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
        }}
        screenOptions={{
            swipeEnabled: false,
            tabBarStyle: {
                backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
                borderTopWidth: 0,
                elevation: 0,
            },
            tabBarLabelStyle: {
                color: colorScheme === 'dark' ? '#fff' : '#000',
            },
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
