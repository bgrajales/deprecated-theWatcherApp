import { DrawerActions, useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../context/AuthContext'

export const About = () => {
    
    const navigation = useNavigation()
    const { top } = useSafeAreaInsets()

    const { colorScheme } = useContext( AuthContext )


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
            <Icon name='menu' size={30} color={
                colorScheme === 'dark' ? '#fff' : '#000'
            } style={{ marginLeft: 20 }} />
        </TouchableOpacity>

        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Image
                source={require('../assets/fullIcon.png')}
                style={{
                    width: 150,
                    height: 105,
                    marginBottom: 20

                }}
            />
            <Text style={{ 
                fontSize: 26, 
                fontWeight: 'bold', 
                marginBottom: 20, 
                color: colorScheme === 'dark' ? '#fff' : '#000'    
            }}>
                About The Watcher App
            </Text>
        </View>


        <Text style={{ 
            fontSize: 16, 
            marginBottom: 20, 
            textAlign: 'center',
            color: colorScheme === 'dark' ? '#e6e6e6' : '#000'
        }}>
            The Watcher App is a simple app that allows you to keep track of the episodes of TV shows and movies you watch.
        </Text>
        <Text style={{ 
            fontSize: 16, 
            marginBottom: 20, 
            textAlign: 'center',
            color: colorScheme === 'dark' ? '#e6e6e6' : '#000'
         }}>
            You can add your favorite shows and movies to the app and mark them as watched, which will be saved in the Series and Movies tabs.
        </Text>

        <View
            style={{
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                paddingHorizontal: 40,
            }}
        >
            <Image 
                source={require('../assets/tmdb-logo.png')}
                style={{ width: 60, height: 43, marginBottom: 20 }}
            />
            <View style={{ width: 15 }}/>
            <Text style={{ 
                fontSize: 16, 
                marginBottom: 20, 
                textAlign: 'center',
                fontWeight: 'bold',
                color: colorScheme === 'dark' ? '#e6e6e6' : '#000'
             }}>
                This product uses the TMDB API but is not endorsed or certified by TMDB.
            </Text>
        </View>
    </View>
  )
}
