import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import Table from '../components/Table';
import { clients, clientBookings } from '../services/mockData';

const CLIENT_COLS = [
    { key: 'name', label: 'Nom complet', width: '20%' },
    { key: 'email', label: 'Email', width: '22%' },
    { key: 'phone', label: 'Téléphone', width: '18%' },
    { key: 'location', label: 'Ville', width: '14%' },
    { key: 'bookings', label: 'Réservations', width: '12%', render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    { key: 'joined', label: 'Inscrit le', width: '14%' },
];

const BOOKING_COLS = [
    { key: 'id', label: 'Réf.' },
    { key: 'vehicle', label: 'Véhicule' },
    { key: 'dates', label: 'Période' },
    { key: 'total', label: 'Total', render: v => `${v} MAD` },
    { key: 'status', label: 'Statut', render: v => <span className={`badge badge-${v}`}>{v}</span> },
];

const ClientsPage = () => {
    const { searchQuery = '' } = useOutletContext() || {};
    const [localSearch, setLocalSearch] = useState('');
    const [expandedClient, setExpanded] = useState(null);

    const query = localSearch || searchQuery;

    const filtered = useMemo(() =>
        clients.filter(c =>
            `${c.name} ${c.email} ${c.location}`.toLowerCase().includes(query.toLowerCase())
        ), [query]);

    const handleRowClick = (row) => {
        setExpanded(prev => prev === row.id ? null : row.id);
    };

    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Gestion des Clients</h1>
                    <p className="page-subtitle">{filtered.length} client(s) enregistré(s)</p>
                </div>
            </div>

            <div className="filter-bar">
                <div style={{ position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Rechercher un client..."
                        value={localSearch}
                        onChange={e => setLocalSearch(e.target.value)}
                        style={{ padding: '0.55rem 1rem 0.55rem 2.2rem', border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', width: 280 }}
                    />
                </div>
            </div>

            {/* Clients table with expandable booking history */}
            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            {CLIENT_COLS.map(c => <th key={c.key} style={{ width: c.width }}>{c.label}</th>)}
                            <th style={{ width: '6%' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={7} className="table-empty">Aucun client trouvé</td></tr>
                        ) : (
                            filtered.map(client => (
                                <React.Fragment key={client.id}>
                                    <tr
                                        className={`clickable ${expandedClient === client.id ? 'active-row' : ''}`}
                                        onClick={() => handleRowClick(client)}
                                    >
                                        {CLIENT_COLS.map(col => (
                                            <td key={col.key}>{col.render ? col.render(client[col.key]) : client[col.key]}</td>
                                        ))}
                                        <td>
                                            {expandedClient === client.id
                                                ? <ChevronUp size={16} color="var(--primary)" />
                                                : <ChevronDown size={16} color="var(--text-muted)" />}
                                        </td>
                                    </tr>
                                    {expandedClient === client.id && (
                                        <tr>
                                            <td colSpan={7} style={{ padding: 0, background: '#f9fafb' }}>
                                                <div style={{ padding: '1rem 2rem 1.25rem' }}>
                                                    <p className="section-title" style={{ marginBottom: '0.75rem' }}>
                                                        Historique des réservations de <strong>{client.name}</strong>
                                                    </p>
                                                    <Table
                                                        columns={BOOKING_COLS}
                                                        data={clientBookings[client.id] || []}
                                                        emptyMessage="Aucune réservation pour ce client"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClientsPage;
