import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Alert from '../components/Alert';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear specific field error when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (globalError) setGlobalError('');
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            errors.name = 'Le nom est requis';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            errors.email = 'L\'email est requis';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            errors.email = 'Format d\'email invalide';
            isValid = false;
        }

        if (!formData.password) {
            errors.password = 'Le mot de passe est requis';
            isValid = false;
        } else if (formData.password.length < 8) {
            errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Les mots de passe ne correspondent pas';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        setGlobalError('');

        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setGlobalError(err.message || 'Échec de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="glass-panel auth-container">
                <div className="logo-container" style={{ marginBottom: '1.5rem' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.5-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <path d="M9 17h6" />
                        <circle cx="17" cy="17" r="2" />
                    </svg>
                    <span className="logo-text" style={{ fontSize: '1.5rem' }}>YanCarz</span>
                </div>

                <div className="text-center mb-6">
                    <h2 className="mb-2">Créer un compte</h2>
                    <p>Rejoignez YanCarz pour gérer votre agence</p>
                </div>

                <Alert type="error" message={globalError} />

                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Nom complet d'agence"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Auto Monaco"
                        error={formErrors.name}
                        required
                    />
                    <InputField
                        label="Adresse Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="nom@yancarz.com"
                        error={formErrors.email}
                        required
                    />
                    <InputField
                        label="Mot de passe"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Mini. 8 caractères"
                        error={formErrors.password}
                        required
                    />
                    <InputField
                        label="Confirmer le mot de passe"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Répétez le mot de passe"
                        error={formErrors.confirmPassword}
                        required
                    />

                    <div className="mt-6 mb-4">
                        <Button type="submit" fullWidth isLoading={loading}>
                            S'inscrire
                        </Button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p style={{ fontSize: '0.875rem' }}>
                        Vous avez déjà un compte ?{' '}
                        <Link to="/login">Se connecter</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
