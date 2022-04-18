import React, { useEffect, useState } from 'react'
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moviesGenres, seriesGenres } from '../data/generesData';


export const PickGenresModal = () => {

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

    return (
            <View
                style={{
                    ...styles.modal,
                    top: top + 20
                }}
            >
                <Text
                    style={styles.title}
                >
                    Pick at least 5 genres for movies and series
                </Text>

                <ScrollView>
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
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontWeight: 'bold'
                                }}
                            >
                                Done
                            </Text>
                        </TouchableOpacity>
                    </View>
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
        marginTop: 20,
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
