import { StackScreenProps } from '@react-navigation/stack'
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/Ionicons';
import { markSerieAsWatched, updateWatchlist } from '../api/watcherActions';
import { AuthContext } from '../context/AuthContext';

import { useSeriesDetail } from '../hooks/useSeriesDetail'
import { DetailStackParams } from '../navigation/DetailStack'
import { SeriesNavigator } from '../navigation/SeriesNavigation'

interface Props extends StackScreenProps<DetailStackParams, 'SeriesDetailScreen'>{}

export const SeriesDetailScreen = ({ route }: Props) => {

    const series = route.params
    
    
    const { user, updateWatchListContext, updateSeries, colorScheme } = useContext( AuthContext )
    const { isLoading, serieFull } = useSeriesDetail(series.id, user?.region)
    
    const uri = `https://image.tmdb.org/t/p/w500${serieFull?.poster_path}`;

    const saveToWatchList = async () => {

      if ( user ) {

        const elementExists = user!.watchlist.find( (movie: any) => movie.elementId.toString() === serieFull!.id.toString() )
        let resp
        let action

        if ( elementExists ) {
          action = 'remove'
          resp = await updateWatchlist({ userName: user!.userName, id: serieFull!.id, posterPath: serieFull!.poster_path!, type: 'tv', action: 'remove' })
        } else {
          action = 'add'
          resp = await updateWatchlist({ userName: user!.userName, id: serieFull!.id, posterPath: serieFull!.poster_path!, type: 'tv', action: 'add' })
        }

        if ( resp.result ) { 

          if ( action === 'remove' ) {

            const newWatchList = user.watchlist.filter( (element: any) => element.elementId !== serieFull!.id.toString() )

            updateWatchListContext(newWatchList)

          } else {

            const newWatchList = [
                ...user!.watchlist,
                {
                  elementId: serieFull!.id.toString(),
                    posterPath: serieFull!.poster_path!,
                    type: 'tv'
                }
            ]
            updateWatchListContext(newWatchList)

          }

        }
      }

    }

    const markAllSerieWatched = async (action: string) => {

      if ( user ) {

        const resp = await markSerieAsWatched({ 
          userName: user!.userName, 
          id: serieFull!.id, 
          posterPath: serieFull!.poster_path!, 
          action: action,
          serieTotalEpisodes: serieFull?.number_of_episodes,
          seriesSeasons: serieFull?.seasons
        })
  
        if ( resp.result ) {
          updateSeries(resp.seriesUpdate)
        }
      }


    }

    if ( isLoading ) {
        return (
          <View style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff'  
          }}>
            <ActivityIndicator size={ 80 }/>
          </View>
        );
    }

    return (
        <ScrollView
          showsVerticalScrollIndicator={ false }
          contentContainerStyle={{
            height: '100%',
          }}
        >
            <View 
                style={{
                    position: 'relative',
                    height: 200,
                }}
            >
              <Image
                source={{ uri }}
                style={{
                    width: '100%',
                    height: 200,
                }}
              />
              <View
                style={{
                    position: 'absolute',
                    bottom: '20%',
                    left: 0,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    backgroundColor: '#0055FF',
                    borderBottomRightRadius: 20,
                    borderTopRightRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,

                    elevation: 5,
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 26,
                    fontWeight: 'bold',
                  }}
                >
                  { serieFull?.name }
                </Text>
              </View>
                
              <View
                style={{
                  flexDirection: 'row',
                  position: 'absolute',
                  bottom: '8%',
                  right: 0,
                  zIndex: 5,
                  elevation: 5,
                }}
              >

                {
                  user?.watchlist.find( (m: any) => {
                    return parseInt(m.elementId) === serieFull?.id
                  } ) ? (
                    <TouchableOpacity
                      style={{
                        backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
                        paddingHorizontal: 5,
                        paddingVertical: 5,
                        borderRadius: 100,
                        height: 40,
                        width: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      activeOpacity={0.7}
                      onPress={ () => saveToWatchList() }
                    >
                      <Icon
                        name="bookmark"
                        size={ 30 }
                        color="#0055FF"
                        
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
                        paddingHorizontal: 5,
                        paddingVertical: 5,
                        borderRadius: 100,
                        height: 40,
                        width: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      activeOpacity={0.7}
                      onPress={ () => saveToWatchList() }
                    >
                      <Icon
                        name="bookmark-outline"
                        size={ 30 }
                        color="#0055FF"
                      />
                    </TouchableOpacity>
                  )
                }
                <View style={{ width: 10 }}/>
                {
                  user?.series.find( (m: any) => { return parseInt(m.id) === serieFull?.id })?.episodesWatched === serieFull?.number_of_episodes ? (
                    <TouchableOpacity 
                      style={{
                        backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
                        paddingHorizontal: 5,
                        paddingVertical: 5,
                        borderRadius: 100,
                        height: 40,
                        width: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      activeOpacity={0.7}
                      onPress={ () => markAllSerieWatched('remove') }
                    >
                      <Image 
                        source={require('../assets/fullIcon.png')}
                        style={{
                            width: 37,
                            height: 26,
                        }}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      style={{
                        backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
                        paddingHorizontal: 5,
                        paddingVertical: 5,
                        borderRadius: 100,
                        height: 40,
                        width: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      activeOpacity={0.7}
                      onPress={ () => markAllSerieWatched('add') }
                    >
                      <Image 
                        source={require('../assets/empty.png')}
                        style={{
                            width: 37,
                            height: 26,
                        }}
                      />
                    </TouchableOpacity>
                  )
                }
                <View style={{ width: 10 }}/>
                <View
                  style={{
                    backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderBottomLeftRadius: 20,
                    borderTopLeftRadius: 20,
                  }}
                >
                    <StarRating
                      disabled={ true }
                      maxStars={ 5 }
                      rating={ serieFull ? serieFull.vote_average / 2 : 0 }
                      starSize={ 20 }
                      fullStarColor={ '#FFD700' }
                      emptyStarColor={ '#FFD700' }
                    />
                </View>
              </View>
            </View>
            <SeriesNavigator seriesId={ serieFull!.id }/>
        </ScrollView>
    )
}
