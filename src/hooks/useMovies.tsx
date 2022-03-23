import { useEffect, useState } from 'react';
import {movieDB} from '../api/movieDB';
import { Movie, MovieDBMoviesResponse } from '../interfaces/movieInterface';


interface MoviesState {
    nowPlaying: Movie[];
    popular: Movie[];
    topRated: Movie[];
}

export const useMovies = () => {

    const [ isLoading, setIsLoading ] = useState(true);

    const [ moviesState, setMoviesState ] = useState<MoviesState>({
        nowPlaying: [],
        popular: [],
        topRated: [],
    });

    const getMovies = async () => {

        const nowPlayingPromise = movieDB.get<MovieDBMoviesResponse>('/now_playing');
        const popularPromise = movieDB.get<MovieDBMoviesResponse>('/popular');
        const topRatedPromise = movieDB.get<MovieDBMoviesResponse>('/top_rated');
        const resp = await Promise.all([
            nowPlayingPromise,
            popularPromise,
            topRatedPromise,
        ])

        setMoviesState({
            nowPlaying: resp[0].data.results,
            popular: resp[1].data.results,
            topRated: resp[2].data.results,
        });

        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        getMovies();
    }, []);

    return {
        isLoading,
        ...moviesState,
    };

};
