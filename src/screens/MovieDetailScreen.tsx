import { StackScreenProps } from '@react-navigation/stack'
import React, { useContext } from 'react'

import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import StarRating from 'react-native-star-rating';
import { LinearGradient } from "expo-linear-gradient";
import YoutubePlayer from 'react-native-youtube-iframe';

import { useMovieDetails } from '../hooks/useMoviesDetail'
import { DetailStackParams } from '../navigation/DetailStack'
import Carousel from 'react-native-snap-carousel';
import { markMovieAsWatched } from '../api/watcherActions';
import { AuthContext } from '../context/AuthContext';

interface Props extends StackScreenProps<DetailStackParams, 'MovieDetailScreen'>{}

export const MovieDetailScreen = ({ route }: Props) => {

    const movie = route.params
    const { isLoading, movieFull, cast, providers, videos } = useMovieDetails( movie.id )
    const { user, token, updateWatchedMovies } = useContext( AuthContext )

    const uri = `https://image.tmdb.org/t/p/w500${movieFull?.poster_path}`;

    const markMovieWatched = async () => {
      if ( movieFull && user && token ) {
        const marked = await markMovieAsWatched({ user, token, movieId: movieFull.id, posterPath: movieFull.poster_path, runTime: movieFull.runtime })

        if ( marked.result ) {

          updateWatchedMovies( marked.movies )

        }

      }
    }

    if ( isLoading ) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size={ 80 }/>
        </View>
      );
    }

    return (
        <ScrollView
          showsVerticalScrollIndicator={ false }
          contentContainerStyle={{
            paddingBottom: 30,
          }}
        >
            <View 
                style={{
                    position: 'relative',
                    height: 280,
                }}
            >
              <Image 
                source={{ uri }}
                style={{
                    width: '100%',
                    height: 280,
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
                  { movieFull?.title }
                </Text>
              </View>
              <View
                style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    alignItems: 'center',
                    bottom: '8%',
                    right: 0,
                    paddingVertical: 10,
                    borderBottomLeftRadius: 20,
                    borderTopLeftRadius: 20,
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
                  <View>

                    {
                      user?.movies.find( (m: any) => {
                        return parseInt(m.id) === movie.id
                      } ) ? (
                        null
                      ) : (
                        <TouchableOpacity 
                          style={{
                            backgroundColor: '#fff',
                            paddingHorizontal: 5,
                            paddingVertical: 5,
                            borderRadius: 100,
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          activeOpacity={0.7}
                          onPress={ markMovieWatched }
                        >
                          <Image 
                            source={ require('../assets/empty.png') }
                            style={{
                                width: 37,
                                height: 26,
                            }}
                          />
                        </TouchableOpacity>
                      )
                    }
                      
                  </View>
                  <View style={{ width: 15 }}/>
                  <View style={{
                      backgroundColor: '#fff',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTopLeftRadius: 100,
                      borderBottomLeftRadius: 100,
                  }}>
                    <StarRating 
                      disabled={ true }
                      maxStars={ 5 }
                      rating={ movieFull ? movieFull.vote_average / 2 : 0 }
                      starSize={ 20 }
                      fullStarColor={ '#FFD700' }
                      emptyStarColor={ '#FFD700' }
                    />
                  </View>
              </View>
            </View>
            {

              providers?.length > 0 ? (
                <View style={ styles.section }>
                    <Text style={ styles.title }>Watch</Text>
                    <FlatList 
                        horizontal={ true }
                        data={ providers }
                        keyExtractor={ ( provider ) => provider.provider_id.toString() }
                        renderItem={ ({ item }) => (
                          <Image 
                            source={ { uri: `https://image.tmdb.org/t/p/w500${item.logo_path}` } }
                            style={{
                                width: 70,
                                height: 70,
                                marginRight: 10,
                                borderRadius: 10,
                            }}
                          />
                        )}
                        style={{
                          paddingHorizontal: 20,
                        }}
                    />
                </View>
              ) : <View style={{
                    width: 270,
                    marginTop: 20,
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
              }}>
                <Text style={{ 
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 'bold',
                 }}>Not available on any platform</Text>
              </View>


            }

            <View style={ styles.section }>
                <Text style={ styles.title }>Overview</Text>
                <Text style={ styles.text }>{ movieFull?.overview }</Text>
            </View>
            
            <View style={ styles.section }>
                <Text style={ styles.title }>Videos</Text>
                <Carousel 
                    data={ videos }
                    renderItem={ ({ item }) => (
                      <YoutubePlayer 
                          width={ 300 }
                          height={ 170 }
                          videoId={ item.key }
                          play={ false }
                          webViewStyle={{
                            width: 300,
                            height: 170,
                            borderRadius: 10,
                          }}
                          webViewProps={{
                            allowsFullscreenVideo: true,
                          }}                            
                      />
                    )}
                    sliderWidth={ Dimensions.get('window').width }
                    itemWidth={ 300 }
                    itemHeight={ 170 }
                    layout={ 'default' }
                    loop={ false }
                    onSnapToItem={ ( index ) => console.log( index ) }
                />
            </View>
            
            <View style={ styles.section }>
                <Text style={ styles.title }>Cast</Text>
                <FlatList 
                    horizontal={ true }
                    data={ cast }
                    keyExtractor={ ( cast ) => cast.id.toString() }
                    renderItem={ ({ item }) => (
                      <View style={ styles.castDiv }>
                        <Image
                          source={ { uri: item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : `https://critics.io/img/movies/poster-placeholder.png` } }
                          style={{
                              width: 120,
                              height: 180,
                              marginRight: 10,
                              borderRadius: 10,
                          }}
                        />
                        <LinearGradient 
                          colors={["rgba(0,0,0, 0)",  "rgba(0,0,0, 1)", "rgba(0,0,0, 1)"]}
                          style={ styles.castInfo }
                        >
                          <Text style={ styles.castName }>{ item.name }</Text>
                          <Text style={ styles.castChar }>{ item.character }</Text>
                        </LinearGradient>
                      </View>
                    )}
                    style={{
                      paddingHorizontal: 20,
                    }}
                />
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({

    section: {
        marginTop: 20,
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        paddingHorizontal: 20,
    },

    text: {
        paddingHorizontal: 20,
        lineHeight: 25,
        textAlign: 'justify',
    },

    castDiv: {
        flexDirection: 'row',
        position: 'relative',
    },

    castInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 120,
        paddingHorizontal: 6,
        paddingVertical: 10,
        borderRadius: 10,
    },

    castName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        flexWrap: 'wrap',
        color: '#fff',  
    },

    castChar: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        flexWrap: 'wrap',
    },


});
