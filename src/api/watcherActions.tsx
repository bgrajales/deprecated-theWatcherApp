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

interface PostCommentsProps {
    userName: string;
    comment: string;
    elementId: number;
    type: string;
}

export const postComment = async ({ userName, comment, elementId, type }: PostCommentsProps) => {

    const headers = {
        // authorization: token,
        'Content-Type': 'application/json'
    }

    const resp = await watcherApi.post("/postComment", { userName, comment, elementId, type }, { headers });

    console.log(resp.data)
    if (resp.data.error) {
        return {
            result: false
        };
    } else {
        return {
            result: true,
            comments: resp.data.comments,
        };
    }

}

interface FetchCommentsProps {
    elementId: number;
}

export const fetchComments = async ({ elementId }: FetchCommentsProps) => {

    const headers = {
        // authorization: token,
        'Content-Type': 'application/json'
    }

    const resp = await watcherApi.get("/fetchComments", { params: { elementId }, headers });

    if (resp.data.error) {
        return {
            result: false
        };
    } else {

        if (resp.data.forum) {
            return {
                result: true,
                comments: resp.data.forum.comments,
            };
        } else {

            return {
                result: false,
            };

        }
    }

}

interface LikeCommentProps {
    userName: string;
    commentId: string;
    elementId: number;
}

export const likeComment = async ({ userName, commentId, elementId }: LikeCommentProps) => {

    const headers = {
        // authorization: token,
        'Content-Type': 'application/json'
    }

    const resp = await watcherApi.post("/likeComment", { userName, commentId, elementId }, { headers });

    if (resp.data.error) {
        return {
            result: false
        };
    } else {
        return {
            result: true,
            action: resp.data.action,
        };
    }


}