import React, { useContext, useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CommonActions, useNavigation } from '@react-navigation/native';
import { FadeLoading } from 'react-native-fade-loading';

import { Movie, Series, UserMovies, UserSeries } from '../interfaces/movieInterface';
import { AuthContext } from '../context/AuthContext';
import StarRating from 'react-native-star-rating';

interface Props {
    movie: any;
    height?: number;
    width?: number;
    type: string;
    isLoading?: boolean;
    progressBar?: boolean;
    episodesTotal?: number;
    episodesWatched?: number;
    element?: string;
}

export const MovieCard = ({ movie, height = 350, width = 230, type, progressBar=false, episodesTotal = 0, episodesWatched = 0, element }: Props) => {

  const navigation = useNavigation<any>()

  const { colorScheme } = useContext( AuthContext )

  let uri

if (element === 'homeBackDrop') {
    uri = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
} else if ( movie.poster_path ) {
    uri = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
} else if ( movie.posterPath ) {
    uri = `https://image.tmdb.org/t/p/w500${movie.posterPath}`
}

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
        setIsLoading(false)
    }, 1500)

    return () => {
        setIsLoading(true)
    }
  }, [])

 
  return (
    <TouchableOpacity
        onPress={ () => {
            type === 'movie'
                ? navigation.dispatch(CommonActions.navigate('MovieDetailScreen', movie))
                : navigation.dispatch(CommonActions.navigate('SeriesDetailScreen', movie))
        }}
        activeOpacity={ 0.8 }
        style={{
            width,
            height,
            paddingBottom: 20,
            paddingHorizontal: 5,
        }}
    >
        {
            isLoading && 
            <View
                style={{
                    width: width,
                    height: height,
                    borderRadius: 10,
                    paddingBottom: 20,
                    paddingHorizontal: 5,
                }}
            >
                <FadeLoading
                    style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 10,
                    }}
                    primaryColor={
                        colorScheme === 'dark' ? '#252525' : '#003AAF'
                    }
                    secondaryColor={
                        colorScheme === 'dark' ? '#383838' : '#0055ff'
                    }
                    duration={2000}
                    children={
                        <View />
                    }
                    visible={true}
                    animated={true}
                />
            </View>
        }
        <View style={ styles.imageContainer }>
            <Image
                style={ styles.image }
                source={{ uri }}
            />
            {
                !isLoading && element && element === 'homeBackDrop' && typeof movie &&
                <>
                    <View
                        style={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            backgroundColor: '#0055ff',
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 5,
                        }}
                    >
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: 16,
                                fontWeight: 'bold',
                            }}
                        >{ movie.title }</Text>
                    </View>
                    {
                        movie.vote_average !== 0 &&
                        <View
                            style={{
                            backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 10,
                            paddingHorizontal: 12,
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            borderRadius: 10,
                            }}
                        >
                            <StarRating
                                disabled={ true }
                                maxStars={ 5 }
                                rating={ movie.vote_average / 2 }
                                starSize={ 20 }
                                fullStarColor={ '#FFD700' }
                                emptyStarColor={ '#FFD700' }
                            />
                        </View>
                    }
                </>
            }
            {
                progressBar && episodesTotal && episodesWatched && !isLoading &&
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
                        backgroundColor: (episodesWatched / episodesTotal * 100) === 100 ? '#4BB543' : '#0055FF',
                        width: `${episodesWatched / episodesTotal * 100}%`,
                        borderBottomRightRadius: (episodesWatched / episodesTotal * 100) === 100 ? 10 : 0,
                        borderBottomLeftRadius: 10,  
                    }} />
                    </View>
            }
        </View>
    </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    image: {
        flex: 1,
        borderRadius: 10,
    },

    imageContainer: {
        flex: 1,
        borderRadius: 18,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.24,
        shadowRadius: 7,

        elevation: 10,
    },
});
