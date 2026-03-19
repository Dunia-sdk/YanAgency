import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import InputField from './InputField';
import SelectField from './SelectField';
import Button from './Button';
import { createBooking } from '../services/bookingService';
import { getDevises, getPlaces } from '../services/sharedService';
import { useNavigate } from 'react-router-dom';

const CreateReservationModal = ({ isOpen, onClose, vehicleId, vehiclePrice }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [places, setPlaces] = useState([]);
    const [devises, setDevises] = useState([]);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        eMail: '',
        nbrPhone: '',
        startDate: '',
        endDate: '',
        startTime: '09:00',
        endTime: '18:00',
        pickupPlaceId: '',
        returnPlaceId: '',
        deviseId: ''
    });

    useEffect(() => {
        if (isOpen) {
            const fetchSharedData = async () => {
                const results = await Promise.allSettled([
                    getPlaces(),
                    getDevises()
                ]);
                
                const fetchedPlaces = (results[0].status === 'fulfilled' && Array.isArray(results[0].value)) ? results[0].value : [];
                const fetchedDevises = (results[1].status === 'fulfilled' && Array.isArray(results[1].value)) ? results[1].value : [];

                if (results[0].status === 'rejected') {
                    console.error('Failed to fetch places (check trailing slashes):', results[0].reason);
                }
                if (results[1].status === 'rejected') {
                    console.error('Failed to fetch devises (currently error 500):', results[1].reason);
                }

                if (fetchedPlaces.length > 0) {
                    setPlaces(fetchedPlaces);
                    setFormData(prev => ({ 
                        ...prev, 
                        pickupPlaceId: fetchedPlaces[0].id,
                        returnPlaceId: fetchedPlaces[0].id
                    }));
                }
                if (fetchedDevises.length > 0) {
                    setDevises(fetchedDevises);
                    setFormData(prev => ({ ...prev, deviseId: fetchedDevises[0].id }));
                }
            };
            fetchSharedData();
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Combine date and time
            const startDateTime = new Date(`${formData.startDate}T${formData.startTime}:00`).toISOString();
            const endDateTime = new Date(`${formData.endDate}T${formData.endTime}:00`).toISOString();

            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                eMail: formData.eMail,
                nbrPhone: formData.nbrPhone,
                agencyCarId: vehicleId,
                startDate: startDateTime,
                endDate: endDateTime,
                pickupPlaceId: formData.pickupPlaceId,
                returnPlaceId: formData.returnPlaceId,
                pricePerDay: vehiclePrice || 0,
                deviseId: formData.deviseId
            };

            await createBooking(payload);
            setLoading(false);
            onClose();
            navigate('/reservations');
            // Assuming the app uses a global notification system or standard alerts
            // alert('Réservation créée avec succès!');
        } catch (err) {
            console.error('Failed to create reservation:', err);
            setError(err.message || 'Erreur lors de la création de la réservation');
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Créer une réservation" size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
                        {error}
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Prénom"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="Jean"
                    />
                    <InputField
                        label="Nom"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Dupont"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Email"
                        type="email"
                        name="eMail"
                        value={formData.eMail}
                        onChange={handleChange}
                        required
                        placeholder="jean.dupont@email.com"
                    />
                    <InputField
                        label="Téléphone"
                        name="nbrPhone"
                        type="tel"
                        value={formData.nbrPhone}
                        onChange={handleChange}
                        required
                        placeholder="+33 6 12 34 56 78"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Date de début"
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Heure de début"
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                        label="Date de fin"
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Heure de fin"
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                        label="Lieu de prise en charge"
                        name="pickupPlaceId"
                        value={formData.pickupPlaceId}
                        onChange={handleChange}
                        options={places.map(p => ({ label: p.name || 'Agence', value: p.id }))}
                        required
                        disabled={places.length === 0}
                    />
                    <SelectField
                        label="Lieu de restitution"
                        name="returnPlaceId"
                        value={formData.returnPlaceId}
                        onChange={handleChange}
                        options={places.map(p => ({ label: p.name || 'Agence', value: p.id }))}
                        required
                        disabled={places.length === 0}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectField
                        label="Devise"
                        name="deviseId"
                        value={formData.deviseId}
                        onChange={handleChange}
                        options={devises.map(d => ({ label: d.label || d.name || d.code || 'Devise', value: d.id }))}
                        required
                        disabled={devises.length === 0}
                    />
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
                    <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                        Annuler
                    </Button>
                    <Button type="submit" disabled={loading} className="min-w-[120px]">
                        {loading ? 'Création...' : 'Confirmer'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateReservationModal;
