import React, { useContext, useEffect, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/Ionicons';
import { updateEpisode } from '../api/watcherActions';
import { AuthContext } from '../context/AuthContext';

import { useSeriesDetail } from '../hooks/useSeriesDetail';
import { Episode, SeriesSeason } from '../interfaces/movieInterface';

interface Props {
    seriesId: number;
}

export const EpisodesScreen = ({ seriesId }: Props) => {

    const { user, token, updateWatchedSeries } = useContext( AuthContext )

    const [activeSection, setActiveSection] = useState({
        section: null,
    })
    
    const { seasons, serieFull } = useSeriesDetail(seriesId)

    useEffect(() => {
    }, [activeSection.section])

    const renderHeader = ( season: SeriesSeason ) => {
 
        return(
            <View style={{ 
                ...styles.accHeader, 
                borderBottomRightRadius: activeSection.section === season.id ? 0 : 10,
                borderBottomLeftRadius: activeSection.section === season.id ? 0 : 10,
            }}>
                <Text style={ styles.accHeaderText}>{season.name}</Text>
                <Icon name="ios-arrow-down" size={20} />
            </View>
        )

    }

    const markEpisodeWatched = async (season: SeriesSeason, episode: Episode) => {
        
        if ( serieFull && user && token ) {
            const marked = await updateEpisode({ 
                user, 
                token,
                serieId: serieFull.id,
                posterPath: serieFull.poster_path || '',
                serieTotalEpisodes: serieFull.number_of_episodes,
                seasonId: season.id,
                seasonNumber: season.season_number,
                episodeNumber: episode.episode_number  
            })
    
            if ( marked.result ) {
    
                updateWatchedSeries( marked.series )
    
            }
    
          }
    }

    const renderContent = ( season: SeriesSeason ) => {

        return (
            <View style={ styles.accContent }>
                {
                    season.episodes.map( ( episode: Episode ) => {
                        return (
                            <View key={ episode.id } style={ styles.accContentItem }>

                                <TouchableOpacity
                                    style={ styles.accContentEyeImage }
                                    activeOpacity={ 0.6 }
                                    onPress={ () => markEpisodeWatched(season, episode) }
                                >
                                    <Image 
                                        source={
                                            user?.series.find(serie => serie.id.toString() === serieFull?.id.toString()) &&
                                            user?.series.find(serie => serie.id.toString() === serieFull?.id.toString())!.
                                                seasonsDetail.find(seasonDet => seasonDet.id.toString() === season.id.toString()) &&
                                                user?.series.find(serie => serie.id.toString() === serieFull?.id.toString())!.
                                                seasonsDetail.find(seasonDet => seasonDet.id.toString() === season.id.toString())!.
                                                episodes.find(episodeDet => episodeDet.toString() === episode.episode_number.toString())
                                                ? require('../assets/fullIcon.png') 
                                                : require('../assets/empty.png')
                                        }
                                        style={{
                                            width: 40,
                                            height: 30,
                                        }}
                                    />
                                </TouchableOpacity>

                                <View style={ styles.accContentImageText}>
                                    <Image 
                                        style={ styles.accContentItemPoster }
                                        source={{ uri: episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : `https://critics.io/img/movies/poster-placeholder.png` }}
                                    />
                                    <View style={ styles.accContentText}>
                                        <Text style={ styles.accContentItemText }>{ episode.name }</Text>
                                        <Text style={ styles.accContentEpisode }>Episode {episode.episode_number}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }
            </View>
        )    
    
    }

  return (
    <ScrollView style={ styles.episodesBody }>
        <Accordion
            activeSections={[activeSection.section as any]}
            sections={seasons}
            renderHeader={renderHeader}
            renderContent={renderContent}
            onChange={(activeSection) => {
                setActiveSection({
                    section: activeSection[0] as any
                })
            }}
            touchableComponent={TouchableOpacity}
            touchableProps={{
                activeOpacity: 0.5,
            }}
        />
    </ScrollView>
  )
}

const styles = StyleSheet.create({

    episodesBody: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingBottom: 20,
        marginTop: 20,
    },

    accHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        marginBottom: 10,
    },

    accHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
    },

    accContent: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        marginBottom: 20,
    },

    accContentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
        marginBottom: 20,
    },

    accContentEyeImage: {
        width: 40,
        height: 30,
        position: 'absolute',
        right: 10,
        top: 10,
        // transform: [{ rotate: '15deg' }],

    },

    accContentImageText: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    accContentItemPoster: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 10,
    },

    accContentText: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flex: 0.9,
        flexWrap: 'wrap',
    },

    accContentItemText: {
        fontSize: 16,
    },

    accContentEpisode: {
        marginTop: 5,
        fontSize: 14,
        color: '#999',
    },
});