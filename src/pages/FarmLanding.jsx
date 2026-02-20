import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FarmMap from '../components/FarmMap';

const GalleryImages = [
    "/img2.png",
    "/img3.png",
    "/view.jpg"
];

const FarmLanding = () => {
    const [parallax, setParallax] = useState({ x: 0, y: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const xMove = (clientX - window.innerWidth / 2) / (window.innerWidth / 20);
            const yMove = (clientY - window.innerHeight / 2) / (window.innerHeight / 20);
            setParallax({ x: -xMove, y: -yMove });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-[#F2FBF6] text-[#064E3B]">
            {/* Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-10 py-8 pointer-events-none">
                <div className="max-w-[1400px] mx-auto grid grid-cols-3 items-center pointer-events-auto">
                    {/* Left: Brand */}
                    <div className="flex items-center gap-3 cursor-pointer justify-self-start" onClick={() => navigate('/')}>
                        <div className="w-12 h-12 bg-[#064E3B] flex items-center justify-center rounded-2xl shadow-lg">
                            <Leaf className="text-[#F2FBF6]" size={24} />
                        </div>
                        <div>
                            <span className="text-2xl font-black tracking-tighter uppercase italic block leading-none text-[#064E3B]">Vriksha</span>
                            <span className="text-[10px] uppercase tracking-[0.4em] text-[#10B981] block mt-1">Estate Systems</span>
                        </div>
                    </div>

                    {/* Center: Primary CTA */}
                    <div className="flex justify-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-10 py-3.5 bg-[#10B981] text-[#064E3B] rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-[#064E3B] hover:text-[#F2FBF6] transition-all shadow-xl shadow-[#10B981]/20"
                        >
                            Investment
                        </button>
                    </div>

                    {/* Right: Sub-Nav */}
                    <div className="flex justify-self-end items-center gap-10 text-[10px] font-bold tracking-[0.3em] uppercase text-[#064E3B]">
                        <a href="/#farms" className="hover:text-[#10B981] transition-colors">Farms</a>
                        <a href="/" className="hover:text-[#10B981] transition-colors">Overview</a>
                    </div>
                </div>
            </nav>

            {/* Interactive Map Background */}
            <motion.div
                className="absolute inset-0 z-0 scale-105"
                animate={{ x: parallax.x, y: parallax.y }}
                transition={{ type: 'spring', stiffness: 40, damping: 25 }}
            >
                <FarmMap showTooltip={true} allowParallax={false} onFeatureClick={(id) => id === 'caretaker-house' && setIsModalOpen(true)} />
            </motion.div>

            {/* Information Overlay */}
            <div className="fixed bottom-10 left-10 z-40 max-w-md pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-10 bg-white/80 backdrop-blur-2xl border border-[#BDFCC9]/50 rounded-[48px] shadow-2xl shadow-[#064E3B]/5"
                >
                    <h1 className="text-4xl font-black tracking-tighter leading-none mb-6 uppercase text-[#064E3B]">
                        ESTATE <br />
                        <span className="text-[#10B981] italic font-serif font-light lowercase">visualization</span>
                    </h1>
                    <p className="text-sm text-[#064E3B]/70 font-medium leading-relaxed mb-10">
                        High-resolution topography of our active agricultural sectors. Move your cursor to explore yield estimates and asset distribution.
                    </p>
                    <div className="flex items-center gap-6 pointer-events-auto">
                        <button
                            onClick={() => navigate('/')}
                            className="text-[10px] font-bold uppercase tracking-widest text-[#064E3B]/40 hover:text-[#10B981] transition-colors underline underline-offset-8"
                        >
                            Back to Landing
                        </button>
                        <div className="w-1 h-1 rounded-full bg-[#10B981]" />
                        <button className="text-[10px] font-bold uppercase tracking-widest text-[#10B981] hover:underline underline-offset-8 transition-colors">
                            Download Specs
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Vignette to soften map edges in dark theme */}
            <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_150px_rgba(8,28,25,1)]" />

            {/* Gallery Modal - REFINED POP-UP CARD */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 bg-slate-950/20 backdrop-blur-md"
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
                                            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                                            <span className="text-[10px] font-black text-[#10B981] uppercase tracking-[0.3em]">Live Node View</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-[#064E3B] tracking-tight">Estate Operations Hub</h3>
                                    </div>
                                    <div className="flex gap-8 text-right">
                                        <div>
                                            <p className="text-[9px] font-black text-[#064E3B]/40 uppercase tracking-widest mb-1">Asset ID</p>
                                            <p className="text-[#064E3B] font-bold text-sm">HUB-01</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-[#064E3B]/40 uppercase tracking-widest mb-1">Status</p>
                                            <p className="text-[#10B981] font-bold text-sm">Operational</p>
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

                                <div className="bg-[#F2FBF6] rounded-3xl p-6 border border-[#BDFCC9]/30 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <p className="text-[11px] text-[#064E3B]/60 font-medium leading-relaxed max-w-md italic">
                                        "Visual verification of the central command unit, providing real-time oversight and asset management for the 11-acre diversified estate."
                                    </p>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="whitespace-nowrap px-8 py-3 bg-[#10B981] text-[#064E3B] text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#064E3B] hover:text-[#F2FBF6] transition-all shadow-lg shadow-[#10B981]/20"
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

export default FarmLanding;
