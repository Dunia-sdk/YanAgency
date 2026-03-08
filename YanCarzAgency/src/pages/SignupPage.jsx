import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import Button from '../components/Button';
import Alert from '../components/Alert';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        city: '',
        phone: '',
        firstName: '',
        lastName: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const moroccanCities = [
        { value: '', label: 'Select a city', disabled: true },
        { value: 'Agadir', label: 'Agadir' },
        { value: 'Beni-Mellal', label: 'Beni-Mellal' },
        { value: 'Casablanca', label: 'Casablanca' },
        { value: 'Chefchaouen', label: 'Chefchaouen' },
        { value: 'Essaouira', label: 'Essaouira' },
        { value: 'Fès', label: 'Fès' },
        { value: 'Ksar-el-Kébir', label: 'Ksar-el-Kébir' },
        { value: 'Marrakech', label: 'Marrakech' },
        { value: 'Meknès', label: 'Meknès' },
        { value: 'Ouarzazate', label: 'Ouarzazate' },
        { value: 'Rabat', label: 'Rabat' },
        { value: 'Safi', label: 'Safi' },
        { value: 'Salé', label: 'Salé' },
        { value: 'Tanger', label: 'Tanger' },
        { value: 'Taza', label: 'Taza' },
        { value: 'Témara', label: 'Témara' }
    ];

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

        if (!formData.city) {
            errors.city = 'La ville est requise';
            isValid = false;
        }

        const phoneRegex = /^(06|07|05)\d{8}$/;
        if (!formData.phone) {
            errors.phone = 'Le numéro de téléphone est requis';
            isValid = false;
        } else if (!phoneRegex.test(formData.phone)) {
            errors.phone = 'Format de numéro de téléphone invalide';
            isValid = false;
        }

        if (!formData.firstName.trim()) {
            errors.firstName = 'First name is required';
            isValid = false;
        }

        if (!formData.lastName.trim()) {
            errors.lastName = 'Last name is required';
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
            // Pass the entire formData object to the register function
            // AuthContext.register expects one argument (userData/formData)
            await register(formData);
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
                    <h2 className="mb-2">Create an account</h2>
                    <p>Join YanCarz to manage your agency</p>
                </div>

                <Alert type="error" message={globalError} />

                <form onSubmit={handleSubmit}>
                    <InputField
                        label="Agency Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Auto Monaco"
                        error={formErrors.name}
                        required
                    />
                    <InputField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@yancarz.com"
                        error={formErrors.email}
                        required
                    />
                    <SelectField
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        options={moroccanCities}
                        error={formErrors.city}
                        required
                    />
                    <InputField
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="06XXXXXXXX"
                        error={formErrors.phone}
                        required
                    />
                    <div className="flex gap-4">
                        <InputField
                            label="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            error={formErrors.firstName}
                            required
                        />
                        <InputField
                            label="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            error={formErrors.lastName}
                            required
                        />
                    </div>
                    <InputField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min. 8 characters"
                        error={formErrors.password}
                        required
                    />
                    <InputField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat password"
                        error={formErrors.confirmPassword}
                        required
                    />

                    <div className="mt-6 mb-4">
                        <Button type="submit" fullWidth isLoading={loading}>
                            Sign Up
                        </Button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p style={{ fontSize: '0.875rem' }}>
                        Already have an account?{' '}
                        <Link to="/login">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
