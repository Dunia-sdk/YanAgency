import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import authService from '../services/authService';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Alert from '../components/Alert';

const LANGUAGES = [
    { code: 'ar', label: 'العربية' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
];

const SettingsPage = () => {
    const { t, i18n } = useTranslation();
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
            setSecurityStatus({ type: 'error', message: t('errors.passwordMismatch') });
            return;
        }
        try {
            await authService.changePassword(securityForm.currentPassword, securityForm.newPassword);
            setSecurityStatus({ type: 'success', message: t('success.passwordChanged') });
            setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setSecurityStatus({ type: 'error', message: error.message });
        }
    };

    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>
            <div className="page-header">
                <div><h1 className="page-title">{t('settings.title')}</h1><p className="page-subtitle">{t('settings.subtitle')}</p></div>
            </div>

            <div className="flex flex-col gap-6" style={{ maxWidth: 620 }}>
                {/* Mode d'affichage */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <p className="section-title">{t('settings.displayMode')}</p>
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
                            {t('settings.morningMode')}
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
                            {t('settings.nightMode')}
                        </Button>
                    </div>
                </div>

                {/* Choix de la langue */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <p className="section-title">{t('settings.language')}</p>
                    <div className="flex gap-4">
                        {LANGUAGES.map(({ code, label }) => (
                            <Button
                                key={code}
                                onClick={() => i18n.changeLanguage(code)}
                                style={{
                                    flex: 1,
                                    background: i18n.language === code ? 'var(--primary)' : 'var(--surface)',
                                    color: i18n.language === code ? 'white' : 'var(--text-main)',
                                    border: `1px solid ${i18n.language === code ? 'transparent' : 'var(--border)'}`
                                }}
                            >
                                {label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Informations générales */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <p className="section-title">{t('settings.generalInfo')}</p>
                    {saved && <Alert type="success" message={t('success.settingsSaved')} />}
                    <InputField label={t('settings.agencyName')} name="agencyName" value={form.agencyName} onChange={handleChange} />
                    <InputField label={t('settings.contactEmail')} name="email" type="email" value={form.email} onChange={handleChange} />
                    <InputField label={t('settings.phone')} name="phone" value={form.phone} onChange={handleChange} />
                    <InputField label={t('settings.address')} name="address" value={form.address} onChange={handleChange} />
                    <div className="mt-4">
                        <Button onClick={handleSave}>{t('settings.saveBtn')}</Button>
                    </div>
                </div>

                {/* Sécurité */}
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <p className="section-title">{t('settings.security')}</p>
                    {securityStatus.message && (
                        <Alert
                            type={securityStatus.type}
                            message={securityStatus.message}
                            onClose={() => setSecurityStatus({ type: '', message: '' })}
                        />
                    )}
                    <InputField
                        label={t('settings.currentPassword')}
                        name="currentPassword"
                        type="password"
                        value={securityForm.currentPassword}
                        onChange={handleSecurityChange}
                    />
                    <InputField
                        label={t('settings.newPassword')}
                        name="newPassword"
                        type="password"
                        value={securityForm.newPassword}
                        onChange={handleSecurityChange}
                    />
                    <InputField
                        label={t('settings.confirmNewPassword')}
                        name="confirmNewPassword"
                        type="password"
                        value={securityForm.confirmPassword}
                        onChange={handleSecurityChange}
                    />
                    <div className="mt-4">
                        <Button onClick={handlePasswordChange}>{t('settings.changePasswordBtn')}</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
