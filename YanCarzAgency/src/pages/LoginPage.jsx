import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Alert from '../components/Alert';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError('Veuillez remplir tous les champs');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Veuillez entrer une adresse email valide');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setError('');

        try {
            await login(formData.email, formData.password);
            // Redirection is handled by caller or here
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Échec de la connexion');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="glass-panel auth-container">
                <div className="logo-container">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.5-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                        <circle cx="7" cy="17" r="2" />
                        <path d="M9 17h6" />
                        <circle cx="17" cy="17" r="2" />
                    </svg>
                    <span className="logo-text">YanCarz</span>
                </div>

                <div className="text-center mb-6">
                    <h2 className="mb-2">Welcome Back</h2>
                    <p>Log in to your agency space</p>
                </div>

                <Alert type="error" message={error} />

                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@yancarz.com"
                        required
                    />
                    <InputField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />

                    <div className="flex justify-between items-center mb-6 mt-2">
                        <label className="flex items-center gap-2" style={{ fontSize: '0.875rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <input type="checkbox" style={{ accentColor: 'var(--primary)', cursor: 'pointer' }} />
                            Remember me
                        </label>
                        <a href="#" className="font-500" style={{ fontSize: '0.875rem' }}>Forgot password?</a>
                    </div>

                    <Button type="submit" fullWidth isLoading={loading}>
                        Log in
                    </Button>
                </form>

                <div className="text-center mt-6">
                    <p style={{ fontSize: '0.875rem' }}>
                        Don't have an account?{' '}
                        <Link to="/signup">Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
