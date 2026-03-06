import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const Dashboard = () => {
    const { user, logout } = useAuth();

    const getRoleBadgeStyle = (role) => {
        switch (role) {
            case 'Owner':
                return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
            case 'Manager':
                return { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' };
            default:
                return { bg: 'var(--primary-light)', text: 'var(--primary-hover)', border: 'var(--primary-light)' };
        }
    };

    const badgeStyle = getRoleBadgeStyle(user?.role);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', animation: 'slideUpFade 0.5s ease' }}>
            <header className="flex justify-between items-center mb-6 glass-panel" style={{ padding: '1.5rem 2rem' }}>
                <div className="logo-container" style={{ margin: 0 }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.5-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <path d="M9 17h6" />
                        <circle cx="17" cy="17" r="2" />
                    </svg>
                    <span className="logo-text" style={{ fontSize: '1.5rem' }}>YanCarz</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span style={{ fontWeight: 600 }}>{user?.name}</span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user?.email}</span>
                    </div>
                    <Button variant="outline" onClick={logout}>Déconnexion</Button>
                </div>
            </header>

            <main>
                <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                    <h1 className="mb-4" style={{ fontSize: '2.5rem' }}>Bienvenue sur votre Dashboard</h1>
                    <p className="mb-6" style={{ fontSize: '1.125rem', color: 'var(--text-muted)' }}>
                        Vous êtes connecté avec succès à l'application YanCarz.
                    </p>

                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '1rem 2rem', background: 'var(--bg-color)', borderRadius: '12px' }}>
                        <span style={{ fontWeight: 500 }}>Votre rôle d'accès :</span>
                        <span style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            backgroundColor: badgeStyle.bg,
                            color: badgeStyle.text,
                            border: `1px solid ${badgeStyle.border}`
                        }}>
                            {user?.role || 'Member'}
                        </span>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
