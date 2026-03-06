import React from 'react';
import { Car, CalendarCheck, DollarSign, MessageSquare } from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import Card from '../components/Card';
import Table from '../components/Table';
import { vehicles, reservations, revenueData, vehicleStatusData } from '../services/mockData';

const RECENT_COLS = [
    { key: 'id', label: 'Réf.' },
    { key: 'client', label: 'Client' },
    { key: 'vehicle', label: 'Véhicule' },
    { key: 'total', label: 'Total', render: v => `${v} MAD` },
    { key: 'status', label: 'Statut', render: v => <span className={`badge badge-${v}`}>{v}</span> },
];

const DashboardPage = () => {
    const totalVehicles = vehicles.length;
    const activeRes = reservations.filter(r => r.status === 'confirmed').length;
    const monthlyRevenue = reservations.reduce((s, r) => s + r.total, 0);
    const unreadMessages = 7;
    const recentActivity = reservations.slice(0, 5);

    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Tableau de bord</h1>
                    <p className="page-subtitle">Vue d'ensemble de l'agence YanCarz</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <Card title="Total Véhicules" value={totalVehicles} icon={Car} trend={5} trendLabel="vs mois dernier" color="var(--primary)" />
                <Card title="Réservations Actives" value={activeRes} icon={CalendarCheck} trend={12} trendLabel="vs mois dernier" color="#6366f1" />
                <Card title="Revenu du Mois" value={`${monthlyRevenue} MAD`} icon={DollarSign} trend={8} trendLabel="vs mois dernier" color="#f59e0b" />
                <Card title="Messages Non Lus" value={unreadMessages} icon={MessageSquare} trend={-2} trendLabel="vs mois dernier" color="#ec4899" />
            </div>

            {/* Charts */}
            <div className="charts-grid">
                {/* Area chart — Revenue trend */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <p className="section-title">Évolution du revenu (7 mois)</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={revenueData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                            <Tooltip formatter={v => [`${v} MAD`, 'Revenu']} contentStyle={{ borderRadius: 10, fontSize: 13 }} />
                            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} fill="url(#colorRev)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie chart — Vehicle statuses */}
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <p className="section-title">Statut de la flotte</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie data={vehicleStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4}>
                                {vehicleStatusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13 }} />
                            <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Reservations bar chart */}
            <div className="glass-panel mb-6" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <p className="section-title">Réservations par mois</p>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={revenueData}>
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
                <p className="section-title">Activité récente</p>
                <Table columns={RECENT_COLS} data={recentActivity} emptyMessage="Aucune réservation récente" />
            </div>
        </div>
    );
};

export default DashboardPage;
