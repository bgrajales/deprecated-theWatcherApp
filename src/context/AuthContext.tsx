import React, { createContext, useEffect, useReducer } from "react";

import AsyncStorage from '@react-native-async-storage/async-storage';

import { LoginData, RegisterData, WatcherUser } from "../interfaces/authInterface";
import { AuthReducer, AuthState } from "./AuthReducer";
import { watcherApi } from "../api/watcherApi";
import { Series, UserMovies, UserSeries } from "../interfaces/movieInterface";
import { Appearance, useColorScheme } from "react-native";

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
    updateWatchedMovies: ( movies: UserMovies[] ) => void;
    updateWatchedSeries: ( series: UserSeries[] ) => void;
    updateLikedComments: ( likedComments: string[] ) => void;
    updateWatchListContext: ( watchlist: { elementId: string; posterPath: string; type: string; }[] ) => void;
    updateSeries: ( series: UserSeries[] ) => void;
    colorScheme: string | null | undefined;
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
    const colorScheme = Appearance.getColorScheme();

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

    const signUp = async ({ userName, email, password, repeatPassword, region }: RegisterData) => {

        try {

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
            await AsyncStorage.removeItem('refreshToken')
    
            dispatch({ type: 'logOut' })
    
    };

    const removeError = () => {

        dispatch({
            type: 'removeError'
        })

    };

    const updateWatchedMovies = async ( movies: UserMovies[]) => {

        dispatch({ 
            type: 'updateWatchedMovies',
            payload: {
                movies
            }
        })
    }

    const updateWatchedSeries = async ( series: UserSeries[]) => {

        dispatch({ 
            type: 'updateWatchedSeries',
            payload: {
                series
            }
        })
    }

    const updateLikedComments = async ( likedComments: string[]) => {

        dispatch({
            type: 'updateLikedComments',
            payload: {
                likedComments
            }
        })

    }

    const updateWatchListContext = async ( watchlist: { elementId: string; posterPath: string; type: string; }[]) => {

        dispatch({
            type: 'updateWatchList',
            payload: {
                watchlist
            }
        })

    }

    const updateSeries = async ( series: WatcherUser['series']) => {

        dispatch({
            type: 'updateSeries',
            payload: {
                series
            }
        })

    }

    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError,
            updateWatchedMovies,
            updateWatchedSeries,
            updateLikedComments,
            updateWatchListContext,
            updateSeries,
            colorScheme
        }}>
            {children}
        </AuthContext.Provider>
    )

}