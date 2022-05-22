import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, SectionList, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Carousel from 'react-native-snap-carousel'
import { getSeriesNextEpisodes } from '../api/TMDBActions'
import { AuthContext } from '../context/AuthContext'
import { NextEpisodeResponse } from '../interfaces/movieInterface'
import { english } from '../lenguages/english'
import { spanish } from '../lenguages/spanish'

export const SeriesSeen = () => {

  const navigation = useNavigation<any>()

  const { user, colorScheme } = useContext( AuthContext )
  const { top } = useSafeAreaInsets()

  const [ nextEpisodes, setNextEpisodes ] = useState<NextEpisodeResponse[] | undefined>([])

  useEffect(() => {
    if(user) {
        const seriesWatching: number[] = []

        user.series.filter(serie => serie.episodesTotal > serie.episodesWatched).forEach(serie => {
            seriesWatching.push(parseInt(serie.id))
        })

        getNextEpisodesAsync(seriesWatching)

    }
  }, [])

  const getNextEpisodesAsync = async (seriesId: number[]) => {
    const getNext = await getSeriesNextEpisodes({seriesId})
    setNextEpisodes(
        getNext.sort((a, b) => {
            if(a.air_date < b.air_date) return -1
            if(a.air_date > b.air_date) return 1
            return 0
        })
    )
  }

  if ( !user ) {
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={ 80 }/>
        </View>
      );

  } else {
      
      return (
          <>
            <ScrollView style={{ 
                flex: 1, 
                paddingTop: top,
                backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
                }}
                contentContainerStyle={{
                    justifyContent: 'center'
                }}
                >

                {
                    user.series.filter( serie => serie.episodesTotal > serie.episodesWatched ).length === 0 &&
                    user.series.filter( serie => serie.episodesTotal === serie.episodesWatched ).length === 0 &&
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingHorizontal: 20,
                            paddingBottom: 20,
                            flexDirection: 'column',
                            backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
                        }}
                    >
                        <View 
                            style={{
                                height: 250,
                            }}
                        />
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
                {
                    nextEpisodes && nextEpisodes.length > 0 
                    ? <>
                        <View
                        style={{
                            flex: 1,
                            paddingBottom: 20,
                            flexDirection: 'column',
                        }}
                    >
                            <Text style={{ 
                            fontSize: 20, 
                            fontWeight: 'bold', 
                            paddingHorizontal: 14,
                            marginBottom: 10,
                            color: colorScheme === 'dark' ? '#fff' : '#000',
                            textAlign: 'center'
                        }}>
                                {
                                    user?.settings.leng === 'es-ES' ? spanish.seriesScreenUpcEpisodes : english.seriesScreenUpcEpisodes
                                }
                        </Text>
                        
                        <Carousel 
                            data={nextEpisodes}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('SeriesDetailScreen', user.series.find(serie => parseInt(serie.id) === item.serieId))}
                                    style={{
                                        paddingRight: 20,
                                        borderRadius: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        paddingVertical: 10,
                                        paddingLeft: 10,
                                        backgroundColor: colorScheme === 'dark' ? '#363636' : '#ededed',
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,

                                        elevation: 5,
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/w500${item.still_path}` }}
                                        style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 10,
                                            marginRight: 20,
                                            
                                        }}
                                    />
                                    <View style={{
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        flex: 0.9,
                                        flexWrap: 'wrap',
                                        width: '100%',
                                    }}>
                                        <View
                                            style={{
                                                backgroundColor: '#0055ff',
                                                borderRadius: 5,
                                                paddingHorizontal: 10,
                                                paddingVertical: 2,
                                                marginBottom: 2,
                                                width: '110%',
                                            }}
                                        >
                                            <Text style={{ 
                                                fontSize: 16,
                                                color: '#fff', 
                                                fontWeight: 'bold',
                                            }}>{ item.serieName } - { item.name }</Text>                                            
                                        </View>
                                        <Text style={{
                                            marginTop: 5,
                                            fontSize: 18,
                                            color: '#999',
                                            fontWeight: 'bold',
                                        }}>S{
                                            item.season_number.toString().length === 1 ? `0${item.season_number}` : item.season_number
                                        } E{
                                            item.episode_number.toString().length === 1 ? `0${item.episode_number}` : item.episode_number
                                        }</Text>
                                        <Text style={{
                                            marginTop: 5,
                                            fontSize: 14,
                                            color: '#999',
                                        }}>{item.air_date.split('-')[2]}/{item.air_date.split('-')[1]}/{item.air_date.split('-')[0]}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                            sliderWidth={Dimensions.get('window').width}
                            itemWidth={Dimensions.get('window').width - 80}
                            itemHeight={200}
                        />
                    </View>
                    </> 
                    : null
                }
                {
                    user.series.filter( serie => serie.episodesTotal > serie.episodesWatched ).length > 0 &&
                    <>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingHorizontal: 20,
                                paddingBottom: 20,
                                flexDirection: 'row',
                            }}
                        >
                            <Text style={{ 
                                fontSize: 20, 
                                fontWeight: 'bold', 
                                paddingHorizontal: 14,
                                color: colorScheme === 'dark' ? '#fff' : '#000',
                            }}>
                                    {
                                        user?.settings.leng === 'es-ES' ? spanish.seriesScreenCurrentlyWatching : english.seriesScreenCurrentlyWatching
                                    }
                            </Text>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    paddingHorizontal: 14,
                                    color: '#0055ff',
                                }}
                            >
                                {  user.series.filter( serie => serie.episodesTotal > serie.episodesWatched ).length.toString() }
                            </Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                width: '100%',
                                paddingHorizontal: 10,
                                justifyContent: 'space-between',
                                marginBottom: 10,
                            }}
                        >
                            {
                                user.series.filter( serie => serie.episodesTotal > serie.episodesWatched ).map( ( serie, index ) => {
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
                                            onPress={ () => { navigation.navigate('SeriesDetailScreen', serie ) } }
                                            key={ index.toString() }
                                        >
                                            <Image
                                                source={{ uri: `https://image.tmdb.org/t/p/w500${serie.posterPath}` }}
                                                style={{ width: "100%", height: 200, borderRadius: 10 }}
                                            />
            
                                            <View style={{
                                                flex: 1,
                                                width: '100%',
                                                backgroundColor: '#f5f5f5',
                                                height: 8,
                                                position: 'absolute',
                                                bottom: 0,
                                                borderBottomRightRadius: 10,
                                                borderBottomLeftRadius: 10,                                  
                                            }}>
                                            <View style={{
                                                flex: 1,
                                                backgroundColor: (serie.episodesWatched / serie.episodesTotal * 100) === 100 ? '#4BB543' : '#0055FF',
                                                width: `${serie.episodesWatched / serie.episodesTotal * 100}%`,
                                                borderBottomRightRadius: (serie.episodesWatched / serie.episodesTotal * 100) === 100 ? 10 : 0,
                                                borderBottomLeftRadius: 10,  
                                            }} />
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            {
                                user.series.filter( serie => serie.episodesTotal > serie.episodesWatched ).length % 3 !== 0 &&
                                <View style={{ width: '30%' }}/>
                            }
                        </View>
                    </>
                }
                {
                    user.series.filter( serie => serie.episodesTotal === serie.episodesWatched ).length > 0 &&
                    <>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingHorizontal: 20,
                                paddingBottom: 20,
                                flexDirection: 'row',
                            }}
                        >
                            <Text style={{ 
                                fontSize: 20, 
                                fontWeight: 'bold', 
                                paddingHorizontal: 14,
                                color: colorScheme === 'dark' ? '#fff' : '#000',
                            }}>
                                    {
                                        user?.settings.leng === 'es-ES' ? spanish.seriesScreenCompletedSeries : english.seriesScreenCompletedSeries
                                    }
                            </Text>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    paddingHorizontal: 14,
                                    color: '#0055ff',
                                }}
                            >
                                {  user.series.filter( serie => serie.episodesTotal === serie.episodesWatched ).length.toString() }
                            </Text>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                width: '100%',
                                paddingHorizontal: 10,
                                justifyContent: 'space-between',
                            }}
                        >
                            
                            {
                                user.series.filter( serie => serie.episodesTotal === serie.episodesWatched ).map( ( serie, index ) => {
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
                                            onPress={ () => { navigation.navigate('SeriesDetailScreen', serie ) } }
                                            key={ index.toString() }
                                        >
                                            <Image
                                                source={{ uri: `https://image.tmdb.org/t/p/w500${serie.posterPath}` }}
                                                style={{ width: "100%", height: 200, borderRadius: 10 }}
                                            />
            
                                            <View style={{
                                                flex: 1,
                                                width: '100%',
                                                backgroundColor: '#f5f5f5',
                                                height: 8,
                                                position: 'absolute',
                                                bottom: 0,
                                                borderBottomRightRadius: 10,
                                                borderBottomLeftRadius: 10,                                  
                                            }}>
                                            <View style={{
                                                flex: 1,
                                                backgroundColor: (serie.episodesWatched / serie.episodesTotal * 100) === 100 ? '#4BB543' : '#0055FF',
                                                width: `${serie.episodesWatched / serie.episodesTotal * 100}%`,
                                                borderBottomRightRadius: (serie.episodesWatched / serie.episodesTotal * 100) === 100 ? 10 : 0,
                                                borderBottomLeftRadius: 10,  
                                            }} />
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                            {
                                user.series.filter( serie => serie.episodesTotal === serie.episodesWatched ).length % 3 !== 0 &&
                                <View style={{ width: '30%' }}/>
                            }
                        </View>
                    </>
                }
                <View 
                    style={{
                        height: 65
                    }}
                />
            </ScrollView>
          </>
      )
  }
}
