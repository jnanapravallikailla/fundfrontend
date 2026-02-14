import React from 'react';

export const ChartCard = ({ title, children, className }) => {
    return (
        <div className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm ${className}`}>
            <h3 className="text-lg font-bold text-slate-800 mb-6">{title}</h3>
            <div className="w-full h-[300px]">
                {children}
            </div>
        </div>
    );
};
