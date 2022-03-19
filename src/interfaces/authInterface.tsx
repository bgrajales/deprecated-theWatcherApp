import { UserMovies } from "./movieInterface";

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    userName: string;
    email: string;
    password: string;
    repeatPassword: string;
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
    series: [],
    userName: string,
    img?: string,
  }