import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Carousel from 'react-native-snap-carousel';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/Ionicons';
import { getEpisodeData } from '../api/TMDBActions';
import { EpisodeModalResponse } from '../interfaces/movieInterface';

interface Props {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    seriesId: number,
    seasonNumber: number,
    episodeNumber: number,
}

export const EpisodeModal = ({ visible = false, setVisible, seriesId, seasonNumber, episodeNumber }: Props) => {
  
    const [isVisible, setIsVisible] = useState(visible);

    const [ fullEpisode, setFullEpisode ] = useState<EpisodeModalResponse>();

    useEffect(() => {
        setIsVisible(visible);

        if( visible ) {
            modalStart();
        }
    }, [visible])

    const closeModal = () => {
        setIsVisible(false);
        setVisible(false);

        setFullEpisode(undefined);
    }

    const modalStart = async () => {
        
        const resp = await getEpisodeData({ serieId: seriesId, seasonNumber, episodeNumber })
        
        if ( resp ) {
            setFullEpisode(resp);
        } else {
            setFullEpisode(undefined);
        }

    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            style={{
                position: 'relative',
            }}
        >

            <View style={{ ...styles.closeSection }}>
                <Icon name="md-close" size={30} color="#000" onPress={() => closeModal()} />
            </View>

            <View
                style={styles.modal}
            >
                {
                    fullEpisode ? (
                        <>
                        <View style={{ paddingTop: 20 }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Image source={{ uri: `https://image.tmdb.org/t/p/w500${fullEpisode.still_path}` }} style={{ width: 80, height: 80, borderRadius: 10, marginRight: 10 }} />
                                <View>
                                    <Text style={ styles.title }>{ fullEpisode.name }</Text>
                                    <Text style={ styles.text }>Season { seasonNumber } - Episode { episodeNumber }</Text>
                                    <View
                                        style={{ 
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <StarRating
                                            disabled={ true }
                                            maxStars={ 5 }
                                            rating={ fullEpisode.vote_average / 2 }
                                            starSize={ 20 }
                                            fullStarColor={ '#FFD700' }
                                            emptyStarColor={ '#FFD700' }
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text
                                style={ styles.subTitle }
                            >Overview</Text>
                            <Text style={ styles.text }>{ fullEpisode.overview }</Text>
                        </View>
                        
                        <View
                            style={{
                                marginLeft: -20,
                            }}
                        >
                            <Text
                                style={{ ...styles.subTitle, paddingLeft: 20, marginBottom: 20 }}
                            >Stills</Text>
                            <Carousel
                                data={ fullEpisode.stills }
                                renderItem={({ item }: any) => (
                                    <Image
                                        source={{ uri: `https://image.tmdb.org/t/p/w500${item.file_path}` }}
                                        style={{ width: 300, height: 169, borderRadius: 10 }}
                                    />
                                )}
                                sliderWidth={ Dimensions.get('window').width }
                                itemWidth={ 300 }
                                inactiveSlideScale={ 0.95 }
                                inactiveSlideOpacity={ 0.7 }
                                enableMomentum={ true }
                                loop={ true }
                                loopClonesPerSide={ 2 }
                                autoplay={ true }
                                autoplayDelay={ 1000 }
                                autoplayInterval={ 3000 }
                            />
                        </View>
                        
                        </>
                    ) : (
                        <View>
                            <Text>Loading...</Text>
                        </View>
                    )
                }
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({

    modal: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        bottom: 0,
        paddingHorizontal: 20,
        top: 200,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },

    closeSection: {
        position: 'absolute',
        right: 20,
        backgroundColor: '#fff',
        padding: 2,
        borderRadius: 100,
        top: 220,
        zIndex: 2,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    
    text: {
        fontSize: 16,
        color: '#999',
        marginTop: 8,
    },

    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
    },

    episodeImage: {
        width: 150,
        height: 100,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
    }

})
