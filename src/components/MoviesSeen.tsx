import { useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import { ActivityIndicator, Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AuthContext } from '../context/AuthContext'
import { english } from '../lenguages/english'
import { spanish } from '../lenguages/spanish'
import { MovieCard } from './MovieCard'

export const MoviesSeen = () => {

    const navigation = useNavigation<any>()

    const { user, colorScheme } = useContext( AuthContext )

    const { top } = useSafeAreaInsets()

    if ( !user ) {
    
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size={ 80 }/>
            </View>
          );
    
    } else {
        
        return (
            <View style={{ 
                flex: 1, 
                paddingTop: top,
                backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff'                
            }}>
                {
                    user.movies.length > 0 ?
                    <FlatList 
                        data={ user.movies }
                        keyExtractor={ ( item: any ) => item.id.toString() }
                        ListHeaderComponent={ () => { 
                            return (
                            <View>
                                <Text style={{
                                    fontSize: 24,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    marginVertical: 20,
                                    color: colorScheme === 'dark' ? '#fff' : '#000'
                                }}>
                                    {
                                        user?.settings.leng === 'es-ES' ? spanish.moviesSeenTitles : english.moviesSeenTitles
                                    }
                                </Text>
                            </View>
                        )}}
                        renderItem={ ({ item }: any) => {
                            return (
                                <MovieCard 
                                    movie={ item }
                                    type='movie'
                                    width={ Dimensions.get('window').width / 3 }
                                    height={ 200 }
                                />
                            )
                        }}
                        numColumns={ 3 }
                        contentContainerStyle={{
                            paddingBottom: 20,
                        }}
                    /> :
                    <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        paddingBottom: 20,
                        flexDirection: 'column',
                        backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
                        height: Dimensions.get('window').height

                    }}
                >
                    <Image 
                        source={ require('../assets/fullIcon.png') }
                        style={{ width: 140, height: 100, marginTop: 20, marginBottom: 20}}
                    />
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        paddingHorizontal: 14,
                        color: colorScheme === 'dark' ? '#fff' : '#000',
                        textAlign: 'center', 
                        marginBottom: 20
                    }}>
                            {
                                user?.settings.leng === 'es-ES' ? spanish.moviesSeriesNothingToSee : english.moviesSeriesNothingToSee
                            }
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            paddingHorizontal: 14,
                            color: '#0055ff',
                            textAlign: 'center'
                        }}
                    >
                        {
                            user?.settings.leng === 'es-ES' ? spanish.moviesSeriesAddMovToTrack : english.moviesSeriesAddMovToTrack
                        }
                    </Text>
                    
                    </View>

                }
            </View>
        )
    }
}
                   