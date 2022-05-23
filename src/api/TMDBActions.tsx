import { useContext } from 'react';
import { multiDB, seriesDB } from '../api/movieDB';
import { AuthContext } from '../context/AuthContext';
import { EpisodeModalResponse, NextEpisodeResponse, SeriesFull } from '../interfaces/movieInterface';
import { fetchComments } from './watcherActions';

interface EpisodeData {
    serieId: number;
    seasonNumber: number;
    episodeNumber: number;
}

export const getEpisodeData = async (episodeData: EpisodeData, lenguageUser: string) => {

    const lenguageParams = {
        language: lenguageUser || 'en-US',
    }

    const resp = await seriesDB.get<EpisodeModalResponse>(`/${episodeData.serieId}/season/${episodeData.seasonNumber}/episode/${episodeData.episodeNumber}`, { params: lenguageParams });
    const images = await seriesDB.get(`/${episodeData.serieId}/season/${episodeData.seasonNumber}/episode/${episodeData.episodeNumber}/images`);

    const comments = await fetchComments({ elementId: resp.data.id });

    const fullResponse = {
        ...resp.data,
        ...images.data,
        comments: comments.result ? comments.comments : [],
    }

    if ( resp.data ) {
        return fullResponse;
    }

}

interface GetGenresListsProps {
    type: 'movie' | 'tv';
    genreId: number
}

export const getGenresLists = async ({ type, genreId}: GetGenresListsProps) => {

    const resp = await multiDB.get(`/discover/${type}`, {
        params: {
            with_genres: genreId,
            page: 1,
            language: 'en-US',
            sort_by: 'popularity.desc',
        }
    })

    return resp.data;

}

interface GetSeriesNextEpisodeToAir {
    seriesId: number[];
}

export const getSeriesNextEpisodes = async ({ seriesId }: GetSeriesNextEpisodeToAir) => {

    let seriesNextEpisodes: any[] = []

    for (let i = 0; i < seriesId.length; i++) {
        const resp = await seriesDB.get<SeriesFull>(`/${seriesId[i]}`);

        if (resp.data) {

            if (resp.data.next_episode_to_air) {
                const newEpisode = {
                    ...resp.data.next_episode_to_air,
                    serieId: seriesId[i],
                    serieName: resp.data.name,
                }
                seriesNextEpisodes.push(newEpisode);
            }

        }
    }
    
    return seriesNextEpisodes;
}

export const getActorAction = async (actorId: number, setActorProps: any, setActorTitles: any, leng: string) => {

    const lenguageParam = {
        language: leng || 'en-US',
    }

    const resp = await multiDB.get(`/person/${actorId}`, { params: lenguageParam });
    const titles = await multiDB.get(`/person/${actorId}/combined_credits`, { params: lenguageParam });

    const titlesArray = titles.data.cast.sort(
        (a: any, b: any) => {
        if (a.vote_average < b.vote_average) {
            return 1;
        }
        if (a.vote_average > b.vote_average) {
            return -1;
        }
        return 0;
    }).filter((a: { tilte: string; }) => a.tilte !== '')

    let titlesDuplicated = titlesArray.sort().filter((a: { id: number; }, i: number, arr: { id: number; }[]) => {
        return i === 0 || a.id !== arr[i - 1].id;
    });

    titlesDuplicated = titlesDuplicated.filter((a: { poster_path: string;}) => a.poster_path !== null);

    if (resp.data) {
        setActorProps(resp.data);
        setActorTitles(titlesDuplicated)
    }
    console.log(resp.data)

}