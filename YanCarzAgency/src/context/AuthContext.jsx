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
                    setUser({ email: decoded.email, name: decoded.name });
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
            setUser({ email: decoded.email, name: decoded.name });
            setToken(data.token);
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (formData) => {
        setLoading(true);
        try {
            const data = await authService.register(formData);
            const decoded = jwtDecode(data.token);
            setUser({ email: decoded.email, name: decoded.name });
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
    };

    const value = {
        user,
        token,
        loading,
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