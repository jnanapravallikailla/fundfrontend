import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    TrendingUp,
    Wallet,
    Briefcase,
    UserCircle,
    Sprout
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/progress', icon: Sprout, label: 'Progress' },
    { path: '/portfolio', icon: Briefcase, label: 'Portfolio' },
    { path: '/profile', icon: UserCircle, label: 'Profile' }
];

export const Sidebar = () => {
    const { isCEO } = useAuth();

    return (
        <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex-col">
            <div className="p-6 flex items-center gap-3 border-b border-slate-50">
                <div className="bg-emerald-100 p-2 rounded-lg">
                    <Sprout className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent italic">
                    FarmFund
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all
              ${isActive
                                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50'}
            `}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {isCEO && (
                <div className="p-4 border-t border-slate-100">
                    <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-md">
                        <p className="text-xs uppercase font-bold tracking-wider opacity-80">Access Level</p>
                        <p className="font-bold">Admin Panel</p>
                        <p className="text-xs mt-2 opacity-90">Manage investments & track progress live.</p>
                    </div>
                </div>
            )}
        </aside>
    );
};
