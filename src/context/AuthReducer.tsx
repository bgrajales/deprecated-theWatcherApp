import { WatcherUser } from "../interfaces/authInterface";

export interface AuthState {
    status: 'checking' | 'authenticated' | 'unauthenticated';
    token: string | null;
    refreshToken: string | null;
    errorMessage: string;
    user: WatcherUser | null;
}

type AuthAction = 
    | { type: 'singUp', payload: { token: string, refreshToken: string, user: WatcherUser } }
    | { type: 'addError', payload: string }
    | { type: 'removeError'}
    | { type: 'notAuthenticated'}
    | { type: 'logOut'}
    | { type: 'updateWatchedMovies', payload: { movies: WatcherUser['movies'] } }
    | { type: 'updateWatchedSeries', payload: { series: WatcherUser['series'] } }


export const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {

    switch (action.type) {
        case 'addError':
            return {
                ...state,
                user: null,
                status: 'unauthenticated',
                refreshToken: null,
                token: null,
                errorMessage: action.payload
            }
        
        case 'removeError':
            return {
                ...state,
                errorMessage: ''
            }

        case 'singUp':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
                status: 'authenticated',
                errorMessage: ''
            }

        case 'notAuthenticated':
        case 'logOut':
            return {
                ...state,
                user: null,
                token: null,
                refreshToken: null,
                status: 'unauthenticated',
                errorMessage: ''
            }

        case 'updateWatchedMovies':
            return { 
                ...state,
                user: {
                    ...state.user!,
                    movies: action.payload.movies,
                }
            }

        case 'updateWatchedSeries':
            return {
                ...state,
                user: {
                    ...state.user!,
                    series: action.payload.series,
                }
            }

        default:
            return state;
    }
}