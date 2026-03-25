import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RefreshCw, ChevronDown, Eye } from 'lucide-react';
import * as bookingService from '../services/bookingService';
import { useNotifications } from '../context/NotificationContext';
import './ReservationsPage.css';

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Text filter input rendered inside a <th> */
const ThTextFilter = ({ value, onChange, placeholder }) => (
    <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || '🔍'}
        onClick={e => e.stopPropagation()}
        className="th-filter-input"
    />
);

/** Select filter rendered inside a <th> */
const ThSelectFilter = ({ value, onChange, options }) => (
    <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onClick={e => e.stopPropagation()}
        className="th-filter-select"
    >
        {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
        ))}
    </select>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ReservationsPage = () => {
    const { t } = useTranslation();
    const { searchQuery = '' } = useOutletContext() || {};
    const navigate = useNavigate();
    const { addNotification } = useNotifications();

    // Track seen booking IDs to detect newly added ones
    const seenBookingIds = useRef(new Set());
    const isFirstLoad = useRef(true);

    // ── Core state ─────────────────────────────────────────────────────────────
    const [reservations, setReservations] = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null);

    /**
     * Column-level filter state.
     * Each key corresponds to a column in the table.
     */
    const [columnFilters, setColumnFilters] = useState({
        id:        '',
        client:    '',
        vehicle:   '',
        startDate: '',
        endDate:   '',
        status:    '',
    });

    // i18n labels
    const STATUS_LABELS = {
        pending:   t('reservations.statusPending'),
        confirmed: t('reservations.statusConfirmed'),
        completed: t('reservations.statusCompleted'),
        cancelled: t('reservations.statusCancelled'),
    };

    const ACTION_KEYS = {
        pending:   ['actionDetails', 'actionConfirm', 'actionCancel'],
        confirmed: ['actionDetails', 'actionComplete', 'actionCancel'],
        completed: ['actionDetails'],
        cancelled: ['actionDetails'],
    };

    // ── Status filter options for the column <select> ──────────────────────────
    const statusOptions = [
        { value: '',          label: t('all') },
        { value: 'pending',   label: STATUS_LABELS.pending   },
        { value: 'confirmed', label: STATUS_LABELS.confirmed },
        { value: 'completed', label: STATUS_LABELS.completed },
        { value: 'cancelled', label: STATUS_LABELS.cancelled },
    ];

    // ── Data fetching ──────────────────────────────────────────────────────────

    const loadBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const data       = await bookingService.getBookings();
            const mappedData = (data || []).map(bookingService.mapApiToUi);
            
            // Check for new bookings to notify
            if (!isFirstLoad.current) {
                mappedData.forEach(booking => {
                    if (!seenBookingIds.current.has(booking.id)) {
                        addNotification({
                            id: `res-${booking.id}`,
                            type: 'reservation',
                            msg: `Nouvelle réservation : ${booking.client} - ${booking.vehicle}`,
                            time: new Date()
                        });
                    }
                });
            } else {
                isFirstLoad.current = false;
            }

            // Update seen IDs
            mappedData.forEach(booking => seenBookingIds.current.add(booking.id));

            setReservations(mappedData);
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            setError(t('errors.fetchFailed') || 'Impossible de récupérer les réservations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadBookings(); }, []);

    // ── Filtering ──────────────────────────────────────────────────────────────

    /**
     * Client-side filtering using column-level filters.
     * The global searchQuery from the layout still applies across all text fields.
     */
    const filtered = useMemo(() => {
        const globalQ = (searchQuery || '').toLowerCase();

        return reservations.filter(r => {
            // Global search touches id / client / vehicle
            if (globalQ) {
                const hay = `${r.id} ${r.client} ${r.vehicle}`.toLowerCase();
                if (!hay.includes(globalQ)) return false;
            }

            // Per-column filters (case-insensitive substring for text, exact for select)
            if (columnFilters.client    && !(r.client || '').toLowerCase().includes(columnFilters.client.toLowerCase()))              return false;
            if (columnFilters.vehicle   && !(r.vehicle || '').toLowerCase().includes(columnFilters.vehicle.toLowerCase()))            return false;
            if (columnFilters.startDate && !(r.startDate || '').toLowerCase().includes(columnFilters.startDate.toLowerCase()))       return false;
            if (columnFilters.endDate   && !(r.endDate || '').toLowerCase().includes(columnFilters.endDate.toLowerCase()))           return false;
            if (columnFilters.status    && r.status !== columnFilters.status)                                                 return false;

            return true;
        });
    }, [reservations, searchQuery, columnFilters]);

    const setColFilter = (key, val) =>
        setColumnFilters(prev => ({ ...prev, [key]: val }));

    // ── Actions ────────────────────────────────────────────────────────────────

    const applyAction = (id, actionKey) => {
        if (actionKey === 'actionDetails') {
            navigate(`/reservations/${id}`);
            return;
        }
        const statusMap = {
            actionConfirm:  'confirmed',
            actionCancel:   'cancelled',
            actionComplete: 'completed',
        };
        setReservations(prev =>
            prev.map(r => r.id === id ? { ...r, status: statusMap[actionKey] } : r)
        );
        setOpenDropdown(null);
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>

            {/* ── Page header ────────────────────────────────────────────── */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('reservations.title')}</h1>
                    <p className="page-subtitle">
                        {t('reservations.subtitle', { count: filtered.length })}
                    </p>
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

            {/* ── Error banner ───────────────────────────────────────────── */}
            {error && (
                <div style={{ padding: '1rem', background: 'var(--error-light)', color: 'var(--error)', borderRadius: '8px', marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            {/* ── Table ──────────────────────────────────────────────────── */}
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        {/* Row 1 – column labels */}
                        <tr>
                            <th style={{ width: '22%' }}>{t('client')}</th>
                            <th style={{ width: '22%' }}>{t('vehicle')}</th>
                            <th style={{ width: '13%' }}>{t('reservations.startDate')}</th>
                            <th style={{ width: '13%' }}>{t('reservations.endDate')}</th>
                            <th style={{ width: '11%' }}>{t('total')}</th>
                            <th style={{ width: '11%' }}>{t('status')}</th>
                            <th style={{ width: '8%'  }}>{t('actions')}</th>
                        </tr>

                        {/* Row 2 – column filter inputs */}
                        <tr className="th-filter-row">
                            <th>
                                <ThTextFilter
                                    value={columnFilters.client}
                                    onChange={v => setColFilter('client', v)}
                                    placeholder="Client..."
                                />
                            </th>
                            <th>
                                <ThTextFilter
                                    value={columnFilters.vehicle}
                                    onChange={v => setColFilter('vehicle', v)}
                                    placeholder="Véhicule..."
                                />
                            </th>
                            <th>
                                <ThTextFilter
                                    value={columnFilters.startDate}
                                    onChange={v => setColFilter('startDate', v)}
                                    placeholder="Début..."
                                />
                            </th>
                            <th>
                                <ThTextFilter
                                    value={columnFilters.endDate}
                                    onChange={v => setColFilter('endDate', v)}
                                    placeholder="Fin..."
                                />
                            </th>
                            <th>{/* Total – no filter */}</th>
                            <th>
                                <ThSelectFilter
                                    value={columnFilters.status}
                                    onChange={v => setColFilter('status', v)}
                                    options={statusOptions}
                                />
                            </th>
                            <th>{/* Actions – no filter */}</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* Loading state – show skeleton message until data arrives */}
                        {loading && reservations.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="table-empty">
                                    <div className="flex items-center justify-center gap-2" style={{ padding: '2rem' }}>
                                        <div className="w-5 h-5 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                                        <span>{t('loading') || 'Chargement...'}</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="table-empty">
                                    {t('reservations.noResults')}
                                </td>
                            </tr>
                        ) : filtered.map((row, idx) => (
                            <tr key={row.id ?? idx}>
                                <td>{row.client}</td>
                                <td>{row.vehicle}</td>
                                <td>{row.startDate}</td>
                                <td>{row.endDate}</td>
                                <td>{row.total} MAD</td>
                                <td>
                                    <span className={`badge badge-${row.status}`}>
                                        {STATUS_LABELS[row.status] || row.status}
                                    </span>
                                </td>

                                {/* Action dropdown */}
                                <td>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="action-btn-primary"
                                            title={t('viewDetails')}
                                            onClick={() => applyAction(row.id, 'actionDetails')}
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <div style={{ position: 'relative' }}>
                                            <button
                                                className="action-btn flex items-center gap-1"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setOpenDropdown(prev => prev === row.id ? null : row.id);
                                                }}
                                            >
                                                {t('actions')} <ChevronDown size={12} />
                                            </button>
                                            {openDropdown === row.id && (
                                                <div style={{
                                                    position: 'absolute', insetInlineEnd: 0, top: '110%',
                                                    background: 'var(--surface)', border: '1px solid var(--border)',
                                                    borderRadius: 10, boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                                                    zIndex: 99, minWidth: 140, overflow: 'hidden'
                                                }}>
                                                    {(ACTION_KEYS[row.status] || []).map(key => (
                                                        <button
                                                            key={key}
                                                            className="topbar__dropdown-item"
                                                            onClick={e => { e.stopPropagation(); applyAction(row.id, key); }}
                                                            style={{
                                                                padding: '0.65rem 1rem',
                                                                color: key === 'actionCancel' ? 'var(--error)' : 'inherit'
                                                            }}
                                                        >
                                                            {t(`reservations.${key}`)}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReservationsPage;
