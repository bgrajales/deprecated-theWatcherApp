/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from 'react';
import { movieDB } from '../api/movieDB';
import { fetchComments } from '../api/watcherActions';
import { AuthContext } from '../context/AuthContext';
import { Comments, MovieCast, MovieCreditsResponse, MovieFull, Providers, Video, VideosResponse } from '../interfaces/movieInterface';

interface MovieDetails {
    isLoading: boolean;
    movieFull?: MovieFull;
    cast: MovieCast[];
    providers: Providers[];
    videos: Video[];
    comments: Comments[];
}

export const useMovieDetails = ( movieId: number, setCommentsToShow: (arg0: Comments[]) => void, userRegion: string | undefined) => {

    const { user } = useContext( AuthContext )

    const [state, setState] = useState<MovieDetails>({
        isLoading: true,
        movieFull: undefined,
        cast: [],
        providers: [],
        videos: [],
        comments: [],
    });

    const getMovieDetails = async () => {

        const lenguageParam = {
            language: user?.settings.leng || 'en-US',
        }

        const movieDetailsPromise = movieDB.get<MovieFull>(`/${movieId}`, { params: lenguageParam })
        const castPromise = movieDB.get<MovieCreditsResponse>(`/${movieId}/credits`);
        const providersPromise = movieDB.get(`/${movieId}/watch/providers`);
        const videosPromise = movieDB.get<VideosResponse>(`/${movieId}/videos`);

        const comments = await fetchComments({ elementId: movieId });

        const [movieDetailsResponse, castResponse, providersResponse, videosResponse] = await Promise.all([movieDetailsPromise, castPromise, providersPromise, videosPromise]);

        setCommentsToShow(comments.result ? comments.comments : []);

        let userRegionProviders

        if ( userRegion ) {
            userRegionProviders = providersResponse.data.results.hasOwnProperty(userRegion) ? providersResponse.data.results[userRegion] : providersResponse.data.results.US;
        } else {
            userRegionProviders = providersResponse.data.results.US;
        }
        setState({
            isLoading: false,
            movieFull: movieDetailsResponse.data,
            cast: castResponse.data.cast,
            providers: userRegionProviders?.flatrate ? userRegionProviders.flatrate : [],
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

