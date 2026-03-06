import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Simulate checking for an active session
    useEffect(() => {
        const storedUser = localStorage.getItem('yancarz_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'admin@yancarz.com' && password === 'password123') {
                    const userData = { id: 1, name: 'Admin', email, role: 'Owner' };
                    setUser(userData);
                    localStorage.setItem('yancarz_user', JSON.stringify(userData));
                    resolve(userData);
                } else if (password.length >= 8) {
                    // generic accept for demo purposes
                    const userData = { id: 2, name: 'User', email, role: 'Manager' };
                    setUser(userData);
                    localStorage.setItem('yancarz_user', JSON.stringify(userData));
                    resolve(userData);
                } else {
                    reject(new Error('Email ou mot de passe incorrect'));
                }
            }, 1500);
        });
    };

    const register = async (name, email, password) => {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (password.length < 8) {
                    reject(new Error('Le mot de passe doit contenir au moins 8 caractères'));
                } else {
                    const userData = { id: Date.now(), name, email, role: 'Member' };
                    setUser(userData);
                    localStorage.setItem('yancarz_user', JSON.stringify(userData));
                    resolve(userData);
                }
            }, 1500);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('yancarz_user');
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};