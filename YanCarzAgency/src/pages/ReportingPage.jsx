import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, Users, Car, DollarSign, Download, Filter, Search } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import Card from '../components/Card';
import Button from '../components/Button';
import { revenueData, fleetOccupancyData, vehicles } from '../services/mockData';

const ReportingPage = () => {
    const { t } = useTranslation();
    const [timeRange, setTimeRange] = useState('7d');

    const stats = useMemo(() => ({
        totalRevenue: revenueData.reduce((acc, curr) => acc + curr.revenue, 0),
        totalBookings: revenueData.reduce((acc, curr) => acc + curr.reservations, 0),
        avgBookingValue: Math.round(revenueData.reduce((acc, curr) => acc + curr.revenue, 0) / revenueData.reduce((acc, curr) => acc + curr.reservations, 0)),
        fleetUtilization: '78%'
    }), []);

    const topVehicles = useMemo(() => {
        return vehicles.slice(0, 5).map(v => ({
            name: `${v.brand} ${v.model}`,
            bookings: Math.floor(Math.random() * 20) + 10,
            revenue: Math.floor(Math.random() * 5000) + 2000
        })).sort((a, b) => b.revenue - a.revenue);
    }, []);

    const handleExport = (format) => {
        alert(t('reporting.exporting', { format }));
    };

    const translatedFleetData = useMemo(() => {
        return fleetOccupancyData.map(d => ({
            ...d,
            name: d.name === 'Libre' ? t('reporting.statusFree') : t('reporting.statusOccupied')
        }));
    }, [t]);

    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('reporting.title')}</h1>
                    <p className="page-subtitle">{t('reporting.subtitle')}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleExport('PDF')}>
                        <div className="flex items-center gap-2"><Download size={16} /> {t('reporting.exportPDF')}</div>
                    </Button>
                    <Button onClick={() => handleExport('Excel')}>
                        <div className="flex items-center gap-2"><Download size={16} /> {t('reporting.exportExcel')}</div>
                    </Button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card title={t('reporting.totalRevenue')} icon={<DollarSign size={20} color="var(--primary)" />}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{stats.totalRevenue.toLocaleString()} MAD</div>
                    <div className="flex items-center gap-1" style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem' }}>
                        <TrendingUp size={12} /> +12.4% <span style={{ color: 'var(--text-muted)' }}>{t('reporting.vsLastMonth')}</span>
                    </div>
                </Card>
                <Card title={t('reporting.reservations')} icon={<Users size={20} color="#6366f1" />}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{stats.totalBookings}</div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('reporting.totalRentals')}</p>
                </Card>
                <Card title={t('reporting.averageValue')} icon={<TrendingUp size={20} color="#f59e0b" />}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{stats.avgBookingValue.toLocaleString()} MAD</div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('reporting.perReservation')}</p>
                </Card>
                <Card title={t('reporting.fleetUtilization')} icon={<Car size={20} color="#8b5cf6" />}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{stats.fleetUtilization}</div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('reporting.occupancyRate')}</p>
                </Card>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card title={t('reporting.revenueTrend')}>
                    <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `${v / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--text-main)' }}
                                    formatter={(value) => [value.toLocaleString() + ' MAD', t('reporting.revenue')]}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card title={t('reporting.fleetOccupancy')}>
                    <div style={{ width: '100%', height: 300, marginTop: '1rem' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={translatedFleetData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {translatedFleetData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4" style={{ fontSize: '0.8rem' }}>
                            {translatedFleetData.map(d => (
                                <div key={d.name} className="flex items-center gap-1">
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: d.fill }}></div>
                                    <span>{d.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            <Card title={t('reporting.topRentedVehicles')}>
                <div style={{ marginTop: '1rem' }}>
                    <div className="flex flex-col gap-4">
                        {topVehicles.map((v, i) => (
                            <div key={i} className="flex items-center justify-between" style={{ padding: '0.75rem', borderRadius: 8, backgroundColor: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
                                <div className="flex items-center gap-3">
                                    <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'var(--bg-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}>{i + 1}</div>
                                    <span style={{ fontWeight: 500 }}>{v.name}</span>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('reporting.rentals')}</p>
                                        <p style={{ fontWeight: 600 }}>{v.bookings}</p>
                                    </div>
                                    <div className="text-right" style={{ minWidth: 100 }}>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('reporting.revenue')}</p>
                                        <p style={{ fontWeight: 600, color: 'var(--primary)' }}>{v.revenue.toLocaleString()} MAD</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ReportingPage;
