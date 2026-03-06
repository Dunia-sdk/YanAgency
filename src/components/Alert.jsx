import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import './Alert.css';

const Alert = ({ type = 'error', message }) => {
    if (!message) return null;

    return (
        <div className={`alert alert-${type} animate-slide-down`}>
            {type === 'error' ? (
                <AlertCircle size={20} className="alert-icon" />
            ) : (
                <CheckCircle2 size={20} className="alert-icon" />
            )}
            <p className="alert-message">{message}</p>
        </div>
    );
};

export default Alert;
