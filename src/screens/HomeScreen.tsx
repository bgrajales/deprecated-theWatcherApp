import { BlurView } from 'expo-blur'
import React, { useContext, useEffect, useState } from 'react'

import { ActivityIndicator, Dimensions, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import Icon from 'react-native-vector-icons/Ionicons'
import { getGenresLists } from '../api/TMDBActions'
import { ActorModal } from '../components/ActorModal'
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

  const { isLoading, nowPlaying, popular, popularActors } = useMovies();  
  const { popularSerie } = useSeries();

  const [ movieGenreTitle, setMovieGenreTitle ] = useState('');
  const [ serieGenreTitle, setSerieGenreTitle ] = useState('');
  const [ moviesGenres, setMoviesGenres] = useState([])
  const [ seriesGenres, setSeriesGenres] = useState([])

  const [actorModalVisible, setActorModalVisible] = useState({
    visible: false,
    actor: {} as any
  });

  const [ homeActiveSlide, setHomeActiveSlide ] = useState(0)


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
        <Carousel
          data={ nowPlaying }
          renderItem={ ({ item }) => (
            <MovieCard 
              movie={item} 
              type='movie' 
              width={ Dimensions.get('window').width - 20}
              height={ Dimensions.get('window').width * 0.6 }
              element='homeBackDrop'
            />
          )}
          sliderWidth={ Dimensions.get('window').width }
          itemWidth={ Dimensions.get('window').width - 20  }
          inactiveSlideOpacity={ 0.9 }
          onSnapToItem={ (index) => setHomeActiveSlide(index) }
        />
        <Pagination 
          dotsLength={ nowPlaying.length }
          activeDotIndex={ homeActiveSlide }
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: 4,
            backgroundColor: colorScheme === 'dark' ? '#fff' : '#121212'
          }}
          inactiveDotOpacity={ 0.5 }
          inactiveDotScale={ 0.6 }
          activeOpacity={ 0.8 }
          animatedFriction={ 7 }
          containerStyle={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            marginTop: -10,
            marginBottom: 10,
          }}
        />

        {/* Popular Actors */}

        {
          popularActors.length > 0 &&
          <View 
            style={{ marginBottom: 20 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                marginBottom: 10
              }}
            >
              <Text 
                style={{ 
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colorScheme === 'dark' ? '#fff' : '#121212',
                  marginRight: 10,
                }}
              >{ 
                user?.settings.leng === 'en-US' ? english.popularActors : spanish.popularActors
              }</Text>
              <Icon name="person" size={ 20 } color={ colorScheme === 'dark' ? '#fff' : '#121212' } />
            </View>
            <FlatList 
              horizontal
              showsHorizontalScrollIndicator={ false }
              data={ popularActors }
              keyExtractor={ (item) => item.id.toString() }
              renderItem={ ({ item }) => (
                <TouchableOpacity
                  style={{
                    width: 100,
                    marginRight: 15,
                  }}
                  onPress={ () => setActorModalVisible({
                    visible: true,
                    actor: item
                  }) }
                >
                  <Image
                    style={{ 
                      width: 100, 
                      height: 100, 
                      marginRight: 20,
                      borderRadius: 10,
                    }}
                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.profile_path}` }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: colorScheme === 'dark' ? '#fff' : '#121212',
                      marginTop: 5,
                      textAlign: 'center',
                    }}
                  >
                    {
                      item.name
                    }
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={{
                paddingHorizontal: 20,
              }}
            />
          </View>
        }

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

        <ActorModal modalVisible={actorModalVisible} setActorModalVisible={setActorModalVisible} />
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
