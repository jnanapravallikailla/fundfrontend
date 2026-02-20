import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../context/AuthContext';
import {
    AlertCircle,
    ChevronRight,
    LayoutGrid,
    Sprout,
    Wallet,
    Briefcase,
    UserCircle
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const AppLayout = ({ children }) => {
    const { user, isCEO } = useAuth();
    const navigate = useNavigate();

    const isProfileIncomplete = !isCEO && (!user?.full_name || !user?.phone);

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 max-w-[100vw] overflow-x-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />

                {isProfileIncomplete && (
                    <div className="bg-amber-50 border-b border-amber-100 px-4 md:px-8 py-2.5 flex items-center justify-between animate-in slide-in-from-top duration-500">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-1.5 rounded-lg shrink-0">
                                <AlertCircle className="w-4 h-4 text-amber-600" />
                            </div>
                            <p className="text-xs md:text-sm font-medium text-amber-800">
                                Profile incomplete. Add bank details to enable investments.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-1 text-xs md:text-sm font-bold text-amber-700 hover:text-amber-900 transition-colors group shrink-0"
                        >
                            Setup
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                )}

                <main className="p-4 md:p-8 flex-1 w-full max-w-full overflow-hidden pb-24 md:pb-8">
                    {children}
                </main>

                <MobileNav />
            </div>
        </div>
    );
};

const MobileNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        { path: '/dashboard', icon: LayoutGrid, label: 'Home' },
        { path: '/progress', icon: Sprout, label: 'Project' },
        { path: '/portfolio', icon: Briefcase, label: 'Portfolio' },
        { path: '/profile', icon: UserCircle, label: 'Me' }
    ];

    return (
        <div className="md:hidden fixed bottom-1 left-4 right-4 bg-white/95 backdrop-blur-md border border-slate-100 px-1 py-1.5 rounded-2xl flex justify-around items-center z-[100] shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            {items.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${isActive ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'}`}
                    >
                        <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-tight ${isActive ? 'opacity-100' : 'opacity-80'}`}>{item.label}</span>
                    </button>
                );
            })}
        </div>
    );
};
