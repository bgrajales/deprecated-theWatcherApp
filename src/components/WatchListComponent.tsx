import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AuthContext } from '../context/AuthContext'
import { WatcherUser } from '../interfaces/authInterface'

export const WatchListComponent = () => {

    const { user, colorScheme } = useContext( AuthContext )
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
        <ScrollView
            style={{
                flex: 1,
                paddingHorizontal: 20,
                paddingTop: top + 5,
                backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff'
            }}
        >
            <Text
                style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    marginBottom: 20,
                    color: colorScheme === 'dark' ? '#fff' : '#000'
                }}
            >Watchlist</Text>

                {/* <FlatList
                    data={ moviesWatchList }
                    keyExtractor={ ( item: any ) => item.elementId.toString() }
                    ListHeaderComponent={ () => { 
                        return (
                        <View
                            style={{
                                marginBottom: 20,
                                borderBottomColor: '#0055ff',
                                borderBottomWidth: 2,
                                backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff'
                            }}
                        >
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: colorScheme === 'dark' ? '#e6e6e6' : '#000'
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
                                backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff'
                            }}
                        >
                            <Text style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: colorScheme === 'dark' ? '#e6e6e6' : '#000'
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
                /> */}
                
                <View
                    style={{
                        flex: 1,
                        paddingBottom: 20,
                        flexDirection: 'row',
                    }}
                >
                    <Text style={{ 
                        fontSize: 20, 
                        fontWeight: 'bold', 
                        color: colorScheme === 'dark' ? '#fff' : '#000',
                    }}>
                            Movies
                    </Text>
                
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            paddingHorizontal: 14,
                            color: '#0055ff',
                        }}
                    >
                        { moviesWatchList.length }
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: '100%',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                    }}
                >
                    {
                        moviesWatchList.map( ( movie, index ) => {
                            return (
                                <TouchableOpacity style={{ 
                                    width: '30%',
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                    marginBottom: 10,
                                }} 
                                    activeOpacity={0.7}
                                    onPress={ () => { navigation.navigate('MovieDetailScreen', {
                                        id: movie.elementId,
                                        })
                                    }}
                                    key={ index.toString() }
                                >
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.posterPath}` }}
                                        style={{ width: "100%", height: 200, borderRadius: 10 }}
                                    />
                                </TouchableOpacity>
                            )
                        })
                    }
                    {
                        moviesWatchList.length % 3 !== 0 &&
                        <View style={{ width: '30%' }}/>
                    }
                </View>
               
                <View
                    style={{
                        flex: 1,
                        paddingBottom: 20,
                        flexDirection: 'row',
                    }}
                >
                    <Text style={{ 
                        fontSize: 20, 
                        fontWeight: 'bold', 
                        color: colorScheme === 'dark' ? '#fff' : '#000',
                    }}>
                            Series
                    </Text>
                
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            paddingHorizontal: 14,
                            color: '#0055ff',
                        }}
                    >
                        { seriesWatchList.length }
                    </Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: '100%',
                        justifyContent: 'space-between',
                        marginBottom: 10,
                    }}
                >
                    {
                        seriesWatchList.map( ( serie, index ) => {
                            return (
                                <TouchableOpacity style={{ 
                                    width: '30%',
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 2,
                                    },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 5,
                                    marginBottom: 10,
                                }} 
                                    activeOpacity={0.7}
                                    onPress={ () => { navigation.navigate('SeriesDetailScreen', {
                                        id: serie.elementId,
                                        })
                                    }}
                                    key={ index.toString() }
                                >
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/w500${serie.posterPath}` }}
                                        style={{ width: "100%", height: 200, borderRadius: 10 }}
                                    />
                                </TouchableOpacity>
                            )
                        })
                    }
                    {
                        seriesWatchList.length % 3 !== 0 &&
                        <View style={{ width: '30%' }}/>
                    }
                </View>

                <View 
                    style={{ height: 65 }}
                />
        </ScrollView>
    )
}
