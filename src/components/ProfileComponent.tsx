import React, { useContext, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { intervalToDuration  } from 'date-fns'

import { AuthContext } from '../context/AuthContext'
import { PickGenresModal } from './PickGenresModal'
import Icon from 'react-native-vector-icons/Ionicons'
import { ProfileDrawer } from '../navigation/ProfileDrawer'
import { DrawerActions, useNavigation } from '@react-navigation/native'

export const ProfileComponent = () => {

    const navigation = useNavigation()

    const { top } = useSafeAreaInsets()

    const [pickGenresVisible, setPickGenresVisible] = useState(false)

    const { user } = useContext( AuthContext )

    const turnMinutesMovies = () => {

        let total: number = 0

        user?.movies.forEach( movie => {
            total += movie.runTime
        })

        const duration = intervalToDuration({
            start: 0,
            end: total * 60 * 1000
        })
        
        let result = []

        result.push({
            key: 'Months',
            value: duration.months
        },{
            key: 'Days',
            value: duration.days
        },{
            key: 'Hours',
            value: duration.hours
        })

        return result

    }

    const turnMinutesSeries = ( total: number ) => {

        const duration = intervalToDuration({
            start: 0,
            end: total * 60 * 1000
        })

        let result = []

        result.push({
            key: 'Months',
            value: duration.months
        },{
            key: 'Days',
            value: duration.days
        },{
            key: 'Hours',
            value: duration.hours
        })
    
        return result
    
    }

    return (
        <View style={{ paddingTop: top + 20, ...styles.container }}>

            <Text style={ styles.profileUsername }>
                { user?.userName }
                <TouchableOpacity
                    onPress={ () => navigation.dispatch( DrawerActions.openDrawer() ) }
                >
                    <Icon name='cog' size={40} color='#000' style={{ marginLeft: 20 }} />
                </TouchableOpacity>
            </Text>

            <View style={ styles.statsDiv }>
                <ScrollView
                    style={{
                        width: '100%',
                        height: '100%',
                        paddingHorizontal: 20,
                        paddingVertical: 20,
                    }}
                    contentContainerStyle={{
                        alignItems: 'center',
                    }}
                >
                    <View style={ styles.statsCard }>
                        <Text style={ styles.statsTitle }>Movies Watched</Text>
                        <Text style={ styles.statsStat }>{ user?.movies.length }</Text>
                    </View>

                    <View style={ styles.statsCard }>
                        <Text style={ styles.statsTitle }>Time Watching Movies</Text>
                        <View style={ styles.statsTime }>{ user && turnMinutesMovies().map((m) =>{
                            return (
                            <View style={ styles.timeIndiv } key={ m.key }>
                                <Text style={ styles.statsStat }>{ m.value }</Text>
                                <Text style={ styles.timeKeys }>{ m.key }</Text>
                            </View>)
                        })}</View>
                    </View>

                    <View style={ styles.statsCard }>
                        <Text style={ styles.statsTitle }>Episodes Watched</Text>
                        <Text style={ styles.statsStat }>{
                            user?.series.reduce((acc, curr) => {
                                return acc + curr.episodesWatched
                            }, 0)
                        }</Text>
                    </View>

                    <View style={ styles.statsCard }>
                        <Text style={ styles.statsTitle }>Time Watching Episodes</Text>
                        <View style={ styles.statsTime }>{
                            turnMinutesSeries(
                            user?.series.reduce((acc, curr) => {
                                return acc + curr.episodesWatched * 30
                            }, 0) || 0
                            ).map((m) =>{ 
                                return (
                                <View style={ styles.timeIndiv } key={ m.key }>
                                    <Text style={ styles.statsStat }>{ m.value }</Text>
                                    <Text style={ styles.timeKeys }>{ m.key }</Text>
                                </View>)
                            })
                        }</View>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },

    profileUsername: {
        fontSize: 45,
        fontWeight: 'bold',
    },

    btnContainer: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },

    btn: {
        width: '80%',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#a42837',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },

    btnText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },

    statsDiv: {
        width: '100%',
        marginTop: 20,
        alignItems: 'center',
    },

    statsCard: {
        width: '90%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },

    statsTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    timeIndiv: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
    },

    timeKeys: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#aaaaaa',
    },

    statsTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold',
    },

    statsStat: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#2068F8',
    },

});
