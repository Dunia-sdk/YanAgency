import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Car, CalendarCheck, Users, Receipt, CreditCard,
    Bell, BarChart3, UserCog, Settings, LogOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = [
    { to: '/dashboard', label: 'Tableau de bord', Icon: LayoutDashboard },
    { to: '/vehicles', label: 'Véhicules', Icon: Car },
    { to: '/reservations', label: 'Réservations', Icon: CalendarCheck },
    { to: '/clients', label: 'Clients', Icon: Users },
    { to: '/billing', label: 'Facturation', Icon: Receipt },
    { to: '/payments', label: 'Paiements', Icon: CreditCard },
    { to: '/notifications', label: 'Notifications', Icon: Bell },
    { to: '/reporting', label: 'Rapports', Icon: BarChart3 },
    { to: '/team', label: 'Équipe', Icon: UserCog },
    { to: '/settings', label: 'Paramètres', Icon: Settings },
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
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <YanCarzLogo collapsed={collapsed} />

            <button className="sidebar-toggle" onClick={toggleSidebar} title={collapsed ? 'Expand' : 'Collapse'}>
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>

            <nav className="sidebar-nav">
                {NAV_ITEMS.map(({ to, label, Icon: NavIcon }) => (
                    // eslint-disable-next-line no-unused-vars
                    <NavLink
                        key={to}
                        to={to}
                        title={collapsed ? label : undefined}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <NavIcon size={20} className="sidebar-link__icon" />
                        {!collapsed && <span className="sidebar-link__label">{label}</span>}
                    </NavLink>
                ))}
            </nav>

            <button className="sidebar-link sidebar-logout" onClick={handleLogout} title={collapsed ? 'Déconnexion' : undefined}>
                <LogOut size={20} className="sidebar-link__icon" />
                {!collapsed && <span className="sidebar-link__label">Déconnexion</span>}
            </button>
        </aside>
    );
};

export default Sidebar;
