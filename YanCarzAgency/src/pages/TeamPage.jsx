import React, { useState, useEffect } from 'react';
import { UserPlus, AlertCircle, Loader, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { getAgencyUsers, addAgencyUser, updateAgencyUser, deleteAgencyUser } from '../services/agencyUserService';
import { useAuth } from '../context/AuthContext';

const TeamPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState(null);
    const [modal, setModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ firstName: '', lastName: '', email: '', telephone: '', role: 'Staff', department: '', agencyId: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchTeam = React.useCallback(async () => {
        try {
            setLoading(true);
            const currentAgencyId = user?.agencyId || localStorage.getItem('agencyId');
            const data = await getAgencyUsers(currentAgencyId);
            setTeam(data);
            setPageError(null);
        } catch (err) {
            setPageError(t('team.loadError') || 'Failed to load team members.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [t, user?.agencyId]);

    useEffect(() => {
        fetchTeam();
    }, [fetchTeam]);

    const ROLES = ['Staff', 'Manager', 'Owner'];

    const COLUMNS = [
        {
            key: 'avatar', label: '', width: '6%',
            render: (v, row) => (
                <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)',
                    color: '#fff', fontWeight: 700, fontSize: '0.8rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{row.avatar}</div>
            )
        },
        { key: 'firstName', label: t('firstName') || 'First Name', width: '15%' },
        { key: 'lastName', label: t('lastName') || 'Last Name', width: '15%' },
        { key: 'email', label: t('email'), width: '22%' },
        { key: 'telephone', label: t('telephone') || 'Telephone', width: '14%' },
        {
            key: 'role',
            label: t('role'),
            width: '12%',
            render: v => <span className={`badge badge-${v?.toLowerCase() || 'staff'}`}>{t(`team.roles.${v?.toLowerCase() || 'staff'}`)}</span>
        },
        { key: 'joined', label: t('joined'), width: '12%' },
        {
            key: 'actions',
            label: '',
            width: '10%',
            render: (v, row) => (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(row)}>
                        <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(row.id, row.firstName, row.lastName)} style={{ color: 'var(--danger, #ef4444)' }}>
                        <Trash2 size={16} />
                    </Button>
                </div>
            )
        }
    ];

    const handleDelete = async (userId, firstName, lastName) => {
        if (!window.confirm(t('team.confirmDelete') || `Are you sure you want to delete ${firstName} ${lastName}?`)) return;
        
        try {
            setLoading(true); // Optional: global loading state while deleting
            await deleteAgencyUser(userId);
            await fetchTeam(); // Refresh the list
        } catch (err) {
            console.error('Failed to delete user:', err);
            setPageError(t('team.deleteError') || 'Failed to delete team member.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenEdit = (user) => {
        setEditingId(user.id);
        setForm({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            telephone: user.telephone || '',
            role: user.role || 'Staff',
            department: user.department || '',
            agencyId: user.agencyId || ''
        });
        setErrors({});
        setModal(true);
    };

    const handleOpenInvite = () => {
        setEditingId(null);
        setForm({ firstName: '', lastName: '', email: '', telephone: '', role: 'Staff', department: '' });
        setErrors({});
        setModal(true);
    };

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    };

    const validate = () => {
        const errs = {};
        if (!form.firstName.trim()) errs.firstName = t('team.firstNameError') || 'First name is required';
        if (!form.lastName.trim()) errs.lastName = t('team.lastNameError') || 'Last name is required';
        if (!form.email.trim()) errs.email = t('team.emailError');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('team.emailInvalid');
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleInvite = async () => {
        if (!validate()) return;
        try {
            setIsSubmitting(true);
            const currentAgencyId = user?.agencyId || localStorage.getItem('agencyId');
            
            if (editingId) {
                await updateAgencyUser(editingId, form);
            } else {
                await addAgencyUser(form, currentAgencyId);
            }
            await fetchTeam(); // Refresh the list
            setModal(false);
        } catch (err) {
            console.error('Failed to save user:', err);
            setErrors({ submit: (editingId ? t('team.updateError') : t('team.addError')) || 'Failed to save team member. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>
            <div className="page-header">
                <div>
                    <h1 className="page-title">{t('team.title')}</h1>
                    <p className="page-subtitle">
                        {t('team.subtitle', { count: team.length })}
                    </p>
                </div>
                <Button onClick={handleOpenInvite}>
                    <div className="flex items-center gap-2"><UserPlus size={16} /> {t('team.inviteMember')}</div>
                </Button>
            </div>

            {/* Role summary pills */}
            <div className="flex gap-2 mb-6" style={{ marginBottom: '1.5rem' }}>
                {ROLES.map(role => {
                    const count = team.filter(m => m.role === role).length;
                    return (
                        <div key={role} className="glass-panel flex items-center gap-2"
                            style={{ padding: '0.6rem 1.1rem', borderRadius: 10, fontSize: '0.875rem' }}>
                            <span className={`badge badge-${role.toLowerCase()}`}>{t(`team.roles.${role.toLowerCase()}`)}</span>
                            <span style={{ fontWeight: 700 }}>{count}</span>
                        </div>
                    );
                })}
            </div>

            {loading ? (
                <div className="flex justify-center items-center p-12 glass-panel" style={{ borderRadius: 12 }}>
                    <div className="flex flex-col items-center gap-4 text-gray-400">
                        <Loader className="animate-spin text-primary" size={32} />
                        <p>{t('team.loading') || 'Loading team members...'}</p>
                    </div>
                </div>
            ) : pageError ? (
                <div className="flex justify-center items-center p-12 glass-panel border border-red-500/30" style={{ borderRadius: 12, background: 'rgba(239, 68, 68, 0.05)' }}>
                    <div className="flex flex-col items-center gap-3 text-red-500">
                        <AlertCircle size={32} />
                        <p>{pageError}</p>
                        <Button variant="outline" onClick={() => window.location.reload()} style={{ marginTop: '1rem' }}>
                            Try Again
                        </Button>
                    </div>
                </div>
            ) : (
                <Table columns={COLUMNS} data={team} emptyMessage={t('team.noMembers')} />
            )}

            {/* Invite / Edit Modal */}
            <Modal isOpen={modal} onClose={() => setModal(false)} title={editingId ? (t('team.editModal') || 'Edit Team Member') : t('team.inviteModal')} size="sm">
                {errors.submit && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                        {errors.submit}
                    </div>
                )}
                <div className="flex gap-4">
                    <div style={{ flex: 1 }}>
                        <InputField
                            label={t('firstName') || 'First Name'}
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            placeholder={t('firstName') || 'First Name'}
                            error={errors.firstName}
                            required
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <InputField
                            label={t('lastName') || 'Last Name'}
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            placeholder={t('lastName') || 'Last Name'}
                            error={errors.lastName}
                            required
                        />
                    </div>
                </div>
                <InputField
                    label={t('email')}
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t('team.emailPlaceholder')}
                    error={errors.email}
                    required
                />
                <InputField
                    label={t('telephone') || 'Telephone'}
                    name="telephone"
                    value={form.telephone}
                    onChange={handleChange}
                    placeholder={t('telephone') || 'Phone Number'}
                />
                <InputField
                    label={t('department')}
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder={t('department')}
                />
                <div className="input-group">
                    <label className="input-label">{t('role')}</label>
                    <select className="input-field" name="role" value={form.role} onChange={handleChange} style={{ padding: '0.75rem 1rem' }}>
                        {ROLES.map(r => (
                            <option key={r} value={r}>
                                {t(`team.roles.${r.toLowerCase()}`)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2 mt-4">
                    <Button onClick={handleInvite} fullWidth disabled={isSubmitting}>
                        {isSubmitting ? (t('saving') || 'Saving...') : (editingId ? (t('saveChanges') || 'Save Changes') : (t('sendInvitation') || 'Send Invitation'))}
                    </Button>
                    <Button variant="outline" onClick={() => setModal(false)} fullWidth disabled={isSubmitting}>
                        {t('cancel')}
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default TeamPage;
