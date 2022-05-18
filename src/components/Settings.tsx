import { DrawerActions, useNavigation } from '@react-navigation/native'
import React, { useContext } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import { deleteAccountAction } from '../api/watcherActions'
import { AuthContext } from '../context/AuthContext'

export const Settings = () => {
    
    const navigation = useNavigation()
    const { top } = useSafeAreaInsets()

    const { user, logOut, colorScheme } = useContext( AuthContext )

    const triggerDelete = () => {
        Alert.alert('Delete Account', 'Are you sure you want to delete your account? All data will be lost', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Delete',
                onPress: () => {
                    deleteAccount()
                }
            }
        ], { cancelable: true })
          
    }

    const deleteAccount = () => {
    
        if ( user ) {
            const userNameToDelete = user.userName
            deleteAccountAction( userNameToDelete )
            logOut()
        }

    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
            }}
        >

            <TouchableOpacity
                onPress={ () => navigation.dispatch( DrawerActions.openDrawer() ) }
                style={{
                    position: 'absolute',
                    top: top + 5,
                    right: 20,
                    zIndex: 10
                }}
            >
                <Icon name='menu' size={30} color={
                    colorScheme === 'dark' ? '#fff' : '#000'
                } style={{ marginLeft: 20 }} />
            </TouchableOpacity>

            <Text style={{
                ...styles.title, 
                top: top + 5, 
                marginLeft: 20, 
                color: colorScheme === 'dark' ? '#fff' : '#000'
            }}>
                Settings
            </Text>
            <View style={styles.container}>
                {/* <View style={styles.subDiv}>
                    <Text style={styles.subTitle}>
                        Account
                    </Text>
                    <TouchableOpacity style={styles.btn}>
                        <Text>
                            Change Password
                        </Text>
                        <Icon name='pencil' size={20} color='#000' />
                    </TouchableOpacity>
                </View> */}

                <View style={styles.subDiv}>
                    <Text style={styles.subTitle}>
                        Application
                    </Text>
                    {
                        colorScheme === 'dark' 
                      ? <TouchableOpacity style={{
                          ...styles.btn,
                            backgroundColor: '#2f2f2f'
                          }}>
                            <Text
                                style={{
                                    color: '#e6e6e6'
                                }}
                            >
                                Dark Theme
                            </Text>
                            <Icon name='moon' size={20} color='#fff' />
                        </TouchableOpacity>
                      : <TouchableOpacity style={styles.btn}>
                            <Text>
                                Light Theme
                            </Text>
                            <Icon name="sunny" size={20} color="#000" />
                        </TouchableOpacity>
                    }
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 14,
                            color: colorScheme === 'dark' ? '#e6e6e6' : '#000'
                        }}
                    >
                        The theme of the app is set using your device setting, to change the theme change your device to {
                            colorScheme === 'dark' ? 'light' : 'dark'
                        } mode
                    </Text>
                </View>

                <View style={styles.deleteDiv}>
                    <TouchableOpacity style={styles.btnDelete}
                        onPress={triggerDelete}
                    >
                        <Text
                            style={{
                                color: '#fff',
                                fontWeight: 'bold'
                            }}
                        >
                            Delete Account
                        </Text>
                        <Icon name="trash" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
    },

    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 30,
    },

    subDiv: {
        width: '100%',
        padding: 20,
        borderRadius: 10,
        justifyContent: 'center',
        marginBottom: 20,
    },

    deleteDiv: {
        width: '100%',
        padding: 20,
        borderRadius: 10,
        justifyContent: 'center',
        marginBottom: 20,
        position: 'absolute',
        bottom: 0,
    },

    subTitle: {
        fontSize: 20,
        marginBottom: 10,
        color: '#777777',
    },

    btn: {
        width: '100%',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#dfdfdf',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
        flexDirection: 'row',
    },

    btnDelete: {
        width: '100%',
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#BF1313',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 20,
    },
})
