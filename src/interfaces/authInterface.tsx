import { Dispatch, SetStateAction } from "react";
import { UserMovies, UserSeries } from "./movieInterface";

export interface LoginData {
    email: string;
    password: string;
    setLoginLoader: Dispatch<SetStateAction<boolean>>;
}

export interface RegisterData {
    userName: string;
    email: string;
    password: string;
    repeatPassword: string;
    region: string;
    setLoadingRegister: Dispatch<SetStateAction<boolean>>;
}

export interface LoginResponse {
    user: WatcherUser;
    token:   string;
}

export interface WatcherUser {
    email: string,
    id: string,
    movies: UserMovies[],
    region: string,
    series: UserSeries[],
    userName: string,
    likedComments: string[],
    img?: string,
    moviesGenres: { genreId: number; genre: string; }[],
    seriesGenres: { genreId: number; genre: string; }[],
    watchlist: { elementId: string; posterPath: string; type: string; }[],
    settings: {
        leng: string,
        newAccount: boolean,
        verifyCode?: string,
    }
}
