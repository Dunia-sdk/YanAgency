import api, { isMockMode } from './api';
import { teamMembers } from './mockData';

// Valid-formatted mock JWT (Header.Payload.Signature)
// Payload contains: {"email":"admin@yancarz.com","name":"Admin Admin","exp":2524608000}
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHlhbmNhcnouY29tIiwibmFtZSI6IkFkbWluIEFkbWluIiwiZXhwIjoyNTI0NjA4MDAwfQ.mock-signature';

const register = async (formData) => {
    if (isMockMode) {
        console.log('Mock Mode: Registering', formData);
        return { token: MOCK_TOKEN, user: { email: formData.email, name: formData.name } };
    }
    try {
        // Agency and User creation via single API endpoint
        await api.post('/Agency', {
            name: formData.name,
            eMail: formData.email,
            nbrPhone: formData.phone,
            lastName: formData.lastName,
            firstMame: formData.firstName, // Using exact key requested by user
            address: "", // Front-end doesn't collect address currently
            idCity: "3fa85f64-5717-4562-b3fc-2c963f66afa6" // Default UUID as requested/provided
        });

        // After successful registration, log the user in.
        const loginResponse = await login(formData.email, formData.password);

        return loginResponse;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message || error.response.data.title || 'Registration failed';
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('No response from server. Please check your network connection.');
        } else {
            throw new Error(error.message);
        }
    }
};

const login = async (email, password) => {
    if (isMockMode) {
        console.log('Mock Mode: Logging in', email);
        const user = teamMembers.find(m => m.email === email) || { name: 'Admin', email };
        const response = {
            token: MOCK_TOKEN,
            user: { email: user.email, name: user.name }
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
        if (error.response) {
            const errorMessage = error.response.data.message || error.response.data.title || 'Login failed';
            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('No response from server. Please check your network connection.');
        } else {
            throw new Error(error.message);
        }
    }
};

const logout = () => {
    localStorage.removeItem('token');
};

const authService = {
    register,
    login,
    logout,
};

export default authService;
