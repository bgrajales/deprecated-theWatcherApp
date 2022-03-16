/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { movieDB } from '../api/movieDB';
import { MovieCast, MovieCreditsResponse, MovieFull, Providers, Video, VideosResponse } from '../interfaces/movieInterface';

interface MovieDetails {
    isLoading: boolean;
    movieFull?: MovieFull;
    cast: MovieCast[];
    providers: Providers[];
    videos: Video[]
}

export const useMovieDetails = ( movieId: number ) => {

    const [state, setState] = useState<MovieDetails>({
        isLoading: true,
        movieFull: undefined,
        cast: [],
        providers: [],
        videos: [],
    });

    const getMovieDetails = async () => {

        const movieDetailsPromise = movieDB.get<MovieFull>(`/${movieId}`);
        const castPromise = movieDB.get<MovieCreditsResponse>(`/${movieId}/credits`);
        const providersPromise = movieDB.get(`/${movieId}/watch/providers`);
        const videosPromise = movieDB.get<VideosResponse>(`/${movieId}/videos`);

        const [movieDetailsResponse, castResponse, providersResponse, videosResponse] = await Promise.all([movieDetailsPromise, castPromise, providersPromise, videosPromise]);

        setState({
            isLoading: false,
            movieFull: movieDetailsResponse.data,
            cast: castResponse.data.cast,
            providers: providersResponse.data.results.US ? providersResponse.data.results.US.flatrate : [],
            videos: videosResponse.data.results || [],
        });

    };

    useEffect(() => {
        getMovieDetails();
    }, []);

    return {
        ...state,
    };
};

