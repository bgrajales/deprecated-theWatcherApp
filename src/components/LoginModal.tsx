import React, { useContext, useEffect, useState } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';

interface Props {
    visible: boolean
    setLoginVisibleParent: (visible: boolean) => void
}

export const LoginModal = ({ visible = false, setLoginVisibleParent }: Props) => {

    const [isVisible, setIsVisible] = useState(visible);

    const { top } = useSafeAreaInsets();

    const { signIn, errorMessage, removeError, colorScheme } = useContext( AuthContext )

    const { email, password, onChange } = useForm({
        email: '',
        password: '',
    }) 

    useEffect(() => {
        if( isVisible ) {
            if ( errorMessage.length === 0 ) return;
            Alert.alert('Login Failed', errorMessage, [{ text: 'Ok', onPress: removeError }])
        }
    }, [errorMessage])

    useEffect(() => {
        setIsVisible(visible);
    }, [visible])

    const onSubmit = () => {
        signIn({ email, password })
        Keyboard.dismiss();
    }    
    
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
        >
            <View style={{ 
                ...styles.closeSection, 
                top: top, 
                backgroundColor: colorScheme === 'dark' ? '#262626' : '#fff'
            }}>
                <Icon name="md-close" size={30} color={
                    colorScheme === 'dark' ? '#fff' : '#000'
                } onPress={() => setLoginVisibleParent(false)} />
            </View>

            <KeyboardAvoidingView 
                style={{ 
                    ...styles.modal, 
                    backgroundColor: colorScheme === 'dark' ? '#262626' : '#fff'
                }}
                behavior="padding"
            >
                <View style={ styles.modalContent }>


                    <Text style={{ 
                        ...styles.modalTitle, 
                        color: colorScheme === 'dark' ? '#fff' : '#000'
                    }}>Login</Text>

                    <Text style={ styles.inputLabel }>Email:</Text>
                    <TextInput 
                        style={{ 
                            ...styles.input, 
                            color: colorScheme === 'dark' ? '#fff' : '#000'
                        }}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        keyboardType='email-address'
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={email}
                        onChangeText={(value) => onChange(value, 'email')}
                    />

                    <Text style={ styles.inputLabel }>Password:</Text>
                    <TextInput
                        style={{ 
                            ...styles.input, 
                            color: colorScheme === 'dark' ? '#fff' : '#000'
                        }}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={true}

                        value={password}
                        onChangeText={(value) => onChange(value, 'password')}
                    />

                    <View style={ styles.btnSection }>
                        <TouchableOpacity
                            style={ styles.btn }
                            onPress={() => onSubmit()}
                            activeOpacity={0.8}
                        >
                            <Text style={ styles.btnText }>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

const styles = StyleSheet.create({

    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '100%',
        height: '90%',
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },

    modalContent: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        height: '100%',
        width: '90%',
        position: 'relative',
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },

    inputLabel: {
        fontSize: 16,
        marginBottom: 10,
        color: '#b2b2b2'
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
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
        backgroundColor: '#0055FF',
    },

    btnText: {
        color: '#fff',
    },

    closeSection: {
        position: 'absolute',
        right: 20,
        backgroundColor: '#fff',
        padding: 2,
        borderRadius: 100,
    },

});
