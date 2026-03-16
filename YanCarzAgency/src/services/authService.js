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
            user: { email: formData.email, name: formData.name, agencyId: '55060eb2-7311-43c8-96df-36dad628c47a' }
        };
        localStorage.setItem('token', response.token);
        return response;
    }
    try {
        // 1. Agency and User creation via single API endpoint
        // Payload compatibility: send both firstName and firstMame (backend might expect firstMame)
        const response = await api.post('/agency/Agency', {
            name: formData.name,
            eMail: formData.email,
            nbrPhone: formData.phone,
            lastName: formData.lastName,
            firstName: formData.firstName,
            firstMame: formData.firstName, // Legacy/Typos compatibility
            address: "",
            idCity: formData.idCity
        });
        
        const agencyData = response.data;
        const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        let agencyId = null;

        // --- Extreme Robust Extraction ---
        // A. Check Location header first (standard for 201 Created)
        const locationHeader = response.headers?.location;
        if (locationHeader) {
            // Split and find the first part that looks like a GUID, starting from the end
            const parts = locationHeader.split('/').filter(Boolean);
            const guidPart = [...parts].reverse().find(p => guidRegex.test(p));
            if (guidPart) {
                agencyId = guidPart;
            }
        }

        // B. Check common keys
        if (!agencyId && agencyData) {
            agencyId = agencyData.id || agencyData.agencyId || agencyData.AgencyId || agencyData.agencyID;
        }

        // C. Direct string check
        if (!agencyId && typeof agencyData === 'string' && guidRegex.test(agencyData)) {
            agencyId = agencyData;
        }

        // D. Recursive Search
        if (!agencyId && agencyData && typeof agencyData === 'object') {
            const searchGuid = (obj) => {
                for (const key in obj) {
                    const value = obj[key];
                    if (typeof value === 'string' && guidRegex.test(value)) return value;
                    if (value && typeof value === 'object') {
                        const found = searchGuid(value);
                        if (found) return found;
                    }
                }
                return null;
            };
            agencyId = searchGuid(agencyData);
        }

        // 2. Build a temporary session from signup data
        const tempUser = {
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
            agencyName: formData.name,
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: 'Admin',
            isActive: false
        };

        // UTF-8 safe base64url encoding helper
        const utf8ToB64Url = (str) => {
            const b64 = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
                return String.fromCharCode('0x' + p1);
            }));
            return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        };

        const payload = {
            email: formData.email,
            name: `${formData.firstName} ${formData.lastName}`,
            agencyName: formData.name,
            firstName: formData.firstName,
            lastName: formData.lastName,
            agencyId: agencyId,
            role: 'Admin',
            isActive: false,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24h
        };

        const tempPayload = utf8ToB64Url(JSON.stringify({ alg: 'none', typ: 'JWT' })) + '.' +
                           utf8ToB64Url(JSON.stringify(payload)) + '.temp-signature';

        if (agencyId) localStorage.setItem('agencyId', agencyId);
        localStorage.setItem('token', tempPayload);
        localStorage.setItem('agencyName', formData.name);
        localStorage.setItem('firstName', formData.firstName);
        localStorage.setItem('lastName', formData.lastName);

        return {
            token: tempPayload,
            user: { ...tempUser, agencyId }
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
