import { DrawerActions, useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../context/AuthContext'
import { WatcherUser } from '../interfaces/authInterface';
import { WatchlistStack } from '../navigation/WatchlistStack'

export const WatchList = () => {
    
    const navigation = useNavigation()
    const { top } = useSafeAreaInsets()
    const { colorScheme } = useContext( AuthContext )

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
            }}
        >

            <TouchableOpacity
                onPress={ () => navigation.dispatch( DrawerActions.openDrawer() ) }
                style={{
                    position: 'absolute',
                    top: top + 5,
                    right: 20,
                    zIndex: 10,
                    backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
                    borderRadius: 50,
                    padding: 3,
                }}
            >
                <Icon name='menu' size={30} color={
                    colorScheme === 'dark' ? '#fff' : '#000'
                } />
            </TouchableOpacity>

            <WatchlistStack />
        </View>
    )
}
