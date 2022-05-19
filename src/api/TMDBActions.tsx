import { multiDB, seriesDB } from '../api/movieDB';
import { EpisodeModalResponse, NextEpisodeResponse, SeriesFull } from '../interfaces/movieInterface';
import { fetchComments } from './watcherActions';

interface EpisodeData {
    serieId: number;
    seasonNumber: number;
    episodeNumber: number;
}

export const getEpisodeData = async (episodeData: EpisodeData) => {

    const resp = await seriesDB.get<EpisodeModalResponse>(`/${episodeData.serieId}/season/${episodeData.seasonNumber}/episode/${episodeData.episodeNumber}`);
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