import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Eye } from 'lucide-react';
import Table from '../components/Table';
import { clients } from '../services/mockData';

const ClientsPage = () => {
    const { t } = useTranslation();
    const { searchQuery = '' } = useOutletContext() || {};
    const navigate = useNavigate();
    const [localSearch, setLocalSearch] = useState('');

    const query = localSearch || searchQuery;

    const CLIENT_COLS = (onView) => [
        { key: 'name', label: t('clients.fullName'), width: '20%' },
        { key: 'email', label: t('email'), width: '22%' },
        { key: 'phone', label: t('clients.phone'), width: '18%' },
        { key: 'location', label: t('clients.location'), width: '14%' },
        { key: 'bookings', label: t('clients.bookings'), width: '12%', render: v => <span style={{ fontWeight: 600 }}>{v}</span> },
        { key: 'joined', label: t('clients.joined'), width: '10%' },
        {
            key: '__actions', label: t('actions'), width: '4%',
            render: (_, row) => (
                <button className="action-btn" title={t('viewDetails')} onClick={e => { e.stopPropagation(); onView(row.id); }} style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-main)' }}>
                    <Eye size={13} />
                </button>
            )
        },
    ];

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
                    <h1 className="page-title">{t('clients.title')}</h1>
                    <p className="page-subtitle">{t('clients.subtitle', { count: filtered.length })}</p>
                </div>
            </div>

            <div className="filter-bar">
                <div style={{ position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', insetInlineStart: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder={t('clients.searchPlaceholder')}
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
                emptyMessage={t('clients.noResults')}
            />
        </div>
    );
};

export default ClientsPage;
