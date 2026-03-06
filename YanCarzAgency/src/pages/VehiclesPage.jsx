import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { vehicles as initialVehicles } from '../services/mockData';

const CATEGORIES = ['Tous', 'Berline', 'Citadine', 'SUV', 'Premium'];
const FUELS = ['Tous', 'Essence', 'Diesel', 'Hybride', 'Électrique'];
const TRANS = ['Tous', 'Auto', 'Manuel'];
const STATUSES = ['Tous', 'available', 'rented', 'maintenance'];
const STATUS_LABELS = { available: 'Disponible', rented: 'Loué', maintenance: 'En maintenance' };

const emptyForm = { brand: '', model: '', year: '', price: '', mileage: '', category: 'Berline', fuel: 'Essence', transmission: 'Auto', status: 'available', image: '' };

const COLUMNS = (onEdit, onDelete, onView) => [
    {
        key: 'image',
        label: 'Photo',
        width: '60px',
        render: (v) => <img src={v} alt="car" style={{ width: 40, height: 30, borderRadius: 4, objectFit: 'cover' }} />
    },
    { key: 'brand', label: 'Marque', width: '12%' },
    { key: 'model', label: 'Modèle', width: '14%' },
    { key: 'year', label: 'Année', width: '8%' },
    { key: 'mileage', label: 'Km', width: '8%', render: v => `${v?.toLocaleString()} km` },
    { key: 'category', label: 'Catégorie', width: '10%' },
    { key: 'fuel', label: 'Carburant', width: '10%' },
    { key: 'price', label: 'Prix/jour', width: '10%', render: v => `${v} MAD` },
    { key: 'status', label: 'Statut', width: '12%', render: v => <span className={`badge badge-${v}`}>{STATUS_LABELS[v] || v}</span> },
    {
        key: '__actions', label: 'Actions', width: '12%',
        render: (_, row) => (
            <div className="flex gap-2">
                <button className="action-btn" title="Voir détails" onClick={e => { e.stopPropagation(); onView(row); }} style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-main)' }}><Search size={13} /></button>
                <button className="action-btn success" title="Modifier" onClick={e => { e.stopPropagation(); onEdit(row); }}><Pencil size={13} /></button>
                <button className="action-btn danger" title="Supprimer" onClick={e => { e.stopPropagation(); onDelete(row.id); }}><Trash2 size={13} /></button>
            </div>
        )
    },
];

