import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
});

export const getContentRecommendations = async (song, artist, k = 10) => {
    const response = await api.get('/recommend/content', {
        params: { song_name: song, artist_name: artist, k }
    });
    return response.data;
};

export const getHybridRecommendations = async (song, artist, k = 10, diversity = 5) => {
    const response = await api.get('/recommend/hybrid', {
        params: { song_name: song, artist_name: artist, k, diversity }
    });
    return response.data;
};

export default api;
