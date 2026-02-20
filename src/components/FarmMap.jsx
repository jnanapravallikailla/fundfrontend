import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Zap, TrendingUp, Droplets, ZoomIn, ZoomOut, RefreshCcw } from 'lucide-react';

const farmSections = {
    'coconut': {
        id: 'coconut',
        name: 'Hybrid Coconut Block',
        yield: '180,000 Nuts/Yr',
        acres: '3.0 Acres',
        revenue: '₹0.8M projected',
        description: 'Elite hybrid tall-dwarf palms with automated drip irrigation in the northern sector.',
        color: '#2D5A27',
        icon: <Leaf className="w-4 h-4 text-emerald-600" />
    },
    'avocado': {
        id: 'avocado',
        name: 'Hass Avocado Ridge',
        yield: '95 Tons/Yr',
        acres: '3.5 Acres',
        revenue: '₹1.4M projected',
        description: 'Export-grade Hass avocados with high-density planting in the eastern sector.',
        color: '#1B4D3E',
        icon: <Zap className="w-4 h-4 text-lime-600" />
    },
    'mango': {
        id: 'mango',
        name: 'Export Mango Orchard',
        yield: '65 Tons/Yr',
        acres: '2.5 Acres',
        revenue: '₹0.9M projected',
        description: 'Premium Alphonso and Kesar block managed with precision crop-science.',
        color: '#F59E0B',
        icon: <TrendingUp className="w-4 h-4 text-amber-600" />
    },
    'pond': {
        id: 'pond',
        name: 'Resource Reservoir',
        yield: '2.5M Gallons',
        acres: '2.0 Acres',
        revenue: 'Sustainable Asset',
        description: 'Strategic water security hub integrated into the south-eastern corner.',
        color: '#1E40AF',
        icon: <Droplets className="text-blue-600" />
    },
    'caretaker-house': {
        id: 'caretaker-house',
        name: 'Estate Operations Hub',
        yield: '24/7 Monitoring',
        acres: 'Central Hub',
        revenue: 'Asset Integrity',
        description: 'Central command unit coordinating all 11-acre estate operations and moisture sensing.',
        color: '#F59E0B',
        icon: <TrendingUp className="text-amber-600" />
    }
};

