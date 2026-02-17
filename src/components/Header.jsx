import React from 'react';
import { Bell, Search, User, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
    const { user, isCEO } = useAuth();

    return (
        <header className="h-14 md:h-18 bg-white/70 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-3">
                {/* Logo Box */}
                <div className="bg-emerald-100/50 p-2 rounded-xl shrink-0">
                    <Sprout className="w-5 h-5 text-emerald-600" />
                </div>

                <div className="relative w-48 md:w-96">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-full py-1.5 md:py-2 pl-10 pr-4 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all shrink-0">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-100/50 flex items-center justify-center text-emerald-600 font-bold border border-emerald-50 shrink-0">
                        <User className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                </div>
            </div>
        </header>
    );
};
