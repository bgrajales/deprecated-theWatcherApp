import React, { useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';

export const NotAuth = () => {

    const [loginVisible, setLoginVisible] = useState(false)
    const [registerVisible, setRegisterVisible] = useState(false)

  return (
    <View style={{ 
        flex: 1, 
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    }}>

        <LoginModal 
            visible={loginVisible}
            setLoginVisibleParent={setLoginVisible}
        />

        <RegisterModal 
            visible={registerVisible}
            setRegisterVisibleParent={setRegisterVisible}
        />

        <Image 
            source={require('../assets/fullIcon.png')}
            style={{ width: 150, height: 105, marginBottom: 20 }}
        />
        <Text style={ styles.title }>Nothing to see here</Text>

        <Text style={ styles.subTitle }>You need to be logged in to access this section</Text>

        <View style={ styles.btnSection }>
            <TouchableOpacity 
                style={{
                        ...styles.btn,
                        ...styles.btnLogin
                }} 
                activeOpacity={0.8}
                onPress={() => setLoginVisible(true)}
            >
                <Text style={ styles.btnText }>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={{
                    ...styles.btn,
                    ...styles.btnRegister
                }} 
                activeOpacity={0.8}
                onPress={() => setRegisterVisible(true)}    
            >
                <Text style={ styles.btnText }>Register</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },

    subTitle: {
        fontSize: 16,
        marginBottom: 20,
        color: '#b2b2b2'
    },

    btnSection: {
        width: '100%',
        marginTop: 20
    },

    btn: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },

    btnLogin: {
        backgroundColor: '#0055FF',
    },

    btnRegister: {
        backgroundColor: '#333333',
    },

    btnText: {
        color: '#fff',
        fontWeight: 'bold',
    },

});
