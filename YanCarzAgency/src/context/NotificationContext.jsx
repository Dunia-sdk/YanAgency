import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

/**
 * Global notification store shared across the entire app.
 * Components can call `addNotification` to push a new entry,
 * and `NotificationsPage` reads from `notifications`.
 */
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    /** Push a new notification (unread by default). */
    const addNotification = useCallback((notif) => {
        setNotifications(prev => {
            // Avoid exact-duplicate inserts (same id)
            if (notif.id && prev.some(n => n.id === notif.id)) return prev;
            return [{ read: false, time: new Date(), ...notif }, ...prev];
        });
    }, []);

    const markRead = useCallback((id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, markRead, markAllRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

/** Hook to consume the notification context. */
export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used inside <NotificationProvider>');
    return ctx;
};
