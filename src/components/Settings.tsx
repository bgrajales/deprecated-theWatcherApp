import { DrawerActions, useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/Ionicons'
import { changeLenguageAction, deleteAccountAction } from '../api/watcherActions'
import { AuthContext } from '../context/AuthContext'
import { english } from '../lenguages/english'
import DropDownPicker from 'react-native-dropdown-picker';
import { spanish } from '../lenguages/spanish'

export const Settings = () => {
    
    const navigation = useNavigation()
    const { top } = useSafeAreaInsets()

    const { user, logOut, colorScheme, updateSettings } = useContext( AuthContext )

    const [ lenguageOpen, setLenguageOpen ] = useState( false )
    const [ lenguagePickerValue, setLenguagePickerValue ] = useState('')
    const [ lenguageItemToChange, setLenguageItemToChange ] = useState('')

    useEffect(() => {
      
        if(user){
            setLenguagePickerValue(user.settings.leng)
        } else {
            setLenguagePickerValue('en-US')
        }

        return () => {
            setLenguagePickerValue('')
        }

    }, [])

    useEffect(() => {

        if(user && lenguageItemToChange !== user.settings.leng && lenguageItemToChange !== ''){
            changeLenguage(lenguageItemToChange)
        }

        return () => {
            setLenguageItemToChange('')
        }
    },[lenguageItemToChange])
    

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

    const changeLenguage = async ( lenguage: any ) => {
        if(user){
            const resp = await changeLenguageAction( user.userName, lenguage )
    
            if ( resp.result ) {
                setLenguagePickerValue( lenguage )
                setLenguageOpen( false )

                const newSettings = {
                    ...user.settings,
                    leng: lenguage
                }

                setLenguageItemToChange('')
                updateSettings( newSettings )
            }
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
                {
                    user?.settings.leng === 'es-ES' ? spanish.settingsTitle : english.settingsTitle
                }
            </Text>
            <View style={styles.container}>
                <View style={styles.subDiv}>
                    <Text style={styles.subTitle}>
                        {
                            user?.settings.leng === 'es-ES' ? spanish.settingsSubTitleOne : english.settingsSubTitleOne
                        }
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
                                {
                                    user?.settings.leng === 'es-ES' ? spanish.settingsDarkTheme : english.settingsDarkTheme
                                }
                            </Text>
                            <Icon name='moon' size={20} color='#fff' />
                        </TouchableOpacity>
                      : <TouchableOpacity style={styles.btn}>
                            <Text>
                                {
                                    user?.settings.leng === 'es-ES' ? spanish.settingsLightTheme : english.settingsLightTheme
                                }
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
                        {
                            user?.settings.leng === 'es-ES' ? spanish.settingsThemeText : english.settingsThemeText
                        } {
                            colorScheme === 'dark' ? english.settingsLightTheme : english.settingsDarkTheme
                        }
                    </Text>
                </View>

                <View style={styles.subDiv}>
                    <Text style={styles.subTitle}>
                        Lenguage
                    </Text>
                    <DropDownPicker 
                        open={lenguageOpen}
                        value={lenguagePickerValue}
                        items={[
                            {label: 'English', value: 'en-US'},
                            {label: 'Español', value: 'es-ES'},
                        ]}
                        setOpen={setLenguageOpen}
                        setValue={setLenguageItemToChange}
                        style={{
                            ...styles.btn,
                            backgroundColor: colorScheme === 'dark' ? '#2f2f2f' : '#dfdfdf',
                            borderWidth: 0,
                        }}
                        textStyle={{
                            color: colorScheme === 'dark' ? '#e6e6e6' : '#000'
                        }}
                        theme={ colorScheme === 'dark' ? 'DARK' : 'LIGHT' }
                    />
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
                           {
                                user?.settings.leng === 'es-ES' ? spanish.settingsDeleteAcc : english.settingsDeleteAcc
                           }
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
        marginBottom: 5,
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
