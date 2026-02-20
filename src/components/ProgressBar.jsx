import React, { useRef, useState } from 'react';

export const ProgressBar = ({ progress, label, status, startDate, endDate, onEdit, isEditable = false }) => {
    const barRef = useRef(null);
    const [hoverProgress, setHoverProgress] = useState(null);

    const handleMouseMove = (e) => {
        if (!isEditable || !barRef.current) return;
        const rect = barRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percentage = Math.min(100, Math.max(0, Math.round((x / width) * 100)));
        setHoverProgress(percentage);
    };

    const handleClick = (e) => {
        if (!isEditable || !onEdit || !barRef.current) return;
        const rect = barRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percentage = Math.min(100, Math.max(0, Math.round((x / width) * 100)));
        onEdit(percentage);
    };

    return (
        <div className="space-y-4 group relative pt-2">
            <div className="flex justify-between items-end mb-1">
                <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none">{label}</span>
                    <p className="text-sm font-black text-slate-900 italic uppercase tracking-tight">{status}</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-black text-slate-900 italic tracking-tighter">{progress}<span className="text-xs text-slate-400 ml-0.5">%</span></span>
                </div>
            </div>

            <div
                ref={barRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverProgress(null)}
                onClick={handleClick}
                className={`relative h-5 bg-slate-100 rounded-full overflow-hidden ${isEditable ? 'cursor-crosshair' : 'cursor-default'}`}
            >
                {/* Progress Fill */}
                <div
                    className="bg-slate-900 h-full transition-all duration-500 ease-out rounded-full shadow-lg shadow-slate-900/10 relative z-10"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                {/* Hover Indicator */}
                {isEditable && hoverProgress !== null && (
                    <div
                        className="absolute inset-y-0 left-0 bg-emerald-500/20 border-r-2 border-emerald-500 z-0 transition-all duration-75"
                        style={{ width: `${hoverProgress}%` }}
                    />
                )}

                {/* Timeline Markers */}
                <div className="absolute inset-0 z-20 pointer-events-none flex justify-between px-6 items-center opacity-40">
                    <div className="w-px h-2 bg-slate-400/30" />
                    <div className="w-px h-2 bg-slate-400/30" />
                    <div className="w-px h-2 bg-slate-400/30" />
                    <div className="w-px h-2 bg-slate-400/30" />
                </div>
            </div>

            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span>Start: {startDate || 'TBD'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>Target: {endDate || 'TBD'}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                </div>
            </div>

            {isEditable && (
                <div className="absolute -top-1 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full shadow-lg">
                        Click to Sync Progress
                    </div>
                </div>
            )}
        </div>
    );
};
