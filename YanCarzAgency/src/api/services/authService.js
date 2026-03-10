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
        // 1. Agency and User creation via single API endpoint
        await api.post('/portal/Agency', {
            name: formData.name,
            eMail: formData.email,
            nbrPhone: formData.phone,
            lastName: formData.lastName,
            firstMame: formData.firstName, // Note: firstMame is the correct field in the API (typo included)
            address: "", // Front-end doesn't collect address currently
            idCity: formData.idCity // City UUID from the API dropdown
        });

        // 2. Build a temporary session from signup data
        // (Login API not yet available from backend - will be updated once /Auth/login is deployed)
        const tempUser = {
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
            agencyName: formData.name,
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: 'Admin'
        };

        // Create a minimal temporary token payload so jwtDecode doesn't crash
        // This is a placeholder — will be replaced by real JWT from login API
        const tempPayload = btoa(JSON.stringify({ alg: 'none' })) + '.' +
            btoa(JSON.stringify({
                email: formData.email,
                name: `${formData.firstName} ${formData.lastName}`,
                agencyName: formData.name,
                firstName: formData.firstName,
                lastName: formData.lastName,
                role: 'Admin',
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24h
            })) + '.temp-signature';

        localStorage.setItem('token', tempPayload);
        localStorage.setItem('agencyName', formData.name);
        localStorage.setItem('firstName', formData.firstName);
        localStorage.setItem('lastName', formData.lastName);

        return {
            token: tempPayload,
            user: tempUser
        };
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
        console.error('Response Data:', error.response.data);
        console.error('Response Status:', error.response.status);
        const message = error.response.data?.message ||
            error.response.data?.title ||
            (typeof error.response.data === 'string' ? error.response.data : defaultMessage);
        throw new Error(message);
    } else if (error.request) {
        throw new Error('No response from server. Check your connection.');
    } else {
        throw new Error(error.message || defaultMessage);
    }
};

const changePassword = async (oldPassword, newPassword) => {
    if (isMockMode) {
        console.log('Mock Mode: Changing password');
        return { message: 'Password changed successfully' };
    }
    try {
        const response = await api.post('/Auth/change-password', { oldPassword, newPassword });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Password change failed');
    }
};

const sendWelcomeEmail = async (email, firstName) => {
    // Mocking email sending as backend doesn't have an endpoint yet
    console.log(`[Mock Email] Sending welcome email to ${email} (Hi ${firstName}!)`);
    return new Promise(resolve => setTimeout(resolve, 1000));
};

const authService = {
    login,
    signup,
    logout,
    changePassword,
    sendWelcomeEmail
};

export default authService;
