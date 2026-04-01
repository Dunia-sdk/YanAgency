import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';

const LayoutContent = () => {
    const { collapsed } = useSidebar();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="dashboard-shell">
            <Sidebar />
            <div className={`dashboard-main ${collapsed ? 'collapsed' : ''}`}>
                <Header onSearch={setSearchQuery} searchValue={searchQuery} />
                <main className="dashboard-content">
                    <Outlet context={{ searchQuery }} />
                </main>
            </div>
        </div>
    );
};

const DashboardLayout = () => (
    <SidebarProvider>
        <LayoutContent />
    </SidebarProvider>
);

export default DashboardLayout;
