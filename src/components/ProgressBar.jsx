import React from 'react';

export const ProgressBar = ({ progress, label, status }) => {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-700">{label}</span>
                <span className="text-primary font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                    className="bg-primary h-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            {status && (
                <p className="text-xs text-slate-500 mt-1">{status}</p>
            )}
        </div>
    );
};
