import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Mail, CheckCircle, Clock, AlertCircle, Printer, CreditCard, ChevronRight, Activity, Building, User, Calendar } from 'lucide-react';
import Button from '../components/Button';
import Table from '../components/Table';
import { invoices, clients } from '../services/mockData';

const STATUS_CONFIG = {
    paid: { label: 'Payée', color: 'success', icon: <CheckCircle size={16} /> },
    pending: { label: 'En attente', color: 'pending', icon: <Clock size={16} /> },
    overdue: { label: 'En retard', color: 'error', icon: <AlertCircle size={16} /> }
};

const ITEMS_COLS = [
    { key: 'desc', label: 'Description', width: '40%', render: v => <div className="font-800 text-main uppercase text-[11px] tracking-tight">{v}</div> },
    { key: 'qty', label: 'Qté', width: '15%', render: v => <span className="font-700 text-muted">{v}</span> },
    { key: 'price', label: 'Prix Unitaire', width: '20%', render: v => <span className="font-700 text-muted">{v.toLocaleString()} MAD</span> },
    { key: 'total', label: 'Total', width: '25%', render: v => <span className="font-900 text-main tracking-tighter">{v.toLocaleString()} MAD</span> },
];

const BillingDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Find invoice
    const invoice = invoices.find(inv => inv.id === parseInt(id));

    if (!invoice) {
        return (
            <div className="flex flex-col items-center justify-center h-96 animate-[slideUpFade_0.5s_ease-out]">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6">
                    <FileText size={32} className="text-muted opacity-30" />
                </div>
                <p className="text-muted mb-4 font-900 uppercase tracking-[0.3em] text-[10px]">Facture Introuvable</p>
                <Button onClick={() => navigate('/billing')}>Retour à la facturation</Button>
            </div>
        );
    }

    // Find associated client
    const client = clients.find(c => c.name === invoice.client) || { email: 'client@example.com', phone: '+212 6 00 00 00 00', location: 'Maroc' };
    const statusInfo = STATUS_CONFIG[invoice.status] || STATUS_CONFIG.pending;

    // Generate mock line items based on total amount
    const mockItems = [
        { id: 1, desc: 'Location Véhicule (Forfait Jours)', qty: 1, price: invoice.amount * 0.8, total: invoice.amount * 0.8 },
        { id: 2, desc: 'Assurance Complète', qty: 1, price: invoice.amount * 0.15, total: invoice.amount * 0.15 },
        { id: 3, desc: 'Frais de Dossier', qty: 1, price: invoice.amount * 0.05, total: invoice.amount * 0.05 },
    ];

    const subtotal = invoice.amount * 0.8;
    const taxes = invoice.amount * 0.2; // roughly 20% TVA
    const total = invoice.amount;

    return (
        <div className="pb-12 space-y-8 animate-[slideUpFade_0.5s_ease-out]">
            {/* 1. Header Segmented Layout */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-border/40">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/billing')}
                        className="group flex items-center justify-center w-12 h-12 rounded-full bg-accent hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-900 text-primary uppercase tracking-[0.25em] mb-2 px-3 py-1 bg-primary/5 rounded-full w-fit">
                            <Activity size={10} />
                            <span>Facturation</span>
                            <ChevronRight size={10} />
                            <span>Détails Facture</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-900 text-main tracking-tighter uppercase leading-none">{invoice.ref}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4 border-t lg:border-t-0 pt-6 lg:pt-0 border-border/50">
                    <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-900 text-[0.75rem] uppercase tracking-[0.2em] shadow-lg ${invoice.status === 'paid' ? 'bg-success text-white shadow-success/20' :
                            invoice.status === 'overdue' ? 'bg-error text-white shadow-error/20' :
                                'bg-[#f59e0b] text-white shadow-[#f59e0b]/20'
                        }`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 2. Sidebars (4 Columns) */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    {/* Invoice Overview Snapshot */}
                    <div className="glass-panel p-10 relative overflow-hidden shadow-2xl border-none">
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                        <div className="relative z-10 flex flex-col">
                            <div className="flex justify-between items-start mb-8 border-b border-border/50 pb-6">
                                <div>
                                    <p className="text-[10px] font-900 text-muted uppercase tracking-[0.2em] mb-1">Montant Total due</p>
                                    <h2 className="font-900 text-4xl text-main tracking-tighter uppercase">{total.toLocaleString()} <span className="text-[16px] text-muted tracking-wide">MAD</span></h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-accent/50 rounded-2xl">
                                    <p className="text-[9px] uppercase font-900 text-muted tracking-[0.2em] mb-1">Date d'édition</p>
                                    <p className="text-sm font-800 text-main">{invoice.date}</p>
                                </div>
                                <div className="p-4 bg-accent/50 rounded-2xl">
                                    <p className="text-[9px] uppercase font-900 text-muted tracking-[0.2em] mb-1">Échéance</p>
                                    <p className="text-sm font-800 text-main">{invoice.date}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 w-full text-left pt-6 border-t border-border/80">
                                <h3 className="text-[10px] font-900 text-primary uppercase tracking-[0.25em] flex items-center gap-2 mb-2">
                                    <User size={12} /> Référence Client
                                </h3>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-main text-white rounded-xl flex items-center justify-center font-900 text-xl uppercase shadow-md">
                                        {client.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-900 text-main truncate tracking-tight uppercase leading-none mb-1">{client.name}</p>
                                        <p className="text-[10px] font-800 text-muted truncate tracking-widest uppercase">{client.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 w-full mt-10">
                                <Button className="w-full py-4 font-black text-[10px] tracking-[0.2em] uppercase shadow-lg flex items-center justify-center gap-2">
                                    <CreditCard size={14} /> ENREGISTRER PAIEMENT
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Main Invoice Document Column (8 Columns) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Invoice Body */}
                    <div className="glass-panel p-10 space-y-8 shadow-xl border-none">
                        <div className="flex justify-between items-center border-b border-border/50 pb-8">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-black text-white rounded-[24px] shadow-lg">
                                    <Building size={26} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-900 text-main uppercase tracking-tighter">YanCarz Agency</h3>
                                    <p className="text-[10px] text-muted font-800 uppercase tracking-widest mt-1">N° Patente: 12345678 • RC: 98765</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="h-10 px-4 py-0 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all rounded-xl shadow-sm text-[10px] font-900 tracking-widest uppercase">
                                    <Printer size={14} className="mr-2" /> IMPRIMER
                                </Button>
                                <Button className="h-10 px-4 py-0 bg-main text-white hover:bg-black transition-all rounded-xl shadow-sm text-[10px] font-900 tracking-widest uppercase">
                                    <Download size={14} className="mr-2" /> TÉLÉCHARGER PDF
                                </Button>
                            </div>
                        </div>

                        {/* Invoice Items Table */}
                        <div className="overflow-hidden rounded-3xl border border-border/30 my-6">
                            <Table
                                columns={ITEMS_COLS}
                                data={mockItems}
                                emptyMessage="Aucun détail de facturation disponible."
                                className="border-none"
                            />
                        </div>

                        {/* Financial Totals */}
                        <div className="flex items-center justify-end pt-4">
                            <div className="w-full md:w-1/2 lg:w-1/3 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-800 text-muted uppercase tracking-widest text-[10px]">Total HT</span>
                                    <span className="font-700 text-main">{subtotal.toLocaleString()} MAD</span>
                                </div>
                                <div className="flex justify-between items-center text-sm pb-4 border-b border-border/50">
                                    <span className="font-800 text-muted uppercase tracking-widest text-[10px]">TVA (20%)</span>
                                    <span className="font-700 text-main">{taxes.toLocaleString()} MAD</span>
                                </div>
                                <div className="flex justify-between items-center text-xl mt-4">
                                    <span className="font-900 text-main uppercase tracking-widest text-[12px]">Net à payer</span>
                                    <span className="font-900 text-primary tracking-tighter">{total.toLocaleString()} MAD</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingDetailPage;
