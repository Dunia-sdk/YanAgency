import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import authService from '../api/services/authService';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Alert from '../components/Alert';

const SettingsPage = () => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [form, setForm] = useState({ agencyName: 'YanCarz Agency', email: user?.email || '', phone: '+33 1 23 45 67 89', address: 'Paris, France' });
    const [securityForm, setSecurityForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [saved, setSaved] = useState(false);
    const [securityStatus, setSecurityStatus] = useState({ type: '', message: '' });

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSecurityChange = e => setSecurityForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

    const handlePasswordChange = async () => {
        if (securityForm.newPassword !== securityForm.confirmPassword) {
            setSecurityStatus({ type: 'error', message: 'Les nouveaux mots de passe ne correspondent pas.' });
            return;
        }
        try {
            await authService.changePassword(securityForm.currentPassword, securityForm.newPassword);
            setSecurityStatus({ type: 'success', message: 'Mot de passe mis à jour avec succès !' });
            setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setSecurityStatus({ type: 'error', message: error.message });
        }
    };

    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>
            <div className="page-header">
                <div><h1 className="page-title">Paramètres</h1><p className="page-subtitle">Gérez vos préférences et la sécurité</p></div>
            </div>

            <div className="flex flex-col gap-6" style={{ maxWidth: 620 }}>
                {/* Mode d'affichage */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <p className="section-title">Mode d'affichage</p>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => toggleTheme('light')}
                            style={{
                                flex: 1,
                                background: theme === 'light' ? 'var(--primary)' : 'var(--surface)',
                                color: theme === 'light' ? 'white' : 'var(--text-main)',
                                border: `1px solid ${theme === 'light' ? 'transparent' : 'var(--border)'}`
                            }}
                        >
                            ☀️ Mode Matin
                        </Button>
                        <Button
                            onClick={() => toggleTheme('dark')}
                            style={{
                                flex: 1,
                                background: theme === 'dark' ? 'var(--primary)' : 'var(--surface)',
                                color: theme === 'dark' ? 'white' : 'var(--text-main)',
                                border: `1px solid ${theme === 'dark' ? 'transparent' : 'var(--border)'}`
                            }}
                        >
                            🌙 Mode Nuit
                        </Button>
                    </div>
                </div>

                {/* Informations générales */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <p className="section-title">Informations générales</p>
                    {saved && <Alert type="success" message="Paramètres enregistrés avec succès !" />}
                    <InputField label="Nom de l'agence" name="agencyName" value={form.agencyName} onChange={handleChange} />
                    <InputField label="Email de contact" name="email" type="email" value={form.email} onChange={handleChange} />
                    <InputField label="Téléphone" name="phone" value={form.phone} onChange={handleChange} />
                    <InputField label="Adresse" name="address" value={form.address} onChange={handleChange} />
                    <div className="mt-4">
                        <Button onClick={handleSave}>Enregistrer les modifications</Button>
                    </div>
                </div>

                {/* Sécurité */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <p className="section-title">Sécurité</p>
                    {securityStatus.message && (
                        <Alert
                            type={securityStatus.type}
                            message={securityStatus.message}
                            onClose={() => setSecurityStatus({ type: '', message: '' })}
                        />
                    )}
                    <InputField
                        label="Mot de passe actuel"
                        name="currentPassword"
                        type="password"
                        value={securityForm.currentPassword}
                        onChange={handleSecurityChange}
                    />
                    <InputField
                        label="Nouveau mot de passe"
                        name="newPassword"
                        type="password"
                        value={securityForm.newPassword}
                        onChange={handleSecurityChange}
                    />
                    <InputField
                        label="Confirmer le nouveau mot de passe"
                        name="confirmPassword"
                        type="password"
                        value={securityForm.confirmPassword}
                        onChange={handleSecurityChange}
                    />
                    <div className="mt-4">
                        <Button onClick={handlePasswordChange}>Changer le mot de passe</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
