import React, { useContext } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AuthContext } from '../context/AuthContext'

export const ProfileComponent = () => {

    const { top } = useSafeAreaInsets()

    const { user, logOut } = useContext( AuthContext )

    console.log(user)
    return (
        <View style={{ paddingTop: top + 20, ...styles.container }}>

            <View style={ styles.profileInfo }>
                <Image 
                    source={require('../assets/profile-placeholder.png')}
                    style={{ width: 150, height: 150, borderRadius: 50, opacity: 0.7 }}
                />
                <Text style={ styles.profileUsername }>
                    { user?.userName }
                </Text>
            </View>


            <View style={ styles.btnContainer }>
                <TouchableOpacity style={ styles.btn } activeOpacity={0.8} onPress={logOut}>
                    <Text style={ styles.btnText }>
                        LogOut
                    </Text>
                </TouchableOpacity>
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

    profileInfo: {
        marginTop: 20,
        alignItems: 'center',
    },

    profileUsername: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 10,
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


});
