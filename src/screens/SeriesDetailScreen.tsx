import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { ActivityIndicator, Image, ScrollView, Text, View } from 'react-native'

import StarRating from 'react-native-star-rating';

import { useSeriesDetail } from '../hooks/useSeriesDetail'
import { DetailStackParams } from '../navigation/DetailStack'
import { SeriesNavigator } from '../navigation/SeriesNavigation'

interface Props extends StackScreenProps<DetailStackParams, 'SeriesDetailScreen'>{}

export const SeriesDetailScreen = ({ route }: Props) => {

    const series = route.params

    const { isLoading, serieFull } = useSeriesDetail(series.id)

    const uri = `https://image.tmdb.org/t/p/w500${serieFull?.poster_path}`;

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
                    position: 'absolute',
                    bottom: '8%',
                    right: 0,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    backgroundColor: '#fff',
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
            <SeriesNavigator seriesId={ serieFull!.id }/>
        </ScrollView>
    )
}
