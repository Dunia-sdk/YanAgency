import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Car, CalendarCheck, DollarSign, MessageSquare } from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import Card from '../components/Card';
import Table from '../components/Table';
import Alert from '../components/Alert';
import { reservations, revenueData, vehicles as mockVehicles } from '../services/mockData';
import { getVehicles, mapApiToUi } from '../services/vehicleService';

const DashboardPage = () => {
    const location = useLocation();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [realVehicles, setRealVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    const isNewSignup = location.state?.newSignup;
    const isNotActive = user?.isActive === false;
    const isVisible = !isNotActive && !loading;

    useEffect(() => {
        if (!isNotActive) {
            const fetchStats = async () => {
                setLoading(true);
                try {
                    const data = await getVehicles();
                    setRealVehicles(data || []);
                } catch (err) {
                    console.error("Dashboard fetch failed", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchStats();
        }
    }, [isNotActive]);

    const mappedVehicles = realVehicles.map(mapApiToUi);

    // Dynamic vehicle stats
    const vehicleStatusData = [
        { name: t('vehicles.statusAvailable'), value: mappedVehicles.filter(v => v.status === 'available').length, fill: '#10b981' },
        { name: t('vehicles.statusRented'), value: mappedVehicles.filter(v => v.status === 'rented').length, fill: '#6366f1' },
        { name: t('vehicles.statusMaintenance'), value: mappedVehicles.filter(v => v.status === 'maintenance').length, fill: '#f59e0b' },
    ];

    // KPI Calculations
    const totalVehicles = isNotActive ? 0 : realVehicles.length;
    const activeRes = isNotActive ? 0 : (isVisible ? reservations.filter(r => r.status === 'confirmed').length : 0);
    const monthlyRevenue = isNotActive ? 0 : (isVisible ? reservations.reduce((s, r) => s + r.total, 0) : 0);
    const unreadMessages = isNotActive ? 0 : (isVisible ? 7 : 0);
    const recentActivity = isNotActive ? [] : (isVisible ? reservations.slice(0, 5) : []);
    const currentRevenueData = isNotActive ? [] : (isVisible ? revenueData : []);
    const currentVehicleStatusData = isNotActive ? [] : (realVehicles.length > 0 ? vehicleStatusData : [
        { name: t('vehicles.statusAvailable'), value: 0, fill: '#10b981' },
        { name: t('vehicles.statusRented'), value: 0, fill: '#6366f1' },
        { name: t('vehicles.statusMaintenance'), value: 0, fill: '#f59e0b' },
    ]);

    const RECENT_COLS = [
        { key: 'id', label: t('ref') },
        { key: 'client', label: t('client') },
        { key: 'vehicle', label: t('vehicle') },
        { key: 'total', label: t('total'), render: v => `${v} MAD` },
        { key: 'status', label: t('status'), render: v => <span className={`badge badge-${v}`}>{v}</span> },
    ];

    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>
            {(isNewSignup || isNotActive) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {isNewSignup && (
                        <Alert
                            type="success"
                            message={t('welcome', { firstName: user?.firstName || '', lastName: user?.lastName || '' })}
                        />
                    )}
                    {isNotActive && (
                        <Alert
                            type="error"
                            message={t('accountNotActive')}
                        />
                    )}
                </div>
            )}
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('dashboard')}</h1>
                    <p className="page-subtitle">{t('agencyOverview')} {user?.agencyName || 'YanCarz'}</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <Card title={t('totalVehicles')} value={loading ? '...' : totalVehicles} icon={Car} trend={isNewSignup ? 0 : 5} trendLabel={t('vsLastMonth')} color="var(--primary)" />
                <Card title={t('activeReservations')} value={activeRes} icon={CalendarCheck} trend={isNewSignup ? 0 : 12} trendLabel={t('vsLastMonth')} color="#6366f1" />
                <Card title={t('monthlyRevenue')} value={`${monthlyRevenue} MAD`} icon={DollarSign} trend={isNewSignup ? 0 : 8} trendLabel={t('vsLastMonth')} color="#f59e0b" />
                <Card title={t('unreadMessages')} value={unreadMessages} icon={MessageSquare} trend={isNewSignup ? 0 : -2} trendLabel={t('vsLastMonth')} color="#ec4899" />
            </div>

            {/* Charts */}
            <div className="charts-grid">
                {/* Area chart — Revenue trend */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <p className="section-title">{t('revenueEvolution')}</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={currentRevenueData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <Tooltip formatter={v => [`${v} MAD`, t('monthlyRevenue')]} contentStyle={{ borderRadius: 10, fontSize: 13 }} />
                            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie chart — Vehicle statuses */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <p className="section-title">{t('fleetStatus')}</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={currentVehicleStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4}>
                                {currentVehicleStatusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
                            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Reservations bar chart */}
            <div className="glass-panel mb-6" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <p className="section-title">{t('reservationsByMonth')}</p>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={currentRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                        <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
                        <Bar dataKey="reservations" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Recent activity */}
            <div>
                <p className="section-title">{t('recentActivity')}</p>
                <Table columns={RECENT_COLS} data={recentActivity} emptyMessage={t('noRecentReservations')} />
            </div>
        </div>
    );
};

export default DashboardPage;
