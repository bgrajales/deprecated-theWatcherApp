import { BlurView } from 'expo-blur'
import React, { useContext, useEffect, useState } from 'react'

import { ActivityIndicator, Dimensions, FlatList, Image, Modal, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Carousel from 'react-native-snap-carousel'
import Icon from 'react-native-vector-icons/Ionicons'
import { getGenresLists } from '../api/TMDBActions'
import { CarrouselCards } from '../components/CarrouselCards'
import { MovieCard } from '../components/MovieCard'
import { TutorialModal } from '../components/TutorialModal'
import { AuthContext } from '../context/AuthContext'

import { useMovies } from '../hooks/useMovies'
import { useSeries } from '../hooks/useSeries'
import { english } from '../lenguages/english'
import { spanish } from '../lenguages/spanish'
import { styles } from '../theme/appTheme'

export const HomeScreen = () => {

  const { user, colorScheme } = useContext( AuthContext )
  const { top } = useSafeAreaInsets();

  const { isLoading, nowPlaying, popular, topRated } = useMovies();  
  const { popularSerie } = useSeries();

  const [ movieGenreTitle, setMovieGenreTitle ] = useState('');
  const [ serieGenreTitle, setSerieGenreTitle ] = useState('');
  const [ moviesGenres, setMoviesGenres] = useState([])
  const [ seriesGenres, setSeriesGenres] = useState([])


  useEffect(() => {
    
    if ( user?.moviesGenres && user.moviesGenres.length > 0 ) {

      const index = Math.floor( Math.random() * user.moviesGenres.length );

      setGenresListUseEffect('movie', user.moviesGenres[index].genreId);
      setMovieGenreTitle(user.moviesGenres[index].genre);
      
    }

    if ( user?.seriesGenres && user.seriesGenres.length > 0 ) {

      const index = Math.floor( Math.random() * user.seriesGenres.length );

      setGenresListUseEffect('tv', user.seriesGenres[index].genreId);
      setSerieGenreTitle(user.seriesGenres[index].genre);

    }

    return () => {
      setMovieGenreTitle('');
      setSerieGenreTitle('');
    }

  }, [user])

  const setGenresListUseEffect = async (type: 'movie' | 'tv' , genreId: number) => {

    const genreResponse = await getGenresLists({ type, genreId })

    if ( type === 'movie' ) {
      setMoviesGenres( genreResponse.results )
    } else {
      setSeriesGenres( genreResponse.results )
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
        style={{ 
          paddingTop: top + 20, 
          ...styles.container,
          backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff'        
        }}
        contentContainerStyle={{ paddingBottom: 75 }}
      >

        {
          user &&
          <TutorialModal />
        }
        {/* Main Carrousel */}
        <View style={ homeStyles.categContainer }>
          <Text style={{ 
            ...homeStyles.categTitle, 
            color: colorScheme === 'dark' ? '#fff' : '#000'
          }}>
            {
              user?.settings.leng === 'es-ES' ? spanish.homeNowPlaying : english.homeNowPlaying
            }
          </Text>
          <Icon name="film" color={ 
            colorScheme === 'dark' ? '#fff' : '#000'
          } size={ 30 } style={{ marginLeft: 10 }}/>
        </View>
        <Carousel
          data={ nowPlaying }
          renderItem={ ({ item }) => (
            <MovieCard movie={item} type='movie' />
          )}
          sliderWidth={ Dimensions.get('window').width }
          itemWidth={ 250 }
          inactiveSlideOpacity={ 0.9 }
        />

        {/* Generic Carrousels */}
        {
          moviesGenres.length > 0 &&
          <CarrouselCards moviePosters={ moviesGenres } title={movieGenreTitle} iconName="film" />
        }

        {
          seriesGenres.length > 0 &&
          <CarrouselCards seriesPosters={ seriesGenres } title={serieGenreTitle} iconName="ios-tv" />
        }

        <CarrouselCards seriesPosters={ popularSerie } title="Popular" iconName="ios-tv" />
        <CarrouselCards moviePosters={ popular } title="Popular" iconName="film"  />

        
      </ScrollView>
  )
}

const homeStyles = StyleSheet.create({

  categContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },

  categTitle: {
    fontSize: 26,
    fontWeight: 'bold',
  },

});
