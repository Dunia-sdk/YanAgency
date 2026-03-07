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
        // Step 1: Create the Agency
        const agencyResponse = await api.post('/Agency', {
            name: formData.name,
            city: formData.city,
            contactPerson: formData.contact,
        });

        const agencyId = agencyResponse.data.id;

        // Step 2: Create the Agency User
        const nameParts = formData.contact.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ') || firstName;

        const userResponse = await api.post('/AgencyUsers', {
            firstName,
            lastName,
            email: formData.email,
            passwordHash: formData.password,
            telephone: formData.phone,
            agencyId,
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
