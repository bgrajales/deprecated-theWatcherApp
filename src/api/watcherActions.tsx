import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
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
