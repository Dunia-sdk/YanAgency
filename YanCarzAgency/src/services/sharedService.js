import api, { handleAxiosError } from './api';

export const getDevises = async () => {
    try {
        const response = await api.get('shared/Devise/');
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

export const getPlaces = async () => {
    try {
        const response = await api.get('shared/Place/');
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};
