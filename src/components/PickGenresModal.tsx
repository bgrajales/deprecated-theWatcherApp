import { DrawerActions, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react'
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { setGenres } from '../api/watcherActions';
import { AuthContext } from '../context/AuthContext';
import { moviesGenres, seriesGenres } from '../data/generesData';


export const PickGenresModal = () => {

    const { user } = useContext( AuthContext );

    const navigation = useNavigation()

    const [moviesGenresPicked, setMoviesGenresPicked] = useState<{ id: number; genre: string; }[]>([]);
    const [seriesGenresPicked, setSeriesGenresPicked] = useState<{ id: number; genre: string; }[]>([]);

    const { top } = useSafeAreaInsets()

    const setMoviesGenPicked = (id: number, genre: string) => {

        if (moviesGenresPicked.find(item => item.id === id)) {
            setMoviesGenresPicked(moviesGenresPicked.filter(item => item.id !== id))
        } else {

            const newMoviesGenresPicked = [
                ...moviesGenresPicked,
                {
                    id,
                    genre
                }
            ]

            setMoviesGenresPicked(newMoviesGenresPicked)
        }
    }

    const setSeriesGenPicked = (id: number, genre: string) => {

        if (seriesGenresPicked.find(item => item.id === id)) {
            setSeriesGenresPicked(seriesGenresPicked.filter(item => item.id !== id))
        } else {

            const newSeriesGenresPicked = [
                ...seriesGenresPicked,
                {
                    id,
                    genre
                }
            ]

            setSeriesGenresPicked(newSeriesGenresPicked)
        }
    }

    const saveSelectedGenres = () => {

        if (moviesGenresPicked.length >= 4 && seriesGenresPicked.length >= 4) {

            const userName = user?.userName!
            setGenres({ userName, moviesGenresPicked, seriesGenresPicked })

        } else {
            // implement error handling
        }
    }

    useEffect(() => {

        console.log(user?.moviesGenres, user?.seriesGenres)
      
        if (user?.moviesGenres) {

            const newMoviesGenresPicked = user?.moviesGenres.map(item => {
                return {
                    id: item.genreId,
                    genre: item.genre
                }
            })

            setMoviesGenresPicked(newMoviesGenresPicked)
        }

        if (user?.seriesGenres) {

            const newSeriesGenresPicked = user?.seriesGenres.map(item => {
                return {
                    id: item.genreId,
                    genre: item.genre
                }
            })

            setSeriesGenresPicked(newSeriesGenresPicked)
        }


    }, [])
    

    return (
            <View
                style={{
                    ...styles.modal,
                    top: top + 20,
                    marginBottom: 60
                }}
            >
                <Text
                    style={styles.title}
                >
                    Pick at least 4 genres for movies and series
                    <TouchableOpacity
                        onPress={ () => navigation.dispatch( DrawerActions.openDrawer() ) }
                    >
                        <Icon name='cog' size={30} color='#000' style={{ marginLeft: 20 }} />
                    </TouchableOpacity>
                </Text>

                <ScrollView
                    style={{
                        paddingBottom: 30
                    }}
                >
                    <Text style={styles.modalTitle}>
                        Movies
                    </Text>

                    <View
                        style={styles.genres}
                    >
                        {
                            moviesGenres.map((genre, index) => {
                                return (
                                    <TouchableOpacity
                                        style={{
                                            ...styles.genreBtn,
                                            backgroundColor: moviesGenresPicked.find(item => item.id === genre.id) ? '#0055FF' : '#fff'
                                        }}
                                        key={index}
                                        onPress={() => setMoviesGenPicked(genre.id, genre.name)}
                                    >
                                        <Text
                                            style={{
                                                color: moviesGenresPicked.find(g => g.id === genre.id) ? '#fff' : '#000'
                                            }}
                                        >
                                            {genre.name}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })
                        }    
                    </View>
                    <Text style={styles.modalTitle}>
                        Series
                    </Text>
                    <View
                        style={styles.genres}
                    >
                        {
                            seriesGenres.map((genre, index) => {
                                return (
                                    <TouchableOpacity
                                        style={{
                                            ...styles.genreBtn,
                                            backgroundColor: seriesGenresPicked.find(g => g.id === genre.id) ? '#0055FF' : '#fff',
                                        }}
                                        key={index}
                                        onPress={() => setSeriesGenPicked(genre.id, genre.name)}
                                    >
                                        <Text
                                            style={{
                                                color: seriesGenresPicked.find(g => g.id === genre.id) ? '#fff' : '#000'
                                            }}
                                        >
                                            {genre.name}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            })
                        }    
                    </View>

                    <View
                        style={{
                            alignItems: 'center',
                        }}
                    >
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={saveSelectedGenres}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontWeight: 'bold'
                                }}
                            >
                                Save
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 40 }}/>
                </ScrollView>
            </View>
    )
}

const styles = StyleSheet.create({

    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '100%',
    },

    genres: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center',
    },

    genreBtn: {
        padding: 10,
        margin: 8,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#0055ff',
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 10,
    },

    btn: {
        width: '80%',
        height: 40,
        backgroundColor: '#0055ff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginTop: 20,
    }

});
