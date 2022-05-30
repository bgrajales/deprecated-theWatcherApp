import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/Ionicons';
import { markSeasonAsWatchedAction, updateEpisode } from '../api/watcherActions';
import { EpisodeModal } from '../components/EpisodeModal';
import { AuthContext } from '../context/AuthContext';

import { useSeriesDetail } from '../hooks/useSeriesDetail';
import { Episode, SeriesSeason } from '../interfaces/movieInterface';
import { english } from '../lenguages/english';
import { spanish } from '../lenguages/spanish';

interface Props {
    seriesId: number;
}

export const EpisodesScreen = ({ seriesId }: Props) => {

    const [ loadingEpisodes, setLoadingEpisode ] = useState(false)

    const { user, token, updateWatchedSeries, updateSeries, colorScheme } = useContext( AuthContext )

    const [activeSection, setActiveSection] = useState({
        section: null,
    })
    const [ showEpisode, setShowEpisode ] = useState(false)

    const [ watchEpisodeLoader, setWatchEpisodeLoader ] = useState({
        epId: 0,
        loader: false
    })

    const [ watchSeasonLoader, setWatchSeasonLoader ] = useState({
        seasonId: 0,
        loader: false
    })

    const [ episodeModalParameters, setEpisodeModalParameters ] = useState({
        seriesId: 0,
        seasonNumber: 0,
        episode: 0,
    })
    
    const { seasons, serieFull } = useSeriesDetail(seriesId, user?.region)

    useEffect(() => {
    }, [activeSection.section])

    const renderHeader = ( season: SeriesSeason ) => {
 
        return(
            <View style={{ 
                ...styles.accHeader, 
                borderBottomRightRadius: activeSection.section === season.id ? 0 : 10,
                borderBottomLeftRadius: activeSection.section === season.id ? 0 : 10,
                backgroundColor: colorScheme === 'dark' ? '#353535' : '#fff'
            }}>
                <Text style={{ 
                    ...styles.accHeaderText,
                    color: colorScheme === 'dark' ? '#fff' : '#000'
                }}>{season.name}</Text>
                
                {/* Season progress bar */}

                <View style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    height: 10,
                    // borderColor: '#0055ff',
                    // borderWidth: 1,
                    borderRadius: 10,
                    marginHorizontal: 20,
                    // overflow: 'hidden',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.20,
                    shadowRadius: 1.41,

                    elevation: 2,
                }}>
                    <View style={{
                        backgroundColor: '#0055ff',
                        borderRadius: 10,
                        height: 10,
                        width: (user?.series?.find( serie => parseInt(serie.id) === seriesId )?.seasonsDetail?.find( seasonArr => parseInt(seasonArr.id) === season.id )?.episodes.length || 0 ) / season.episodes.length * 100 + '%',
                    }}>
                    </View>
                </View>

                {
                    watchSeasonLoader.seasonId === season.id && watchSeasonLoader.loader ? (
                        <ActivityIndicator size={25} color="#0055ff" />
                    ) : (user?.series?.find( serie => parseInt(serie.id) === seriesId )?.seasonsDetail?.find( seasonArr => parseInt(seasonArr.id) === season.id )?.episodes.length || 0 ) / season.episodes.length * 100 === 100 
                    ?   <>
                            
                            <TouchableOpacity
                                onPress={() => {
                                    markSeasonAsWatched(season, 'remove')
                                }}
                            >
                                <Icon name="checkmark-circle" size={30} color="#0055ff" />
                            </TouchableOpacity>
                        </>
                    :   <>
                            <TouchableOpacity
                                onPress={() => {
                                    markSeasonAsWatched(season, 'add')
                                }}
                            >
                                <Icon name="ellipse-outline" size={30} color="#0055ff" />
                            </TouchableOpacity>
                        </>
                }
            </View>
        )

    }

    const markSeasonAsWatched = async ( season: SeriesSeason, action: string ) => {

        setWatchSeasonLoader({
            seasonId: season.id,
            loader: true
        })
        
        if( serieFull && user && token ) {
            const marked = await markSeasonAsWatchedAction({
                userName: user.userName,
                serieId: seriesId,
                seasonId: season.id,
                seasonNumber: season.season_number,
                seasonEpisodes: season.episodes.length,
                posterPath: serieFull.poster_path || '',
                serieEpisodes: serieFull.number_of_episodes,
                action: action,
            })
            setWatchSeasonLoader({
                seasonId: 0,
                loader: false
            })

            if( marked.result ) {
                // updateWatchedSeries(marked.data)
                updateSeries(marked.seriesUpdate)
            } else {
                console.log('error')
            }

        }

    }

    const markEpisodeWatched = async (season: SeriesSeason, episode: Episode) => {
        
        setWatchEpisodeLoader({
            epId: episode.id,
            loader: true
        })

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
    
                setWatchEpisodeLoader({
                    epId: 0,
                    loader: false
                })
                updateWatchedSeries( marked.series )
            }
    
          }
    }

    const showEpisodeContent = ( episode: number, seasonNumber: number ) => {

        setShowEpisode(true)

        setEpisodeModalParameters({
            seriesId,
            seasonNumber,
            episode
        })

    }

    const renderContent = ( season: SeriesSeason ) => {
        return (
            <View style={{ 
                ...styles.accContent, 
                backgroundColor: colorScheme === 'dark' ? '#353535' : '#fff'
            }}>
                {
                    season.episodes.map( ( episode: Episode ) => {
                        return (
                            <View key={ episode.id } style={{
                                ...styles.accContentItem, 
                                backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#fff',
                            }}>

                                {
                                    watchEpisodeLoader.epId === episode.id && watchEpisodeLoader.loader ? (
                                        <View style={{ 
                                            ...styles.accContentEyeImage, 
                                            width: 40,
                                            height: 40,
                                        }} >
                                            <ActivityIndicator
                                                size='small'
                                                color='#0055ff'
                                            />
                                        </View>
                                    ) : (
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
                                    )
                                }
                                

                                

                                <TouchableOpacity 
                                    style={ styles.accContentImageText}
                                    activeOpacity={0.6}
                                    onPress={ () => showEpisodeContent(episode.episode_number, season.season_number) }
                                >
                                    <Image 
                                        style={ styles.accContentItemPoster }
                                        source={{ uri: episode.still_path ? `https://image.tmdb.org/t/p/w500${episode.still_path}` : `https://critics.io/img/movies/poster-placeholder.png` }}
                                    />
                                    <View style={ styles.accContentText}>
                                        <Text style={{ 
                                            ...styles.accContentItemText,
                                            color: colorScheme === 'dark' ? '#fff' : '#000', 
                                        }}>{ episode.name }</Text>
                                        <Text style={ styles.accContentEpisode }>{
                                            user?.settings.leng === 'es-ES' ? spanish.episodeModalEpisode : english.episodeModalEpisode
                                        } {episode.episode_number}</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        )
                    })
                }

                <EpisodeModal 
                    visible={ showEpisode }
                    setVisible={ setShowEpisode }
                    seriesId={ episodeModalParameters.seriesId }
                    seasonNumber={ episodeModalParameters.seasonNumber }
                    episodeNumber={ episodeModalParameters.episode }
                />
            </View>
        )    
    
    }

    return (
        <ScrollView style={{ 
            ...styles.episodesBody,
            backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',    
        }}>
            {
                seasons ? (
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
                ) : (
                    null
                )
            }
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