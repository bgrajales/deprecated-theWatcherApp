import React, { useContext, useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CommonActions, useNavigation } from '@react-navigation/native';
import { FadeLoading } from 'react-native-fade-loading';

import { Movie, Series, UserMovies, UserSeries } from '../interfaces/movieInterface';
import { AuthContext } from '../context/AuthContext';

interface Props {
    movie: Movie | Series | UserMovies | UserSeries ;
    height?: number;
    width?: number;
    type: string;
    isLoading?: boolean;
    progressBar?: boolean;
    episodesTotal?: number;
    episodesWatched?: number;
}

export const MovieCard = ({ movie, height = 350, width = 230, type, progressBar=false, episodesTotal = 0, episodesWatched = 0 }: Props) => {

  const navigation = useNavigation<any>()

  const { colorScheme } = useContext( AuthContext )

  let uri

  if ( movie.poster_path ) {
    uri = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
} else if (movie.posterPath ) {
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



  if (isLoading) {
    return (
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
    );

  }

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
        <View style={ styles.imageContainer }>
            <Image
                style={ styles.image }
                source={{ uri }}
            />
            {
                progressBar && episodesTotal && episodesWatched &&
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
