import React from 'react';

export const StatCard = ({ title, value, icon: Icon, trend, description }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg">
                    {Icon && <Icon className="w-6 h-6 text-primary" />}
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {trend.value}
                    </span>
                )}
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            {description && (
                <p className="text-xs text-slate-400 mt-1">{description}</p>
            )}
        </div>
    );
};
