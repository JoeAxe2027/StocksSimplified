import api from './api';

export const getWatchlist = async () => {
    const response = await api.get('/watchlist');
    return response.data;
};
export const addToWatchlist = async (ticker) => {
    const response = await api.post('/watchlist', { ticker });
    return response.data;
};

export const removeFromWatchlist = async (id) => {
    const response = await api.delete(`/watchlist/${id}`);
    return response.data;
};