import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard, Car, CalendarCheck, Users, Receipt, CreditCard,
    Bell, BarChart3, UserCog, Settings, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
    { to: '/dashboard', key: 'nav.dashboard', Icon: LayoutDashboard },
    { to: '/vehicles', key: 'nav.vehicles', Icon: Car },
    { to: '/reservations', key: 'nav.reservations', Icon: CalendarCheck },
    { to: '/clients', key: 'nav.clients', Icon: Users },
    { to: '/billing', key: 'nav.billing', Icon: Receipt },
    { to: '/payments', key: 'nav.payments', Icon: CreditCard },
    { to: '/notifications', key: 'nav.notifications', Icon: Bell },
    { to: '/reporting', key: 'nav.reporting', Icon: BarChart3 },
    { to: '/team', key: 'nav.team', Icon: UserCog },
    { to: '/settings', key: 'nav.settings', Icon: Settings },
];

const YanCarzLogo = ({ collapsed }) => (
    <div className="sidebar-logo">
        <div className="sidebar-logo__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.5-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" />
            </svg>
        </div>
        {!collapsed && <span className="sidebar-logo__text">YanCarz</span>}
    </div>
);

const Sidebar = () => {
    const { collapsed, toggleSidebar } = useSidebar();
    const { logout } = useAuth();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const isRtl = i18n.dir() === 'rtl';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // In RTL the sidebar is on the right, so collapse/expand arrow direction is flipped
    const CollapseIcon = collapsed
        ? (isRtl ? ChevronLeft : ChevronRight)
        : (isRtl ? ChevronRight : ChevronLeft);

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <YanCarzLogo collapsed={collapsed} />

            <button className="sidebar-toggle" onClick={toggleSidebar} title={collapsed ? t('nav.dashboard') : undefined}>
                <CollapseIcon size={16} />
            </button>

            <nav className="sidebar-nav">
                {NAV_ITEMS.map(({ to, key, Icon: NavIcon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        title={collapsed ? t(key) : undefined}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <NavIcon size={20} className="sidebar-link__icon" />
                        {!collapsed && <span className="sidebar-link__label">{t(key)}</span>}
                    </NavLink>
                ))}
            </nav>

            <button
                className="sidebar-link sidebar-logout"
                onClick={handleLogout}
                title={collapsed ? t('nav.logout') : undefined}
            >
                <LogOut size={20} className="sidebar-link__icon" />
                {!collapsed && <span className="sidebar-link__label">{t('nav.logout')}</span>}
            </button>
        </aside>
    );
};

export default Sidebar;
