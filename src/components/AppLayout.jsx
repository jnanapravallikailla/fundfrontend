import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AppLayout = ({ children }) => {
    const { user, isCEO } = useAuth();
    const navigate = useNavigate();

    const isProfileIncomplete = !isCEO && (user?.verification_status !== 'verified' || !user?.full_name);

    return (
        <div className="flex min-h-screen bg-background text-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />

                {isProfileIncomplete && (
                    <div className="bg-amber-50 border-b border-amber-100 px-8 py-2.5 flex items-center justify-between animate-in slide-in-from-top duration-500">
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-100 p-1.5 rounded-lg">
                                <AlertCircle className="w-4 h-4 text-amber-600" />
                            </div>
                            <p className="text-sm font-medium text-amber-800">
                                Your profile is incomplete. Please add your personal and bank details to enable investments.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-1 text-sm font-bold text-amber-700 hover:text-amber-900 transition-colors group"
                        >
                            Complete Setup
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                )}

                <main className="p-8 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};
