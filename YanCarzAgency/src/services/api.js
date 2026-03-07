import axios from 'axios';

export const isMockMode = import.meta.env.VITE_USE_MOCK === 'true';

const api = axios.create({
    baseURL: isMockMode ? '' : 'https://yancarz-be.azurewebsites.net/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
