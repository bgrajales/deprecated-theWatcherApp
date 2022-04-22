import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CommonActions, useNavigation } from '@react-navigation/native';
import { FadeLoading } from 'react-native-fade-loading';

import { Movie, Series } from '../interfaces/movieInterface';

interface Props {
    movie: Movie | Series;
    height?: number;
    width?: number;
    type: string;
    isLoading?: boolean;
}

export const MovieCard = ({ movie, height = 350, width = 230, type }: Props) => {

  const navigation = useNavigation<any>()
  
  const uri = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
        setIsLoading(false)
  }, [])



  if (isLoading) {
    return (
        <FadeLoading 
            style={{
                height: height,
                width: width,
                borderRadius: 10,
                marginRight: 20,
            }}
            primaryColor='lightgray'
            secondaryColor='whitesmoke'
            duration={2000}
            children={
                <View />
            }
            visible={true}
            animated={true}
        />
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
            marginHorizontal: 2,
            paddingBottom: 20,
            paddingHorizontal: 5,
        }}
    >
        <View style={ styles.imageContainer }>
            <Image
                style={ styles.image }
                source={{ uri }}
            />
        </View>
    </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    image: {
        flex: 1,
        borderRadius: 15,
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
