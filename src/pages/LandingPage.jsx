import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    Leaf,
    Zap,
    Maximize2,
    Globe,
    ShieldCheck,
    ArrowUpRight,
    TrendingUp,
    Droplets,
    Home,
    MousePointer2,
    Mail,
    Lock,
    X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FarmMap from '../components/FarmMap';

const GalleryImages = [
    "/img2.png",
    "/img3.png",
    "/view.jpg"
];

const LandingPage = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const estateAssets = [
        {
            id: 'coconut',
            name: 'Hybrid Coconut',
            icon: <Leaf className="text-emerald-600" />,
            detail: '3.0 Acres // Elite Palms',
            desc: 'High-yield hybrid tall-dwarf palms integrated with precision irrigation in the northern sector.',
            accent: 'bg-emerald-50/50'
        },
        {
            id: 'mango',
            name: 'Export Mango',
            icon: <TrendingUp className="text-amber-600" />,
            detail: '2.5 Acres // Phase II',
            desc: 'Premium Alphonso and Kesar block managed with precision crop-science in the central field.',
            accent: 'bg-amber-50/50'
        },
        {
            id: 'avocado',
            name: 'Hass Avocado',
            icon: <Zap className="text-lime-600" />,
            detail: '3.5 Acres // Export Grade',
            desc: 'High-value fruit production utilizing modern vertical-aligned plantation techniques.',
            accent: 'bg-lime-50/50'
        },
        {
            id: 'pond',
            name: 'Resource Reservoir',
            icon: <Droplets className="text-blue-600" />,
            detail: '2.0 Acres // Moisture Hub',
            desc: 'Strategic water security asset ensuring 24/7 moisture control for the entire 11-acre estate.',
            accent: 'bg-blue-50/50'
        }
    ];

    return (
        <div className="min-h-screen bg-[#F9FAF8] text-[#1A302B] font-sans selection:bg-[#10B981]/30 overflow-x-hidden">

            {/* 1. Executive Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-8 md:px-12 py-6 ${isScrolled ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent'}`}>
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    {/* Left: Brand */}
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-9 h-9 bg-[#1A302B] rounded-lg flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105">
                            <Leaf size={18} fill="currentColor" />
                        </div>
                        <span className="text-xl font-bold tracking-tighter text-[#1A302B]">vriksha<span className="text-[#10B981]">.</span></span>
                    </div>

                    {/* Center: Menu Links */}
                    <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-[#1A302B]/60">
                        <a href="#" className="hover:text-[#10B981] transition-colors">Product</a>
                        <a href="#" className="hover:text-[#10B981] transition-colors">Solutions</a>
                        <a href="/topography-view" className="hover:text-[#10B981] transition-colors">Farms</a>
                        <a href="#" className="hover:text-[#10B981] transition-colors">Pricing</a>
                    </div>

                    {/* Right: Auth Actions */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-[11px] font-bold uppercase tracking-widest text-[#1A302B] hover:text-[#10B981] transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-[#10B981] text-[#F9FAF8] px-6 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-widest hover:bg-[#1A302B] transition-all shadow-md active:scale-95"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            {/* 2. Panoramic Hero */}
            <section className="relative pt-32 pb-16 px-8 text-center overflow-hidden bg-[#F9FAF8]">
                {/* Stepped Background Shapes */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#1A302B]/[0.02] -z-10 translate-x-32 skew-x-12" />
                <div className="absolute top-0 left-0 w-1/4 h-full bg-[#10B981]/[0.02] -z-10 -translate-x-32 -skew-x-12" />

                <div className="max-w-6xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-7xl md:text-[140px] font-black tracking-tighter leading-[0.85] text-[#1A302B] mb-10 uppercase">
                            INVEST<span className="text-[#10B981]">.</span><br />
                            MAP<span className="text-[#10B981]">.</span> GROW<span className="text-[#10B981]">.</span>
                        </h1>
                        <p className="text-slate-500 text-lg md:text-2xl font-medium leading-relaxed max-w-3xl mx-auto mb-12 px-4">
                            The industry standard for biological asset tracking and farm investment transparency. Discover extensive private parcel data and interactive maps.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/login')}
                                className="bg-[#10B981] text-white px-10 py-5 rounded-xl text-[13px] font-bold uppercase tracking-widest shadow-xl shadow-[#10B981]/20 hover:bg-[#1A302B] transition-all"
                            >
                                Get Started For Free
                            </motion.button>
                            <button
                                onClick={() => navigate('/topography-view')}
                                className="bg-white text-[#1A302B] px-10 py-5 rounded-xl text-[13px] font-bold uppercase tracking-widest border border-slate-200 hover:border-[#10B981] transition-all"
                            >
                                View Live Map
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Stepped edge simulation */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
                    <div className="absolute top-20 right-0 w-32 h-32 border-r-8 border-t-8 border-[#1A302B]" />
                    <div className="absolute bottom-20 left-0 w-32 h-32 border-l-8 border-b-8 border-[#1A302B]" />
                </div>
            </section>

            {/* 3. CENTERPIECE MAP VIEW */}
            <section className="px-8 md:px-16 pb-12 bg-[#F9FAF8]">
                <div className="max-w-[1400px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative group p-4 bg-white/50 rounded-[56px] border border-slate-200 shadow-2xl backdrop-blur-sm"
                    >
                        {/* The Large Map Container */}
                        <div className="relative aspect-[16/9] w-full bg-slate-900 rounded-[44px] overflow-hidden border border-slate-200 shadow-inner">
                            <FarmMap
                                allowParallax={true}
                                showTooltip={true}
                                onFeatureClick={(id) => id === 'caretaker-house' && setIsModalOpen(true)}
                            />

                            {/* Overlay Controls UI */}
                            <div className="absolute bottom-10 right-10 flex items-center gap-5 pointer-events-none">
                                <div
                                    onClick={() => navigate('/topography-view')}
                                    className="w-16 h-16 bg-[#3EB489] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#3EB489]/20 transition-all hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto"
                                >
                                    <Maximize2 size={26} />
                                </div>
                            </div>

                            {/* Interaction Hint */}
                            <div className="absolute top-10 left-10 flex items-center gap-4 bg-[#064E3B] px-6 py-3 rounded-full border border-white/20 shadow-lg">
                                <MousePointer2 size={16} className="text-[#10B981]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F2FBF6]">Scroll to Zoom // Drag to Explore</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 4. Refined Asset Information */}
            <section className="py-20 px-8 bg-[#F9FAF8] border-y border-slate-100 relative">
                <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                    <div className="lg:col-span-4 sticky top-40">
                        <div className="inline-flex items-center gap-3 text-[#3EB489] text-[11px] font-black uppercase tracking-[0.3em] mb-8">
                            <div className="w-8 h-px bg-[#3EB489]/30" /> Estate Intelligence
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter uppercase leading-[0.9] mb-10 text-[#1A302B]">
                            FARM <br />
                            <span className="text-[#10B981] italic">INVESTMENT</span>
                        </h2>
                        <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12">
                            The Vriksha Estate is structured into specialized commercial blocks, each managed via automated moisture monitoring and biological data tracking.
                        </p>

                        <div className="grid grid-cols-2 gap-8 py-10 border-t border-slate-100">
                            <div>
                                <div className="text-[#1A302B] font-black text-3xl tracking-tighter italic">11.0 ACRES</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Total Estate Land</div>
                            </div>
                            <div>
                                <div className="text-[#10B981] font-black text-3xl tracking-tighter italic">100%</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Satellite Verified</div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {estateAssets.map((asset, i) => (
                            <motion.div
                                key={asset.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`group p-10 rounded-[48px] bg-white border border-slate-100 hover:border-[#10B981] hover:shadow-2xl hover:shadow-[#10B981]/5 transition-all duration-500 relative overflow-hidden`}
                            >
                                <div className={`w-16 h-16 bg-[#F9FAF8] rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform`}>
                                    {React.cloneElement(asset.icon, { size: 32, className: "text-[#10B981]" })}
                                </div>
                                <h3 className="text-2xl font-black tracking-tight text-[#1A302B] mb-3 uppercase italic">{asset.name}</h3>
                                <div className="text-[11px] font-bold text-[#10B981] tracking-[0.2em] mb-8 uppercase px-3 py-1 bg-white rounded-full inline-block border border-slate-100">{asset.detail}</div>
                                <p className="text-slate-500 text-base font-medium leading-relaxed">{asset.desc}</p>

                                <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                    <ArrowUpRight size={28} className="text-[#10B981]" />
                                </div>
                            </motion.div>
                        ))}

                        {/* Summary Card */}
                        <div className="p-10 rounded-[48px] bg-[#1A302B] text-white flex flex-col justify-between shadow-xl shadow-[#1A302B]/10 border border-white/10">
                            <div>
                                <Leaf className="w-12 h-12 mb-8 opacity-60 text-[#10B981]" />
                                <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-none mb-4">Biological <br />Appreciation</h3>
                                <p className="text-white/70 text-sm font-black leading-relaxed italic">Stable growth driven by nature, verified by modern computing.</p>
                            </div>
                            <button className="flex items-center gap-3 text-xs font-black uppercase tracking-widest mt-10 hover:gap-5 transition-all text-[#10B981]">
                                Portfolio Management <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Minimalist Tech Utility */}
            <section className="py-24 px-8 bg-[#F9FAF8]">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-8">
                            <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                                <ShieldCheck size={36} className="text-[#10B981]" />
                            </div>
                            <div>
                                <h4 className="text-[#1A302B] font-black tracking-tighter uppercase text-xl mb-4">Secured Title</h4>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">Legal verification of every land parcel integrated into the digital ledger.</p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                                <Globe size={36} className="text-blue-500" />
                            </div>
                            <div>
                                <h4 className="text-[#1A302B] font-black tracking-tighter uppercase text-xl mb-4">Precision Agri</h4>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">Real-time mapping ensuring that physical growth is always digitally verifiable.</p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                                <Zap size={36} className="text-amber-500" />
                            </div>
                            <div>
                                <h4 className="text-[#1A302B] font-black tracking-tighter uppercase text-xl mb-4">Asset Growth</h4>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">Focus on biological assets that grow consistently with or without market fluctuations.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Executive Footer */}
            <footer className="py-24 px-12 border-t border-slate-100 bg-[#F9FAF8]">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1A302B] rounded-xl flex items-center justify-center text-white shadow-md transition-transform hover:scale-110">
                            <Leaf size={22} fill="currentColor" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter uppercase italic text-[#1A302B] leading-none">Vriksha</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                        <a href="#" className="hover:text-[#10B981] transition-colors">Privacy Council</a>
                        <a href="#" className="hover:text-[#10B981] transition-colors">Asset Terms</a>
                        <a href="#" className="hover:text-[#10B981] transition-colors">Institutional Access</a>
                        <a href="#" className="hover:text-[#10B981] transition-colors">Risk portal</a>
                    </div>

                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em]">© 2026 Vriksha Digital Estates</p>
                </div>
            </footer>

            {/* Hub Gallery Modal - REFINED POP-UP CARD */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 bg-slate-950/20 backdrop-blur-md"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 40 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white/90 backdrop-blur-2xl rounded-[40px] p-8 md:p-10 max-w-4xl w-full shadow-[0_30px_100px_rgba(15,23,42,0.2)] border border-white relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Close Trigger */}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 p-3 bg-slate-100/50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all duration-300 z-50"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col gap-8">
                                <div className="flex flex-col md:flex-row items-end justify-between gap-4 px-2">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Live Node View</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Estate Operations Hub</h3>
                                    </div>
                                    <div className="flex gap-8 text-right">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Asset ID</p>
                                            <p className="text-slate-900 font-bold text-sm">HUB-01</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                            <p className="text-emerald-600 font-bold text-sm">Operational</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {GalleryImages.map((src, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="relative aspect-[4/3] rounded-3xl overflow-hidden group shadow-lg border border-slate-100"
                                        >
                                            <img
                                                src={src}
                                                alt={`Hub View ${i + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500" />
                                            <div className="absolute bottom-5 left-5 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/50">
                                                <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">Angle {i === 0 ? 'Alpha' : 'Beta'}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-md italic">
                                        "Visual verification of the central command unit, providing real-time oversight and asset management for the 11-acre diversified estate."
                                    </p>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="whitespace-nowrap px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all shadow-lg"
                                    >
                                        Close Observer
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default LandingPage;
