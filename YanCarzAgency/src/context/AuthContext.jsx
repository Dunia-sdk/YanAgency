/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false); // Used for form submissions
    const [initializing, setInitializing] = useState(true); // Used for initial auth state check

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                // Check if token is expired
                if (decoded.exp * 1000 > Date.now()) {
                    const getValidId = (id) => (id && id !== 'null' && id !== 'undefined') ? id : null;
                    const agencyId = getValidId(decoded.agencyId) || getValidId(decoded.agency_id) || getValidId(decoded.AgencyId) || getValidId(localStorage.getItem('agencyId'));

                    setUser({
                        email: decoded.email,
                        name: decoded.name,
                        agencyId: agencyId,
                        agencyName: decoded.agencyName || localStorage.getItem('agencyName') || 'YanCarz Agency',
                        firstName: decoded.firstName || localStorage.getItem('firstName'),
                        lastName: decoded.lastName || localStorage.getItem('lastName'),
                        role: decoded.role || 'Admin',
                        isActive: decoded.isActive !== undefined ? decoded.isActive : localStorage.getItem('isActive') !== 'false'
                    });
                    setToken(storedToken);
                } else {
                    // Token is expired
                    localStorage.removeItem('token');
                }
            } catch (error) {
                // Invalid token
                localStorage.removeItem('token');
                console.error("Invalid token on initial load", error);
            }
        }
        setInitializing(false);
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const data = await authService.login(email, password);
            const decoded = jwtDecode(data.token);
            const getValidId = (id) => (id && id !== 'null' && id !== 'undefined') ? id : null;
            const agencyId = getValidId(decoded.agencyId) || getValidId(decoded.agency_id) || getValidId(decoded.AgencyId) || getValidId(data.user?.agencyId) || getValidId(localStorage.getItem('agencyId'));

            const userData = {
                email: decoded.email,
                name: decoded.name,
                agencyId: agencyId,
                agencyName: decoded.agencyName || data.user?.agencyName || 'YanCarz Agency',
                firstName: decoded.firstName || data.user?.firstName || decoded.name?.split(' ')[0],
                lastName: decoded.lastName || data.user?.lastName || decoded.name?.split(' ')[1],
                role: decoded.role || 'Admin',
                isActive: decoded.isActive !== undefined ? decoded.isActive : data.user?.isActive !== undefined ? data.user?.isActive : true
            };
            setUser(userData);

            localStorage.setItem('token', data.token);
            if (userData.agencyId) localStorage.setItem('agencyId', userData.agencyId);
            if (userData.agencyName) localStorage.setItem('agencyName', userData.agencyName);
            if (userData.firstName) localStorage.setItem('firstName', userData.firstName);
            if (userData.lastName) localStorage.setItem('lastName', userData.lastName);
            localStorage.setItem('isActive', userData.isActive);

            setToken(data.token);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (signupData) => {
        setLoading(true);
        try {
            const data = await authService.signup(signupData);
            const decoded = jwtDecode(data.token);
            const getValidId = (id) => (id && id !== 'null' && id !== 'undefined') ? id : null;
            
            // Priority: Service Response > Token Claims > LocalStorage
            const agencyId = getValidId(data.user?.agencyId) || 
                           getValidId(decoded.agencyId) || 
                           getValidId(decoded.agency_id) || 
                           getValidId(decoded.AgencyId) || 
                           getValidId(localStorage.getItem('agencyId'));

            const userData = {
                email: decoded.email,
                name: decoded.name,
                agencyId: agencyId,
                agencyName: decoded.agencyName || data.user?.agencyName || 'YanCarz Agency',
                firstName: decoded.firstName || data.user?.firstName || decoded.name?.split(' ')[0],
                lastName: decoded.lastName || data.user?.lastName || decoded.name?.split(' ')[1],
                role: decoded.role || 'Admin',
                isActive: decoded.isActive !== undefined ? decoded.isActive : data.user?.isActive !== undefined ? data.user?.isActive : false
            };
            setUser(userData);

            localStorage.setItem('token', data.token);
            if (userData.agencyName) localStorage.setItem('agencyName', userData.agencyName);
            if (userData.firstName) localStorage.setItem('firstName', userData.firstName);
            if (userData.lastName) localStorage.setItem('lastName', userData.lastName);
            localStorage.setItem('isActive', userData.isActive);
            if (userData.agencyId) localStorage.setItem('agencyId', userData.agencyId);

            setToken(data.token);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setToken(null);
        localStorage.removeItem('agencyId');
        localStorage.removeItem('agencyName');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
    };
    const value = {
        user,
        token,
        loading,
        initializing,
        isAuthenticated: !!token,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!initializing && children}
        </AuthContext.Provider>
    );
};