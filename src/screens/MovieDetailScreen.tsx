import { StackScreenProps } from '@react-navigation/stack'
import React, { useContext, useState } from 'react'

import { ActivityIndicator, Dimensions, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import StarRating from 'react-native-star-rating';
import { LinearGradient } from "expo-linear-gradient";
import YoutubePlayer from 'react-native-youtube-iframe';
import { format, parseISO } from 'date-fns'

import { useMovieDetails } from '../hooks/useMoviesDetail'
import { DetailStackParams } from '../navigation/DetailStack'
import Carousel from 'react-native-snap-carousel';
import { likeComment, markMovieAsWatched, markMovieUnwatched, postComment, postReply } from '../api/watcherActions';
import { AuthContext } from '../context/AuthContext';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/Ionicons';
import { Comments } from '../interfaces/movieInterface';

interface Props extends StackScreenProps<DetailStackParams, 'MovieDetailScreen'>{}

export const MovieDetailScreen = ({ route }: Props) => {

    const movie = route.params
    
    const [commentsToShow, setCommentsToShow] = useState<Comments[]>([]);
    
    const { isLoading, movieFull, cast, providers, videos, comments } = useMovieDetails( movie.id, setCommentsToShow )
    const { user, token, updateWatchedMovies, updateLikedComments } = useContext( AuthContext )

    const [ writeCommentVisible, setWriteCommentVisible ] = useState(false);
    const [ commentToPost, setCommentToPost ] = useState<string>('');

    const [ showReplies, setShowReplies ] = useState(false);
    const [ commentToShow, setCommentToShow ] = useState<Comments>({} as Comments);

    const [ replyText, setReplyText] = useState('');

    const uri = `https://image.tmdb.org/t/p/w500${movieFull?.poster_path}`;

    const markMovieWatched = async () => {
      if ( movieFull && user && token ) {
        const marked = await markMovieAsWatched({ user, token, movieId: movieFull.id, posterPath: movieFull.poster_path, runTime: movieFull.runtime })

        if ( marked.result ) {

          updateWatchedMovies( marked.movies )

        }

      }
    }

    const markMovieNotWatched = async () => {
      if ( movieFull && user && token ) {
        const marked = await markMovieUnwatched({ user, token, movieId: movieFull.id })

        if ( marked.result ) {
            updateWatchedMovies( marked.movies )
        }
      }

    }

    const postCommentBtnAction = async () => {

      const userName = user!.userName

      if ( commentToPost.length > 3 ) {

          const resp = await postComment({ userName, comment: commentToPost, elementId: movieFull!.id, type: 'movie' });

          if ( resp.result && movieFull ) {

              const commentMade: Comments = {
                  userName,
                  comment: commentToPost,
                  date: new Date().toLocaleString(),
                  likes: 0,
                  replies: [],
                  id: Math.floor(Math.random() * 1000000).toString()
              }
              
              const commentsNew: Comments[] = [ commentMade, ...comments ];

              setCommentsToShow( commentsNew );

              setWriteCommentVisible(false);
              setCommentToPost('');

          }
      
      }
  }

  const likeCommentAction = async (commentId: string, commentUserName: string) => {

    if (commentUserName === user?.userName) {
        return;
    }

    const resp = await likeComment({ userName: user!.userName, commentId, elementId: movieFull!.id })

    if ( resp.result && movieFull ) {

        const commentsArr = commentsToShow.map( (comment: Comments) => {
            if ( comment.id === commentId ) {
                return {
                    ...comment,
                    likes: resp.action === 'like' ? comment.likes + 1 : comment.likes - 1
                }
            } else {
                return comment;
            }
        })

        setCommentsToShow( commentsArr );

        let newLikedComments

        if ( resp.action === 'like' ) {
            newLikedComments = [ ...user!.likedComments, commentId ]    
        } else {
            newLikedComments = user!.likedComments.filter( (commentId: string) => commentId !== commentId )
        }

        updateLikedComments(newLikedComments)
        
    }
      
  }

  const showRepliesFunction = (comment: Comments) => {

    setShowReplies(true);
    setCommentToShow(comment);

  }

  const replyCommentAction = async (commentId: string) => {

    console.log(commentId, replyText)

    if ( replyText.length > 3 ) {

        const resp = await postReply({ userName: user!.userName, reply: replyText, commentId, elementId: movieFull!.id})

        console.log(resp.result)

        if ( resp.result && movieFull ) {

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

            console.log(newCommentShow.replies[0].date)

            const commentsArr = commentsToShow.map( (comment: Comments) => {
                if ( comment.id === commentId ) {
                    return newCommentShow
                } else {
                    return comment;
                }
            })

            setCommentsToShow( commentsArr );
            setCommentToShow(newCommentShow);

            setReplyText('');
            setWriteCommentVisible(false);

        }

    }

  }

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
            paddingBottom: 30,
          }}
        >
            <View 
                style={{
                    position: 'relative',
                    height: 280,
                }}
            >
              <Image 
                source={{ uri }}
                style={{
                    width: '100%',
                    height: 280,
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
                  { movieFull?.title }
                </Text>
              </View>
              <View
                style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    alignItems: 'center',
                    bottom: '8%',
                    right: 0,
                    paddingVertical: 10,
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
                  <View>

                    {
                      user?.movies.find( (m: any) => {
                        return parseInt(m.id) === movieFull?.id
                      } ) ? (
                        <TouchableOpacity 
                          style={{
                            backgroundColor: '#fff',
                            paddingHorizontal: 5,
                            paddingVertical: 5,
                            borderRadius: 100,
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          activeOpacity={0.7}
                          onPress={ markMovieNotWatched }
                        >
                          <Image 
                            source={ require('../assets/fullIcon.png') }
                            style={{
                                width: 37,
                                height: 26,
                            }}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity 
                          style={{
                            backgroundColor: '#fff',
                            paddingHorizontal: 5,
                            paddingVertical: 5,
                            borderRadius: 100,
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                          activeOpacity={0.7}
                          onPress={ markMovieWatched }
                        >
                          <Image 
                            source={ require('../assets/empty.png') }
                            style={{
                                width: 37,
                                height: 26,
                            }}
                          />
                        </TouchableOpacity>
                      )
                    }
                      
                  </View>
                  <View style={{ width: 15 }}/>
                  <View style={{
                      backgroundColor: '#fff',
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      height: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTopLeftRadius: 100,
                      borderBottomLeftRadius: 100,
                  }}>
                    <StarRating 
                      disabled={ true }
                      maxStars={ 5 }
                      rating={ movieFull ? movieFull.vote_average / 2 : 0 }
                      starSize={ 20 }
                      fullStarColor={ '#FFD700' }
                      emptyStarColor={ '#FFD700' }
                    />
                  </View>
              </View>
            </View>
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
                <Text style={ styles.text }>{ movieFull?.overview }</Text>
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
                />
            </View>
            <View
              style={{
                paddingHorizontal: 20,
              }}
            >
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

                                  // value={commentToPost}
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
                          commentsToShow.map((item: Comments, index: number) => (
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
                                        <View style={ styles.likesAndComment }>
                                            <Icon name="chatbubble" size={20} color="#0055FF" style={{ marginLeft: 10 }} />
                                            <Text style={{ fontSize: 12, color: '#999', marginLeft: 10 }}>{ item.replies.length } {
                                                item.replies.length === 1 ? 'comment' : 'comments'
                                            }</Text>
                                        </View>
                                      </TouchableOpacity>
                                  </View>
                              </View>
                          ))
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
                                            <TextInput
                                                style={{
                                                    height: 40,
                                                    borderColor: '#0055FF',
                                                    borderWidth: 1,
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
              </View>
          </View>
          <View  style={{ height: 30 }}/>
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
});
