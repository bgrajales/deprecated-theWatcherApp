import React, { createContext, useEffect, useReducer } from "react";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { LoginData, RegisterData, WatcherUser } from "../interfaces/authInterface";
import { AuthReducer, AuthState } from "./AuthReducer";
import { watcherApi } from "../api/watcherApi";

// import cafeApi from "../api/cafeApi";
// import { AuthReducer, AuthState } from "./AuthReducer";

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: WatcherUser | null;
    status: 'checking' | 'authenticated' | 'unauthenticated';
    signUp: ( registerData: RegisterData ) => void;
    signIn: ( loginData: LoginData ) => void;
    logOut: () => void;
    removeError: () => void;
}

const authInitialState: AuthState = {
    status: 'checking',
    refreshToken: null,
    token: null,
    user: null,
    errorMessage: ''
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {

    const [ state, dispatch ] = useReducer(AuthReducer, authInitialState)

    useEffect(() => {

        checkToken()
      
    }, [])

    const checkToken = async () => {

        const refreshToken = await AsyncStorage.getItem('refreshToken')

        if ( !refreshToken ) return dispatch({ type: 'notAuthenticated' });

        const resp = await watcherApi.post('/refreshToken', { refreshToken })

        if ( resp.data.error ) return dispatch({ type: 'notAuthenticated' });

        await AsyncStorage.setItem('token', resp.data.token)
        await AsyncStorage.setItem('refreshToken', resp.data.refreshToken)

        dispatch({
            type: 'singUp',
            payload: {
                token: resp.data.token,
                refreshToken: resp.data.refreshToken,
                user: resp.data.user
            }
        })
        
    }    

    const signIn = async ( { email, password }: LoginData ) => {

        try {
            console.log(email, password)
            const { data } = await watcherApi.post('/login', { email, password })

            dispatch({
                type: 'singUp',
                payload: {
                    refreshToken: data.refreshToken,
                    token: data.token,
                    user: data.user
                }
            })

            await AsyncStorage.setItem('token', data.token)
            await AsyncStorage.setItem('refreshToken', data.refreshToken)

        } catch (error: any) {

            dispatch({
                type: 'addError',
                payload: error.response.data.error || 'Wrong information'
            })

        }

    };

    const signUp = async ({ userName, email, password, repeatPassword }: RegisterData) => {

        try {
            const region = "US"

            const { data } = await watcherApi.post('/register', { userName, email, password, repeatPassword, region })

            dispatch({
                type: 'singUp',
                payload: {
                    refreshToken: data.refreshToken,
                    token: data.token,
                    user: data.user
                }
            })

            await AsyncStorage.setItem('token', data.token)
            await AsyncStorage.setItem('refreshToken', data.refreshToken)

        } catch (error: any) {
                
            dispatch({
                type: 'addError',
                payload: error.response.data.error || 'Wrong information'
            })

        }
    };

    const logOut = async () => {
            
            await AsyncStorage.removeItem('token')
    
            dispatch({ type: 'logOut' })
    
    };

    const removeError = () => {

        dispatch({
            type: 'removeError'
        })

    };

    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError
        }}>
            {children}
        </AuthContext.Provider>
    )

}