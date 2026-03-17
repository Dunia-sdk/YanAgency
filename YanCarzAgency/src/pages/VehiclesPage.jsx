import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle, mapApiToUi, mapUiToApi, getMarks, getModelsByMark } from '../services/vehicleService';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

const STATUS_VALUES = ['available', 'rented', 'maintenance'];

const VehiclesPage = () => {
    const { t } = useTranslation();
    const { searchQuery = '' } = useOutletContext() || {};
    const { user } = useAuth();
    const navigate = useNavigate();

    const CATEGORIES = t('vehicles.categories', { returnObjects: true });
    const FUELS = t('vehicles.fuels', { returnObjects: true });
    const TRANS = t('vehicles.transmissions', { returnObjects: true });

    const STATUS_LABELS = {
        available: t('vehicles.statusAvailable'),
        rented: t('vehicles.statusRented'),
        maintenance: t('vehicles.statusMaintenance'),
    };

    const emptyForm = { brand: '', markId: '', model: '', modelId: '', year: '', price: '', mileage: '', category: CATEGORIES[1] || 'Berline', fuel: FUELS[1] || 'Essence', transmission: TRANS[1] || 'Auto', status: 'available', plateNumber: '', color: '', seats: 5 };

    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeRow, setActiveRow] = useState(null);
    const [modal, setModal] = useState(false);
    const [editVehicle, setEditVehicle] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [localSearch, setLocalSearch] = useState('');
    const [filters, setFilters] = useState({ category: CATEGORIES[0], fuel: FUELS[0], transmission: TRANS[0], status: t('all') });

    // Dynamic Options State
    const [marks, setMarks] = useState([]);
    const [models, setModels] = useState([]);
    const [loadingMarks, setLoadingMarks] = useState(false);
    const [loadingModels, setLoadingModels] = useState(false);

    const fetchVehicles = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getVehicles();
            const mapped = data.map(mapApiToUi);
            setVehicles(mapped);
        } catch (err) {
            console.error('Failed to fetch vehicles:', err);
            setError(t('errors.fetchFailed') || 'Impossible de charger les véhicules');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    const query = localSearch || searchQuery;

    const COLUMNS = (onEdit, onDelete, onView) => [
        
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

    const openAdd = () => { 
        setForm(emptyForm); 
        setEditVehicle(null); 
        setModels([]); 
        setModal(true); 
        fetchMarks(); 
    };
    
    const openEdit = async (v) => { 
        setForm({ ...v }); 
        setEditVehicle(v); 
        setModal(true); 
        
        await fetchMarks();
        if (v.markId) {
            fetchModels(v.markId);
        }
    };

    const fetchMarks = async () => {
        if (marks.length > 0) return;
        setLoadingMarks(true);
        try {
            const data = await getMarks();
            setMarks(data || []);
        } catch (err) {
            console.error('Failed to fetch marks:', err);
        } finally {
            setLoadingMarks(false);
        }
    };

    const fetchModels = async (markId) => {
        if (!markId) {
            setModels([]);
            return;
        }
        setLoadingModels(true);
        try {
            const data = await getModelsByMark(markId);
            setModels(data || []);
        } catch (err) {
            console.error('Failed to fetch models:', err);
        } finally {
            setLoadingModels(false);
        }
    };

    const openView = (v) => { navigate(`/vehicles/${v.id}`); };
    const closeModal = () => { setModal(false); };

    const handleFormChange = e => {
        const { name, value } = e.target;
        
        if (name === 'brand') {
            const selectedMark = marks.find(m => m.id === value);
            setForm(prev => ({ 
                ...prev, 
                brand: selectedMark ? selectedMark.name : '',
                markId: value,
                model: '', // Reset model
                modelId: '' // Reset modelId
            }));
            fetchModels(value);
        } else if (name === 'model') {
            const selectedModel = models.find(m => m.id === value);
            setForm(prev => ({
                ...prev,
                model: selectedModel ? selectedModel.name : '',
                modelId: value
            }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleFilterChange = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

    const handleSave = async () => {
        if (!form.brand || !form.model) return;
        const year = Number(form.year);
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear + 1) {
            alert(t('errors.yearInvalid', { max: currentYear + 1 }));
            return;
        }
        if (Number(form.price) < 0) {
            alert(t('errors.priceNegative') || 'Le prix doit être un nombre positif');
            return;
        }
        if (Number(form.mileage) < 0) {
            alert(t('errors.mileageNegative') || 'Le kilométrage doit être un nombre positif');
            return;
        }

        setLoading(true);
        try {
            // agencyId now comes from user context (correctly populated after login/signup)
            const agencyId = user?.agencyId || localStorage.getItem('agencyId');
            
            // Validate agencyId before sending to API to prevent 400 Bad Request (Guid conversion error)
            const isValidGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(agencyId);
            
            if (!agencyId || !isValidGuid) {
                console.warn('Invalid or missing Agency ID:', agencyId);
                alert(`${t('errors.invalidAgency') || "ID d'agence invalide."} \n\n${t('errors.reconnectSuggested') || "Veuillez vous déconnecter et vous reconnecter pour rafraîchir votre session."}`);
                setLoading(false);
                return;
            }
            
            const apiData = mapUiToApi(form, agencyId);

            if (editVehicle) {
                const response = await updateVehicle(editVehicle.id, apiData);
                // Merge form and response for absolute data integrity in UI
                const updated = mapApiToUi({ ...form, ...(typeof response === 'object' ? response : {}) });
                setVehicles(prev => prev.map(v => v.id === editVehicle.id ? updated : v));
            } else {
                const response = await createVehicle(apiData);
                // If response is just a string (the ID), use it. If it's an object, merge it.
                const newId = typeof response === 'string' ? response : (response.id || response.Id || response.uid);
                const resultObj = typeof response === 'object' ? response : {};
                
                const created = mapApiToUi({
                    ...form,
                    ...resultObj,
                    id: newId
                });
                
                setVehicles(prev => [...prev, created]);
            }
            closeModal();
        } catch (err) {
            console.error('Failed to save vehicle:', err);
            const errorMsg = typeof err === 'string' ? err : (err.message || JSON.stringify(err));
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('confirmDelete') || 'Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return;
        setLoading(true);
        try {
            await deleteVehicle(id);
            setVehicles(prev => prev.filter(v => v.id !== id));
            if (activeRow?.id === id) setActiveRow(null);
        } catch (err) {
            console.error('Failed to delete vehicle:', err);
            alert(err.message || 'Erreur lors de la suppression');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('vehicles.title')}</h1>
                    <p className="page-subtitle">{t('vehicles.subtitle', { count: filtered.length })}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchVehicles} disabled={loading}>
                        {loading ? '...' : t('refresh') || 'Rafraîchir'}
                    </Button>
                    <Button onClick={openAdd}>
                        <div className="flex items-center gap-2"><Plus size={16} /> {t('vehicles.addVehicle')}</div>
                    </Button>
                </div>
            </div>

            <Alert type="error" message={error} onClose={() => setError(null)} />

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

            {loading && vehicles.length === 0 ? (
                <div className="flex items-center justify-center p-12 glass-panel mt-4">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-muted">{t('loading') || 'Chargement...'}</p>
                    </div>
                </div>
            ) : (
                <Table
                    columns={COLUMNS(openEdit, handleDelete, openView)}
                    data={filtered}
                    onRowClick={setActiveRow}
                    activeRowId={activeRow?.id}
                    emptyMessage={t('vehicles.noResults')}
                />
            )}

            <Modal isOpen={modal} onClose={closeModal} title={editVehicle ? t('vehicles.editModal') : t('vehicles.addModal')}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                    <div className="input-group">
                        <label className="input-label">{t('vehicles.brand')} *</label>
                        <select 
                            className="input-field select-input" 
                            name="brand" 
                            value={form.markId || ''} 
                            onChange={handleFormChange} 
                            style={{ padding: '0.75rem 1rem' }}
                            disabled={loadingMarks}
                            required
                        >
                            <option value="" disabled>{loadingMarks ? 'Chargement...' : 'Sélectionner une marque'}</option>
                            {marks.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('vehicles.model')} *</label>
                        <select 
                            className="input-field select-input" 
                            name="model" 
                            value={form.modelId || ''} 
                            onChange={handleFormChange} 
                            style={{ padding: '0.75rem 1rem' }}
                            disabled={!form.markId || loadingModels}
                            required
                        >
                            <option value="" disabled>{!form.markId ? 'Sélectionnez d\'abord une marque' : (loadingModels ? 'Chargement...' : 'Sélectionner un modèle')}</option>
                            {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>

                    <InputField label={t('vehicles.year')} name="year" type="number" value={form.year} onChange={handleFormChange} placeholder="2023" min="1900" max={new Date().getFullYear() + 1} />
                    <InputField label={`${t('vehicles.pricePerDay')} (MAD)`} name="price" type="number" value={form.price} onChange={handleFormChange} placeholder="500" min="0" />
                    <InputField label={`${t('vehicles.mileage')} (km)`} name="mileage" type="number" value={form.mileage} onChange={handleFormChange} placeholder="15000" min="0" />
                    <InputField label={t('vehicles.plateNumber') || 'Plaque'} name="plateNumber" value={form.plateNumber} onChange={handleFormChange} placeholder="1234-A-15" />
                    <InputField label={t('vehicles.color') || 'Couleur'} name="color" value={form.color} onChange={handleFormChange} placeholder="Gris" />

                    <InputField label={t('vehicles.seats') || 'Places'} name="seats" type="number" value={form.seats} onChange={handleFormChange} placeholder="5" min="1" max="50" />
                    {[
                        ['category', t('vehicles.category'), CATEGORIES.slice(1)],
                        ['fuel', t('vehicles.fuel'), FUELS.slice(1)],
                    ].map(([key, lbl, opts]) => (
                        <div className="input-group" key={key}>
                            <label className="input-label">{lbl}</label>
                            <select className="input-field select-input" name={key} value={form[key]} onChange={handleFormChange} style={{ padding: '0.75rem 1rem' }}>
                                {opts.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                    ))}

                    <div className="input-group">
                        <label className="input-label">{t('vehicles.transmission')}</label>
                        <div className="toggle-group">
                            {TRANS.slice(1).map(o => (
                                <button
                                    key={o}
                                    type="button"
                                    className={`toggle-btn ${form.transmission === o ? 'active' : ''}`}
                                    onClick={() => setForm(prev => ({ ...prev, transmission: o }))}
                                >
                                    {o}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('status')}</label>
                        <select className="input-field select-input" name="status" value={form.status} onChange={handleFormChange} style={{ padding: '0.75rem 1rem' }}>
                            {STATUS_VALUES.map(s => (
                                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                            ))}
                        </select>
                    </div>
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
