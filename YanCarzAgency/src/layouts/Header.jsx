import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import './Header.css';

const Header = ({ onSearch, searchValue }) => {
    const { collapsed } = useSidebar();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const initials = user?.firstName && user?.lastName
        ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        : user?.name
            ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
            : 'YC';

    return (
        <header className={`topbar ${collapsed ? 'collapsed' : ''}`}>
            {/* Search */}
            <div className="topbar__search">
                <Search size={16} className="topbar__search-icon" />
                <input
                    type="text"
                    placeholder={t('search')}
                    className="topbar__search-input"
                    value={searchValue}
                    onChange={e => onSearch && onSearch(e.target.value)}
                />
            </div>

            <div className="topbar__right">
                {/* Language Switcher */}
                <LanguageSwitcher />

                {/* Notification Bell */}
                <button 
                    className="topbar__icon-btn" 
                    title={t('notifications.title')}
                    onClick={() => navigate('/notifications')}
                >
                    <Bell size={20} />
                    <span className="topbar__badge">3</span>
                </button>

                {/* User Dropdown */}
                <div className="topbar__user" ref={dropdownRef}>
                    <button
                        className="topbar__avatar-btn"
                        onClick={() => setDropdownOpen(prev => !prev)}
                    >
                        <div className="topbar__avatar">{initials}</div>
                        <div className="topbar__user-info">
                            <span className="topbar__user-name">
                                {user?.firstName && user?.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user?.name || 'Utilisateur'}
                            </span>
                            <span className="topbar__user-role">{user?.role || 'Admin'}</span>
                        </div>
                        <ChevronDown size={14} className={`topbar__chevron ${dropdownOpen ? 'open' : ''}`} />
                    </button>

                    {dropdownOpen && (
                        <div className="topbar__dropdown">
                            <button className="topbar__dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/profile'); }}>
                                <User size={16} /> {t('profile.title')}
                            </button>
                            <button className="topbar__dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/settings'); }}>
                                <Settings size={16} /> {t('settings.title')}
                            </button>
                            <hr className="topbar__dropdown-divider" />
                            <button className="topbar__dropdown-item danger" onClick={handleLogout}>
                                <LogOut size={16} /> {t('logout')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
