import { DrawerActions, useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
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

        <ScrollView
            showsVerticalScrollIndicator={ false }
        >
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

            <View 
                style={{
                    borderBottomColor: '#e6e6e6',
                    borderBottomWidth: 1,
                    width: '100%',
                    marginBottom: 20,
                }}
            />

            <Text style={{
                fontSize: 26, 
                fontWeight: 'bold', 
                marginBottom: 20, 
                color: colorScheme === 'dark' ? '#fff' : '#000',
                textAlign: 'center'
            }}>
                Features
            </Text>

            <View
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    marginBottom: 35 
                }}
            >
                <Icon name='bookmark' size={30} color='#0055ff' style={{ marginRight: 20 }} />
                <Text style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: colorScheme === 'dark' ? '#e6e6e6' : '#000'
                }}>
                    Use the 'bookmark' icon on shows and movies to add them to your watchlist
                </Text>
            </View>
            <View
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    marginBottom: 35 
                }}
            >
                <Text style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: colorScheme === 'dark' ? '#e6e6e6' : '#000',
                    paddingRight: 20,
                }}>
                    Use the watcher eye on shows and movies to mark them as watched, you can mark entire shows, season or individual episodes
                </Text>
                <Image 
                    source={require('../assets/fullIcon.png')}
                    style={{ width: 40, height: 30}}
                />
            </View>
            <View
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    marginBottom: 35 
                }}
            >
                <Icon name='search' size={30} color='#0055ff' style={{ marginRight: 10 }} />
                <Text style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: colorScheme === 'dark' ? '#e6e6e6' : '#000',
                }}>
                    Use the search screen to find shows and movies
                </Text>
            </View>
            <View
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    marginBottom: 35 
                }}
            >
                <Text style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: colorScheme === 'dark' ? '#e6e6e6' : '#000',
                    paddingRight: 20,
                }}>
                    Keep track of watched movies and shows in the Series and Movies tabs
                </Text>
                <Icon name='tv' size={30} color='#0055ff' style={{ marginRight: 10 }} />
            </View>
            <View
                style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                    marginBottom: 35 
                }}
            >
                <Icon name='chatbubbles' size={30} color='#0055ff' style={{ marginRight: 10 }} />
                <Text style={{
                    fontSize: 16,
                    textAlign: 'center',
                    color: colorScheme === 'dark' ? '#e6e6e6' : '#000',
                }}>
                    Comment on your favourite shows and movies and see what others think
                </Text>
            </View>
        </ScrollView>
    </View>
  )
}
