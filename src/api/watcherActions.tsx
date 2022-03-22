import { WatcherUser } from "../interfaces/authInterface";
import { watcherApi } from "./watcherApi";

interface MarkAsWatchedProps {
    user: WatcherUser;
    token: string;
    movieId: number;
    posterPath: string;
    runTime: number;
}

export const markMovieAsWatched = async ({ user, token, movieId, posterPath, runTime }: MarkAsWatchedProps) => {

    const movie = {
        id: movieId,
        posterPath,
        runTime,
    }

    const headers = {
        authorization: token,
        'Content-Type': 'application/json'
    }

    const resp = await watcherApi.post("/markMovieAsWatched", { user, movie }, { headers });

    if (resp.data.error) {
        console.log(resp.data.error);
        return {
            result: false
        };
    } else {
        return {
            movies: resp.data.movies,
            result: true
        };
    }
    
}

interface MarkMovieUnwatchedProps {
    user: WatcherUser;
    token: string;
    movieId: number;
}

export const markMovieUnwatched = async ({ user, token, movieId }: MarkMovieUnwatchedProps) => {

    const headers = {
        authorization: token,
        'Content-Type': 'application/json'
    }

    const resp = await watcherApi.post("/markMovieUnwatched", { user, movieId }, { headers });

    if (resp.data.error) {
        console.log(resp.data.error);
        return {
            result: false
        };
    } else {
        return {
            movies: resp.data.movies,
            result: true
        };
    }
    

}

interface MarkEpisodeWatchedProps {
    user: WatcherUser;
    token: string;
    serieId: number;
    posterPath: string;
    serieTotalEpisodes: number;
    seasonId: number;
    seasonNumber: number;
    episodeNumber: number;    
}

export const updateEpisode = async ({ user, token, serieId, posterPath, serieTotalEpisodes, seasonId, seasonNumber, episodeNumber }: MarkEpisodeWatchedProps) => {

    const headers = {
        authorization: token,
        'Content-Type': 'application/json'
    }

    const resp = await watcherApi.post("/updateEpisode", { 
        user, 
        serieId, 
        posterPath, 
        serieTotalEpisodes, 
        seasonId, 
        seasonNumber, 
        episodeNumber 
    }, { headers });

    if (resp.data.error) {
        console.log(resp.data.error);
        return {
            result: false
        };
    } else {
        return {
            result: true,
            series: resp.data.series,
        };
    }

}