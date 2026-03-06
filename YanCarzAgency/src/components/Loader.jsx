import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 24, className = '', color = 'var(--surface)' }) => {
    return (
        <div className={`loader-container ${className}`}>
            <Loader2 size={size} color={color} className="animate-spin" />
        </div>
    );
};

export default Loader;
