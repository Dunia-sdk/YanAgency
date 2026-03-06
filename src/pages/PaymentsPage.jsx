import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CreditCard, Search, Calendar, Download } from 'lucide-react';
import Table from '../components/Table';
import { payments as initialPayments } from '../services/mockData';

const METHODS = ['Tous', 'Online', 'Versement', 'Cash Plus', 'Agence'];
const STATUS_LABELS = { completed: 'Complété', pending: 'En attente', failed: 'Échoué' };

const COLUMNS = [
    { key: 'date', label: 'Date', width: '15%', render: v => <div className="flex items-center gap-2"><Calendar size={13} /> {v}</div> },
    { key: 'client', label: 'Client', width: '25%' },
    { key: 'amount', label: 'Montant', width: '15%', render: v => <span style={{ fontWeight: 600 }}>{v} MAD</span> },
    { key: 'method', label: 'Mode', width: '15%' },
    { key: 'status', label: 'Statut', width: '15%', render: v => <span className={`badge badge-${v}`}>{STATUS_LABELS[v] || v}</span> },
    {
        key: '__actions', label: 'Actions', width: '10%',
        render: () => (
            <button className="action-btn" title="Télécharger reçu" style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-main)' }}>
                <Download size={13} />
            </button>
        )
    },
];

const PaymentsPage = () => {
    const { searchQuery = '' } = useOutletContext() || {};
    const [payments] = useState(initialPayments);
    const [filters, setFilters] = useState({ method: 'Tous' });

    const filtered = useMemo(() => {
        return payments.filter(p => {
            const matchSearch = p.client.toLowerCase().includes(searchQuery.toLowerCase());
            const matchMethod = filters.method === 'Tous' || p.method === filters.method;
            return matchSearch && matchMethod;
        });
    }, [payments, searchQuery, filters]);

    const handleFilterChange = (val) => setFilters({ method: val });

    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Paiements</h1>
                    <p className="page-subtitle">Suivi des {filtered.length} transactions récentes</p>
                </div>
            </div>

            <div className="filter-bar">
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <select className="select-input" value={filters.method} onChange={e => handleFilterChange(e.target.value)}>
                            {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="glass-panel items-center flex gap-2" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <CreditCard size={14} /> Total: {filtered.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} MAD
                    </div>
                </div>
            </div>

            <Table
                columns={COLUMNS}
                data={filtered}
                emptyMessage="Aucun paiement trouvé"
            />
        </div>
    );
};

export default PaymentsPage;
