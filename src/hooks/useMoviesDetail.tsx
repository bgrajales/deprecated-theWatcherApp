/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { movieDB } from '../api/movieDB';
import { fetchComments } from '../api/watcherActions';
import { Comments, MovieCast, MovieCreditsResponse, MovieFull, Providers, Video, VideosResponse } from '../interfaces/movieInterface';

interface MovieDetails {
    isLoading: boolean;
    movieFull?: MovieFull;
    cast: MovieCast[];
    providers: Providers[];
    videos: Video[];
    comments: Comments[];
}

export const useMovieDetails = ( movieId: number, setCommentsToShow: (arg0: Comments[]) => void) => {

    const [state, setState] = useState<MovieDetails>({
        isLoading: true,
        movieFull: undefined,
        cast: [],
        providers: [],
        videos: [],
        comments: [],
    });

    const getMovieDetails = async () => {

        const movieDetailsPromise = movieDB.get<MovieFull>(`/${movieId}`);
        const castPromise = movieDB.get<MovieCreditsResponse>(`/${movieId}/credits`);
        const providersPromise = movieDB.get(`/${movieId}/watch/providers`);
        const videosPromise = movieDB.get<VideosResponse>(`/${movieId}/videos`);

        const comments = await fetchComments({ elementId: movieId });

        const [movieDetailsResponse, castResponse, providersResponse, videosResponse] = await Promise.all([movieDetailsPromise, castPromise, providersPromise, videosPromise]);

        setCommentsToShow(comments.result ? comments.comments : []);
        
        setState({
            isLoading: false,
            movieFull: movieDetailsResponse.data,
            cast: castResponse.data.cast,
            providers: providersResponse.data.results.US ? providersResponse.data.results.US.flatrate : [],
            videos: videosResponse.data.results || [],
            comments: comments.result ? comments.comments : [],
        });

    };

    useEffect(() => {
        getMovieDetails();
    }, []);

    return {
        ...state,
    };
};

