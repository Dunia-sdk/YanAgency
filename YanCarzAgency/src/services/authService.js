import api, { isMockMode } from './api';

/**
 * Service to handle Authentication (Login, Signup, JWT)
 */

// Valid-formatted mock JWT (Header.Payload.Signature)
// Valid-formatted mock JWT (Header.Payload.Signature) - Includes a dummy agencyId for testing
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHlhbmNhcnouY29tIiwibmFtZSI6IkFkbWluIEFkbWluIiwiYWdlbmN5SWQiOiI1NTA2MGViMi03MzExLTQzYzgtOTZkZi0zNmRhZDYyOGM0N2EiLCJuYW1lIjoiQWRtaW4gQWRtaW4iLCJleHAiOjI1MjQ2MDgwMDB9.mock-signature';

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
        const response = await api.post('Auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    } catch (error) {
        handleApiError(error, 'Login failed');
        throw error; // Ensure caller always receives the rejection
    }
};

const signup = async (formData) => {
    if (isMockMode) {
        console.log('Mock Mode: Registering', formData);
        const response = {
            token: MOCK_TOKEN,
            user: { email: formData.email, name: formData.name, agencyId: '55060eb2-7311-43c8-96df-36dad628c47a' }
        };
        localStorage.setItem('token', response.token);
        return response;
    }
    try {
        // Clear any old agency ID
        localStorage.removeItem('agencyId');

        // Agency and User creation via single API endpoint
        const response = await api.post('agency/Agency', {
            name: formData.name,
            eMail: formData.email,
            nbrPhone: formData.phone,
            lastName: formData.lastName,
            firstName: formData.firstName,
            firstMame: formData.firstName, // Legacy/Typos compatibility
            address: "",
            idCity: formData.idCity
        });

        // Capture the real agency ID if provided by the backend (check common nested fields)
        const d = response.data;
        const capturedAgencyId = d?.id || d?.agencyId || d?.agency?.id || d?.data?.id || d?.result?.id || null;
        
        if (capturedAgencyId) {
            localStorage.setItem('agencyId', capturedAgencyId);
            console.log('Real Agency ID captured during signup:', capturedAgencyId);
        } else {
            console.warn('Backend did not return an agency ID. Waiting for API fix as requested.');
        }

        // By user request: immediately enter the dashboard without a real token.
        // We generate a temp fake token with the captured agencyId (or null if missing).
        const tempUser = {
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
            agencyName: formData.name,
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: 'Admin',
            isActive: false,
            agencyId: capturedAgencyId
        };

        const utf8ToB64Url = (str) => {
            const b64 = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
                return String.fromCharCode('0x' + p1);
            }));
            return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        };

        const payload = {
            ...tempUser,
            agencyId: capturedAgencyId, 
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24h
        };

        const tempPayload = utf8ToB64Url(JSON.stringify({ alg: 'none', typ: 'JWT' })) + '.' +
                           utf8ToB64Url(JSON.stringify(payload)) + '.temp-signature';

        localStorage.setItem('token', tempPayload);
        localStorage.setItem('agencyName', formData.name);
        localStorage.setItem('firstName', formData.firstName);
        localStorage.setItem('lastName', formData.lastName);

        return {
            token: tempPayload,
            user: { ...tempUser, agencyId: capturedAgencyId }
        };
    } catch (error) {
        handleApiError(error, 'Registration failed');
    }
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('agencyId');
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
        const response = await api.post('Auth/change-password', { oldPassword, newPassword });
        return response.data;
    } catch (error) {
        handleApiError(error, 'Password change failed');
        throw error; // Ensure caller always receives the rejection
    }
};

const sendWelcomeEmail = async (_email, _firstName) => {
    // TODO: implement real email endpoint. Currently a silent no-op mock.
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