const FarmMap = ({ onFeatureClick, showTooltip = true, backgroundImage = "/image.png" }) => {
    const [hoveredId, setHoveredId] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleWheel = (e) => {
        // Fix: Use Ctrl + Scroll for zooming to allow natural page scrolling
        if (!e.ctrlKey) return;

        e.preventDefault();
        const container = containerRef.current;
        if (!container) return;

        const zoomStep = 0.2;
        const oldScale = scale;
        const newScale = e.deltaY < 0 ? Math.min(oldScale + zoomStep, 5) : Math.max(oldScale - zoomStep, 1);

        if (newScale === oldScale) return;

        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const ratio = newScale / oldScale;

        setScale(newScale);
        setTranslate({
            x: newScale === 1 ? 0 : mouseX - (mouseX - translate.x) * ratio,
            y: newScale === 1 ? 0 : mouseY - (mouseY - translate.y) * ratio
        });
    };

    const handleMouseMove = (e) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        if (isDragging) {
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;
            setTranslate(prev => ({ x: prev.x + dx, y: prev.y + dy }));
            dragStart.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseDown = (e) => {
        if (scale > 1) {
            setIsDragging(true);
            dragStart.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    useEffect(() => {
        const container = containerRef.current;
        const handleWheelEvent = (e) => handleWheel(e);
        if (container) container.addEventListener('wheel', handleWheelEvent, { passive: false });
        const handleGlobalClick = (e) => {
            if (container && !container.contains(e.target)) setIsFocused(false);
        };
        document.addEventListener('mousedown', handleGlobalClick);
        return () => {
            if (container) container.removeEventListener('wheel', handleWheelEvent);
            document.removeEventListener('mousedown', handleGlobalClick);
        };
    }, [scale, translate, isFocused]);

    const hoveredData = hoveredId ? farmSections[hoveredId] : null;

    return (
        <div
            ref={containerRef}
            className={`relative w-full h-full overflow-hidden bg-[#0f172a] rounded-[inherit] ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => { handleMouseUp(); setHoveredId(null); }}
            onClick={() => setIsFocused(true)}
        >
            <motion.div
                className="w-full h-full origin-top-left"
                animate={{ scale, x: translate.x, y: translate.y }}
                transition={{ type: 'spring', stiffness: 300, damping: 35, mass: 0.5 }}
            >
                <svg viewBox="0 0 1600 900" className="w-full h-full object-cover" preserveAspectRatio="xMidYMid slice">
                    <image href={backgroundImage} width="1600" height="900" preserveAspectRatio="xMidYMid slice" />

                    {/* Interactive Areas */}
                    <g>
                        {/* 1. COCONUT - TOP LEFT (Width reduced further to clear house clearing) */}
                        <path
                            d="M50,50 L480,50 L430,430 L50,450 Z"
                            fill={hoveredId === 'coconut' ? 'rgba(16, 185, 129, 0.2)' : 'transparent'}
                            stroke={hoveredId === 'coconut' ? '#10b981' : 'transparent'}
                            strokeWidth="3"
                            strokeDasharray="8 4"
                            className="cursor-pointer transition-all duration-300"
                            onMouseEnter={() => setHoveredId('coconut')}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={(e) => { e.stopPropagation(); onFeatureClick?.('coconut'); }}
                        />

                        {/* 2. AVOCADO - TOP RIGHT */}
                        <path
                            d="M950,50 L1550,50 L1500,430 L900,450 Z"
                            fill={hoveredId === 'avocado' ? 'rgba(132, 204, 22, 0.2)' : 'transparent'}
                            stroke={hoveredId === 'avocado' ? '#84cc16' : 'transparent'}
                            strokeWidth="3"
                            strokeDasharray="8 4"
                            className="cursor-pointer transition-all duration-300"
                            onMouseEnter={() => setHoveredId('avocado')}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={(e) => { e.stopPropagation(); onFeatureClick?.('avocado'); }}
                        />

                        {/* 3. MANGO - BOTTOM CENTER */}
                        <path
                            d="M400,480 L1100,480 L1050,850 L450,880 Z"
                            fill={hoveredId === 'mango' ? 'rgba(245, 158, 11, 0.2)' : 'transparent'}
                            stroke={hoveredId === 'mango' ? '#f59e0b' : 'transparent'}
                            strokeWidth="3"
                            strokeDasharray="8 4"
                            className="cursor-pointer transition-all duration-300"
                            onMouseEnter={() => setHoveredId('mango')}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={(e) => { e.stopPropagation(); onFeatureClick?.('mango'); }}
                        />

                        {/* 4. RESERVOIR - BOTTOM RIGHT CORNER */}
                        <path
                            d="M1150,480 L1550,460 L1520,850 L1100,880 Z"
                            fill={hoveredId === 'pond' ? 'rgba(59, 130, 246, 0.2)' : 'transparent'}
                            stroke={hoveredId === 'pond' ? '#3b82f6' : 'transparent'}
                            strokeWidth="3"
                            strokeDasharray="8 4"
                            className="cursor-pointer transition-all duration-300"
                            onMouseEnter={() => setHoveredId('pond')}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={(e) => { e.stopPropagation(); onFeatureClick?.('pond'); }}
                        />

                        {/* Interactive Building Targets (Existing brown-roofed buildings in imagery) */}
                        <g className="cursor-pointer">
                            {/* North Operations Building (Central Large House) */}
                            <rect
                                x="700" y="250" width="300" height="280"
                                fill="rgba(255,255,255,0)"
                                onMouseEnter={() => setHoveredId('caretaker-house')}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={(e) => { e.stopPropagation(); onFeatureClick?.('caretaker-house'); }}
                            />
                            {/* South-East Operations Building (Smaller Structure) */}
                            <rect
                                x="1150" y="730" width="250" height="200"
                                fill="rgba(255,255,255,0)"
                                onMouseEnter={() => setHoveredId('caretaker-house')}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={(e) => { e.stopPropagation(); onFeatureClick?.('caretaker-house'); }}
                            />
                        </g>
                    </g>
                </svg>
            </motion.div>

            <AnimatePresence>
                {showTooltip && hoveredId && hoveredData && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                            position: 'absolute',
                            left: mousePos.x > 165 ? (mousePos.x < (containerRef.current?.offsetWidth - 165) ? mousePos.x : containerRef.current?.offsetWidth - 165) : 165,
                            top: mousePos.y > 180 ? mousePos.y - 25 : mousePos.y + 25,
                            zIndex: 200,
                            pointerEvents: 'none',
                            transform: mousePos.y > 180 ? 'translate(-50%, -100%)' : 'translate(-50%, 0)'
                        }}
                        className="w-64"
                    >
                        <div className="bg-white/95 backdrop-blur-2xl border border-slate-200 p-5 rounded-[28px] shadow-2xl">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">{hoveredData.icon}</div>
                                <div>
                                    <h3 className="text-slate-900 font-black text-sm tracking-tight leading-none mb-1.5">{hoveredData.name}</h3>
                                    <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">Digital Verified</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                                    <p className="text-[8px] text-slate-400 uppercase font-black tracking-wider mb-1">Acres</p>
                                    <p className="text-slate-900 font-black text-sm">{hoveredData.acres}</p>
                                </div>
                                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                                    <p className="text-[8px] text-slate-400 uppercase font-black tracking-wider mb-1">Revenue</p>
                                    <p className="text-emerald-600 font-black text-sm">{hoveredData.revenue}</p>
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic px-1">"{hoveredData.description}"</p>
                        </div>
                        <div className={`w-4 h-4 bg-white/95 rotate-45 mx-auto border-slate-200 ${mousePos.y > 180 ? '-mt-2 border-r border-b' : '-mb-2 border-l border-t shadow-sm'}`} />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-8 right-8 flex items-center gap-3 z-[60]">
                <div className="flex bg-white/90 backdrop-blur-2xl border border-slate-200 rounded-2xl p-1.5 shadow-2xl pointer-events-auto">
                    <button onClick={() => setScale(prev => Math.min(prev + 0.5, 5))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"><ZoomIn size={20} /></button>
                    <button onClick={() => setScale(prev => Math.max(prev - 0.5, 1))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"><ZoomOut size={20} /></button>
                    <div className="w-px h-6 bg-slate-200 my-auto mx-1.5" />
                    <button onClick={() => { setScale(1); setTranslate({ x: 0, y: 0 }); }} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"><RefreshCcw size={20} /></button>
                </div>
            </div>
        </div>
    );
};

export default FarmMap;
