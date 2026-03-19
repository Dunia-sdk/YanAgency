import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import Modal from '../components/Modal';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Alert from '../components/Alert';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle, mapApiToUi, mapUiToApi, getMarks, getModelsByMark } from '../services/vehicleService';
import { useAuth } from '../context/AuthContext';
import './VehiclesPage.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_VALUES = ['available', 'rented', 'maintenance'];

/** Standard car colors shown in the dropdown */
const CAR_COLORS = [
    'Blanc', 'Noir', 'Gris', 'Argent', 'Rouge',
    'Bleu', 'Vert', 'Orange', 'Beige', 'Marron', 'Jaune', 'Violet'
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/**
 * A reusable text input rendered inside a <th> for column-level filtering.
 */
const ThTextFilter = ({ value, onChange, placeholder }) => (
    <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || '🔍'}
        onClick={e => e.stopPropagation()}
        className="th-filter-input"
    />
);

/**
 * A reusable select rendered inside a <th> for column-level filtering.
 */
const ThSelectFilter = ({ value, onChange, options }) => (
    <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onClick={e => e.stopPropagation()}
        className="th-filter-select"
    >
        {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
        ))}
    </select>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const VehiclesPage = () => {
    const { t } = useTranslation();
    const { searchQuery = '' } = useOutletContext() || {};
    const { user } = useAuth();
    const navigate = useNavigate();

    // i18n option arrays
    const CATEGORIES = t('vehicles.categories', { returnObjects: true });
    const FUELS      = t('vehicles.fuels',       { returnObjects: true });
    const TRANS      = t('vehicles.transmissions', { returnObjects: true });

    const STATUS_LABELS = {
        available:   t('vehicles.statusAvailable'),
        rented:      t('vehicles.statusRented'),
        maintenance: t('vehicles.statusMaintenance'),
    };

    const emptyForm = {
        brand: '', markId: '', model: '', modelId: '',
        year: '', price: '', mileage: '',
        category:     CATEGORIES[1] || 'Berline',
        fuel:         FUELS[1]      || 'Essence',
        transmission: TRANS[1]      || 'Auto',
        status: 'available',
        plateNumber: '', color: CAR_COLORS[0], seats: 5
    };

    // ── State ──────────────────────────────────────────────────────────────────
    const [vehicles,      setVehicles]      = useState([]);
    const [loading,       setLoading]       = useState(true);
    const [error,         setError]         = useState(null);
    const [activeRow,     setActiveRow]     = useState(null);
    const [modal,         setModal]         = useState(false);
    const [editVehicle,   setEditVehicle]   = useState(null);
    const [form,          setForm]          = useState(emptyForm);

    // Marks / Models for the Add/Edit form
    const [marks,         setMarks]         = useState([]);
    const [models,        setModels]        = useState([]);
    const [loadingMarks,  setLoadingMarks]  = useState(false);
    const [loadingModels, setLoadingModels] = useState(false);

    /**
     * Column-level filter state.
     * Each key matches a column key or 'mark' (brand+model merged).
     */
    const [columnFilters, setColumnFilters] = useState({
        mark:     '',   // filters brand + model combined
        year:     '',
        category: '',
        fuel:     '',
        status:   '',
    });

    // ── Data Fetching ──────────────────────────────────────────────────────────

    const fetchVehicles = async () => {
        setLoading(true);
        setError(null);
        try {
            const data   = await getVehicles();
            const mapped = (data || []).map(mapApiToUi);
            setVehicles(mapped);
        } catch (err) {
            console.error('Failed to fetch vehicles:', err);
            setError(t('errors.fetchFailed') || 'Impossible de charger les véhicules');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVehicles(); }, []);

    const fetchMarks = async () => {
        if (marks.length > 0) return marks; // already cached
        setLoadingMarks(true);
        try {
            const data = await getMarks();
            setMarks(data || []);
            return data || [];
        } catch (err) {
            console.error('Failed to fetch marks:', err);
            return [];
        } finally {
            setLoadingMarks(false);
        }
    };

    const fetchModels = async (markId) => {
        if (!markId) { setModels([]); return; }
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

    // ── Filtering ──────────────────────────────────────────────────────────────

    /**
     * Apply all column-level filters plus the global searchQuery from the layout.
     * The 'mark' filter matches against brand + model combined.
     */
    const filtered = useMemo(() => {
        const globalQ = searchQuery.toLowerCase();
        return vehicles.filter(v => {
            const markStr = `${v.brand} ${v.model}`.toLowerCase();

            // Global search from layout topbar
            if (globalQ && !markStr.includes(globalQ)) return false;

            // Column filters
            if (columnFilters.mark && !markStr.includes(columnFilters.mark.toLowerCase())) return false;
            if (columnFilters.year && !String(v.year).includes(columnFilters.year)) return false;
            if (columnFilters.category && v.category !== columnFilters.category) return false;
            if (columnFilters.fuel && v.fuel !== columnFilters.fuel) return false;
            if (columnFilters.status && v.status !== columnFilters.status) return false;

            return true;
        });
    }, [vehicles, searchQuery, columnFilters]);

    const setColFilter = (key, val) =>
        setColumnFilters(prev => ({ ...prev, [key]: val }));

    // ── Modal helpers ──────────────────────────────────────────────────────────

    const openAdd = () => {
        setForm(emptyForm);
        setEditVehicle(null);
        setModels([]);
        setModal(true);
        fetchMarks();
    };

    const openEdit = async (v) => {
        setForm({ ...v, color: v.color || CAR_COLORS[0] });
        setEditVehicle(v);
        setModal(true);
        await fetchMarks();
        if (v.markId) await fetchModels(v.markId);
    };

    const openView = (v) => navigate(`/vehicles/${v.id}`);
    const closeModal = () => setModal(false);

    // ── Form ───────────────────────────────────────────────────────────────────

    const handleFormChange = e => {
        const { name, value } = e.target;
        if (name === 'brand') {
            const selected = marks.find(m => m.id === value);
            setForm(prev => ({ ...prev, brand: selected?.name || '', markId: value, model: '', modelId: '' }));
            fetchModels(value);
        } else if (name === 'model') {
            const selected = models.find(m => m.id === value);
            setForm(prev => ({ ...prev, model: selected?.name || '', modelId: value }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        if (!form.brand || !form.model) return;

        const year = Number(form.year);
        const currentYear = new Date().getFullYear();
        if (year < 1900 || year > currentYear + 1) {
            alert(t('errors.yearInvalid', { max: currentYear + 1 }));
            return;
        }
        if (Number(form.price) < 0)   { alert(t('errors.priceNegative'));   return; }
        if (Number(form.mileage) < 0)  { alert(t('errors.mileageNegative')); return; }

        setLoading(true);
        try {
            const agencyId = user?.agencyId;
            const isValidGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(agencyId);
            if (!agencyId || !isValidGuid) {
                alert(`${t('errors.invalidAgency')}\n\n${t('errors.reconnectSuggested')}`);
                setLoading(false);
                return;
            }

            const apiData = mapUiToApi(form, agencyId);

            if (editVehicle) {
                const response = await updateVehicle(editVehicle.id, apiData);
                // Some APIs return 204/empty body on PUT — fall back to form data
                const merged = typeof response === 'object' && response !== null
                    ? { ...editVehicle, ...form, ...response }
                    : { ...editVehicle, ...form };
                const updated = mapApiToUi(merged);
                setVehicles(prev => prev.map(v => v.id === editVehicle.id ? updated : v));
            } else {
                const response = await createVehicle(apiData);
                const newId    = typeof response === 'string' ? response : (response?.id || response?.Id || response?.uid);
                const created  = mapApiToUi({ ...form, ...(typeof response === 'object' ? response : {}), id: newId });
                setVehicles(prev => [...prev, created]);
            }
            closeModal();
        } catch (err) {
            console.error('Failed to save vehicle:', err);
            alert(typeof err === 'string' ? err : (err.message || JSON.stringify(err)));
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

    // ── Select options for column filters ──────────────────────────────────────

    const categoryOptions = [
        { value: '', label: t('all') },
        ...CATEGORIES.slice(1).map(c => ({ value: c, label: c }))
    ];
    const fuelOptions = [
        { value: '', label: t('all') },
        ...FUELS.slice(1).map(f => ({ value: f, label: f }))
    ];
    const statusOptions = [
        { value: '', label: t('all') },
        ...STATUS_VALUES.map(s => ({ value: s, label: STATUS_LABELS[s] }))
    ];

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>

            {/* ── Page header ─────────────────────────────────────────────── */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('vehicles.title')}</h1>
                    <p className="page-subtitle">{t('vehicles.subtitle', { count: filtered.length })}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchVehicles} disabled={loading}>
                        {loading ? '...' : (t('refresh') || 'Rafraîchir')}
                    </Button>
                    <Button onClick={openAdd}>
                        <div className="flex items-center gap-2"><Plus size={16} /> {t('vehicles.addVehicle')}</div>
                    </Button>
                </div>
            </div>

            <Alert type="error" message={error} onClose={() => setError(null)} />

            {/* ── Loading spinner (initial load) ──────────────────────────── */}
            {loading && vehicles.length === 0 ? (
                <div className="flex items-center justify-center p-12 glass-panel mt-4">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-muted">{t('loading') || 'Chargement...'}</p>
                    </div>
                </div>
            ) : (
                /* ── Table with inline column filters ──────────────────────── */
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            {/* Row 1 – column labels */}
                            <tr>
                                <th style={{ width: '22%' }}>{t('vehicles.brand')} / {t('vehicles.model')}</th>
                                <th style={{ width: '8%'  }}>{t('vehicles.year')}</th>
                                <th style={{ width: '10%' }}>{t('vehicles.mileage')}</th>
                                <th style={{ width: '12%' }}>{t('vehicles.category')}</th>
                                <th style={{ width: '10%' }}>{t('vehicles.fuel')}</th>
                                <th style={{ width: '10%' }}>{t('vehicles.pricePerDay')}</th>
                                <th style={{ width: '12%' }}>{t('status')}</th>
                                <th style={{ width: '16%' }}>{t('actions')}</th>
                            </tr>
                            {/* Row 2 – column filter inputs */}
                            <tr className="th-filter-row">
                                <th>
                                    <ThTextFilter
                                        value={columnFilters.mark}
                                        onChange={v => setColFilter('mark', v)}
                                        placeholder="Marque / Modèle..."
                                    />
                                </th>
                                <th>
                                    <ThTextFilter
                                        value={columnFilters.year}
                                        onChange={v => setColFilter('year', v)}
                                        placeholder="Année..."
                                    />
                                </th>
                                <th>{/* Mileage – no filter needed */}</th>
                                <th>
                                    <ThSelectFilter
                                        value={columnFilters.category}
                                        onChange={v => setColFilter('category', v)}
                                        options={categoryOptions}
                                    />
                                </th>
                                <th>
                                    <ThSelectFilter
                                        value={columnFilters.fuel}
                                        onChange={v => setColFilter('fuel', v)}
                                        options={fuelOptions}
                                    />
                                </th>
                                <th>{/* Price – no filter */}</th>
                                <th>
                                    <ThSelectFilter
                                        value={columnFilters.status}
                                        onChange={v => setColFilter('status', v)}
                                        options={statusOptions}
                                    />
                                </th>
                                <th>{/* Actions – no filter */}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="table-empty">
                                        {t('vehicles.noResults')}
                                    </td>
                                </tr>
                            ) : filtered.map((row, idx) => (
                                <tr
                                    key={row.id ?? idx}
                                    onClick={() => setActiveRow(row)}
                                    className={`clickable ${activeRow?.id === row.id ? 'active-row' : ''}`}
                                >
                                    {/* Merged Mark / Model column */}
                                    <td>
                                        <span style={{ fontWeight: 600 }}>{row.brand}</span>
                                        {row.model && (
                                            <span style={{ color: 'var(--text-muted)', marginLeft: '0.35rem', fontSize: '0.875rem' }}>
                                                {row.model}
                                            </span>
                                        )}
                                    </td>
                                    <td>{row.year}</td>
                                    <td>{row.mileage ? `${Number(row.mileage).toLocaleString()} km` : '—'}</td>
                                    <td>{row.category || 'Berline'}</td>
                                    <td>{row.fuel}</td>
                                    <td>{row.price} MAD</td>
                                    <td>
                                        <span className={`badge badge-${row.status}`}>
                                            {STATUS_LABELS[row.status] || row.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                className="action-btn"
                                                title={t('viewDetails')}
                                                onClick={e => { e.stopPropagation(); openView(row); }}
                                                style={{ backgroundColor: 'var(--bg-accent)', color: 'var(--text-main)' }}
                                            >
                                                <Search size={13} />
                                            </button>
                                            <button
                                                className="action-btn success"
                                                title={t('edit')}
                                                onClick={e => { e.stopPropagation(); openEdit(row); }}
                                            >
                                                <Pencil size={13} />
                                            </button>
                                            <button
                                                className="action-btn danger"
                                                title={t('delete')}
                                                onClick={e => { e.stopPropagation(); handleDelete(row.id); }}
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Add / Edit Modal ─────────────────────────────────────────── */}
            <Modal
                isOpen={modal}
                onClose={closeModal}
                title={editVehicle ? t('vehicles.editModal') : t('vehicles.addModal')}
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>

                    {/* Brand (mark) select */}
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
                            <option value="" disabled>
                                {loadingMarks ? 'Chargement...' : 'Sélectionner une marque'}
                            </option>
                            {marks.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>

                    {/* Model select */}
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
                            <option value="" disabled>
                                {!form.markId
                                    ? "Sélectionnez d'abord une marque"
                                    : loadingModels ? 'Chargement...' : 'Sélectionner un modèle'}
                            </option>
                            {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                    </div>

                    <InputField label={t('vehicles.year')} name="year" type="number" value={form.year} onChange={handleFormChange} placeholder="2023" min="1900" max={new Date().getFullYear() + 1} />
                    <InputField label={`${t('vehicles.pricePerDay')} (MAD)`} name="price" type="number" value={form.price} onChange={handleFormChange} placeholder="500" min="0" />
                    <InputField label={`${t('vehicles.mileage')} (km)`} name="mileage" type="number" value={form.mileage} onChange={handleFormChange} placeholder="15000" min="0" />
                    <InputField label={t('vehicles.plateNumber') || 'Plaque'} name="plateNumber" value={form.plateNumber} onChange={handleFormChange} placeholder="1234-A-15" />

                    {/* Color dropdown (replaces free-text input) */}
                    <div className="input-group">
                        <label className="input-label">{t('vehicles.color') || 'Couleur'}</label>
                        <select
                            className="input-field select-input"
                            name="color"
                            value={form.color}
                            onChange={handleFormChange}
                            style={{ padding: '0.75rem 1rem' }}
                        >
                            {CAR_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <InputField label={t('vehicles.seats') || 'Places'} name="seats" type="number" value={form.seats} onChange={handleFormChange} placeholder="5" min="1" max="50" />

                    {/* Category + Fuel dropdowns */}
                    {[
                        ['category', t('vehicles.category'), CATEGORIES.slice(1)],
                        ['fuel',     t('vehicles.fuel'),     FUELS.slice(1)],
                    ].map(([key, lbl, opts]) => (
                        <div className="input-group" key={key}>
                            <label className="input-label">{lbl}</label>
                            <select
                                className="input-field select-input"
                                name={key}
                                value={form[key]}
                                onChange={handleFormChange}
                                style={{ padding: '0.75rem 1rem' }}
                            >
                                {opts.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                        </div>
                    ))}

                    {/* Transmission toggle */}
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

                    {/* Status */}
                    <div className="input-group">
                        <label className="input-label">{t('status')}</label>
                        <select
                            className="input-field select-input"
                            name="status"
                            value={form.status}
                            onChange={handleFormChange}
                            style={{ padding: '0.75rem 1rem' }}
                        >
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
