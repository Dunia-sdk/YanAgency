import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, Fuel, Settings, Calendar, Shield, MapPin, Tag, CheckCircle2, AlertCircle, Sparkles, ChevronRight, Info, Zap, Gauge, Star } from 'lucide-react';
import Button from '../components/Button';
import { vehicles } from '../services/mockData';

const VehicleDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const vehicle = vehicles.find(v => v.id === parseInt(id));

    if (!vehicle) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="p-4 bg-error-bg text-error rounded-full mb-4">
                    <AlertCircle size={32} />
                </div>
                <p className="text-muted mb-4 font-700 uppercase tracking-widest text-xs">Véhicule Introuvable</p>
                <Button onClick={() => navigate('/vehicles')}>Retour à la flotte</Button>
            </div>
        );
    }

    return (
        <div className="pb-12 space-y-8 animate-[slideUpFade_0.5s_ease-out]">
            {/* 1. Enhanced Header with Breadcrumbs */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white p-8 rounded-[24px] shadow-sm border border-border/50">
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
                            <span>Flotte Véhicules</span>
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
                        {vehicle.status === 'available' ? 'Disponible Immédiatement' : vehicle.status === 'rented' ? 'En Location' : 'En Maintenance'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 2. Left Column: Image & Feature Cards (7 Columns) */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Hero Image Card */}
                    <div className="glass-panel overflow-hidden group shadow-xl">
                        <div className="relative h-[480px]">
                            <img
                                src={vehicle.image}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                            <div className="absolute bottom-8 left-8 text-white">
                                <p className="text-[10px] font-900 uppercase tracking-[0.3em] mb-2 opacity-80">Design & Performance</p>
                                <h2 className="text-4xl font-900 tracking-tighter uppercase">{vehicle.brand} {vehicle.model} <span className="text-primary-light">Edition 2023</span></h2>
                            </div>
                            <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-[20px] shadow-2xl border border-white/50 text-center flex flex-col items-center">
                                <span className="text-[10px] font-800 text-muted uppercase tracking-widest mb-1">Prix Journalier</span>
                                <p className="text-3xl font-900 text-primary tracking-tighter">{vehicle.price} <span className="text-xs">MAD</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: <Gauge size={24} />, label: 'Kilométrage', value: `${vehicle.mileage.toLocaleString()} KM`, color: 'text-blue-600', bg: 'bg-blue-50' },
                            { icon: <Fuel size={24} />, label: 'Carburant', value: vehicle.fuel, color: 'text-amber-600', bg: 'bg-amber-50' },
                            { icon: <Settings size={24} />, label: 'Boîte', value: vehicle.transmission, color: 'text-purple-600', bg: 'bg-purple-50' },
                            { icon: <Zap size={24} />, label: 'Catégorie', value: vehicle.category, color: 'text-primary', bg: 'bg-primary/5' }
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
                                <h3 className="text-xl font-900 uppercase tracking-tighter text-main">Détails de Configuration</h3>
                            </div>
                            <Button variant="outline" size="sm" className="font-800 text-[10px] tracking-widest">RAPPORT TECHNIQUE</Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                            {[
                                { label: 'Nombre de Portes', value: '5 Portes' },
                                { label: 'Places Assises', value: '5 Adultes' },
                                { label: 'Volume Coffre', value: '380 Litres' },
                                { label: 'Motorisation', value: '1.6 L Turbo' },
                                { label: 'Année de Mise en Circulation', value: '2023' },
                                { label: 'Dernière Révision', value: 'Mars 2024' }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-accent">
                                    <span className="text-[10px] font-800 text-muted uppercase tracking-widest">{item.label}</span>
                                    <span className="text-sm font-700 text-main">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Right Column: Sidebars (5 Columns) */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Status & Quick Actions Card */}
                    <div className="glass-panel p-8 bg-main text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 translate-x-10 -translate-y-10">
                            <Zap size={150} />
                        </div>
                        <div className="relative z-10 flex flex-col gap-8">
                            <div>
                                <h3 className="text-lg font-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Star size={20} className="text-primary" fill="currentColor" /> Premium Status
                                </h3>
                                <p className="text-white/60 text-xs font-500 leading-relaxed">
                                    Ce véhicule appartient à notre gamme supérieure. Disponible pour des locations de courte et longue durée.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Button className="w-full h-14 bg-primary text-white font-900 uppercase tracking-[0.2em] shadow-lg border-none hover:bg-primary-hover">
                                    CRÉER UNE RÉSERVATION
                                </Button>
                                <Button variant="outline" className="w-full h-14 border-white/20 text-white font-800 uppercase tracking-[0.2em] hover:bg-white/10">
                                    MODIFIER LES DÉTAILS
                                </Button>
                            </div>

                            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                <div className="text-center">
                                    <p className="text-[10px] font-800 uppercase tracking-widest text-white/40 mb-1">Km Initial</p>
                                    <p className="text-lg font-900 tracking-tight">{vehicle.mileage - 200}</p>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="text-center">
                                    <p className="text-[10px] font-800 uppercase tracking-widest text-white/40 mb-1">Dernier Client</p>
                                    <p className="text-lg font-900 tracking-tight">Marché J.</p>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="text-center">
                                    <p className="text-[10px] font-800 uppercase tracking-widest text-white/40 mb-1">Contrats</p>
                                    <p className="text-lg font-900 tracking-tight">12</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inclusion & Safety Card */}
                    <div className="glass-panel p-8 space-y-8">
                        <h3 className="text-sm font-900 uppercase tracking-[0.2em] text-muted border-b border-border pb-4 flex items-center gap-2">
                            <Shield size={16} className="text-primary" /> Sécurité & Services
                        </h3>
                        <div className="space-y-6">
                            {[
                                { title: 'Assurance Tous Risques', desc: 'Franchise réduite incluse', icon: <CheckCircle2 className="text-success" /> },
                                { title: 'Assistance 24/7', desc: 'Dépannage partout au Maroc', icon: <CheckCircle2 className="text-success" /> },
                                { title: 'Nettoyage Premium', desc: 'Effectué après chaque location', icon: <CheckCircle2 className="text-success" /> },
                                { title: 'Wifi Embarqué', desc: 'Connexion 4G illimitée', icon: <CheckCircle2 className="text-success" /> }
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
                            <p className="text-[10px] font-800 text-muted uppercase tracking-widest mb-1">Localisation Actuelle</p>
                            <div className="flex items-center justify-center gap-2 text-main font-900">
                                <MapPin size={14} className="text-primary" /> Agence Casablanca Anfa
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailPage;
