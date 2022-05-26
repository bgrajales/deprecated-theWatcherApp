import React, { useContext, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import CountryPicker, { CountryCode } from 'react-native-country-picker-modal'


interface Props {
    visible: boolean
    setRegisterVisibleParent: (visible: boolean) => void
}

export const RegisterModal = ({ visible = false, setRegisterVisibleParent }: Props) => {

    const [isVisible, setIsVisible] = useState(visible);
    const [ countryCodeState, setCountryCode ] = useState<CountryCode>('US');

    const [ loadingRegister, setLoadingRegister ] = useState(false);

    const { top } = useSafeAreaInsets();

    const { signUp, errorMessage, removeError, colorScheme } = useContext( AuthContext )

    const { userName, email, password, repeatPassword, onChange } = useForm({
        userName: '',
        email: '',
        password: '',
        repeatPassword: '',
    }) 

    useEffect(() => {
        if( isVisible ) {
            if ( errorMessage.length === 0 ) return;
            Alert.alert('Register Failed', errorMessage, [{ text: 'Ok', onPress: removeError }])
        }
    }, [errorMessage])

    useEffect(() => {
        setIsVisible(visible);
    }, [visible])

    const onSubmit = async () => {

        setLoadingRegister(true);
        await signUp({
            userName,
            email,
            password,
            repeatPassword,
            region: countryCodeState,
            setLoadingRegister
        })
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
                } onPress={() => setRegisterVisibleParent(false)} />
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
                    }}>Register</Text>

                    <Text style={ styles.inputLabel }>Username:</Text>
                    <TextInput 
                        style={{ 
                            ...styles.input,
                            color: colorScheme === 'dark' ? '#fff' : '#000' 
                        }}
                        placeholder="User Name"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}

                        value={userName}
                        onChangeText={(value) => onChange(value, 'userName')}
                    />

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

                   
                        <CountryPicker
                            countryCode={ countryCodeState }
                            withAlphaFilter={true}
                            withFlagButton={true}
                            withFilter={true}
                            withFlag={true}
                            withEmoji={true}
                            withCountryNameButton={true}
                            withCloseButton={true}
                            onSelect={(country) => {
                                setCountryCode(country.cca2)  
                            }}
                            theme={{
                                backgroundColor: colorScheme === 'dark' ? '#262626' : '#fff',
                                primaryColor: colorScheme === 'dark' ? '#fff' : '#000',
                                onBackgroundTextColor: colorScheme === 'dark' ? '#fff' : '#000',
                                filterPlaceholderTextColor: colorScheme === 'dark' ? '#fff' : '#000',
                                primaryColorVariant: colorScheme === 'dark' ? '#fff' : '#000',
                            }}
                            containerButtonStyle={{
                                backgroundColor: colorScheme === 'dark' ? '#1c1c1c' : '#fff',
                                borderRadius: 5,
                                borderWidth: 0,
                                width: '100%',
                                height: 40,
                                marginTop: 10,
                                marginBottom: 10,
                                paddingLeft: 10,
                            }}
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
                    
                    <Text style={ styles.inputLabel }>Repeat Password:</Text>
                    <TextInput
                        style={{ 
                            ...styles.input,
                            color: colorScheme === 'dark' ? '#fff' : '#000' 
                        }}
                        placeholder="Repeat Password"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={true}

                        value={repeatPassword}
                        onChangeText={(value) => onChange(value, 'repeatPassword')}
                    />

                    <View style={ styles.btnSection }>
                        <TouchableOpacity
                            style={ styles.btn }
                            onPress={() => onSubmit()}
                            activeOpacity={0.8}
                            disabled={loadingRegister}
                        >
                            {
                                loadingRegister ?
                                <ActivityIndicator size="small" color="#fff" />
                                :
                                <Text style={ styles.btnText }>Create account</Text>
                            }
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

    countryPicker: {
        marginBottom: 10,
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: '#DEDEDE',
        paddingVertical: 5,
        borderRadius: 5,
    }

});
