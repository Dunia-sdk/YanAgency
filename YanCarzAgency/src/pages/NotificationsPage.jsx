import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCheck } from 'lucide-react';

const NOTIFS = [
    { id: 1, type: 'reservation', msgKey: 'n1', time: '5min', read: false },
    { id: 2, type: 'vehicle', msgKey: 'n2', time: '1h', read: false },
    { id: 3, type: 'payment', msgKey: 'n3', time: '2h', read: false },
    { id: 4, type: 'team', msgKey: 'n4', time: 'yesterday', read: true },
    { id: 5, type: 'reservation', msgKey: 'n5', time: 'yesterday', read: true },
];

const TYPE_ICON = {
    reservation: '📅', vehicle: '🚗', payment: '💳', team: '👥'
};

const NotificationsPage = () => {
    const { t } = useTranslation();
    const [notifs, setNotifs] = useState(NOTIFS);
    const unread = notifs.filter(n => !n.read).length;

    const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('notifications.title')}</h1>
                    <p className="page-subtitle">{t('notifications.subtitle', { count: unread })}</p>
                </div>
                {unread > 0 && (
                    <button className="action-btn success flex items-center gap-2" onClick={markAllRead}>
                        <CheckCheck size={15} /> {t('notifications.markAllRead')}
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
                            <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: n.read ? 400 : 600, fontSize: '0.9rem' }}>{t(`notifications.messages.${n.msgKey}`)}</p>
                            <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t(`notifications.times.${n.time}`)}</p>
                        </div>
                        {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginTop: 4, flexShrink: 0 }} />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationsPage;

