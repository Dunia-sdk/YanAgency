import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';

const NOTIFS = [
    { id: 1, type: 'reservation', message: 'Nouvelle réservation RES-009 de Alice Moreau', time: 'Il y a 5 min', read: false },
    { id: 2, type: 'vehicle', message: 'Toyota Corolla en maintenance programmée', time: 'Il y a 1h', read: false },
    { id: 3, type: 'payment', message: 'Paiement de 475 MAD reçu pour RES-007', time: 'Il y a 2h', read: false },
    { id: 4, type: 'team', message: 'Marc Tessier a rejoint l\'équipe', time: 'Hier', read: true },
    { id: 5, type: 'reservation', message: 'Réservation RES-004 annulée par David Martin', time: 'Hier', read: true },
];

const TYPE_ICON = {
    reservation: '📅', vehicle: '🚗', payment: '💳', team: '👥'
};

const NotificationsPage = () => {
    const [notifs, setNotifs] = useState(NOTIFS);
    const unread = notifs.filter(n => !n.read).length;

    const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Notifications</h1>
                    <p className="page-subtitle">{unread} notification(s) non lue(s)</p>
                </div>
                {unread > 0 && (
                    <button className="action-btn success flex items-center gap-2" onClick={markAllRead}>
                        <CheckCheck size={15} /> Tout marquer comme lu
                    </button>
                )}
            </div>

            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                {notifs.map((n, i) => (
                    <div key={n.id} onClick={() => markRead(n.id)} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '1rem',
                        padding: '1.1rem 1.5rem',
                        background: n.read ? 'transparent' : 'var(--primary-light)',
                        borderBottom: i < notifs.length - 1 ? '1px solid var(--border)' : 'none',
                        cursor: n.read ? 'default' : 'pointer',
                        transition: 'background 0.2s',
                    }}>
                        <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>{TYPE_ICON[n.type]}</div>
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: n.read ? 400 : 600, fontSize: '0.9rem' }}>{n.message}</p>
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{n.time}</p>
                        </div>
                        {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginTop: 4, flexShrink: 0 }} />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsPage;
