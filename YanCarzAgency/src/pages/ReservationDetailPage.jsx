import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Car, Tag, MapPin, Receipt, Clock, CheckCircle2, XCircle, AlertCircle, Sparkles, CreditCard, ShieldCheck, Download, History, Zap, ChevronRight, Star, ExternalLink, Printer } from 'lucide-react';
import Button from '../components/Button';
import { reservations } from '../services/mockData';

const STATUS_LABELS = {
    pending: 'En attente',
    confirmed: 'Confirmé',
    completed: 'Terminé',
    cancelled: 'Annulé'
};

const STATUS_THEMES = {
    pending: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: <Clock size={16} /> },
    confirmed: { color: 'text-success', bg: 'bg-success/10', border: 'border-success/20', icon: <CheckCircle2 size={16} /> },
    completed: { color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: <CheckCircle2 size={16} /> },
    cancelled: { color: 'text-error', bg: 'bg-error-bg', border: 'border-error/20', icon: <XCircle size={16} /> }
};

const ReservationDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const reservation = reservations.find(r => r.id === id);

    if (!reservation) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <AlertCircle size={48} className="text-muted mb-4 opacity-20" />
                <p className="text-muted mb-4 font-800 uppercase tracking-[0.2em] text-xs">Réservation Introuvable</p>
                <Button onClick={() => navigate('/reservations')}>Retour aux dossiers</Button>
            </div>
        );
    }

    const theme = STATUS_THEMES[reservation.status] || STATUS_THEMES.pending;
    const tax = reservation.total * 0.2;
    const basePrice = reservation.total - tax - 150;

    return (
        <div className="pb-12 space-y-8 animate-[slideUpFade_0.5s_ease-out]">
            {/* 1. Ultra-Modern Segmented Header */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-border/40">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/reservations')}
                        className="group flex items-center justify-center w-12 h-12 rounded-full bg-accent hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-900 text-primary uppercase tracking-[0.25em] mb-2 px-3 py-1 bg-primary/5 rounded-full w-fit">
                            <Zap size={10} fill="currentColor" />
                            <span>Système Central</span>
                            <ChevronRight size={10} />
                            <span>Contrat {reservation.id}</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-900 text-main tracking-tighter uppercase leading-none">
                            Dossier de <span className="text-primary-hover">Location</span>
                        </h1>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 border-t lg:border-t-0 pt-6 lg:pt-0 border-border/50">
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-900 text-xs uppercase tracking-[0.15em] shadow-sm ${theme.bg} ${theme.color} border ${theme.border}`}>
                        {theme.icon}
                        {STATUS_LABELS[reservation.status]}
                    </div>
                    <button className="p-3 bg-accent text-muted hover:text-primary rounded-xl transition-colors">
                        <Printer size={20} />
                    </button>
                    <button className="p-3 bg-accent text-muted hover:text-primary rounded-xl transition-colors">
                        <ExternalLink size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 2. Main Logic Column (8 Columns) */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    {/* Booking Timeline Center-Aligned with Visual Path */}
                    <div className="glass-panel p-12 flex flex-col items-center justify-center relative overflow-hidden group shadow-md border-primary/5">
                        <div className="absolute -top-12 -left-12 opacity-5 scale-150 rotate-45 group-hover:rotate-90 transition-transform duration-[2s]">
                            <Calendar size={200} />
                        </div>

                        <div className="w-full flex items-center gap-5 border-b border-border/50 pb-8 mb-12">
                            <div className="p-4 bg-primary text-white rounded-[24px] shadow-lg shadow-primary/20">
                                <Calendar size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-900 text-main uppercase tracking-tighter">Planning & Itinéraire</h3>
                                <p className="text-[10px] text-muted font-800 uppercase tracking-widest mt-1">Fenêtre de validité contractuelle</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center gap-10 md:gap-20 w-full relative z-10">
                            {/* Check-In */}
                            <div className="flex flex-col items-center text-center gap-6 group">
                                <p className="text-[11px] uppercase font-900 text-muted tracking-[0.3em] opacity-60">Prise en Charge</p>
                                <div className="p-10 bg-accent/30 border border-border/60 rounded-[48px] min-w-[280px] shadow-sm group-hover:bg-white group-hover:shadow-2xl transition-all duration-500 border-dashed group-hover:border-solid group-hover:border-primary/20">
                                    <p className="text-4xl font-900 text-main tracking-tighter">{reservation.startDate}</p>
                                    <div className="mt-4 flex flex-col items-center gap-2">
                                        <p className="text-[11px] text-primary font-900 uppercase tracking-widest bg-primary/5 py-1.5 px-4 rounded-full border border-primary/10">09:00 • Agence Terminal</p>
                                        <p className="text-[9px] text-muted font-600 uppercase">Casablanca Anfa</p>
                                    </div>
                                </div>
                            </div>

                            {/* Center Connector */}
                            <div className="flex flex-col items-center gap-6 md:flex-1 relative">
                                <div className="w-16 h-16 bg-primary/5 text-primary rounded-[28px] border border-primary/20 flex items-center justify-center shadow-inner animate-pulse">
                                    <Clock size={32} />
                                </div>
                                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent relative hidden md:block">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 bg-white text-[10px] font-900 text-primary uppercase tracking-[0.2em] border border-primary/10 rounded-full py-2 shadow-sm whitespace-nowrap">
                                        Location: 5 Jours Complets
                                    </div>
                                </div>
                                <span className="md:hidden text-[10px] font-900 text-primary uppercase tracking-[0.2em] bg-primary/5 px-4 py-1.5 rounded-full">5 Jours d'exploitation</span>
                            </div>

                            {/* Check-Out */}
                            <div className="flex flex-col items-center text-center gap-6 group">
                                <p className="text-[11px] uppercase font-900 text-muted tracking-[0.3em] opacity-60">Restitution</p>
                                <div className="p-10 bg-accent/30 border border-border/60 rounded-[48px] min-w-[280px] shadow-sm group-hover:bg-white group-hover:shadow-2xl transition-all duration-500 border-dashed group-hover:border-solid group-hover:border-primary/20">
                                    <p className="text-4xl font-900 text-main tracking-tighter">{reservation.endDate}</p>
                                    <div className="mt-4 flex flex-col items-center gap-2">
                                        <p className="text-[11px] text-primary font-900 uppercase tracking-widest bg-primary/5 py-1.5 px-4 rounded-full border border-primary/10">18:00 • Agence Terminal</p>
                                        <p className="text-[9px] text-muted font-600 uppercase">Casablanca Anfa</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Entity Cards Centered & Professional */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Client Detail Card */}
                        <div className="glass-panel p-10 flex flex-col justify-between hover:border-primary/40 transition-all group cursor-default shadow-lg min-h-[440px] border-none bg-gradient-to-br from-white to-accent/20">
                            <div className="flex items-center gap-5 mb-12">
                                <div className="p-5 bg-white shadow-xl rounded-[24px] text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <User size={28} />
                                </div>
                                <div>
                                    <h3 className="font-900 text-main text-xl uppercase tracking-tighter">Locataire</h3>
                                    <p className="text-[10px] text-muted font-800 uppercase tracking-[0.2em]">Profile Accrédité</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-center mb-12 px-4 gap-6">
                                <div className="w-20 h-20 rounded-[24px] bg-primary text-white flex items-center justify-center text-3xl font-900 shadow-lg shadow-primary/20">
                                    {reservation.client.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-3xl font-900 text-main tracking-tight leading-none mb-3">{reservation.client}</p>
                                    <div className="flex items-center gap-3 text-sm font-700 text-muted">
                                        <MapPin size={16} className="text-primary" />
                                        <span>Casablanca, Maroc</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-5 py-2 bg-white rounded-2xl text-[10px] font-900 text-primary uppercase border border-primary/10 shadow-sm">
                                    <Star size={12} fill="currentColor" /> Membre Executive
                                </div>
                            </div>
                            <Button variant="outline" fullWidth className="h-14 font-900 tracking-[0.2em] uppercase text-[10px] border-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all" onClick={() => navigate('/clients')}>Consulter Archive</Button>
                        </div>

                        {/* Vehicle Detail Card */}
                        <div className="glass-panel p-10 flex flex-col justify-between hover:border-primary/40 transition-all group cursor-default shadow-lg min-h-[440px] border-none bg-gradient-to-br from-white to-accent/20">
                            <div className="flex items-center gap-5 mb-12">
                                <div className="p-5 bg-white shadow-xl rounded-[24px] text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <Car size={28} />
                                </div>
                                <div>
                                    <h3 className="font-900 text-main text-xl uppercase tracking-tighter">Équipement</h3>
                                    <p className="text-[10px] text-muted font-800 uppercase tracking-[0.2em]">Maintenance Validée</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-center mb-12 px-4 gap-6">
                                <div className="w-20 h-20 rounded-[24px] bg-main text-white flex items-center justify-center text-3xl font-900 shadow-lg">
                                    <Car size={32} />
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-3xl font-900 text-main tracking-tight leading-none mb-3">{reservation.vehicle}</p>
                                    <div className="flex items-center gap-3 text-sm font-700 text-muted">
                                        <Tag size={16} className="text-primary" />
                                        <span>Modèle Premium • Auto</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 px-5 py-2 bg-white rounded-2xl text-[10px] font-900 text-primary uppercase border border-primary/10 shadow-sm">
                                    <Zap size={12} fill="currentColor" /> Full Options • Diesel
                                </div>
                            </div>
                            <Button variant="outline" fullWidth className="h-14 font-900 tracking-[0.2em] uppercase text-[10px] border-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all" onClick={() => navigate('/vehicles')}>Données Techniques</Button>
                        </div>
                    </div>
                </div>

                {/* 3. Sidebar Container (4 Columns) */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    {/* Billing Details (Facturation) Professional Style */}
                    <div className="glass-panel p-10 relative overflow-hidden shadow-2xl border-none bg-main text-white">
                        <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 translate-x-10 -translate-y-10 scale-150">
                            <Receipt size={140} />
                        </div>
                        <h3 className="text-sm font-900 mb-12 flex items-center gap-3 text-white/80 uppercase tracking-[0.2em] relative z-10 border-b border-white/10 pb-6">
                            <CreditCard size={18} className="text-primary" /> Détails Financiers
                        </h3>

                        <div className="flex flex-col gap-8 relative z-10 mb-12">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center group/item">
                                    <span className="text-[10px] font-800 text-black/40 uppercase tracking-[0.15em]">Loyer Net (5 jrs)</span>
                                    <span className="text-base font-900 text-black group-hover/item:text-primary transition-colors tracking-tight">{basePrice.toLocaleString()} MAD</span>
                                </div>
                                <div className="flex justify-between items-center group/item">
                                    <span className="text-[10px] font-800 text-black/40 uppercase tracking-[0.15em]">Assurance Premium</span>
                                    <span className="text-base font-900 text-black group-hover/item:text-primary transition-colors tracking-tight">150.00 MAD</span>
                                </div>
                                <div className="flex justify-between items-center group/item">
                                    <span className="text-[10px] font-800 text-black/40 uppercase tracking-[0.15em]">TVA Indirecte (20%)</span>
                                    <span className="text-base font-900 text-black group-hover/item:text-primary transition-colors tracking-tight">{tax.toLocaleString()} MAD</span>
                                </div>
                            </div>

                            <div className="h-px bg-white/10 my-2"></div>

                            <div className="flex items-center justify-between bg-white/5 p-6 rounded-[24px] border border-white/10 shadow-inner">
                                <div className="flex flex-col">
                                    <p className="text-[10px] text-white/40 uppercase font-900 tracking-[0.3em] mb-2">Total Dossier</p>
                                    <p className="text-4xl font-900 text-primary tracking-tighter leading-none">{reservation.total.toLocaleString()} <span className="text-xs uppercase font-800 opacity-60">MAD</span></p>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-success/20 text-success rounded-xl border border-success/30 shadow-lg">
                                    <ShieldCheck size={14} fill="currentColor" fillOpacity={0.2} />
                                    <span className="text-[10px] font-900 tracking-tighter uppercase leading-none">SOLDE OK</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto flex flex-col gap-4 relative z-10">
                            <Button fullWidth className="h-16 bg-primary font-900 tracking-[0.25em] text-[11px] uppercase shadow-lg border-none hover:bg-primary-hover hover:scale-[1.02] transition-all">
                                <Download size={20} className="mr-3" /> GÉNÉRER FACTURE
                            </Button>
                            <div className="text-center text-[10px] text-white/30 font-800 uppercase tracking-widest bg-white/5 py-4 rounded-2xl">
                                ÉDITION: {new Date().toLocaleDateString()} • REF: {reservation.id}
                            </div>
                        </div>
                    </div>

                    {/* Timeline Sidebar Uniform Layout */}
                    <div className="glass-panel p-10 flex flex-col shadow-xl border-none">
                        <h3 className="text-[11px] font-900 mb-10 flex items-center gap-3 uppercase tracking-[0.2em] text-muted border-b border-border pb-8">
                            <History size={20} className="text-primary" /> Journal d'Exploitation
                        </h3>

                        <div className="flex flex-col gap-12 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary/50 before:via-border/50 before:to-transparent">
                            <div className="flex gap-6 relative group">
                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-xl group-hover:scale-125 transition-transform">
                                    <CheckCircle2 size={10} className="text-white" />
                                </div>
                                <div className="flex flex-col gap-1.5 pt-0.5">
                                    <p className="text-xs font-900 text-main uppercase tracking-tight">Status: {STATUS_LABELS[reservation.status]}</p>
                                    <p className="text-[10px] text-muted/70 font-600 italic leading-relaxed">Validation administrative complétée. Dossier archivé.</p>
                                    <p className="text-[9px] text-primary font-900 uppercase tracking-[0.2em] mt-2 bg-primary/5 w-fit px-3 py-1 rounded-full">Aujourd'hui, 14:30</p>
                                </div>
                            </div>

                            <div className="flex gap-6 relative group opacity-50 hover:opacity-100 transition-opacity duration-300">
                                <div className="w-6 h-6 rounded-full bg-border flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-md group-hover:scale-125 transition-transform">
                                    <Clock size={10} className="text-muted" />
                                </div>
                                <div className="flex flex-col gap-1.5 pt-0.5">
                                    <p className="text-xs font-900 text-muted uppercase tracking-tight">Ouverture du Dossier</p>
                                    <p className="text-[10px] text-muted/70 font-600 italic leading-relaxed">Initialisation des paramètres via terminal agence.</p>
                                    <p className="text-[9px] text-muted/80 font-900 uppercase tracking-[0.2em] mt-2 bg-accent w-fit px-3 py-1 rounded-full">Hier, 09:12</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 pt-10 border-t border-border/60 flex flex-col gap-4">
                            <span className="text-[10px] font-900 text-muted/60 mb-2 flex items-center gap-2 uppercase tracking-[0.25em]">
                                <Zap size={14} className="text-primary" fill="currentColor" /> Administration
                            </span>
                            <div className="grid grid-cols-1 gap-4">
                                {reservation.status === 'pending' && <Button size="lg" className="h-14 font-900 text-[10px] tracking-[0.2em] uppercase shadow-lg">VALIDER LE CONTRAT</Button>}
                                {reservation.status === 'confirmed' && <Button variant="outline" size="lg" className="h-14 font-900 text-[10px] tracking-[0.2em] uppercase border-2">CLÔTURER LOCATION</Button>}
                                <Button variant="danger" outline size="lg" className="h-14 font-900 text-[10px] tracking-[0.2em] uppercase border-2 hover:bg-error-bg">RÉVOQUER LE DOSSIER</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationDetailPage;
