import React, { useState, useMemo } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Receipt, FileText, AlertCircle, Clock } from 'lucide-react';
import Table from '../components/Table';
import Card from '../components/Card';
import { invoices as initialInvoices } from '../services/mockData';

const BillingPage = () => {
    const { t } = useTranslation();
    const { searchQuery = '' } = useOutletContext() || {};
    const [invoices] = useState(initialInvoices);

    const STATUS_LABELS = {
        paid: t('billing.statusPaid'),
        pending: t('billing.statusPending'),
        overdue: t('billing.statusOverdue'),
    };

    const COLUMNS = [
        { key: 'ref', label: t('billing.reference'), width: '15%' },
        { key: 'client', label: t('client'), width: '25%' },
        { key: 'amount', label: t('billing.amount'), width: '15%', render: v => <span style={{ fontWeight: 600 }}>{v} MAD</span> },
        { key: 'date', label: t('billing.date'), width: '15%' },
        { key: 'status', label: t('status'), width: '15%', render: v => <span className={`badge badge-${v}`}>{STATUS_LABELS[v] || v}</span> },
        {
            key: '__actions', label: t('actions'), width: '15%',
            render: (_, row) => (
                <div className="flex gap-2">
                    <Link to={`/billing/${row.id}`} className="action-btn" title={t('billing.viewInvoice')} style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center' }}>
                        <FileText size={13} />
                    </Link>
                </div>
            )
        },
    ];

    const filtered = useMemo(() => {
        return invoices.filter(inv => {
            const matchSearch = inv.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                inv.ref.toLowerCase().includes(searchQuery.toLowerCase());
            return matchSearch;
        });
    }, [invoices, searchQuery]);

    const stats = useMemo(() => {
        const total = filtered.reduce((acc, inv) => acc + inv.amount, 0);
        const pending = filtered.filter(inv => inv.status === 'pending').reduce((acc, inv) => acc + inv.amount, 0);
        const overdueCount = filtered.filter(inv => inv.status === 'overdue').length;
        return { total, pending, overdueCount };
    }, [filtered]);

    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('billing.title')}</h1>
                    <p className="page-subtitle">{t('billing.subtitle', { count: filtered.length })}</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card title={t('billing.totalBilled')} icon={<Receipt size={20} color="var(--primary)" />}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{stats.total.toLocaleString()} MAD</div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('billing.cumulativeAmount')}</p>
                </Card>
                <Card title={t('billing.pendingRevenue')} icon={<Clock size={20} color="#f59e0b" />}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#f59e0b' }}>{stats.pending.toLocaleString()} MAD</div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('billing.unpaidInvoices')}</p>
                </Card>
                <Card title={t('billing.overdueInvoices')} icon={<AlertCircle size={20} color="#ef4444" />}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: '#ef4444' }}>{stats.overdueCount}</div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('billing.immediateAction')}</p>
                </Card>
            </div>

            <div className="glass-panel" style={{ padding: '0' }}>
                <Table
                    columns={COLUMNS}
                    data={filtered}
                    emptyMessage={t('billing.noResults')}
                />
            </div>
        </div>
    );
};

export default BillingPage;
