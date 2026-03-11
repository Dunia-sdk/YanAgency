import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { teamMembers as initialTeam } from '../services/mockData';

const TeamPage = () => {
    const { t } = useTranslation();
    const [team, setTeam] = useState(initialTeam);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', role: 'Staff', department: '' });
    const [errors, setErrors] = useState({});

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
        { key: 'name', label: t('team.columns.name'), width: '22%' },
        { key: 'email', label: t('team.columns.email'), width: '24%' },
        { key: 'department', label: t('team.columns.department'), width: '16%' },
        {
            key: 'role',
            label: t('team.columns.role'),
            width: '14%',
            render: v => <span className={`badge badge-${v.toLowerCase()}`}>{t(`team.roles.${v.toLowerCase()}`)}</span>
        },
        { key: 'joined', label: t('team.columns.joined'), width: '14%' },
    ];

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = t('team.nameError');
        if (!form.email.trim()) errs.email = t('team.emailError');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('team.emailInvalid');
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleInvite = () => {
        if (!validate()) return;
        const initials = form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        setTeam(prev => [
            ...prev,
            { id: Date.now(), ...form, avatar: initials, joined: new Date().toISOString().slice(0, 10) }
        ]);
        setForm({ name: '', email: '', role: 'Staff', department: '' });
        setModal(false);
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
                <Button onClick={() => setModal(true)}>
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

            <Table columns={COLUMNS} data={team} emptyMessage={t('team.noMembers')} />

            {/* Invite Modal */}
            <Modal isOpen={modal} onClose={() => setModal(false)} title={t('team.inviteModal')} size="sm">
                <InputField
                    label={t('team.fullName')}
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t('team.fullName')}
                    error={errors.name}
                    required
                />
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
                    label={t('team.labels.department')}
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder={t('team.departmentPlaceholder')}
                />
                <div className="input-group">
                    <label className="input-label">{t('team.labels.role')}</label>
                    <select className="input-field" name="role" value={form.role} onChange={handleChange} style={{ padding: '0.75rem 1rem' }}>
                        {ROLES.map(r => (
                            <option key={r} value={r}>
                                {t(`team.roles.${r.toLowerCase()}`)}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2 mt-4">
                    <Button onClick={handleInvite} fullWidth>{t('team.buttons.sendInvitation')}</Button>
                    <Button variant="outline" onClick={() => setModal(false)} fullWidth>{t('team.buttons.cancel')}</Button>
                </div>
            </Modal>
        </div>
    );
};

export default TeamPage;
