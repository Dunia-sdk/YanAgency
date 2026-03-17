import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Car, Fuel, Settings, Calendar, Shield, MapPin, Tag, CheckCircle2, AlertCircle, Sparkles, ChevronRight, Info, Zap, Gauge, Star } from 'lucide-react';
import Button from '../components/Button';
import { getVehicleById, mapApiToUi } from '../services/vehicleService';

const VehicleDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVehicle = async () => {
            setLoading(true);
            try {
                const data = await getVehicleById(id);
                setVehicle(mapApiToUi(data));
            } catch (err) {
                console.error('Failed to fetch vehicle:', err);
                setError(t('errors.fetchFailed') || 'Impossible de charger les détails du véhicule');
            } finally {
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [id, t]);

    const reservationCount = vehicle?.nbReservation ?? '0';

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-muted">{t('loading') || 'Chargement...'}</p>
            </div>
        );
    }

    if (error || !vehicle) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="p-4 bg-error-bg text-error rounded-full mb-4">
                    <AlertCircle size={32} />
                </div>
                <p className="text-muted mb-4 font-700 uppercase tracking-widest text-xs">{error || t('vehicleDetails.notFound')}</p>
                <Button onClick={() => navigate('/vehicles')}>{t('vehicleDetails.backToFleet')}</Button>
            </div>
        );
    }

    return (
        <div className="pb-12 space-y-8 animate-[slideUpFade_0.5s_ease-out]">
            {/* 1. Enhanced Header with Breadcrumbs */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-8 rounded-[24px] shadow-sm border border-border/">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/vehicles')}
                        className="group flex items-center justify-center w-12 h-12 rounded-full bg-accent hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-800 text-primary uppercase tracking-[0.2em] mb-2 px-3 py-1 bg-primary/5 rounded-full w-fit">
                            <Sparkles size={10} fill="currentColor" />
                            <span>{t('vehicleDetails.fleet')}</span>
                            <ChevronRight size={10} className="text-muted" />
                            <span>{vehicle.category}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-900 text-main tracking-tight uppercase">
                            {vehicle.brand} <span className="text-primary">{vehicle.model}</span>
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-800 text-xs uppercase tracking-widest shadow-sm ${vehicle.status === 'available' ? 'bg-success/10 text-success border border-success/20' :
                        vehicle.status === 'rented' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                        <div className={`w-2 h-2 rounded-full ${vehicle.status === 'available' ? 'bg-success' : vehicle.status === 'rented' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                        {vehicle.status === 'available' ? t('vehicleDetails.statusAvailableDetail') : vehicle.status === 'rented' ? t('vehicleDetails.statusRentedDetail') : t('vehicleDetails.statusMaintenanceDetail')}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 2. Left Column: Feature Cards & Config Details (8 Columns) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Features Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: <Gauge size={24} />, label: t('vehicleDetails.mileage'), value: `${vehicle.mileage?.toLocaleString()} KM`, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { icon: <Fuel size={24} />, label: t('vehicleDetails.fuel'), value: vehicle.fuel, color: 'text-amber-600', bg: 'bg-amber-50' },
                            { icon: <Settings size={24} />, label: t('vehicleDetails.transmission'), value: vehicle.transmission || 'Auto', color: 'text-purple-600', bg: 'bg-purple-50' },
                            { icon: <Zap size={24} />, label: t('vehicleDetails.category'), value: vehicle.category, color: 'text-primary', bg: 'bg-primary/5' }
                        ].map((spec, i) => (
                            <div key={i} className={`glass-panel p-6 flex flex-col items-center text-center gap-3 hover:shadow-lg transition-all border-none ${spec.bg}`}>
                                <div className={`${spec.color} p-3 rounded-2xl bg-white shadow-inner`}>
                                     {spec.icon}
                                </div>
                                <div>
                                    <p className="text-[9px] uppercase font-800 text-muted tracking-widest mb-1">{spec.label}</p>
                                    <p className="text-sm font-900 text-main tracking-tight uppercase">{spec.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Configuration Table-like List */}
                    <div className="glass-panel p-10 space-y-8">
                        <div className="flex items-center justify-between border-b border-border pb-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/5 text-primary rounded-2xl">
                                    <Info size={24} />
                                </div>
                                <h3 className="text-xl font-900 uppercase tracking-tighter text-main">{t('vehicleDetails.configDetails')}</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {[
                                { label: t('vehicleDetails.plateNumber') || 'Plaque d\'immatriculation', value: vehicle.plateNumber || '---' },
                                { label: t('vehicleDetails.color') || 'Couleur', value: vehicle.color || '---' },
                                { label: t('vehicleDetails.seats'), value: vehicle.seats || 5 },
                                { label: t('vehicleDetails.yearOfCirculation'), value: vehicle.year },
                                { label: t('vehicleDetails.category'), value: vehicle.category },
                                { label: t('vehicleDetails.price'), value: `${vehicle.price} ${t('vehicleDetails.currency')}` }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-accent">
                                    <span className="text-[10px] font-800 text-muted uppercase tracking-widest">{item.label}</span>
                                    <span className="text-sm font-700 text-main">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Right Column: Sidebars (4 Columns) */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Status & Quick Actions Card */}
                    <div className="glass-panel p-8 bg-main text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 translate-x-10 -translate-y-10">
                            <Zap size={150} />
                        </div>
                        <div className="relative z-10 flex flex-col gap-8">
                            <div>
                                <h3 className="text-lg font-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Star size={20} className="text-primary" fill="currentColor" /> {t('vehicleDetails.premiumStatus')}
                                </h3>
                                <p className="text-black/60 text-xs font-500 leading-relaxed">
                                    {t('vehicleDetails.premiumDesc')}
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Button className="w-full h-14 bg-primary text-white font-900 uppercase tracking-[0.2em] shadow-lg border-none hover:bg-primary-hover">
                                    {t('vehicleDetails.createReservation')}
                                </Button>
                                <Button variant="outline" className="w-full h-14 border-white/20 text-white font-800 uppercase tracking-[0.2em] hover:bg-white/10">
                                    {t('vehicleDetails.editDetails')}
                                </Button>
                            </div>

                            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                <div className="text-center">
                                    <p className="text-[10px] font-800 uppercase tracking-widest text-black/40 mb-1">{t('vehicleDetails.mileage')}</p>
                                    <p className="text-lg font-900 tracking-tight">{vehicle.mileage?.toLocaleString()} KM</p>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="text-center">
                                    <p className="text-[10px] font-800 uppercase tracking-widest text-black/40 mb-1">{t('vehicleDetails.lastClient')}</p>
                                    <p className="text-lg font-900 tracking-tight">---</p>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="text-center">
                                    <p className="text-[10px] font-800 uppercase tracking-widest text-black/40 mb-1">{t('vehicleDetails.reservations')}</p>
                                    <p className="text-lg font-900 tracking-tight">
                                        {reservationCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inclusion & Safety Card */}
                    <div className="glass-panel p-8 space-y-8">
                        <h3 className="text-sm font-900 uppercase tracking-[0.2em] text-muted border-b border-border pb-4 flex items-center gap-2">
                            <Shield size={16} className="text-primary" /> {t('vehicleDetails.safetyServices')}
                        </h3>
                        <div className="space-y-6">
                            {[
                                { title: t('vehicleDetails.insurance'), desc: t('vehicleDetails.insuranceDesc'), icon: <CheckCircle2 className="text-success" /> },
                                { title: t('vehicleDetails.assistance'), desc: t('vehicleDetails.assistanceDesc'), icon: <CheckCircle2 className="text-success" /> },
                                { title: t('vehicleDetails.cleaning'), desc: t('vehicleDetails.cleaningDesc'), icon: <CheckCircle2 className="text-success" /> },
                                { title: t('vehicleDetails.wifi'), desc: t('vehicleDetails.wifiDesc'), icon: <CheckCircle2 className="text-success" /> }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="mt-1">{item.icon}</div>
                                    <div>
                                        <p className="text-sm font-800 text-main tracking-tight uppercase leading-none mb-1">{item.title}</p>
                                        <p className="text-[10px] text-muted font-500 uppercase">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-5 bg-accent rounded-[20px] border border-border/50 text-center">
                            <p className="text-[10px] font-800 text-muted uppercase tracking-widest mb-1">{t('vehicleDetails.currentLocation')}</p>
                            <div className="flex items-center justify-center gap-2 text-main font-900">
                                <MapPin size={14} className="text-primary" /> {t('vehicleDetails.agencyLocation')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailPage;
