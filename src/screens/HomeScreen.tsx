import React from 'react'

import { ActivityIndicator, Dimensions, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Carousel from 'react-native-snap-carousel'
import Icon from 'react-native-vector-icons/Ionicons'
import { CarrouselCards } from '../components/CarrouselCards'
import { MovieCard } from '../components/MovieCard'

import { useMovies } from '../hooks/useMovies'
import { useSeries } from '../hooks/useSeries'
import { styles } from '../theme/appTheme'

export const HomeScreen = () => {

  const { top } = useSafeAreaInsets();

  const { isLoading, nowPlaying, popular, topRated } = useMovies();  
  const { latestSerie, popularSerie, topRatedSerie } = useSeries();

  if ( isLoading ) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={ 80 }/>
      </View>
    );
  }

  return (
      <ScrollView 
        style={{ paddingTop: top + 20, ...styles.container }}
        contentContainerStyle={{ paddingBottom: 75 }}
      >

        {/* Main Carrousel */}
        <View style={ homeStyles.categContainer }>
          <Text style={ homeStyles.categTitle }>Now Playing</Text>
          <Icon name="film" color="#000" size={ 30 } style={{ marginLeft: 10 }}/>
        </View>
        <Carousel
          data={ nowPlaying }
          renderItem={ ({ item }) => (
            <MovieCard movie={item} />
          )}
          sliderWidth={ Dimensions.get('window').width }
          itemWidth={ 230 }
          loop={ true }
        />

        {/* Generic Carrousels */}
        <CarrouselCards seriesPosters={ latestSerie } title="Latest" iconName="ios-tv" />
        <CarrouselCards moviePosters={ popular } title="Popular" iconName="film"  />
        <CarrouselCards seriesPosters={ popularSerie } title="Popular" iconName="ios-tv" />
        <CarrouselCards seriesPosters={ topRatedSerie } title="Top Rated" iconName="ios-tv" />
        <CarrouselCards moviePosters={ topRated } title="Top Rated" iconName="film" />

        
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
