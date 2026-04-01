import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const PrivateRoute = () => {
    const { user, loading, initializing } = useAuth();

    if (loading || initializing) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader size={40} color="var(--primary)" />
            </div>
        );
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
