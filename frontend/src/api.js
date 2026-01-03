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

export const getSongsByMood = async (mood) => {
    const response = await api.get('/discover/by-mood', {
        params: { mood, limit: 20 }
    });
    return response.data;
};

export const getSongsByGenre = async (genre) => {
    const response = await api.get('/discover/by-genre', {
        params: { genre, limit: 20 }
    });
    return response.data;
};


export const getArtists = async (skip = 0, limit = 50) => {
    const response = await api.get('/artists', {
        params: { skip, limit }
    });
    return response.data;
};

export const getArtistSongs = async (artistName) => {
    const response = await api.get(`/artists/${encodeURIComponent(artistName)}`);
    return response.data;
};

export default api;
