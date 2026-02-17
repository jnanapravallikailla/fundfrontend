import React from 'react';

export const ChartCard = ({ title, children, className = "" }) => {
    return (
        <div className={`bg-white p-5 md:p-8 rounded-2xl border border-slate-100 shadow-sm min-w-0 ${className}`}>
            <h3 className="text-base md:text-xl font-black text-slate-800 mb-6 tracking-tight">{title}</h3>
            <div className="w-full h-[300px] md:h-[400px]">
                {children}
            </div>
        </div>
    );
};
