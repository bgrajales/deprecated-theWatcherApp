import React from 'react'
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'

import Carousel from 'react-native-snap-carousel'
import { LinearGradient } from "expo-linear-gradient";
import YoutubePlayer from 'react-native-youtube-iframe';

import { useSeriesDetail } from '../hooks/useSeriesDetail'

interface Props {
    seriesId: number;
}

export const SeriesDetailsComponent = ({seriesId}: Props ) => {

    const { serieFull, cast, providers, videos } = useSeriesDetail(seriesId)

    return (
    <ScrollView
        showsVerticalScrollIndicator={ false }
        contentContainerStyle={{
            paddingBottom: 20,
        }}
    >
    {

        providers?.length > 0 ? (
        <View style={ styles.section }>
            <Text style={ styles.title }>Watch</Text>
            <FlatList 
                horizontal={ true }
                data={ providers }
                keyExtractor={ ( provider ) => provider.provider_id.toString() }
                renderItem={ ({ item }) => (
                    <Image
                    source={ { uri: `https://image.tmdb.org/t/p/w500${item.logo_path}` } }
                    style={{
                        width: 70,
                        height: 70,
                        marginRight: 10,
                        borderRadius: 10,
                    }}
                    />
                )}
                style={{
                    paddingHorizontal: 20,
                }}
                showsHorizontalScrollIndicator={ false }
            />
        </View>
        ) : <View style={{
            width: 270,
            marginTop: 20,
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
        }}>
        <Text style={{ 
            color: '#fff',
            fontSize: 14,
            fontWeight: 'bold',
            }}>Not available on any platform</Text>
        </View>


    }

        <View style={ styles.section }>
            <Text style={ styles.title }>Overview</Text>
            <Text style={ styles.text }>{ serieFull?.overview }</Text>
        </View>
        
        <View style={ styles.section }>
            <Text style={ styles.title }>Videos</Text>
            <Carousel
                data={ videos }
                renderItem={ ({ item }) => (
                    <YoutubePlayer
                        width={ 300 }
                        height={ 170 }
                        videoId={ item.key }
                        play={ false }
                        webViewStyle={{
                        width: 300,
                        height: 170,
                        borderRadius: 10,
                        }}
                        webViewProps={{
                        allowsFullscreenVideo: true,
                        }}                            
                    />
                )}
                sliderWidth={ Dimensions.get('window').width }
                itemWidth={ 300 }
                itemHeight={ 170 }
                layout={ 'default' }
                loop={ false }
            />
        </View>
        
        <View style={ styles.section }>
            <Text style={ styles.title }>Cast</Text>
            <FlatList 
                horizontal={ true }
                data={ cast }
                keyExtractor={ ( cast ) => cast.id.toString() }
                renderItem={ ({ item }) => (
                    <View style={ styles.castDiv }>
                    <Image
                        source={ { uri: item.profile_path ? `https://image.tmdb.org/t/p/w500${item.profile_path}` : `https://critics.io/img/movies/poster-placeholder.png` } }
                        style={{
                            width: 120,
                            height: 180,
                            marginRight: 10,
                            borderRadius: 10,
                        }}
                    />
                    <LinearGradient
                        colors={["rgba(0,0,0, 0)",  "rgba(0,0,0, 1)", "rgba(0,0,0, 1)"]}
                        style={ styles.castInfo }
                    >
                        <Text style={ styles.castName }>{ item.name }</Text>
                        <Text style={ styles.castChar }>{ item.character }</Text>
                    </LinearGradient>
                    </View>
                )}
                style={{
                    paddingHorizontal: 20,
                }}
                showsHorizontalScrollIndicator={ false }
            />
        </View>
    </ScrollView>
  )
}



const styles = StyleSheet.create({

    section: {
        marginTop: 20,
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        paddingHorizontal: 20,
    },

    text: {
        paddingHorizontal: 20,
        lineHeight: 25,
        textAlign: 'justify',
    },

    castDiv: {
        flexDirection: 'row',
        position: 'relative',
    },

    castInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: 120,
        paddingHorizontal: 6,
        paddingVertical: 10,
        borderRadius: 10,
    },

    castName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        flexWrap: 'wrap',
        color: '#fff',  
    },

    castChar: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        flexWrap: 'wrap',
    },


});
