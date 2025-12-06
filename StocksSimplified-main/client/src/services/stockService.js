import api from './api';

export const searchStock = async (symbol) => {
    const response = await api.get(`/stocks/search?query=${query}`);
    return response.data;
};

export const getStockHistory = async (ticker, range) => {
    const response = await api.get(`/stocks/${ticker}/history?range=${range}`);
    return response.data;
};

export const getStockDetails = async (ticker) => {
    const response = await api.get(`/stocks/${ticker}`);
    return response.data;
};