const VehiclesPage = () => {
    const { searchQuery = '' } = useOutletContext() || {};
    const [vehicles, setVehicles] = useState(initialVehicles);
    const [activeRow, setActiveRow] = useState(null);
    const [modal, setModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [editVehicle, setEditVehicle] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [localSearch, setLocalSearch] = useState('');
    const [filters, setFilters] = useState({ category: 'Tous', fuel: 'Tous', transmission: 'Tous', status: 'Tous' });

    const query = localSearch || searchQuery;

    const filtered = useMemo(() => {
        return vehicles.filter(v => {
            const matchSearch = `${v.brand} ${v.model}`.toLowerCase().includes(query.toLowerCase());
            const matchCat = filters.category === 'Tous' || v.category === filters.category;
            const matchFuel = filters.fuel === 'Tous' || v.fuel === filters.fuel;
            const matchTrans = filters.transmission === 'Tous' || v.transmission === filters.transmission;
            const matchStatus = filters.status === 'Tous' || v.status === filters.status;
            return matchSearch && matchCat && matchFuel && matchTrans && matchStatus;
        });
    }, [vehicles, query, filters]);

    const openAdd = () => { setForm(emptyForm); setEditVehicle(null); setModal(true); };
    const openEdit = (v) => { setForm({ ...v }); setEditVehicle(v); setModal(true); };
    const openView = (v) => { setSelectedVehicle(v); setViewModal(true); };
    const closeModal = () => { setModal(false); setViewModal(false); };

    const handleFormChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleFilterChange = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

    const handleSave = () => {
        if (!form.brand || !form.model) return;
        if (editVehicle) {
            setVehicles(prev => prev.map(v => v.id === editVehicle.id ? { ...v, ...form } : v));
        } else {
            setVehicles(prev => [...prev, { ...form, id: Date.now(), price: Number(form.price), year: Number(form.year) }]);
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
                    <h1 className="page-title">Gestion des Véhicules</h1>
                    <p className="page-subtitle">{filtered.length} véhicule(s) dans la flotte</p>
                </div>
                <Button onClick={openAdd}>
                    <div className="flex items-center gap-2"><Plus size={16} /> Ajouter un véhicule</div>
                </Button>
            </div>

            {/* Filter bar */}
            <div className="filter-bar">
                <div style={{ position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Rechercher marque / modèle..."
                        value={localSearch}
                        onChange={e => setLocalSearch(e.target.value)}
                        style={{ padding: '0.55rem 1rem 0.55rem 2.2rem', border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', width: 240 }}
                    />
                </div>
                {[['category', CATEGORIES], ['fuel', FUELS], ['transmission', TRANS], ['status', STATUSES]].map(([key, opts]) => (
                    <select key={key} className="select-input" value={filters[key]} onChange={e => handleFilterChange(key, e.target.value)}>
                        {opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                ))}
            </div>

            <Table
                columns={COLUMNS(openEdit, handleDelete, openView)}
                data={filtered}
                onRowClick={setActiveRow}
                activeRowId={activeRow?.id}
                emptyMessage="Aucun véhicule ne correspond aux filtres"
            />

            {/* Add / Edit Modal */}
            <Modal isOpen={modal} onClose={closeModal} title={editVehicle ? 'Modifier le véhicule' : 'Ajouter un véhicule'}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                    <InputField label="Marque" name="brand" value={form.brand} onChange={handleFormChange} placeholder="Toyota" required />
                    <InputField label="Modèle" name="model" value={form.model} onChange={handleFormChange} placeholder="Corolla" required />
                    <InputField label="Année" name="year" type="number" value={form.year} onChange={handleFormChange} placeholder="2023" />
                    <InputField label="Prix / jour (MAD)" name="price" type="number" value={form.price} onChange={handleFormChange} placeholder="500" />
                    <InputField label="Kilométrage (km)" name="mileage" type="number" value={form.mileage} onChange={handleFormChange} placeholder="15000" />
                    <InputField label="URL Image" name="image" value={form.image} onChange={handleFormChange} placeholder="https://..." />
                    {[['category', 'Catégorie', CATEGORIES.slice(1)], ['fuel', 'Carburant', FUELS.slice(1)], ['transmission', 'Boite', TRANS.slice(1)], ['status', 'Statut', STATUSES.slice(1)]].map(([key, lbl, opts]) => (
                        <div className="input-group" key={key}>
                            <label className="input-label">{lbl}</label>
                            <select className="input-field select-input" name={key} value={form[key]} onChange={handleFormChange} style={{ padding: '0.75rem 1rem' }}>
                                {opts.map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-4">
                    <Button onClick={handleSave} fullWidth>{editVehicle ? 'Enregistrer' : 'Ajouter'}</Button>
                    <Button variant="outline" onClick={closeModal} fullWidth>Annuler</Button>
                </div>
            </Modal>

            {/* View Details Modal */}
            <Modal isOpen={viewModal} onClose={closeModal} title="Détails du véhicule">
                {selectedVehicle && (
                    <div className="flex flex-col gap-4">
                        <img
                            src={selectedVehicle.image}
                            alt={selectedVehicle.model}
                            style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12 }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Marque & Modèle</p>
                                <p style={{ fontWeight: 600 }}>{selectedVehicle.brand} {selectedVehicle.model}</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Année</p>
                                <p style={{ fontWeight: 600 }}>{selectedVehicle.year}</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Kilométrage</p>
                                <p style={{ fontWeight: 600 }}>{selectedVehicle.mileage?.toLocaleString()} km</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Prix / jour</p>
                                <p style={{ fontWeight: 600, color: 'var(--primary)' }}>{selectedVehicle.price} MAD</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Carburant</p>
                                <p style={{ fontWeight: 600 }}>{selectedVehicle.fuel}</p>
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Statut</p>
                                <span className={`badge badge-${selectedVehicle.status}`}>{STATUS_LABELS[selectedVehicle.status]}</span>
                            </div>
                        </div>
                        <Button onClick={closeModal} fullWidth className="mt-4">Fermer</Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default VehiclesPage;
