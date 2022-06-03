import { WatcherUser } from "../interfaces/authInterface";
import { Season } from "../interfaces/movieInterface";
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

interface PostReplyProps {
    userName: string;
    commentId: string;
    reply: string;
    elementId: number;
}

export const postReply = async ({ userName, commentId, reply, elementId }: PostReplyProps) => {

    const headers = {
        // authorization: token,
        'Content-Type': 'application/json'
    }

    const resp = await watcherApi.post("/postReply", { userName, commentId, reply, elementId }, { headers });

    if (resp.data.error) {
        return {
            result: false
        };
    } else {
        return {
            result: true,
            replies: resp.data,
        };
    }


}

interface SetGenresProps {
    userName: string;
    moviesGenresPicked: { id: number; genre: string; }[];
    seriesGenresPicked: { id: number; genre: string; }[];
}

export const setGenres = async ({ userName, moviesGenresPicked, seriesGenresPicked }: SetGenresProps) => {

    const headers = {
        // authorization: token,
        'Content-Type': 'application/json'
    }

    const resp = await watcherApi.post("/setGenres", { userName, moviesGenresPicked, seriesGenresPicked }, { headers });

    if (resp.data.error) {
        return {
            result: false
        };
    } else {
        return {
            result: true,
            action: resp.data,
        };
    }

}

interface UpdateWatchListProps {
    userName: string;
    id: number;
    posterPath: string;
    type: string;
    action: string;
}

export const updateWatchlist = async ({ userName, id, posterPath, type, action }: UpdateWatchListProps) => {

    const headers = {
        // authorization: token,
        'Content-Type': 'application/json'
    }

    const resp = await watcherApi.post("/updateWatchlist", { userName, id, posterPath, type, action }, { headers });

    if (resp.data.error) {
        return {
            result: false
        };
    } else {
        return {
            result: true,
            action: resp.data,
        };
    }

}

interface MarkSerieWatchedProps {
    userName: string;
    id: number;
    posterPath: string;
    action: string;
    serieTotalEpisodes: number | undefined;
    seriesSeasons: Season[] | undefined;
}

export const markSerieAsWatched = async ({ userName, id, posterPath, action, serieTotalEpisodes, seriesSeasons }: MarkSerieWatchedProps) => {

    const headers = {
        // authorization: token,
        'Content-Type': 'application/json'
    }

    const resp = await watcherApi.post("/markSerieAsWatched", { userName, id, posterPath, action, serieTotalEpisodes, seriesSeasons }, { headers });

    if (resp.data.error) {
        return {
            result: false
        };
    } else {
        return {
            result: true,
            message: resp.data.message,
            seriesUpdate: resp.data.series
        };
    }

}

interface MarkSeasonWatchedProps {
    userName: WatcherUser['userName'];
    serieId: number;
    seasonId: number;
    seasonNumber: number;
    seasonEpisodes: number;
    posterPath: string;
    serieEpisodes: number;
    action: string;
}

export const markSeasonAsWatchedAction = async ({
    userName,
    serieId,
    seasonId,
    seasonNumber,
    seasonEpisodes,
    posterPath,
    serieEpisodes,
    action
}: MarkSeasonWatchedProps) => {

    const headers = {
        // authorization: token,
        'Content-Type': 'application/json'
    }

    const resp = await watcherApi.post("/markSeasonWatched", {
        userName,
        serieId,
        seasonId,
        seasonNumber,
        seasonEpisodes,
        posterPath,
        serieEpisodes,
        action
    }, { headers });

    if (resp.data.error) {
        return {
            result: false
        };
    } else {
        return {
            result: true,
            message: resp.data.message,
            seriesUpdate: resp.data.series
        };
    }

}

export const deleteAccountAction = async (userName: string ) => {

    const headers = {
        // authorization: token,
        'Content-Type': 'application/json'
    }

    const resp = await watcherApi.post("/deleteAccount", { userName }, { headers });

    if (resp.data.error) {
        return {
            result: false
        };
    } else {
        return {
            result: true,
            action: resp.data,
        };
    }


}

export const changeLenguageAction = async (username: string, newLeng: string) => {

    const headers = {
        // authorization: token,
        'Content-Type': 'application/json'
    }

    const resp = await watcherApi.post("/changeLenguage", { username, newLeng }, { headers });

    if (resp.data.error) {
        return {
            result: false
        };
    } else {
        return {
            result: true,
            action: resp.data,
        };
    }

}

export const changeNewAccounAction = async (username: string) => {

    const headers = {
        // authorization: token,
        'Content-Type': 'application/json'
    }

    const resp = await watcherApi.post("/changeNewAccount", { username }, { headers });

    if (resp.data.error) {
        return {
            result: false
        };
    } else {
        return {
            result: true,
            action: resp.data,
        };
    }


}