import { DrawerActions, useNavigation } from '@react-navigation/native'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'

export const WatchList = () => {
    
    const navigation = useNavigation()
    const { top } = useSafeAreaInsets()

  return (
    <View
        style={{
            flex: 1,
            paddingTop: top + 20,
            paddingHorizontal: 20,
            justifyContent: 'center',
        }}
    >

        <TouchableOpacity
            onPress={ () => navigation.dispatch( DrawerActions.openDrawer() ) }
            style={{
                position: 'absolute',
                top: top + 5,
                right: 20,
                zIndex: 10
            }}
        >
            <Icon name='menu' size={30} color='#000' style={{ marginLeft: 20 }} />
        </TouchableOpacity>

        <Text>
            WatchList
        </Text>
    </View>
  )
}
