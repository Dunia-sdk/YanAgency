import api, { isMockMode } from './api';

/**
 * Service to handle Authentication (Login, Signup, JWT)
 */

// Valid-formatted mock JWT (Header.Payload.Signature)
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHlhbmNhcnouY29tIiwibmFtZSI6IkFkbWluIEFkbWluIiwiZXhwIjoyNTI0NjA4MDAwfQ.mock-signature';

const login = async (email, password) => {
    if (isMockMode) {
        console.log('Mock Mode: Logging in', email);
        const response = {
            token: MOCK_TOKEN,
            user: { email, name: 'Admin User' }
        };
        localStorage.setItem('token', response.token);
        return response;
    }
    try {
        const response = await api.post('/Auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        handleApiError(error, 'Login failed');
    }
};

const signup = async (formData) => {
    if (isMockMode) {
        console.log('Mock Mode: Registering', formData);
        const response = {
            token: MOCK_TOKEN,
            user: { email: formData.email, name: formData.contact }
        };
        localStorage.setItem('token', response.token);
        return response;
    }
    try {
        // 1. Create Agency
        const agencyPayload = {
            name: formData.name,
            street: '',
            city: formData.city,
            postalCode: ''
        };
        const agencyRes = await api.post('/Agencies', agencyPayload);
        const agencyId = agencyRes.data.id;

        // 2. Extract first and last name from contact field
        const nameParts = (formData.contact || '').trim().split(' ');
        const firstName = nameParts[0] || 'User';
        const lastName = nameParts.slice(1).join(' ') || firstName;

        // 3. Create Agency User
        const userPayload = {
            firstName,
            lastName,
            email: formData.email,
            passwordHash: formData.password,
            telephone: formData.phone,
            agencyId: agencyId
        };
        await api.post('/AgencyUsers', userPayload);

        // 4. Automatically Login
        return await login(formData.email, formData.password);
    } catch (error) {
        handleApiError(error, 'Registration failed');
    }
};

const logout = () => {
    localStorage.removeItem('token');
};

const handleApiError = (error, defaultMessage) => {
    console.error(`API Error (${defaultMessage}):`, error);
    if (error.response) {
        const message = error.response.data?.message || error.response.data?.title || defaultMessage;
        throw new Error(message);
    } else if (error.request) {
        throw new Error('No response from server. Check your connection.');
    } else {
        throw new Error(error.message || defaultMessage);
    }
};

const authService = {
    login,
    signup,
    logout
};

export default authService;
