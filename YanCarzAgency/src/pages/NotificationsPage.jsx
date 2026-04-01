import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const TYPE_ICON = {
    reservation: '📅', vehicle: '🚗', payment: '💳', team: '👥'
};

const NotificationsPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { notifications, markRead, markAllRead } = useNotifications();
    const unread = notifications.filter(n => !n.read).length;

    const handleClick = (n) => {
        markRead(n.id);
        if (n.linkTo) navigate(n.linkTo);
    };

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
                {notifications.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p>{t('notifications.empty') || 'Aucune notification pour le moment.'}</p>
                    </div>
                ) : (
                    notifications.map((n, i) => (
                        <div key={n.id || i} onClick={() => handleClick(n)} style={{
                            display: 'flex', alignItems: 'flex-start', gap: '1rem',
                            padding: '1.1rem 1.5rem',
                            background: n.read ? 'transparent' : 'var(--primary-light)',
                            borderBottom: i < notifications.length - 1 ? '1px solid var(--border)' : 'none',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                        }}>
                            <div style={{ fontSize: '1.5rem', lineHeight: 1 }}>{TYPE_ICON[n.type] || '🔔'}</div>
                            <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, color: 'var(--text-main)', fontWeight: n.read ? 400 : 600, fontSize: '0.9rem' }}>
                                    {/* Handle hardcoded translation keys or dynamic messages */}
                                    {n.msgKey ? t(`notifications.messages.${n.msgKey}`) : n.msg}
                                </p>
                                <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    {n.time instanceof Date ? n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (n.timeKey ? t(`notifications.times.${n.timeKey}`) : n.time)}
                                </p>
                            </div>
                            {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', marginTop: 4, flexShrink: 0 }} />}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;

