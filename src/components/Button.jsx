import React from 'react';
import Loader from './Loader';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    type = 'button',
    fullWidth = false,
    isLoading = false,
    disabled = false,
    onClick,
    className = ''
}) => {
    const baseClass = `btn btn-${variant} ${fullWidth ? 'w-full' : ''} ${className}`;

    return (
        <button
            type={type}
            className={baseClass}
            onClick={onClick}
            disabled={disabled || isLoading}
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <Loader size={18} color={variant === 'outline' ? 'var(--primary)' : 'white'} />
                    {children}
                </span>
            ) : (
                children
            )}
        </button>
    );
};

export default Button;
