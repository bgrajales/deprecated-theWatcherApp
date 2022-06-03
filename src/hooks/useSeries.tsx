import { useEffect, useState } from 'react';
import { seriesDB } from '../api/movieDB';
import { MovieDBSeriesResponse, Series } from '../interfaces/movieInterface';


interface SeriesState {
    latestSerie: Series[];
    popularSerie: Series[];
    topRatedSerie: Series[];
}

export const useSeries = () => {

    const [ isLoading, setIsLoading ] = useState(true);

    const [ seriesState, setMoviesState ] = useState<SeriesState>({
        latestSerie: [],
        popularSerie: [],
        topRatedSerie: [],
    });

    const getSeries = async () => {

        const latestPromise = seriesDB.get<MovieDBSeriesResponse>('/airing_today');
        const popularPromise = seriesDB.get<MovieDBSeriesResponse>('/popular');
        const topRatedPromise = seriesDB.get<MovieDBSeriesResponse>('/top_rated');
        const resp = await Promise.all([
            latestPromise,
            popularPromise,
            topRatedPromise,
        ])

        setMoviesState({
            latestSerie: resp[0].data.results,
            popularSerie: resp[1].data.results,
            topRatedSerie: resp[2].data.results,
        });

        setIsLoading(false);
    };

    useEffect(() => {
        getSeries();

        return () => {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        ...seriesState,
    };

};
