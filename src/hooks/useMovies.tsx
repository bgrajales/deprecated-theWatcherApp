import { useEffect, useState } from 'react';
import {movieDB, multiDB} from '../api/movieDB';
import { Movie, MovieDBMoviesResponse, PopularActorsResponse, PopularActorsResponseArray } from '../interfaces/movieInterface';


interface MoviesState {
    nowPlaying: Movie[];
    popular: Movie[];
    topRated: Movie[];
    popularActors: PopularActorsResponseArray[];
}

export const useMovies = () => {

    const [ isLoading, setIsLoading ] = useState(true);

    const [ moviesState, setMoviesState ] = useState<MoviesState>({
        nowPlaying: [],
        popular: [],
        topRated: [],
        popularActors: []
    });

    const getMovies = async () => {

        const nowPlayingPromise = movieDB.get<MovieDBMoviesResponse>('/now_playing');
        const popularPromise = movieDB.get<MovieDBMoviesResponse>('/popular');
        const topRatedPromise = movieDB.get<MovieDBMoviesResponse>('/top_rated');
        const popularActorsPromise = multiDB.get<PopularActorsResponse>('/person/popular');

        const resp = await Promise.all([
            nowPlayingPromise,
            popularPromise,
            topRatedPromise,
            popularActorsPromise
        ])

        const returnNowPlaying = resp[0].data.results.slice(0, 8);

        setMoviesState({
            nowPlaying: returnNowPlaying,
            popular: resp[1].data.results,
            topRated: resp[2].data.results,
            popularActors: resp[3].data.results
        });

        setIsLoading(false);
    };

    useEffect(() => {
        setIsLoading(true);
        getMovies();

        return () => {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        ...moviesState,
    };

};
