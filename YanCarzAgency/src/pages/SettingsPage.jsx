import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Alert from '../components/Alert';

const SettingsPage = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({ agencyName: 'YanCarz Agency', email: user?.email || '', phone: '+33 1 23 45 67 89', address: 'Paris, France' });
    const [saved, setSaved] = useState(false);
    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

    return (
        <div style={{ animation: 'slideUpFade 0.4s ease' }}>
            <div className="page-header">
                <div><h1 className="page-title">Paramètres de l'Agence</h1><p className="page-subtitle">Configurez les informations de votre agence</p></div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', maxWidth: 620 }}>
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
        </div>
    );
};

export default SettingsPage;
