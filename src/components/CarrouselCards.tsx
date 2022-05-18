import React, { useContext } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../context/AuthContext'
import { Movie, Series } from '../interfaces/movieInterface'
import { MovieCard } from './MovieCard'

interface Props {
    moviePosters?: Movie[],
    seriesPosters?: Series[],
    title: string,
    iconName: string,
}

export const CarrouselCards = ({ moviePosters, seriesPosters, title, iconName }: Props) => {

  const { colorScheme } = useContext( AuthContext )

  return (
    <>
        <View style={ homeStyles.categContainer }>
            <Text style={{ 
              ...homeStyles.categTitle,
              color: colorScheme === 'dark' ? '#fff' : '#000' 
            }}>{title}</Text>
            <Icon name={iconName} color={
              colorScheme === 'dark' ? '#fff' : '#000'
            } size={ 30 } style={{ marginLeft: 10 }}/>
        </View>
        {
            moviePosters &&
            <FlatList
                data={ moviePosters }
                renderItem={ ({ item }) => (
                <MovieCard movie={item} width={ 160 } height={ 250 } type='movie' />
                )}
                keyExtractor={ (item) => item.id.toString() }
                horizontal={ true }
                showsHorizontalScrollIndicator={ false }
                style={{ paddingLeft: 20 }}
                contentContainerStyle={{ paddingRight: 30 }}
            />
        }
        {
            seriesPosters &&
            <FlatList
                data={ seriesPosters }
                renderItem={ ({ item }) => (
                <MovieCard movie={item} width={ 160 } height={ 250 } type='series' />
                )}
                keyExtractor={ (item) => item.id.toString() }
                horizontal={ true }
                showsHorizontalScrollIndicator={ false }
                style={{ paddingLeft: 20 }}
                contentContainerStyle={{ paddingRight: 30 }}
            />
        }
    </>
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
  
