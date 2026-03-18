import axios from 'axios';

export const isMockMode = import.meta.env.VITE_USE_MOCK === 'true';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 
             (import.meta.env.DEV 
                ? '/api/' 
                : 'https://yancarz-be.azurewebsites.net/api/'),
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

// Add response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized globally — wipe all session data to avoid stale state
        if (error.response && error.response.status === 401) {
            ['token', 'agencyId', 'agencyName', 'firstName', 'lastName', 'isActive'].forEach(
                key => localStorage.removeItem(key)
            );
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

/**
 * Shared Axios error normaliser — converts an AxiosError into a plain,
 * predictable object and re-throws it.
 * Used by vehicleService, bookingService, etc.
 * @param {import('axios').AxiosError} error
 */
export const handleAxiosError = (error) => {
    if (error.response) {
        const { status, data } = error.response;
        let message = `Request failed with status ${status}`;
        if (data) {
            if (typeof data === 'string') message = data;
            else if (data.message) message = data.message;
            else if (data.title) message = data.title;
            else if (data.errors) {
                message = Object.entries(data.errors)
                    .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
                    .join('\n');
            }
        }
        throw { message, status, data };
    }
    if (error.request) {
        throw {
            message: 'No response received from the server. Please check your connection.',
            status: null,
            data: null,
        };
    }
    throw { message: error.message, status: null, data: null };
};

export default api;
