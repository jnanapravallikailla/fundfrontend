import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
    const { user, isCEO } = useAuth();

    return (
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
            <div className="relative w-96">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search projects, investments..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900">
                            {isCEO ? 'Administrator' : (user?.isInvestor ? 'Investor' : 'Explorer')}
                        </p>
                        <p className="text-xs text-slate-500">{user?.email || 'Guest'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-primary font-bold border border-emerald-200">
                        <User className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </header>
    );
};
