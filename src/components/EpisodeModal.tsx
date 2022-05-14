import React, { useContext, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Carousel from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/Ionicons'
import StarRating from 'react-native-star-rating';
import { getEpisodeData } from '../api/TMDBActions';
import { Comments, EpisodeModalResponse } from '../interfaces/movieInterface';
import { BlurView } from 'expo-blur';
import { likeComment, postComment, postReply } from '../api/watcherActions';
import { AuthContext } from '../context/AuthContext';


interface Props {
    visible: boolean,
    setVisible: (visible: boolean) => void,
    seriesId: number,
    seasonNumber: number,
    episodeNumber: number,
}

export const EpisodeModal = ({ visible = false, setVisible, seriesId, seasonNumber, episodeNumber }: Props) => {
  
    const { user, updateLikedComments } = useContext( AuthContext )

    const [isVisible, setIsVisible] = useState(visible);
    const [ writeCommentVisible, setWriteCommentVisible ] = useState(false);
    const [ commentToPost, setCommentToPost ] = useState<string>('');

    const [ showReplies, setShowReplies ] = useState(false);
    const [ commentToShow, setCommentToShow ] = useState<Comments>({} as Comments);

    const [ replyText, setReplyText] = useState('');

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

    const likeCommentAction = async (commentId: string, commentUserName: string) => {

        if ( !user ) return;

        if (commentUserName === user?.userName) {
            return;
        }

        const resp = await likeComment({ userName: user!.userName, commentId, elementId: fullEpisode!.id })

        if ( resp.result && fullEpisode ) {

            const comments = fullEpisode!.comments.map( (comment: Comments) => {
                if ( comment.id === commentId ) {
                    return {
                        ...comment,
                        likes: resp.action === 'like' ? comment.likes + 1 : comment.likes - 1
                    }
                } else {
                    return comment;
                }
            })

            setFullEpisode({
                ...fullEpisode,
                comments
            })

            let newLikedComments

            if ( resp.action === 'like' ) {
                newLikedComments = [ ...user!.likedComments, commentId ]    
            } else {
                newLikedComments = user!.likedComments.filter( (commentId: string) => commentId !== commentId )
            }

            updateLikedComments(newLikedComments)
            
        }
        
    }

    const replyCommentAction = async (commentId: string) => {

        if ( replyText.length > 3 ) {

            const resp = await postReply({ userName: user!.userName, reply: replyText, commentId, elementId: fullEpisode!.id})

            if ( resp.result && fullEpisode ) {

                const newCommentShow = {
                    ...commentToShow,
                    replies: [ ...commentToShow.replies, {
                        userName: user!.userName,
                        comment: replyText,
                        date: new Date().toLocaleDateString(),
                        likes: 0,
                        id: Math.floor(Math.random() * 1000000).toString()
                    }]
                }

                const commentsArr = fullEpisode!.comments.map( (comment: Comments) => {
                    if ( comment.id === commentId ) {
                        return newCommentShow;
                    } else {
                        return comment;
                    }
                })

                setFullEpisode({
                    ...fullEpisode,
                    comments: commentsArr
                })
                setCommentToShow(newCommentShow);

                setReplyText('');
                setWriteCommentVisible(false);

            }

        }

    }

    const showRepliesFunction = (comment: Comments) => {

        setShowReplies(true);
        setCommentToShow(comment);

    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            style={{
                position: 'relative',
                zIndex: 1
            }}
        >
            
            <View style={{ ...styles.closeSection }}>
                <Icon style={{ ...styles.iconClose }}name="md-close" size={30} color="#000" onPress={() => closeModal()} />
            </View>

                
                    <View
                        style={ styles.modal }
                    >
                            {
                                fullEpisode ? (
                                    <ScrollView
                                        contentContainerStyle={{
                                            overflow: 'visible',
                                            paddingHorizontal: 20,
                                        }}
                                        showsVerticalScrollIndicator={false}
                                    >
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
                                                                    fontSize: 14, 
                                                                    fontWeight: 'bold', 
                                                                    marginRight: 5,
                                                                }}>{ item.userName }</Text>
                                                                <Text style={{ fontSize: 12, color: '#999'}}>Author</Text>
                                                                <Text style={{ fontSize: 12, color: '#999', marginLeft: 10 }}>{
                                                                    item.date
                                                                }</Text>
                                                            </View>
                                                            <Text style={{ 
                                                                marginTop: 10,
                                                                fontSize: 16,
                                                            }}>{ item.comment }</Text>

                                                            <View
                                                                style={{
                                                                    width: '100%',
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'space-evenly',
                                                                    alignItems: 'center',
                                                                    marginTop: 10,
                                                                    backgroundColor: '#e8e8e8',
                                                                    padding: 10,
                                                                    borderRadius: 10,
                                                                }}
                                                            >
                                                                <TouchableOpacity 
                                                                    style={ styles.likesAndComment }
                                                                    onPress={() => likeCommentAction(item.id, item.userName)}
                                                                >
                                                                    <Icon name={
                                                                        user?.likedComments.includes(item.id) ? 'heart' : 'heart-outline'
                                                                    } size={20} color="#0055FF" style={{ marginLeft: 10 }} />
                                                                    <Text style={{ fontSize: 12, color: '#999', marginLeft: 10 }}>{ item.likes } {
                                                                        item.likes === 1 ? 'like' : 'likes'
                                                                    }</Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity 
                                                                    style={ styles.likesAndComment }
                                                                    onPress={() => showRepliesFunction(item)}    
                                                                >
                                                                    <Icon name="chatbubble" size={20} color="#0055FF" style={{ marginLeft: 10 }} />
                                                                    <Text style={{ fontSize: 12, color: '#999', marginLeft: 10 }}>{ item.replies.length } {
                                                                        item.replies.length === 1 ? 'comment' : 'comments'
                                                                    }</Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    ))
                                                }
                                            </View>
                                        </View>
                                    </View>
                                    <View  style={{ height: 30 }}/>
                                    </ScrollView>
                                ) : (
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,

                                        }}
                                    >
                                        <ActivityIndicator 
                                            size="small"
                                            color="#0055FF"
                                        />
                                    </View>
                                )
                            }
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={ showReplies }
                        >
                            <BlurView
                                style={{ flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' }}
                                tint="dark"
                                intensity={20}
                            >
                                <View
                                    style={{
                                        width: '95%',
                                        maxHeight: '90%',
                                        backgroundColor: '#fff',
                                        borderRadius: 10,
                                        padding: 10,
                                        marginTop: 10,
                                    }}
                                >
                                <ScrollView>
                                    {
                                    commentToShow.id ? (
                                        <>
                                        <View style={{ ...styles.subTitleDiv, width: '100%', justifyContent: 'space-between', marginTop: 0}}>
                                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{commentToShow.userName}</Text>
                                            <Icon name="md-close" size={30} color="#000" onPress={() => setShowReplies(false)} />
                                        </View>
                                        <Text style={{
                                            marginTop: 10,
                                            fontSize: 16,
                                        }}>{ commentToShow.comment }</Text>
                                        <View
                                            style={{
                                                width: '100%',
                                                flexDirection: 'row',
                                                justifyContent: 'space-evenly',
                                                alignItems: 'center',
                                                marginTop: 10,
                                                backgroundColor: '#e8e8e8',
                                                padding: 10,
                                                borderRadius: 10,
                                            }}
                                        >
                                            <TouchableOpacity
                                                style={ styles.likesAndComment }
                                                onPress={() => likeCommentAction(commentToShow.id, commentToShow.userName)}
                                            >
                                                <Icon name={
                                                    user?.likedComments.includes(commentToShow.id) ? 'heart' : 'heart-outline'
                                                } size={20} color="#0055FF" style={{ marginLeft: 10 }} />
                                                <Text style={{ fontSize: 12, color: '#999', marginLeft: 10 }}>{ commentToShow.likes } {
                                                    commentToShow.likes === 1 ? 'like' : 'likes'
                                                }</Text>
                                            </TouchableOpacity>
                                            </View>

                                            {/* Write a reply */}

                                            {
                                                user ? (
                                                    <View
                                                        style={{
                                                            width: '100%',
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-evenly',
                                                            alignItems: 'center',
                                                            marginTop: 10,
                                                            padding: 10,
                                                            borderRadius: 10,
                                                        }}
                                                    >
                                                        <TextInput
                                                            style={{
                                                                height: 40,
                                                                borderColor: '#0055FF',
                                                                borderWidth: 2,
                                                                padding: 10,
                                                                flex: 1,
                                                                borderTopStartRadius: 10,
                                                                borderBottomStartRadius: 10,
                                                            }}
                                                            placeholder="Write a reply"
                                                            onChangeText={(text) => setReplyText(text)}
                                                        />
                                                        <TouchableOpacity
                                                            style={{
                                                                width: '20%',
                                                                height: 40,
                                                                backgroundColor: '#0055FF',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                borderBottomEndRadius: 10,
                                                                borderTopEndRadius: 10,
                                                            }}
                                                            onPress={() => {
                                                                if (replyText.length > 0) {
                                                                    replyCommentAction(commentToShow.id);
                                                                    setReplyText('');
                                                                }
                                                            }}
                                                        >
                                                            <Text style={{ color: '#fff', fontSize: 16 }}>Reply</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                
                                                ) : (
                                                    null
                                                )
                                            }
                                            <View
                                                style={{
                                                    width: '100%',
                                                    alignItems: 'center',
                                                }}
                                            >
                                            {
                                                commentToShow.replies.map((item: any, index: number) => (
                                                <View
                                                    style={ styles.commentCard }
                                                    key={index}
                                                >
                                                    <View style={{ width: '100%', marginTop: 0, flexDirection: 'row', borderBottomColor: '#0055FF', borderBottomWidth: 1, paddingBottom: 5, alignItems: 'center'}}>
                                                        <Text style={{
                                                            fontSize: 14,
                                                            fontWeight: 'bold',
                                                            marginRight: 5,
                                                        }}>{ item.userName }</Text>
                                                        <Text style={{ fontSize: 12, color: '#999'}}>Author</Text>
                                                        <Text style={{ fontSize: 12, color: '#999', marginLeft: 10 }}>{
                                                            item.date
                                                        }</Text>
                                                    </View>
                                                    <Text style={{
                                                        marginTop: 10,
                                                        fontSize: 16,
                                                    }}>{ item.comment }</Text>                                          
                                                </View>
                                                ))
                                            }
                                            </View>
                                        </>
                                    ) : null
                                    }
                                </ScrollView>
                                </View>
                            </BlurView>
                        </Modal>
                    </View>
        </Modal>
    )
}

const styles = StyleSheet.create({

    modal: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
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
        borderRadius: 100,
        top: 220,
        zIndex: 5,
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },

    iconClose: {
        // position: 'absolute',
        // right: 0,
        // top: 0,
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

    likesAndComment: {
        flexDirection: 'row',
        alignItems: 'center',
    },

})
