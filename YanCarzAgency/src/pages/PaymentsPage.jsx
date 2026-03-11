import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CreditCard, Calendar, Download } from 'lucide-react';
import Table from '../components/Table';
import { payments as initialPayments } from '../services/mockData';

const PaymentsPage = () => {
    const { t } = useTranslation();
    const { searchQuery = '' } = useOutletContext() || {};
    const [payments] = useState(initialPayments);
    const [filters, setFilters] = useState({ method: 'all' });

    const METHODS = [
        { value: 'all', label: t('all') },
        { value: 'Online', label: 'Online' },
        { value: 'Versement', label: 'Versement' },
        { value: 'Cash Plus', label: 'Cash Plus' },
        { value: 'Agence', label: 'Agence' },
    ];

    const STATUS_LABELS = {
        completed: t('payments.statusCompleted'),
        pending: t('payments.statusPending'),
        failed: t('payments.statusFailed'),
    };

    const COLUMNS = [
        { key: 'date', label: t('payments.date'), width: '15%', render: v => <div className="flex items-center gap-2"><Calendar size={13} /> {v}</div> },
        { key: 'client', label: t('client'), width: '25%' },
        { key: 'amount', label: t('payments.amount'), width: '15%', render: v => <span style={{ fontWeight: 600 }}>{v} MAD</span> },
        { key: 'method', label: t('payments.method'), width: '15%' },
        { key: 'status', label: t('status'), width: '15%', render: v => <span className={`badge badge-${v}`}>{STATUS_LABELS[v] || v}</span> },
        {
            key: '__actions', label: t('actions'), width: '10%',
            render: () => (
                <button className="action-btn" title={t('payments.downloadReceipt')} style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-main)' }}>
                    <Download size={13} />
                </button>
            )
        },
    ];

    const filtered = useMemo(() => {
        return payments.filter(p => {
            const matchSearch = p.client.toLowerCase().includes(searchQuery.toLowerCase());
            const matchMethod = filters.method === 'all' || p.method === filters.method;
            return matchSearch && matchMethod;
        });
    }, [payments, searchQuery, filters]);

    const handleFilterChange = (val) => setFilters({ method: val });

    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('payments.title')}</h1>
                    <p className="page-subtitle">{t('payments.subtitle', { count: filtered.length })}</p>
                </div>
            </div>

            <div className="filter-bar">
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <select className="select-input" value={filters.method} onChange={e => handleFilterChange(e.target.value)}>
                            {METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="glass-panel items-center flex gap-2" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <CreditCard size={14} /> {t('payments.totalLabel')} {filtered.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} MAD
                    </div>
                </div>
            </div>

            <Table
                columns={COLUMNS}
                data={filtered}
                emptyMessage={t('payments.noResults')}
            />
        </div>
    );
};

export default PaymentsPage;
