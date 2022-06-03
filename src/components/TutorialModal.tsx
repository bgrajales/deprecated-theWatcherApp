import { BlurView } from 'expo-blur'
import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Button, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import Icon from 'react-native-vector-icons/Ionicons'
import { changeLenguageAction, changeNewAccounAction } from '../api/watcherActions'
import { AuthContext } from '../context/AuthContext'
import { english } from '../lenguages/english'
import { spanish } from '../lenguages/spanish'

export const TutorialModal = () => {

    const [ lenguageOpen, setLenguageOpen ] = useState( false )
    const [ lenguagePickerValue, setLenguagePickerValue ] = useState('')
    const [ lenguageItemToChange, setLenguageItemToChange ] = useState('')
    const [ btnLogin, setBtnLogin ] = useState(false)

    const { user, colorScheme, updateSettings } = useContext( AuthContext )

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

    const updateNewAccount = async () => {
        setBtnLogin(true)
        if(user){
            const resp = await changeNewAccounAction(user.userName)
    
            if ( resp.result ) {

                const newSettings = {
                    ...user.settings,
                    newAccount: false
                }

                setBtnLogin(false)
                updateSettings( newSettings )
            }
        }
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={
                user?.settings?.newAccount || false
            }
            >
            <BlurView 
                style={{ 
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                }} 
                intensity={100}
                tint="dark"
            >
                <View style={{ 
                width: '90%', 
                height: '75%',
                justifyContent: 'center',
                alignItems: 'center',
                }}>
                <View style={{ 
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    borderRadius: 10,
                    backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
                    padding: 20,
                    alignItems: 'center',
                    }}
                >
                    <Image
                    source={{
                        uri: `${
                        colorScheme === 'dark' 
                        ? 'https://res.cloudinary.com/dcho0pw74/image/upload/v1654122202/logoAnimationDark_mwgsas.gif' 
                        : 'https://res.cloudinary.com/dcho0pw74/image/upload/v1654034791/logoAnimation_hc8ec3.gif'
                        }` 
                    }}
                    style={{width: 60, height: 60}}
                    />
                    <Text
                    style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: colorScheme === 'dark' ? '#fff' : '#000',
                        marginBottom: 10,
                        flexDirection: 'row',
                        textAlign: 'center'
                    }}
                    >
                    {
                        user?.settings?.leng === 'en-US' ? english.tutModalTitle : spanish.tutModalTitle
                    } { user?.userName }
                    </Text>

                    <View
                    style={{
                        zIndex: 5,
                        elevation: 5,
                    }}
                    >
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
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            alignItems: 'center',
                        }}
                    >

                    <View
                        style={{
                            width: '80%',
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            marginTop: 20,
                            marginBottom: 20,
                        }}
                    >
                        <Icon 
                            name="arrow-down-outline"
                            size={20}
                            color={colorScheme === 'dark' ? '#fff' : '#000'}
                        />
                        <Text style={{
                            fontSize: 20, 
                            fontWeight: 'bold', 
                            marginBottom: 20, 
                            color: colorScheme === 'dark' ? '#fff' : '#000',
                            textAlign: 'center'
                        }}>
                            {
                                user?.settings.leng === 'es-ES' ? spanish.aboutFeaturesTitle : english.aboutFeaturesTitle
                            }
                        </Text>
                        <Icon 
                            name="arrow-down-outline"
                            size={20}
                            color={colorScheme === 'dark' ? '#fff' : '#000'}
                        />
                    </View>

                    <View
                        style={{
                            width: '90%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginBottom: 35 
                        }}
                    >
                        <Icon name='bookmark' size={30} color='#0055ff' style={{ paddingHorizontal: 2 }} />
                        <Text style={{
                            fontSize: 16,
                            textAlign: 'center',
                            color: colorScheme === 'dark' ? '#e6e6e6' : '#000',
                            flexShrink: 1,
                        }}>
                            {
                                user?.settings.leng === 'es-ES' ? spanish.aboutFeatureOne : english.aboutFeatureOne
                            }
                        </Text>
                    </View>
                    <View
                        style={{
                            width: '90%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginBottom: 35 
                        }}
                    >
                        <Text style={{
                            fontSize: 16,
                            textAlign: 'center',
                            color: colorScheme === 'dark' ? '#e6e6e6' : '#000',
                            paddingRight: 20,
                            flexShrink: 1,
                        }}>
                            {
                                user?.settings.leng === 'es-ES' ? spanish.aboutFeatureTwo : english.aboutFeatureTwo
                            }
                        </Text>
                        <Image 
                            source={require('../assets/fullIcon.png')}
                            style={{ width: 40, height: 30}}
                        />
                    </View>
                    <View
                        style={{
                            width: '90%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginBottom: 35 
                        }}
                    >
                        <Icon name='search' size={30} color='#0055ff' style={{ paddingHorizontal: 2 }} />
                        <Text style={{
                            fontSize: 16,
                            textAlign: 'center',
                            color: colorScheme === 'dark' ? '#e6e6e6' : '#000',
                            flexShrink: 1,
                        }}>
                            {
                                user?.settings.leng === 'es-ES' ? spanish.aboutFeatureThree : english.aboutFeatureThree
                            }
                        </Text>
                    </View>
                    <View
                        style={{
                            width: '90%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginBottom: 35 
                        }}
                    >
                        <Text style={{
                            fontSize: 16,
                            textAlign: 'center',
                            color: colorScheme === 'dark' ? '#e6e6e6' : '#000',
                            paddingRight: 20,
                            flexShrink: 1,
                        }}>
                            {
                                user?.settings.leng === 'es-ES' ? spanish.aboutFeatureFour : english.aboutFeatureFour
                            }
                        </Text>
                        <Icon name='tv' size={30} color='#0055ff' style={{ paddingHorizontal: 2 }} />
                    </View>
                    <View
                        style={{
                            width: '90%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                            marginBottom: 35 
                        }}
                    >
                        <Icon name='chatbubbles' size={30} color='#0055ff' style={{ paddingHorizontal: 2 }} />
                        <Text style={{
                            fontSize: 16,
                            textAlign: 'center',
                            color: colorScheme === 'dark' ? '#e6e6e6' : '#000',
                            flexShrink: 1,
                        }}>
                            {
                                user?.settings.leng === 'es-ES' ? spanish.aboutFeatureFive : english.aboutFeatureFive
                            }
                        </Text>
                    </View>

                    <TouchableOpacity 
                        style={{
                            width: '90%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#0055ff',
                            borderRadius: 10,
                            marginBottom: 20,
                            paddingVertical: 10,
                        }}
                        onPress={() => {updateNewAccount()}}
                    >
                        {
                            btnLogin ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    color: colorScheme === 'dark' ? '#fff' : '#000',
                                    textAlign: 'center'
                                }}>
                                    {
                                        user?.settings.leng === 'es-ES' ? spanish.tutModalBtn : english.tutModalBtn
                                    }
                                </Text>
                            )
                        }
                    </TouchableOpacity>
                    </ScrollView>
                </View>
                </View>
            </BlurView>
        </Modal>
    )
}


const styles = StyleSheet.create({
    subDiv: {
        width: '100%',
        padding: 20,
        borderRadius: 10,
        justifyContent: 'center',
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

})
