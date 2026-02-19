import React from 'react';

export const ProgressBar = ({ progress, label, status, startDate, endDate }) => {
    return (
        <div className="space-y-3 group cursor-help relative pt-2">
            <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-semibold text-slate-700">{label}</span>
                <span className="text-primary font-bold">{progress}%</span>
            </div>

            <div className="relative h-3 bg-slate-100 rounded-full">
                {/* Progress Fill */}
                <div
                    className="bg-primary h-full transition-all duration-500 ease-out rounded-full shadow-sm"
                    style={{ width: `${progress}%` }}
                />

                {/* Timeline Markers */}
                {startDate && (
                    <div className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                        <div className="flex flex-col items-start">
                            <div className="w-0.5 h-2 bg-indigo-400 mb-1" />
                            <span className="text-[9px] font-bold text-indigo-500 uppercase whitespace-nowrap">{startDate}</span>
                        </div>
                    </div>
                )}
                {endDate && (
                    <div className="absolute -bottom-6 right-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 text-right">
                        <div className="flex flex-col items-end">
                            <div className="w-0.5 h-2 bg-indigo-400 mb-1" />
                            <span className="text-[9px] font-bold text-indigo-500 uppercase whitespace-nowrap">{endDate}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center pt-2">
                {status && (
                    <p className="text-xs text-slate-500">{status}</p>
                )}
            </div>
        </div>
    );
};
