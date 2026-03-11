import React from 'react';
import { User, Mail, Shield, Key, Bell, Camera, ChevronRight, Activity, MapPin, Phone, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Card from '../components/Card';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const { t } = useTranslation();

    // Mock user details since auth context might just have { username, role }
    const profileUser = {
        name: user?.username || 'Jean-Paul Marché',
        email: user?.email || 'jp@yancarz.com',
        role: user?.role || 'Directeur Général',
        phone: '+212 6 11 22 33 44',
        location: 'Casablanca, Maroc',
        joined: 'Janvier 2022'
    };

    return (
        <div className="pb-12 space-y-8 animate-[slideUpFade_0.5s_ease-out]">
            {/* Header */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 bg-white p-8 rounded-[32px] shadow-sm border border-border/40">
                <div className="flex items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-[10px] font-900 text-primary uppercase tracking-[0.25em] mb-2 px-3 py-1 bg-primary/5 rounded-full w-fit">
                            <Activity size={10} />
                            <span>{t('profile.yourSpace')}</span>
                            <ChevronRight size={10} />
                            <span>{t('profile.userProfile')}</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-900 text-main tracking-tighter uppercase leading-none">{t('profile.title')}</h1>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 2. Sidebar Profile Snapshot (4 Columns) */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="glass-panel p-10 text-center relative overflow-hidden shadow-2xl border-none">
                        <div className="absolute top-0 left-0 w-full h-32 bg-main"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="relative group mb-6 -mt-16 group transition-transform duration-500 hover:rotate-3">
                                <div className="w-32 h-32 bg-white border-[8px] border-white shadow-2xl flex items-center justify-center overflow-hidden rounded-[48px]">
                                    <span className="text-5xl font-900 text-primary uppercase">
                                        {profileUser.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <button 
                                    className="absolute bottom-0 right-0 p-2.5 bg-primary text-white rounded-xl shadow-lg hover:scale-110 transition-transform"
                                    title={t('profile.uploadPhoto') || 'Upload Photo'}
                                >
                                    <Camera size={16} />
                                </button>
                            </div>

                            <h2 className="font-900 text-3xl text-main tracking-tight mb-2 uppercase">{profileUser.name}</h2>
                            <p className="text-[10px] font-800 text-muted uppercase tracking-[0.2em] mb-8 inline-block px-4 py-1.5 bg-accent/60 rounded-full">
                                {profileUser.role}
                            </p>

                            <div className="flex flex-col gap-6 w-full text-left pt-6 border-t border-border/80">
                                {[
                                    { icon: <Mail size={18} />, label: t('profile.professionalEmail'), value: profileUser.email },
                                    { icon: <Phone size={18} />, label: t('profile.phone'), value: profileUser.phone },
                                    { icon: <MapPin size={18} />, label: t('profile.office'), value: profileUser.location }
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
                </div>

                {/* 3. Main Settings Column (8 Columns) */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    {/* General Information Card */}
                    <div className="glass-panel p-10 shadow-xl border-none">
                        <h3 className="text-sm font-900 mb-8 flex items-center gap-3 text-main uppercase tracking-[0.2em] border-b border-border/50 pb-4">
                            <User size={18} className="text-primary" /> {t('profile.personalInfo')}
                        </h3>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-900 text-muted uppercase tracking-[0.2em]">{t('profile.fullName')}</label>
                                    <input type="text" defaultValue={profileUser.name} className="select-input w-full font-800 text-main" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-900 text-muted uppercase tracking-[0.2em]">{t('email')}</label>
                                    <input type="email" defaultValue={profileUser.email} className="select-input w-full font-800 text-main" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-900 text-muted uppercase tracking-[0.2em]">{t('phoneNumber')}</label>
                                    <input type="text" defaultValue={profileUser.phone} className="select-input w-full font-800 text-main" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-900 text-muted uppercase tracking-[0.2em]">{t('profile.systemRole')}</label>
                                    <input type="text" defaultValue={profileUser.role} disabled className="select-input w-full font-800 text-main opacity-50 cursor-not-allowed bg-accent/30" />
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end">
                                <Button className="px-8 py-3.5 font-900 text-[10px] tracking-[0.2em] uppercase shadow-lg">
                                    {t('profile.saveChanges')}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Security Settings Area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-panel p-8 shadow-xl border-none">
                            <h3 className="text-sm font-900 mb-6 flex items-center gap-3 text-main uppercase tracking-[0.2em]">
                                <Key size={18} className="text-primary" /> {t('profile.password')}
                            </h3>
                            <p className="text-xs font-600 text-muted mb-6">{t('profile.passwordHint')}</p>
                            <Button variant="outline" className="w-full py-3.5 border-2 border-primary font-black text-[10px] tracking-[0.2em] uppercase bg-white">
                                {t('profile.changePassword')}
                            </Button>
                        </div>

                        <div className="glass-panel p-8 shadow-xl border-none">
                            <h3 className="text-sm font-900 mb-6 flex items-center gap-3 text-error uppercase tracking-[0.2em]">
                                <LogOut size={18} /> {t('profile.signOut')}
                            </h3>
                            <p className="text-xs font-600 text-muted mb-6">{t('profile.signOutHint')}</p>
                            <Button onClick={logout} className="w-full py-3.5 bg-error text-white font-black text-[10px] tracking-[0.2em] uppercase shadow-lg shadow-error/20 hover:bg-red-600 transition-all border-none">
                                {t('profile.disconnectBtn')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
