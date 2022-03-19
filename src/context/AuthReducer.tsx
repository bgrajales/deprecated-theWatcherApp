import { User } from "../interfaces/authInterface";

export interface AuthState {
    status: 'checking' | 'authenticated' | 'unauthenticated';
    token: string | null;
    refreshToken: string | null;
    errorMessage: string;
    user: User | null;
}

type AuthAction = 
    | { type: 'singUp', payload: { token: string, refreshToken: string, user: User } }
    | { type: 'addError', payload: string }
    | { type: 'removeError'}
    | { type: 'notAuthenticated'}
    | { type: 'logOut'}


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

        default:
            return state;
    }
}