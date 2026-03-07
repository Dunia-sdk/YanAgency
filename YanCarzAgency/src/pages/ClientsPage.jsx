import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import Table from '../components/Table';
import { clients } from '../services/mockData';

const CLIENT_COLS = (onView) => [
    { key: 'name', label: 'Nom complet', width: '20%' },
    { key: 'email', label: 'Email', width: '22%' },
    { key: 'phone', label: 'Téléphone', width: '18%' },
    { key: 'location', label: 'Ville', width: '14%' },
    { key: 'bookings', label: 'Réservations', width: '12%', render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    { key: 'joined', label: 'Inscrit le', width: '10%' },
    {
        key: '__actions', label: 'Actions', width: '4%',
        render: (_, row) => (
            <button className="action-btn" title="Voir détails" onClick={e => { e.stopPropagation(); onView(row.id); }} style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-main)' }}>
                <Eye size={13} />
            </button>
        )
    },
];

const ClientsPage = () => {
    const { searchQuery = '' } = useOutletContext() || {};
    const navigate = useNavigate();
    const [localSearch, setLocalSearch] = useState('');

    const query = localSearch || searchQuery;

    const filtered = useMemo(() =>
        clients.filter(c =>
            `${c.name} ${c.email} ${c.location}`.toLowerCase().includes(query.toLowerCase())
        ), [query]);

    const handleView = (id) => {
        navigate(`/clients/${id}`);
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

            <Table
                columns={CLIENT_COLS(handleView)}
                data={filtered}
                onRowClick={(row) => handleView(row.id)}
                emptyMessage="Aucun client trouvé"
            />
        </div>
    );
};

export default ClientsPage;
