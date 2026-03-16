import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import Button from '../components/Button';
import Alert from '../components/Alert';
import LanguageSwitcher from '../components/LanguageSwitcher';
import api from '../services/api';
import authService from '../services/authService';
// Removed static mockCities import

const SignupPage = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        idCity: '',
        phone: '',
        firstName: '',
        lastName: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState([]);
    const [citiesLoading, setCitiesLoading] = useState(true);
    const { register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await api.get('/shared/City');
                const cityOptions = [
                    { value: '', label: t('selectCity'), disabled: true },
                    ...res.data.map(c => ({ value: c.id, label: c.name }))
                ];
                setCities(cityOptions);
            } catch (err) {
                console.error('API failed to load cities:', err);
                setCities([{ value: '', label: t('errors.cityRequired'), disabled: true }]);
            } finally {
                setCitiesLoading(false);
            }
        };
        fetchCities();
    }, [t]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (globalError) setGlobalError('');
    };

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        if (!formData.name.trim()) {
            errors.name = t('errors.nameRequired');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            errors.email = t('errors.emailRequired');
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            errors.email = t('errors.emailInvalid');
            isValid = false;
        }

        if (!formData.idCity) {
            errors.idCity = t('errors.cityRequired');
            isValid = false;
        }

        const phoneRegex = /^(06|07|05)\d{8}$/;
        if (!formData.phone) {
            errors.phone = t('errors.phoneRequired');
            isValid = false;
        } else if (!phoneRegex.test(formData.phone)) {
            errors.phone = t('errors.phoneInvalid');
            isValid = false;
        }

        if (!formData.firstName.trim()) {
            errors.firstName = t('errors.firstNameRequired');
            isValid = false;
        }

        if (!formData.lastName.trim()) {
            errors.lastName = t('errors.lastNameRequired');
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
            await register(formData);

            try {
                await authService.sendWelcomeEmail(formData.email, formData.firstName);
            } catch (emailErr) {
                console.error("Failed to send welcome email", emailErr);
            }

            navigate('/dashboard', { state: { newSignup: true } });
        } catch (err) {
            setGlobalError(err.message || t('errors.signupFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="glass-panel auth-container" style={{ position: 'relative' }}>
                {/* Language Switcher — top end corner (flips in RTL) */}
                <div className="auth-lang-switcher">
                    <LanguageSwitcher />
                </div>

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
                    <h2 className="mb-2">{t('createAccount')}</h2>
                    <p>{t('joinYanCarz')}</p>
                </div>

                <Alert type="error" message={globalError} />

                <form onSubmit={handleSubmit}>
                    <InputField
                        label={t('agencyName')}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Auto Monaco"
                        error={formErrors.name}
                        required
                    />
                    <InputField
                        label={t('email')}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@yancarz.com"
                        error={formErrors.email}
                        required
                    />
                    <SelectField
                        label={t('city')}
                        name="idCity"
                        value={formData.idCity}
                        onChange={handleChange}
                        options={citiesLoading ? [{ value: '', label: t('loadingCities'), disabled: true }] : cities}
                        error={formErrors.idCity}
                        required
                    />
                    <InputField
                        label={t('phoneNumber')}
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
                            label={t('firstName')}
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder={t('firstName')}
                            error={formErrors.firstName}
                            required
                        />
                        <InputField
                            label={t('lastName')}
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder={t('lastName')}
                            error={formErrors.lastName}
                            required
                        />
                    </div>

                    <div className="mt-6 mb-4">
                        <Button type="submit" fullWidth isLoading={loading}>
                            {t('signUp')}
                        </Button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p style={{ fontSize: '0.875rem' }}>
                        {t('alreadyAccount')}{' '}
                        <Link to="/login">{t('login')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
