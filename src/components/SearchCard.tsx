import { useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../context/AuthContext'
import { SearchIndiv } from '../interfaces/movieInterface'

interface Props {
    element: SearchIndiv,
    type: string
}

export const SearchCard = ({ element, type }: Props) => {

  const navigation = useNavigation<any>()
  const { colorScheme } = useContext( AuthContext )

  return (
    <View style={styles.searchCard}>
        <Image 
            style={{ width: 100, height: 150, borderRadius: 10 }}
            source={{ uri: element.poster_path ? `https://image.tmdb.org/t/p/w500${element.poster_path}` : 'https://via.placeholder.com/150' }}
        />

        <View style={styles.searchCardTextDiv}>
            <View style={styles.searchCardTitleYear}>
                <Text style={{
                    ...styles.elementTitle,
                    color: colorScheme === 'dark' ? '#fff' : '#000'
                }}>
                    {
                        type === 'movie' ? element.title : element.name
                    }
                </Text>
                <View style={{ width: 10 }} />
                <Text style={styles.elementYear}>
                    { element.release_date ? element.release_date.substring(0, 4) : '' }
                    <View style={{ width: 5 }} />
                    <Icon 
                        name={
                            type === 'movie' ? 'ios-film' : 'ios-tv'
                        }
                        size={15}
                    />
                </Text>
                    
            </View>
            
            <Text style={styles.elementOverview}>
                { element.overview?.substring(0, 100) + '...' }
            </Text>
        </View>

        <TouchableOpacity
            onPress={() => {
                if (type === 'movie') {
                    navigation.navigate('MovieDetailScreen',  element )
                } else {
                    navigation.navigate('SeriesDetailScreen', element)
                }
            }}
            style={{
                width: 30,
                height: 30,
                borderRadius: 10,
                backgroundColor: '#0055ff',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Icon 
                name="chevron-forward" 
                size={25} 
                color='#fff'
            />
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({

    searchCard: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    searchCardTextDiv: {
        flex: 1,
        paddingLeft: 10,
        justifyContent: 'space-between',
        paddingRight: 10,
    },

    searchCardTitleYear: {
    },

    elementTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    elementYear: {
        fontSize: 14,
        color: '#919191',
    },

    elementOverview: {
        fontSize: 14,
        color: '#666',
        textAlign: 'left',
    },

});