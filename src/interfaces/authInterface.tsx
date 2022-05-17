import { UserMovies, UserSeries } from "./movieInterface";

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    userName: string;
    email: string;
    password: string;
    repeatPassword: string;
    region: string;
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
}
