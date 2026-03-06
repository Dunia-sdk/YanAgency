import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { teamMembers as initialTeam } from '../services/mockData';

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
    { key: 'name', label: 'Nom', width: '22%' },
    { key: 'email', label: 'Email', width: '24%' },
    { key: 'department', label: 'Département', width: '16%' },
    { key: 'role', label: 'Rôle', width: '14%', render: v => <span className={`badge badge-${v.toLowerCase()}`}>{v}</span> },
    { key: 'joined', label: 'Rejoint le', width: '14%' },
];

const TeamPage = () => {
    const [team, setTeam] = useState(initialTeam);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', role: 'Staff', department: '' });
    const [errors, setErrors] = useState({});

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Le nom est requis';
        if (!form.email.trim()) errs.email = 'L\'email est requis';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email invalide';
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
                    <h1 className="page-title">Gestion de l'Équipe</h1>
                    <p className="page-subtitle">{team.length} membre(s) dans l'équipe</p>
                </div>
                <Button onClick={() => setModal(true)}>
                    <div className="flex items-center gap-2"><UserPlus size={16} /> Inviter un membre</div>
                </Button>
            </div>

            {/* Role summary pills */}
            <div className="flex gap-2 mb-6" style={{ marginBottom: '1.5rem' }}>
                {ROLES.map(role => {
                    const count = team.filter(m => m.role === role).length;
                    return (
                        <div key={role} className="glass-panel flex items-center gap-2"
                            style={{ padding: '0.6rem 1.1rem', borderRadius: 10, fontSize: '0.875rem' }}>
                            <span className={`badge badge-${role.toLowerCase()}`}>{role}</span>
                            <span style={{ fontWeight: 700 }}>{count}</span>
                        </div>
                    );
                })}
            </div>

            <Table columns={COLUMNS} data={team} emptyMessage="Aucun membre dans l'équipe" />

            {/* Invite Modal */}
            <Modal isOpen={modal} onClose={() => setModal(false)} title="Inviter un nouveau membre" size="sm">
                <InputField label="Nom complet" name="name" value={form.name} onChange={handleChange} placeholder="Jean Dupont" error={errors.name} required />
                <InputField label="Email" name="email" value={form.email} onChange={handleChange} placeholder="jean@yancarz.com" error={errors.email} required />
                <InputField label="Département" name="department" value={form.department} onChange={handleChange} placeholder="Commercial" />
                <div className="input-group">
                    <label className="input-label">Rôle</label>
                    <select className="input-field" name="role" value={form.role} onChange={handleChange} style={{ padding: '0.75rem 1rem' }}>
                        {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                </div>
                <div className="flex gap-2 mt-4">
                    <Button onClick={handleInvite} fullWidth>Envoyer l'invitation</Button>
                    <Button variant="outline" onClick={() => setModal(false)} fullWidth>Annuler</Button>
                </div>
            </Modal>
        </div>
    );
};

export default TeamPage;
