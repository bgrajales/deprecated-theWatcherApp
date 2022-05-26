import { useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { FlatList, Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import { getActorAction } from '../api/TMDBActions'
import { AuthContext } from '../context/AuthContext'
import { ActorResponse, CastTitles } from '../interfaces/movieInterface'

interface ActorModalProps {
    modalVisible: {
        visible: boolean
        actor: any
    },
    setActorModalVisible: any,
}

export const ActorModal = ({modalVisible, setActorModalVisible}: ActorModalProps) => {

    const navigation = useNavigation<any>()

    const { top } = useSafeAreaInsets()
    const { user, colorScheme } = useContext( AuthContext )

    const [ actorProps, setActorProps ] = useState<ActorResponse>()
    const [ actorTitles, setActorTitles ] = useState<CastTitles[]>()

    useEffect(() => {
      
        if ( modalVisible.visible ) {
            getActorAction( modalVisible.actor.id, setActorProps, setActorTitles, user?.settings.leng || 'en-US')
        }

    }, [modalVisible])

    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible.visible}
            style={{
                position: 'absolute',
            }}
            >
            <View
                style={{ 
                backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff', 
                height: '100%',
                width: '100%',
                top: top + 20,
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                }}
            >
                <View style={{ 
                    backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    borderRadius: 50,
                    zIndex: 5,
                    elevation: 5,
                }}>
                <Icon name="md-close" size={30} color={
                    colorScheme === 'dark' ? '#fff' : '#000'
                } onPress={() => setActorModalVisible({
                    visible: false,
                    actor: {}
                })} />
            </View>
                
            <View
                style={{
                    margin: 20,
                    flexDirection: 'row',
                    backgroundColor: colorScheme === 'dark' ? '#2e2e2e' : '#ededed',
                    borderRadius: 10,
                }}
            >
                <Image
                    style={{
                        width: 100,
                        height: 100,
                        borderRadius: 10,
                    }}
                    source={{
                        uri: modalVisible.actor.profile_path
                        ? `https://image.tmdb.org/t/p/w500${modalVisible.actor.profile_path}`
                        : 'https://www.pngitem.com/pimgs/m/9-948982_no-profile-picture-png-transparent-png.png'
                    }}
                />
                <View
                    style={{
                        marginLeft: 10,
                        flex: 1,
                        justifyContent: 'center',
                        marginRight: 12,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            color: colorScheme === 'dark' ? '#fff' : '#000',
                        }}
                    >{modalVisible.actor.name}</Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: colorScheme === 'dark' ? '#fff' : '#000',
                        }}
                    >{
                        actorProps && actorProps.birthday && 
                        `${actorProps.birthday.split('-')[2]}/${actorProps.birthday.split('-')[1]}/${actorProps.birthday.split('-')[0]} ${
                            !actorProps.deathday ? (
                                `${
                                    user?.settings.leng === 'es-ES' ? '- Edad:' : '- Age:'
                                } ${parseInt(actorProps.birthday.split('-')[0]) < new Date().getFullYear() ? new Date().getFullYear() - parseInt(actorProps.birthday.split('-')[0]) - 1 : 0}`
                            ) : (
                                `${
                                    user?.settings.leng === 'es-ES' ? '- Fallecio a los:' : '- Died at age:'
                                } ${parseInt(actorProps.birthday.split('-')[0]) < parseInt(actorProps.deathday.split('-')[0]) ? parseInt(actorProps.deathday.split('-')[0]) - parseInt(actorProps.birthday.split('-')[0]) - 1 : 0}`
                            )
                        }`
                    }</Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: colorScheme === 'dark' ? '#fff' : '#000',
                        }}
                    >
                        { actorProps && actorProps.place_of_birth}
                    </Text>
                </View>
            </View>

            {
                actorTitles && actorTitles.length > 0 && (
                    <FlatList
                        data={actorTitles}
                        keyExtractor={(item: any) => item.id.toString()}
                        renderItem={({item}: any) => (
                            <View
                                style={{
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: colorScheme === 'dark' ? '#121212' : '#e3e3e3',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}
                            >
                                <Image 
                                    style={{
                                        width: 100,
                                        height: 150,
                                        borderRadius: 10,
                                    }}
                                    source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/150' }}
                                />

                                <View
                                    style={{
                                        marginLeft: 10,
                                        flex: 1,
                                        justifyContent: 'flex-start',
                                        
                                    }}

                                >
                                    <Text style={{
                                        color: colorScheme === 'dark' ? '#fff' : '#000',
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        marginBottom: 5,
                                    }}>
                                        {
                                            item.media_type === 'movie' ? item.title : item.name
                                        }
                                    </Text>
                                    <View style={{ width: 10 }} />
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: colorScheme === 'dark' ? '#a1a1a1' : '#8a8a8a',
                                        }}
                                    >
                                        { item.release_date ? item.release_date.substring(0, 4) : '' }
                                        { item.first_air_date ? item.first_air_date.substring(0, 4) : '' }
                                        <View style={{ width: 5 }} />
                                        <Icon 
                                            name={
                                                item.media_type === 'movie' ? 'ios-film' : 'ios-tv'
                                            }
                                            size={15}
                                        />
                                    </Text>

                                    <Text
                                        style={{
                                            flex: 1,
                                            fontSize: 14,
                                            color: colorScheme === 'dark' ? '#a3a3a3' : '#4d4d4d',
                                            marginTop: 10,
                                        }}
                                    >
                                        { item.overview?.substring(0, 120) + '...' }
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        if (item.media_type === 'movie') {
                                            setActorModalVisible({
                                                visible: false,
                                                actor: {}
                                            })
                                            navigation.goBack()
                                            navigation.navigate('SearchDetailStack', {
                                                screen: 'MovieDetailScreen',
                                                initial: false,
                                                params: item 
                                            })
                                        } else {
                                            setActorModalVisible({
                                                visible: false,
                                                actor: {}
                                            })
                                            navigation.goBack()
                                            navigation.navigate('SearchDetailStack', {
                                                screen: 'SeriesDetailScreen',
                                                initial: false,
                                                params: item
                                            })
                                        }
                                    }}
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 10,
                                        backgroundColor: '#0055ff',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginLeft: 10,
                                    }}
                                >
                                    <Icon 
                                        name="chevron-forward" 
                                        size={25} 
                                        color='#fff'
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
        
                    />
                )
            }
            <View 
                style={{ height: 70 }}
            />
            </View>
        </Modal>
    )
}
