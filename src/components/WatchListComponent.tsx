import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AuthContext } from '../context/AuthContext'
import { WatcherUser } from '../interfaces/authInterface'

export const WatchListComponent = () => {

    const { user } = useContext( AuthContext )
    const { top } = useSafeAreaInsets()

    const navigation = useNavigation<any>()

    const [ moviesWatchList, setMoviesWatchList] = useState<WatcherUser['watchlist']>([])
    const [ seriesWatchList, setSeriesWatchList] = useState<WatcherUser['watchlist']>([])

    useEffect(() => {
        if ( user ) {
            setMoviesWatchList( user.watchlist.filter( ( item: any ) => item.type === 'movie' ) )
            setSeriesWatchList( user.watchlist.filter( ( item: any ) => item.type === 'tv' ) )
        } else {
            setMoviesWatchList([])
            setSeriesWatchList([])
        }

        return () => {
            setMoviesWatchList([])
            setSeriesWatchList([])
        }
    }, [user])

    return (
        <View
            style={{
                flex: 1,
                paddingHorizontal: 20,
                paddingTop: top + 5,
                backgroundColor: '#fff',
            }}
        >
            <Text
                style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    marginBottom: 20,
                }}
            >Watch List</Text>

            <View style={{ flex: 1 }}>
                <FlatList
                    data={ moviesWatchList }
                    keyExtractor={ ( item: any ) => item.elementId.toString() }
                    ListHeaderComponent={ () => { 
                        return (
                        <View
                            style={{
                                marginBottom: 20,
                                borderBottomColor: '#0055ff',
                                borderBottomWidth: 2,
                                backgroundColor: '#fff',
                            }}
                        >
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                            }}>Movies</Text>
                        </View>
                    )}}
                    renderItem={ ({ item }: any) => {
                        return (
                            <TouchableOpacity style={{ 
                                flex: 1/3, 
                                marginHorizontal: 8,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,
                            }} activeOpacity={0.8}
                                onPress={ () => {
                                    navigation.navigate('MovieDetailScreen', {
                                        id: item.elementId,
                                    } )
                                }}
                            >
                                <Image
                                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.posterPath}` }}
                                    style={{ width: "100%", height: 170, borderRadius: 10 }}
                                />
                            </TouchableOpacity>
                        )
                    }}
                    numColumns={ 3 }
                    ItemSeparatorComponent={ () => {
                        return (
                            <View style={{ height: 20}}></View>
                        )
                    }}
                    showsVerticalScrollIndicator={ false }
                    stickyHeaderIndices={[0]}
                />
            </View>
            <View style={{ flex: 1, marginTop: 30 }}>
                <FlatList
                    data={ seriesWatchList }
                    keyExtractor={ ( item: any ) => item.elementId.toString() }
                    ListHeaderComponent={ () => { 
                        return (
                        <View
                            style={{
                                marginBottom: 20,
                                borderBottomColor: '#0055ff',
                                borderBottomWidth: 2,
                                backgroundColor: '#fff',
                            }}
                        >
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                            }}>Series</Text>
                        </View>
                    )}}
                    renderItem={ ({ item }: any) => {
                        return (
                            <TouchableOpacity style={{ 
                                flex: 1/3, 
                                marginHorizontal: 8,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,

                                elevation: 5,
                            }} activeOpacity={0.8}
                                onPress={() => {
                                    navigation.navigate('SeriesDetailScreen', {
                                        id: item.elementId,
                                    })
                                }}
                            >
                                <Image 
                                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.posterPath}` }}
                                    style={{ width: "100%", height: 170, borderRadius: 10 }}
                                />
                            </TouchableOpacity>
                        )
                    }}
                    numColumns={ 3 }
                    ItemSeparatorComponent={ () => {
                        return (
                            <View style={{ height: 20}}></View>
                        )
                    }}
                    showsVerticalScrollIndicator={ false }
                    stickyHeaderIndices={[0]}
                />
            </View>
        </View>
    )
}
