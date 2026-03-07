import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { ChevronDown, Eye } from 'lucide-react';
import Table from '../components/Table';
import { reservations as initialReservations } from '../services/mockData';

const STATUS_OPTS = ['Tous', 'pending', 'confirmed', 'completed', 'cancelled'];
const STATUS_LABELS = { pending: 'En attente', confirmed: 'Confirmé', completed: 'Terminé', cancelled: 'Annulé' };
const STATUS_ACTIONS = {
    pending: ['Détails', 'Confirmer', 'Annuler'],
    confirmed: ['Détails', 'Terminer', 'Annuler'],
    completed: ['Détails'],
    cancelled: ['Détails'],
};

const ReservationsPage = () => {
    const { searchQuery = '' } = useOutletContext() || {};
    const navigate = useNavigate();
    const [reservations, setReservations] = useState(initialReservations);
    const [statusFilter, setStatusFilter] = useState('Tous');
    const [openDropdown, setOpenDropdown] = useState(null);

    const filtered = useMemo(() => {
        return reservations.filter(r => {
            const matchFilter = statusFilter === 'Tous' || r.status === statusFilter;
            const matchSearch = `${r.client} ${r.vehicle} ${r.id}`.toLowerCase().includes(searchQuery.toLowerCase());
            return matchFilter && matchSearch;
        });
    }, [reservations, statusFilter, searchQuery]);

    const applyAction = (id, action) => {
        if (action === 'Détails') {
            navigate(`/reservations/${id}`);
            return;
        }
        const map = { 'Confirmer': 'confirmed', 'Annuler': 'cancelled', 'Terminer': 'completed' };
        setReservations(prev => prev.map(r => r.id === id ? { ...r, status: map[action] } : r));
        setOpenDropdown(null);
    };

    const columns = [
        { key: 'id', label: 'Référence', width: '12%' },
        { key: 'client', label: 'Client', width: '18%' },
        { key: 'vehicle', label: 'Véhicule', width: '18%' },
        { key: 'startDate', label: 'Début', width: '12%' },
        { key: 'endDate', label: 'Fin', width: '12%' },
        { key: 'total', label: 'Total', width: '10%', render: v => `${v} MAD` },
        { key: 'status', label: 'Statut', width: '12%', render: v => <span className={`badge badge-${v}`}>{STATUS_LABELS[v] || v}</span> },
        {
            key: '__actions', label: 'Actions', width: '6%',
            render: (_, row) => {
                const actions = STATUS_ACTIONS[row.status] || [];
                return (
                    <div style={{ position: 'relative' }}>
                        <button
                            className="action-btn flex items-center gap-1"
                            onClick={e => { e.stopPropagation(); setOpenDropdown(prev => prev === row.id ? null : row.id); }}
                        >
                            Actions <ChevronDown size={12} />
                        </button>
                        {openDropdown === row.id && (
                            <div style={{ position: 'absolute', right: 0, top: '110%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, boxShadow: '0 8px 20px rgba(0,0,0,0.1)', zIndex: 99, minWidth: 140, overflow: 'hidden' }}>
                                {actions.map(a => (
                                    <button key={a} className="topbar__dropdown-item" onClick={e => { e.stopPropagation(); applyAction(row.id, a); }}
                                        style={{ padding: '0.65rem 1rem', color: a === 'Annuler' ? 'var(--error)' : 'inherit' }}>
                                        {a}
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
                    <h1 className="page-title">Réservations</h1>
                    <p className="page-subtitle">{filtered.length} réservation(s)</p>
                </div>
            </div>

            <div className="filter-bar">
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Filtrer par statut :</span>
                {STATUS_OPTS.map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                        className="action-btn"
                        style={{ background: statusFilter === s ? 'var(--primary)' : undefined, color: statusFilter === s ? '#fff' : undefined, borderColor: statusFilter === s ? 'var(--primary)' : undefined }}>
                        {STATUS_LABELS[s] || s}
                    </button>
                ))}
            </div>

            <Table columns={columns} data={filtered} emptyMessage="Aucune réservation trouvée" />
        </div>
    );
};

export default ReservationsPage;
