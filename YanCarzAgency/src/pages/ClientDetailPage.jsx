import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, CreditCard, History, UserCheck, Star, Search, ShieldCheck, Briefcase, FileText, Download, ExternalLink, Activity, Zap, ChevronRight, MessageSquare, Plus, Clock } from 'lucide-react';
import Button from '../components/Button';
import Table from '../components/Table';
import { clients, clientBookings } from '../services/mockData';

const ClientDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const client = clients.find(c => c.id === parseInt(id));
    const history = clientBookings[id] || [];

    const BOOKING_COLS = [
        { key: 'id', label: t('clientDetails.bookingCols.ref'), width: '15%', render: v => <span className="font-900 text-primary uppercase tracking-tight">#{v}</span> },
        { key: 'vehicle', label: t('clientDetails.bookingCols.vehicle'), width: '25%', render: v => <div className="font-800 text-main uppercase text-[11px] tracking-tight">{v}</div> },
        { key: 'dates', label: t('clientDetails.bookingCols.period'), width: '25%', render: v => <div className="text-muted text-[10px] font-700 uppercase">{v}</div> },
        { key: 'total', label: t('clientDetails.bookingCols.transaction'), width: '15%', render: v => <span className="font-900 text-main tracking-tighter">{v.toLocaleString()} MAD</span> },
        { key: 'status', label: t('clientDetails.bookingCols.status'), width: '20%', render: v => <span className={`badge badge-${v} font-900 text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 shadow-sm`}>{t(`reservations.status${v.charAt(0).toUpperCase() + v.slice(1)}`)}</span> },
    ];

    if (!client) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6">
                    <UserCheck size={32} className="text-muted opacity-30" />
                </div>
                <p className="text-muted mb-4 font-900 uppercase tracking-[0.3em] text-[10px]">{t('clientDetails.notFound')}</p>
                <Button onClick={() => navigate('/clients')}>{t('clientDetails.backToDirectory')}</Button>
            </div>
        );
    }

    return (
        <div className="pb-12 space-y-8 animate-[slideUpFade_0.5s_ease-out]">
            {/* 1. Header Segmented Layout */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-border/40">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/clients')}
                        className="group flex items-center justify-center w-12 h-12 rounded-full bg-accent hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-900 text-primary uppercase tracking-[0.25em] mb-2 px-3 py-1 bg-primary/5 rounded-full w-fit">
                            <Activity size={10} />
                            <span>{t('clientDetails.clientRegistry')}</span>
                            <ChevronRight size={10} />
                            <span>{t('clientDetails.individualContract')}</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-900 text-main tracking-tighter uppercase leading-none">{client.name}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-4 border-t lg:border-t-0 pt-6 lg:pt-0 border-border/50">
                    <div className="flex items-center gap-3 px-6 py-3 bg-primary text-white rounded-2xl font-900 text-[0.75rem] uppercase tracking-[0.2em] shadow-lg shadow-primary/20">
                        <Star size={16} fill="currentColor" className="animate-pulse" />
                        {t('clientDetails.privilegePartner')}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 2. Sidebars (4 Columns) */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    {/* Identity Snapshot */}
                    <div className="glass-panel p-10 text-center relative overflow-hidden shadow-2xl border-none">
                        <div className="absolute top-0 left-0 w-full h-32 bg-main"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-32 h-32 bg-white border-[8px] border-white shadow-2xl flex items-center justify-center mb-6 overflow-hidden rounded-[48px] -mt-16 group transition-transform duration-500 hover:rotate-3">
                                <span className="text-5xl font-900 text-primary uppercase">
                                    {client.name.split(' ').map(n => n[0]).join('')}
                                </span>
                            </div>
                            <h2 className="font-900 text-3xl text-main tracking-tight mb-2 uppercase">{client.name}</h2>
                            <p className="text-[10px] font-800 text-muted uppercase tracking-[0.2em] mb-8 inline-block px-4 py-1.5 bg-accent/60 rounded-full">
                                {t('clientDetails.memberSince', { date: client.joined })}
                            </p>

                            <div className="grid grid-cols-1 gap-4 w-full mb-15">
                                <Button className="w-full py-4 font-black text-[10px] tracking-[0.2em] uppercase shadow-lg">
                                    {t('clientDetails.edit')}
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full py-[14px] border-[3px] border-primary font-black text-[10px] tracking-[0.2em] uppercase bg-white"
                                >
                                    {t('clientDetails.recommend')}
                                </Button>
                            </div>
                            <div className="flex flex-col gap-6 w-full text-left pt-10 border-t border-border/80">
                                {[
                                    { icon: <Mail size={18} />, label: t('clientDetails.officialEmail'), value: client.email },
                                    { icon: <Phone size={18} />, label: t('clientDetails.mobileLine'), value: client.phone },
                                    { icon: <MapPin size={18} />, label: t('clientDetails.residenceZone'), value: `${client.location}, ${t('clientDetails.morocco')}` }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-5 group transition-all">
                                        <div className="p-3.5 bg-accent text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                            {item.icon}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[9px] uppercase font-900 text-muted tracking-[0.25em] mb-1">{item.label}</p>
                                            <p className="text-sm font-800 text-main truncate tracking-tight uppercase leading-none">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="space-y-6">
                        <div className="glass-panel p-8 border-l-[8px] border-primary flex items-center justify-between shadow-xl border-none">
                            <div className="flex flex-col gap-1">
                                <p className="text-muted text-[10px] font-900 uppercase tracking-[0.25em]">{t('clientDetails.portfolioActivity')}</p>
                                <p className="text-4xl font-900 text-main tracking-tighter">{client.bookings} <span className="text-[20px] font-700 opacity-40">{t('clientDetails.files')}</span></p>
                            </div>
                            <div className="p-5 bg-primary/5 text-primary rounded-[24px]">
                                <Activity size={32} />
                            </div>
                        </div>

                        <div className="glass-panel p-8 border-l-[8px] border-success flex flex-col justify-between shadow-xl border-none">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex flex-col gap-1">
                                    <p className="text-muted text-[10px] font-900 uppercase tracking-[0.25em]">{t('clientDetails.transactionalVolume')}</p>
                                    <div className="flex items-baseline gap-1">
                                        <p className="text-4xl font-900 text-success tracking-tighter">14,830</p>
                                        <span className="text-xs font-900 text-success opacity-40">MAD</span>
                                    </div>
                                </div>
                                <div className="p-5 bg-success/5 text-success rounded-[24px]">
                                    <ShieldCheck size={32} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-6 border-t border-border/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-success animate-ping" />
                                    <p className="text-[10px] text-main font-900 uppercase tracking-widest">{t('clientDetails.accountInGoodStanding')}</p>
                                </div>
                                <span className="text-[9px] font-800 text-muted/60 uppercase">{t('clientDetails.tier1Elite')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. High-Impact Main Column (8 Columns) */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Activity Archive */}
                    <div className="glass-panel p-10 space-y-10 shadow-xl border-none">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-border/50 pb-8">
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-primary text-white rounded-[24px] shadow-lg shadow-primary/20">
                                    <History size={26} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-900 text-main uppercase tracking-tighter">{t('clientDetails.collaborationHistory')}</h3>
                                    <p className="text-[10px] text-muted font-800 uppercase tracking-widest mt-1">{t('clientDetails.realTimeExtraction')}</p>
                                </div>
                            </div>
                            <div className="relative w-full md:w-96 group">
                                <Search size={16} className=" mr-5 absolute  top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors duration-300" />
                                <input
                                    type="text"
                                    placeholder={t('clientDetails.searchPlaceholder')}
                                    className="select-input w-full h-14 rounded-2xl bg-accent/40 border-transparent focus:border-primary focus:bg-white transition-all pl-12 font-800 text-sm uppercase tracking-tight"
                                />
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-border/30">
                            <Table
                                columns={BOOKING_COLS}
                                data={history}
                                emptyMessage={t('clientDetails.noHistory')}
                                className="border-none"
                            />
                        </div>

                        <div className="flex justify-center pt-4">
                            <Button variant="outline" className="px-12 h-14 font-900 text-[10px] tracking-[0.3em] uppercase shadow-sm border-2">
                                {t('clientDetails.loadFullHistory')}
                            </Button>
                        </div>
                    </div>

                    {/* Assets & Intelligence Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Documentation Hub */}
                        <div className="glass-panel p-10 flex flex-col shadow-xl border-none min-h-[480px]">
                            <h3 className="text-sm font-900 mb-10 flex items-center gap-3 text-main uppercase tracking-[0.2em] border-b border-border/50 pb-6">
                                <FileText size={20} className="text-primary" /> {t('clientDetails.clientDocumentation')}
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { name: t('clientDetails.driverLicense'), date: `${t('clientDetails.valid')}: 2028`, color: "text-primary", details: "SCAN-A12" },
                                    { name: t('clientDetails.proIdCard'), date: t('clientDetails.verified'), color: "text-success", details: "CERT-33" },
                                    { name: t('clientDetails.residenceCertificate'), date: t('clientDetails.updated'), color: "text-muted", details: "DOC-99" }
                                ].map((doc, i) => (
                                    <div key={i} className="flex justify-between items-center p-5 bg-accent/30 rounded-[28px] border border-transparent hover:border-primary/20 hover:bg-white transition-all duration-300 cursor-pointer group shadow-sm">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                <FileText size={24} className="text-primary/70" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-900 text-main tracking-tight uppercase leading-none">{doc.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[9px] font-900 uppercase tracking-widest ${doc.color}`}>{doc.date}</span>
                                                    <span className="text-[9px] font-600 text-muted/40 uppercase">#{doc.details}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white text-muted group-hover:text-primary group-hover:shadow-lg rounded-xl transition-all">
                                            <Download size={20} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-auto pt-10">
                                <Button fullWidth variant="outline" className="h-14 font-900 text-[10px] tracking-[0.2em] uppercase border-dashed border-2 hover:bg-primary/5 text-primary">
                                    <Plus size={16} className="mr-2" /> {t('clientDetails.addDocument')}
                                </Button>
                            </div>
                        </div>

                        {/* Intelligence & Notes */}
                        <div className="glass-panel p-10 flex flex-col shadow-xl border-none min-h-[480px] bg-main text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12 translate-x-10 -translate-y-10 scale-150">
                                <Briefcase size={120} />
                            </div>
                            <h3 className="text-sm font-900 mb-10 flex items-center gap-3 text-black/60 uppercase tracking-[0.2em] border-b border-white/10 pb-6 relative z-10">
                                <Zap size={18} className="text-primary" /> {t('clientDetails.clientIntelligence')}
                            </h3>
                            <div className="flex-1 flex flex-col justify-center relative z-10">
                                <div className="p-10 bg-white/5 rounded-[48px] border border-white/10 shadow-inner relative group">
                                    <div className="absolute -top-6 left-10 p-4 bg-primary text-white rounded-2xl shadow-xl">
                                        <MessageSquare size={24} />
                                    </div>
                                    <p className="text-lg text-black font-700 leading-relaxed italic tracking-tight mb-8">
                                        "{t('clientDetails.intelligenceNote')}"
                                    </p>
                                    <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                                        <div className="w-12 h-12 rounded-[18px] bg-primary text-black flex items-center justify-center text-sm font-900 shadow-lg">AD</div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-900 text-black uppercase tracking-widest">{t('clientDetails.auditManager')}</span>
                                            <span className="text-[9px] font-700 text-black/40 uppercase tracking-widest mt-0.5">{t('clientDetails.lastUpdated', { date: '18 Mars 2024' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-auto pt-10 relative z-10">
                                <Button fullWidth className="h-14 font-900 text-[10px] tracking-[0.2em] uppercase bg-white text-main hover:bg-primary hover:text-white transition-all shadow-lg border-none">
                                    {t('clientDetails.newObservation')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDetailPage;