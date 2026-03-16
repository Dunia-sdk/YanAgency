import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, RefreshCw } from 'lucide-react';
import Table from '../components/Table';
import * as bookingService from '../services/bookingService';

const ReservationsPage = () => {
    const { t } = useTranslation();
    const { searchQuery = '' } = useOutletContext() || {};
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [openDropdown, setOpenDropdown] = useState(null);

    const loadBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await bookingService.getBookings();
            const mappedData = (data || []).map(bookingService.mapApiToUi);
            setReservations(mappedData);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            setError(t('errors.fetchFailed') || 'Impossible de récupérer les réservations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const STATUS_OPTS = [
        { value: 'all', label: t('all') },
        { value: 'pending', label: t('reservations.statusPending') },
        { value: 'confirmed', label: t('reservations.statusConfirmed') },
        { value: 'completed', label: t('reservations.statusCompleted') },
        { value: 'cancelled', label: t('reservations.statusCancelled') },
    ];

    const STATUS_LABELS = {
        pending: t('reservations.statusPending'),
        confirmed: t('reservations.statusConfirmed'),
        completed: t('reservations.statusCompleted'),
        cancelled: t('reservations.statusCancelled'),
    };

    const ACTION_KEYS = {
        pending: ['actionDetails', 'actionConfirm', 'actionCancel'],
        confirmed: ['actionDetails', 'actionComplete', 'actionCancel'],
        completed: ['actionDetails'],
        cancelled: ['actionDetails'],
    };

    const filtered = useMemo(() => {
        return (reservations || []).filter(r => {
            const matchFilter = statusFilter === 'all' || r.status === statusFilter;
            const matchSearch = `${r.client} ${r.vehicle} ${r.id}`.toLowerCase().includes(searchQuery.toLowerCase());
            return matchFilter && matchSearch;
        });
    }, [reservations, statusFilter, searchQuery]);

    const applyAction = (id, actionKey) => {
        if (actionKey === 'actionDetails') {
            navigate(`/reservations/${id}`);
            return;
        }
        // TODO: Implement status update API call if needed
        const map = {
            actionConfirm: 'confirmed',
            actionCancel: 'cancelled',
            actionComplete: 'completed',
        };
        setReservations(prev => prev.map(r => r.id === id ? { ...r, status: map[actionKey] } : r));
        setOpenDropdown(null);
    };

    const columns = [
        { key: 'id', label: t('reservations.reference'), width: '12%' },
        { key: 'client', label: t('client'), width: '18%' },
        { key: 'vehicle', label: t('vehicle'), width: '18%' },
        { key: 'startDate', label: t('reservations.startDate'), width: '12%' },
        { key: 'endDate', label: t('reservations.endDate'), width: '12%' },
        { key: 'total', label: t('total'), width: '10%', render: v => `${v} MAD` },
        { key: 'status', label: t('status'), width: '12%', render: v => <span className={`badge badge-${v}`}>{STATUS_LABELS[v] || v}</span> },
        {
            key: '__actions', label: t('actions'), width: '6%',
            render: (_, row) => {
                const actionKeys = ACTION_KEYS[row.status] || [];
                return (
                    <div style={{ position: 'relative' }}>
                        <button
                            className="action-btn flex items-center gap-1"
                            onClick={e => { e.stopPropagation(); setOpenDropdown(prev => prev === row.id ? null : row.id); }}
                        >
                            {t('actions')} <ChevronDown size={12} />
                        </button>
                        {openDropdown === row.id && (
                            <div style={{ position: 'absolute', insetInlineEnd: 0, top: '110%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: '0 8px 20px rgba(0,0,0,0.1)', zIndex: 99, minWidth: 140, overflow: 'hidden' }}>
                                {actionKeys.map(key => (
                                    <button key={key} className="topbar__dropdown-item" onClick={e => { e.stopPropagation(); applyAction(row.id, key); }}
                                        style={{ padding: '0.65rem 1rem', color: key === 'actionCancel' ? 'var(--error)' : 'inherit' }}>
                                        {t(`reservations.${key}`)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            }
        },
    ];

    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('reservations.title')}</h1>
                    <p className="page-subtitle">{t('reservations.subtitle', { count: filtered.length })}</p>
                </div>
                <button 
                  className="btn btn-secondary flex items-center gap-2" 
                  onClick={loadBookings}
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  {t('refresh')}
                </button>
            </div>

            <div className="filter-bar">
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t('reservations.filterByStatus')}</span>
                {STATUS_OPTS.map(s => (
                    <button key={s.value} onClick={() => setStatusFilter(s.value)}
                        className="action-btn"
                        style={{ background: statusFilter === s.value ? 'var(--primary)' : undefined, color: statusFilter === s.value ? '#fff' : undefined, borderColor: statusFilter === s.value ? 'var(--primary)' : undefined }}>
                        {s.label}
                    </button>
                ))}
            </div>

            {error && (
                <div className="error-message" style={{ padding: '1rem', background: 'var(--error-light)', color: 'var(--error)', borderRadius: '8px', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            <Table 
                columns={columns} 
                data={filtered} 
                emptyMessage={loading ? t('loading') : t('reservations.noResults')} 
            />
        </div>
    );
};

export default ReservationsPage;
