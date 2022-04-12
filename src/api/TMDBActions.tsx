import { seriesDB } from '../api/movieDB';
import { EpisodeModalResponse } from '../interfaces/movieInterface';
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