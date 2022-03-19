import axios from 'axios';

export const watcherApi = axios.create({
    baseURL: 'https://thewatcher-app.herokuapp.com',
});