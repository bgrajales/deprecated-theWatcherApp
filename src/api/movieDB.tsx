import axios from 'axios';


export const movieDB = axios.create({
    baseURL: 'https://api.themoviedb.org/3/movie',
    params: {
        api_key: '51a3e903173036a07aa0f91854b1b78a',
        language: 'en-US',
    },
});

export const seriesDB = axios.create({
    baseURL: 'https://api.themoviedb.org/3/tv',
    params: {
        api_key: '51a3e903173036a07aa0f91854b1b78a',
        language: 'en-US',
    },
});

export const multiDB = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    params: {
        api_key: '51a3e903173036a07aa0f91854b1b78a',
        language: 'en-US',
    },
})
