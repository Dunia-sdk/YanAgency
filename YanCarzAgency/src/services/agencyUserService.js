import api from './api';

/**
 * Fetches the team list for an agency.
 * Respects the AgencyUserDto schema from Swagger:
 * { id, firstName, lastName, eMail, telephone, status, agencyId }
 * Returns clean structured data for frontend display in TeamPage.jsx.
 */
export const getAgencyUsers = async (agencyId) => {
    try {
        const response = await api.get('/AgencyUser', {
            params: { agencyId }
        });
        
        // Map the API response schema to the frontend structure based on TeamPage.jsx requirements
        const formattedUsers = response.data.map(user => {
            const firstName = user.firstName || '';
            const lastName = user.lastName || '';
            const fullName = `${firstName} ${lastName}`.trim();
            const initials = fullName
                .split(' ')
                .map(n => n?.[0] || '')
                .join('')
                .toUpperCase()
                .slice(0, 2);

            return {
                id: user.id,
                firstName: firstName || 'N/A',
                lastName: lastName || 'N/A',
                name: fullName || 'Unknown',
                email: user.eMail || 'N/A',
                telephone: user.telephone || 'N/A',
                // The following fields are not in the raw schema but needed for frontend display
                department: 'N/A', 
                role: user.status === 'Manager' ? 'Manager' : (user.status === 'Owner' ? 'Owner' : 'Staff'), // Map status to role if strings match, otherwise default to Staff
                joined: new Date().toISOString().slice(0, 10), // Mocked for UI compatibility as it's missing from schema
                avatar: initials || '?',
                
                // Keep original data just in case
                originalStatus: user.status,
                telephone: user.telephone,
                agencyId: user.agencyId
            };
        });

        return formattedUsers;
    } catch (error) {
        console.error('Error fetching agency users:', error);
        throw error;
    }
};

/**
 * Adds a new agency user.
 * Respects the AgencyUserDto schema from Swagger:
 * { firstName, lastName, eMail, telephone, status, agencyId }
 */
export const addAgencyUser = async (userData, agencyId) => {
    try {
        const payload = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            eMail: userData.email, // backend expects eMail
            telephone: userData.telephone || '',
            status: userData.role || 'Staff',
            agencyId: agencyId // Required by backend
        };
        const response = await api.post('/AgencyUser', payload);
        return response.data;
    } catch (error) {
        console.error('Error adding agency user:', error);
        throw error;
    }
};

/**
 * Updates an existing agency user.
 * Respects the AgencyUserDto schema from Swagger:
 * { id, firstName, lastName, eMail, telephone, status }
 */
export const updateAgencyUser = async (id, userData) => {
    try {
        const payload = {
            id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            eMail: userData.email, // backend expects eMail
            telephone: userData.telephone || '',
            status: userData.role || 'Staff',
            agencyId: userData.agencyId // Ensure agencyId is passed if needed, though id is most critical
        };
        const response = await api.put(`/AgencyUser/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating agency user:', error);
        throw error;
    }
};

/**
 * Deletes an agency user by ID.
 */
export const deleteAgencyUser = async (id) => {
    try {
        const response = await api.delete(`/AgencyUser/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting agency user:', error);
        throw error;
    }
};
