import React, { useContext, useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/Ionicons'
import StarRating from 'react-native-star-rating';
import { getEpisodeData } from '../api/TMDBActions';
import { Comments, EpisodeModalResponse } from '../interfaces/movieInterface';
import { BlurView } from 'expo-blur';
import { postComment } from '../api/watcherActions';
import { AuthContext } from '../context/AuthContext';


interface Props {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    seriesId: number,
    seasonNumber: number,
    episodeNumber: number,
}

export const EpisodeModal = ({ visible = false, setVisible, seriesId, seasonNumber, episodeNumber }: Props) => {
  
    const { user } = useContext( AuthContext )

    const [isVisible, setIsVisible] = useState(visible);
    const [ writeCommentVisible, setWriteCommentVisible ] = useState(false);
    const [ commentToPost, setCommentToPost ] = useState<string>('');

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

    const postCommentBtnAction = async () => {

        const userName = user!.userName

        if ( commentToPost.length > 3 ) {

            const resp = await postComment({ userName, comment: commentToPost, elementId: fullEpisode!.id, type: 'series' });

            if ( resp.result && fullEpisode ) {

                
                const commentMade: Comments = {
                    userName,
                    comment: commentToPost,
                    date: new Date().toLocaleString(),
                    likes: 0,
                    replies: [],
                    id: Math.floor(Math.random() * 1000000).toString()
                }
                
                const commentsNew: Comments[] = [ commentMade, ...fullEpisode!.comments ];

                setFullEpisode({
                    ...fullEpisode,
                    comments: commentsNew
                })

                setWriteCommentVisible(false);
                setCommentToPost('');

            }
        
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

                
                    <ScrollView
                        style={styles.modal}
                        contentContainerStyle={{
                            overflow: 'visible',
                        }}
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
                                                        marginTop: 2,
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
                                        <View style={ styles.subTitleDiv }>
                                            <Text style={ styles.subTitle }>
                                                Overview
                                            </Text>
                                            <Icon name="eye" color="#000" size={20} style={{ marginLeft: 10 }} />
                                        </View>
                                        <Text style={ styles.text }>{ fullEpisode.overview }</Text>
                                    </View>
                                    
                                    <View
                                        style={{
                                            marginLeft: -20,
                                            marginBottom: 20,
                                        }}
                                    >
                                        <View style={{ ...styles.subTitleDiv, marginLeft: 20, marginBottom: 20 }}>
                                            <Text style={ styles.subTitle }>Stills</Text>
                                            <Icon name="image" color="#000" size={20} style={{ marginLeft: 10 }} />
                                        </View>
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
                                        />
                                    </View>

                                    <View>
                                        <View style={ styles.subTitleDiv }>
                                            <Text style={ styles.subTitle }>
                                                Comments
                                            </Text>
                                            <Icon name="chatbubbles" color="#000" size={20} style={{ marginLeft: 10 }} />
                                        </View>
                                        <View>
                                            {
                                                user ? (
                                                <TouchableOpacity
                                                    style={{
                                                        backgroundColor: '#0055FF',
                                                        padding: 10,
                                                        borderRadius: 10,
                                                        marginBottom: 10,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        marginTop: 10,
                                                    }}
                                                    onPress={() => setWriteCommentVisible(true)}
                                                >
                                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Write a new comment</Text>
                                                </TouchableOpacity>
                                                ) : (
                                                    null
                                                )
                                            }
                                            <Modal
                                                animationType="fade"
                                                transparent={true}
                                                visible={writeCommentVisible}
                                                style={{
                                                    position: 'absolute',
                                                }}
                                            >
                                                <BlurView 
                                                    style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}
                                                    tint="dark"
                                                    intensity={20}
                                                >
                                                    <View style={{ 
                                                        justifyContent: 'space-between', 
                                                        backgroundColor: '#fff', 
                                                        width: '95%',
                                                        borderRadius: 10,
                                                        padding: 10, 
                                                    }}>
                                                        <View style={{ ...styles.subTitleDiv, width: '100%', justifyContent: 'space-between', marginTop: 0}}>
                                                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Write a new comment</Text>
                                                            <Icon name="md-close" size={30} color="#000" onPress={() => setWriteCommentVisible(false)} />
                                                        </View>
                                                        <TextInput 
                                                            placeholder="Write your comment here"
                                                            style={{ 
                                                                width: '100%', 
                                                                padding: 10, 
                                                                borderRadius: 10,
                                                                marginTop: 10,
                                                                borderColor: '#e9e9e9',
                                                                borderWidth: 2,
                                                            }}
                                                            autoCorrect={true}
                                                            autoCapitalize="sentences"
                                                            multiline={true}

                                                            value={commentToPost}
                                                            onChangeText={(text) => setCommentToPost(text)}
                                                        />
                                                        <TouchableOpacity
                                                            style={{
                                                                backgroundColor: '#0055FF',
                                                                padding: 10,
                                                                borderRadius: 10,
                                                                marginBottom: 10,
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                marginTop: 10,
                                                            }}
                                                            onPress={() => 
                                                                postCommentBtnAction()
                                                            }
                                                        >
                                                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Post</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </BlurView>
                                            </Modal>
                                            {/* <FlatList
                                                data={ fullEpisode.comments }
                                                renderItem={({ item }: any) => (
                                                    <View
                                                        style={ styles.commentCard }
                                                    >
                                                        <View style={{ width: '100%', marginTop: 0, flexDirection: 'row'}}>
                                                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginRight: 5 }}>{ item.userName }</Text>
                                                            <Text style={{ fontSize: 12, color: '#999'}}>Author</Text>
                                                        </View>
                                                        <Text style={{ marginTop: 10 }}>{ item.comment }</Text>
                                                    </View>
                                                )}
                                                keyExtractor={(item: any) => item.id}
                                                nestedScrollEnabled={true}
                                                contentContainerStyle={{
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                }}
                                            /> */}
                                            <View
                                                style={{
                                                    width: '100%',
                                                    marginTop: 10,
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                {
                                                    fullEpisode.comments.map((item: any, index: number) => (
                                                        <View
                                                            style={ styles.commentCard }
                                                            key={index}
                                                        >
                                                            <View style={{ width: '100%', marginTop: 0, flexDirection: 'row', borderBottomColor: '#0055FF', borderBottomWidth: 1, paddingBottom: 5, alignItems: 'center'}}>
                                                                <Text style={{ 
                                                                    fontSize: 16, 
                                                                    fontWeight: 'bold', 
                                                                    marginRight: 5,
                                                                }}>{ item.userName }</Text>
                                                                <Text style={{ fontSize: 12, color: '#999'}}>Author</Text>
                                                            </View>
                                                            <Text style={{ marginTop: 10 }}>{ item.comment }</Text>
                                                        </View>
                                                    ))
                                                }
                                            </View>
                                        </View>
                                    </View>
                                    <View  style={{ height: 30 }}/>
                                    </>
                                ) : (
                                    <View>
                                        <Text>Loading...</Text>
                                    </View>
                                )
                            }
                    </ScrollView>
        </Modal>
    )
}

const styles = StyleSheet.create({

    modal: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 200,
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

    subTitleDiv: {
        borderBottomColor: '#0055FF',
        borderBottomWidth: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingBottom: 10,
    },

    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    episodeImage: {
        width: 150,
        height: 100,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
    },

    commentCard: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 10,
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
        width: '90%',
    },

})
