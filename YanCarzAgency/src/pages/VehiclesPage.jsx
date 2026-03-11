import React, { useState, useMemo } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { vehicles as initialVehicles } from '../services/mockData';

const STATUS_VALUES = ['available', 'rented', 'maintenance'];

const VehiclesPage = () => {
    const { t } = useTranslation();
    const { searchQuery = '' } = useOutletContext() || {};
    const navigate = useNavigate();

    const CATEGORIES = t('vehicles.categories', { returnObjects: true });
    const FUELS = t('vehicles.fuels', { returnObjects: true });
    const TRANS = t('vehicles.transmissions', { returnObjects: true });

    const STATUS_LABELS = {
        available: t('vehicles.statusAvailable'),
        rented: t('vehicles.statusRented'),
        maintenance: t('vehicles.statusMaintenance'),
    };

    const emptyForm = { brand: '', model: '', year: '', price: '', mileage: '', category: CATEGORIES[1] || 'Berline', fuel: FUELS[1] || 'Essence', transmission: TRANS[1] || 'Auto', status: 'available', image: '' };

    const [vehicles, setVehicles] = useState(initialVehicles);
    const [activeRow, setActiveRow] = useState(null);
    const [modal, setModal] = useState(false);
    const [editVehicle, setEditVehicle] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [localSearch, setLocalSearch] = useState('');
    const [filters, setFilters] = useState({ category: CATEGORIES[0], fuel: FUELS[0], transmission: TRANS[0], status: t('all') });

    const query = localSearch || searchQuery;

    const COLUMNS = (onEdit, onDelete, onView) => [
        {
            key: 'image', label: t('vehicles.photo'), width: '60px',
            render: (v) => <img src={v} alt="car" style={{ width: 40, height: 30, borderRadius: 4, objectFit: 'cover' }} />
        },
        { key: 'brand', label: t('vehicles.brand'), width: '12%' },
        { key: 'model', label: t('vehicles.model'), width: '14%' },
        { key: 'year', label: t('vehicles.year'), width: '8%' },
        { key: 'mileage', label: t('vehicles.mileage'), width: '8%', render: v => `${v?.toLocaleString()} km` },
        { key: 'category', label: t('vehicles.category'), width: '10%' },
        { key: 'fuel', label: t('vehicles.fuel'), width: '10%' },
        { key: 'price', label: t('vehicles.pricePerDay'), width: '10%', render: v => `${v} MAD` },
        { key: 'status', label: t('status'), width: '12%', render: v => <span className={`badge badge-${v}`}>{STATUS_LABELS[v] || v}</span> },
        {
            key: '__actions', label: t('actions'), width: '12%',
            render: (_, row) => (
                <div className="flex gap-2">
                    <button className="action-btn" title={t('viewDetails')} onClick={e => { e.stopPropagation(); onView(row); }} style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-main)' }}><Search size={13} /></button>
                    <button className="action-btn success" title={t('edit')} onClick={e => { e.stopPropagation(); onEdit(row); }}><Pencil size={13} /></button>
                    <button className="action-btn danger" title={t('delete')} onClick={e => { e.stopPropagation(); onDelete(row.id); }}><Trash2 size={13} /></button>
                </div>
            )
        },
    ];

    const filtered = useMemo(() => {
        const allLabel = CATEGORIES[0];
        return vehicles.filter(v => {
            const matchSearch = `${v.brand} ${v.model}`.toLowerCase().includes(query.toLowerCase());
            const matchCat = filters.category === allLabel || v.category === filters.category;
            const matchFuel = filters.fuel === FUELS[0] || v.fuel === filters.fuel;
            const matchTrans = filters.transmission === TRANS[0] || v.transmission === filters.transmission;
            const matchStatus = filters.status === t('all') || v.status === filters.status;
            return matchSearch && matchCat && matchFuel && matchTrans && matchStatus;
        });
    }, [vehicles, query, filters, t]);

    const openAdd = () => { setForm(emptyForm); setEditVehicle(null); setModal(true); };
    const openEdit = (v) => { setForm({ ...v }); setEditVehicle(v); setModal(true); };
    const openView = (v) => { navigate(`/vehicles/${v.id}`); };
    const closeModal = () => { setModal(false); };

    const handleFormChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFilterChange = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

    const handleSave = () => {
        if (!form.brand || !form.model) return;
        const year = Number(form.year);
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear + 1) {
            alert(t('errors.yearInvalid', { max: currentYear + 1 }));
            return;
        }
        if (Number(form.price) < 0 || Number(form.mileage) < 0) return;
        if (editVehicle) {
            setVehicles(prev => prev.map(v => v.id === editVehicle.id ? { ...v, ...form, year } : v));
        } else {
            setVehicles(prev => [...prev, { ...form, id: Date.now(), price: Number(form.price), year }]);
        }
        closeModal();
    };

    const handleDelete = (id) => {
        setVehicles(prev => prev.filter(v => v.id !== id));
        if (activeRow?.id === id) setActiveRow(null);
    };

    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('vehicles.title')}</h1>
                    <p className="page-subtitle">{t('vehicles.subtitle', { count: filtered.length })}</p>
                </div>
                <Button onClick={openAdd}>
                    <div className="flex items-center gap-2"><Plus size={16} /> {t('vehicles.addVehicle')}</div>
                </Button>
            </div>

            <div className="filter-bar">
                <div style={{ position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', insetInlineStart: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder={t('vehicles.searchPlaceholder')}
                        value={localSearch}
                        onChange={e => setLocalSearch(e.target.value)}
                        style={{ padding: '0.55rem 1rem 0.55rem 2.2rem', border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', width: 240 }}
                    />
                </div>
                <select className="select-input" value={filters.category} onChange={e => handleFilterChange('category', e.target.value)}>
                    {CATEGORIES.map(o => <option key={o}>{o}</option>)}
                </select>
                <select className="select-input" value={filters.fuel} onChange={e => handleFilterChange('fuel', e.target.value)}>
                    {FUELS.map(o => <option key={o}>{o}</option>)}
                </select>
                <select className="select-input" value={filters.transmission} onChange={e => handleFilterChange('transmission', e.target.value)}>
                    {TRANS.map(o => <option key={o}>{o}</option>)}
                </select>
                <select className="select-input" value={filters.status} onChange={e => handleFilterChange('status', e.target.value)}>
                    <option value={t('all')}>{t('all')}</option>
                    {STATUS_VALUES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
            </div>

            <Table
                columns={COLUMNS(openEdit, handleDelete, openView)}
                data={filtered}
                onRowClick={setActiveRow}
                activeRowId={activeRow?.id}
                emptyMessage={t('vehicles.noResults')}
            />

            <Modal isOpen={modal} onClose={closeModal} title={editVehicle ? t('vehicles.editModal') : t('vehicles.addModal')}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                    <InputField label={t('vehicles.brand')} name="brand" value={form.brand} onChange={handleFormChange} placeholder="Toyota" required />
                    <InputField label={t('vehicles.model')} name="model" value={form.model} onChange={handleFormChange} placeholder="Corolla" required />
                    <InputField label={t('vehicles.year')} name="year" type="number" value={form.year} onChange={handleFormChange} placeholder="2023" min="1900" max={new Date().getFullYear() + 1} />
                    <InputField label={`${t('vehicles.pricePerDay')} (MAD)`} name="price" type="number" value={form.price} onChange={handleFormChange} placeholder="500" min="0" />
                    <InputField label={`${t('vehicles.mileage')} (km)`} name="mileage" type="number" value={form.mileage} onChange={handleFormChange} placeholder="15000" min="0" />
                    <InputField label={t('vehicles.imageUrl')} name="image" value={form.image} onChange={handleFormChange} placeholder="https://..." />
                    {[
                        ['category', t('vehicles.category'), CATEGORIES.slice(1)],
                        ['fuel', t('vehicles.fuel'), FUELS.slice(1)],
                        ['transmission', t('vehicles.transmission'), TRANS.slice(1)],
                        ['status', t('status'), STATUS_VALUES.map(s => ({ value: s, label: STATUS_LABELS[s] }))]
                    ].map(([key, lbl, opts]) => (
                        <div className="input-group" key={key}>
                            <label className="input-label">{lbl}</label>
                            <select className="input-field select-input" name={key} value={form[key]} onChange={handleFormChange} style={{ padding: '0.75rem 1rem' }}>
                                {opts.map(o => typeof o === 'string'
                                    ? <option key={o} value={o}>{o}</option>
                                    : <option key={o.value} value={o.value}>{o.label}</option>
                                )}
                            </select>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-4">
                    <Button onClick={handleSave} fullWidth>{editVehicle ? t('save') : t('add')}</Button>
                    <Button variant="outline" onClick={closeModal} fullWidth>{t('cancel')}</Button>
                </div>
            </Modal>
        </div>
    );
};

export default VehiclesPage;
