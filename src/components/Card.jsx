import React from 'react';
import './Card.css';

const Card = ({ title, value, icon, trend, trendLabel, color = 'var(--primary)', children }) => {
    const isPositive = trend >= 0;

    // Support both component class and react element
    const renderIcon = () => {
        if (!icon) return null;
        if (React.isValidElement(icon)) return icon;
        const Icon = icon;
        return <Icon size={22} />;
    };

    return (
        <div className="kpi-card glass-panel">
            <div className="kpi-card__header">
                <div className="kpi-card__icon" style={{ background: `${color}15`, color }}>
                    {renderIcon()}
                </div>
                {trend !== undefined && (
                    <span className={`kpi-card__trend ${isPositive ? 'pos' : 'neg'}`}>
                        {isPositive ? '▲' : '▼'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <p className="kpi-card__label">{title}</p>
            {value !== undefined && <p className="kpi-card__value">{value}</p>}
            {children}
            {trendLabel && <p className="kpi-card__trend-label">{trendLabel}</p>}
        </div>
    );
};

export default Card;
