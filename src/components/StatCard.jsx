import React from 'react';

export const StatCard = ({ title, value, icon: Icon, trend, description, className = "" }) => {
    return (
        <div className={`bg-white p-3.5 md:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between min-w-0 ${className}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-emerald-50/50 rounded-xl">
                    {Icon && <Icon className="w-5 h-5 text-emerald-600" />}
                </div>
                {trend && (
                    <span className={`text-[9px] md:text-xs font-bold px-2 py-0.5 rounded-full ${trend.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {trend.value}
                    </span>
                )}
            </div>

            <div className="space-y-1">
                <h3 className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest line-clamp-1">{title}</h3>
                <p className="text-base md:text-2xl font-black text-slate-900 truncate">{value}</p>
                {description && (
                    <p className="text-[10px] text-slate-400 font-medium leading-tight line-clamp-1">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
};
