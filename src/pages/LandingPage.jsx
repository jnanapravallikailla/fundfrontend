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
    X,
    MessageSquare,
    Activity,
    Calendar,
    Search,
    CloudRain,
    BarChart3,
    FileText,
    Download,
    MapPin,
    Facebook,
    Instagram,
    Linkedin,
    Youtube
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
    const [flippedCard, setFlippedCard] = useState(null);
    const [openFaq, setOpenFaq] = useState(null);

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
            desc: 'Strategic water security asset ensuring 24/7 moisture control for the entire estate.',
            accent: 'bg-blue-50/50'
        }
    ];

    const whyInvest = [
        {
            title: "Land-Backed Asset Stability",
            desc: "Real assets backed by plantation land provide long-term value.",
            img: "/land-stability.png",
            icon: <ShieldCheck />
        },
        {
            title: "Biological Growth",
            desc: "Trees naturally grow and produce increasing yield over time.",
            img: "/bio-growth.png",
            icon: <TrendingUp />
        },
        {
            title: "Premium Fruit Demand",
            desc: "Global demand for mango, avocado, and coconut continues to rise.",
            img: "/fruit-demand.png",
            icon: <Zap />
        },
        {
            title: "Diversified Biological Portfolio",
            desc: "A mix of crops provides balanced estate returns.",
            img: "/diversified-biological.png",
            icon: <Maximize2 />
        }
    ];

    const investorQuestions = [
        {
            id: 1,
            q: "Is plantation investment safe?",
            a: "Greenhaven Estate is structured with verified land parcels and managed plantation operations, ensuring your investment is backed by tangible assets."
        },
        {
            id: 2,
            q: "Who manages the plantation?",
            a: "A professional estate management team handles irrigation, crop monitoring, and harvest cycles, allowing for passive investor participation."
        },
        {
            id: 3,
            q: "How are returns generated?",
            a: "Returns come from fruit harvest sales and biological asset growth over the investment cycle as the trees mature and yield increases."
        },
        {
            id: 4,
            q: "Can investors track progress?",
            a: "Yes, investors can monitor plantation development through digital mapping and growth tracking available in their secure portal."
        }
    ];

    const howItWorks = [
        { step: 1, title: "Select Asset Type", desc: "Choose from plantation assets such as mango, avocado, or coconut." },
        { step: 2, title: "Invest in Estate Blocks", desc: "Invest in structured plantation plots inside Greenhaven Estate." },
        { step: 3, title: "Managed Cultivation", desc: "Professional farm managers maintain irrigation, soil health, and crop growth." },
        { step: 4, title: "Harvest & Growth", desc: "Trees mature and produce harvest cycles over the 3-year investment period." }
    ];

    const growthCycle = [
        { year: 1, title: "Plantation Establishment", desc: "Land preparation, irrigation installation, and initial tree planting." },
        { year: 2, title: "Tree Growth", desc: "Trees grow stronger root systems and canopy development." },
        { year: 3, title: "Fruit Production", desc: "Plantations begin producing commercial fruit harvests." }
    ];

    const managementFeatures = [
        { title: "Precision Irrigation", img: "/irrigation-system.png", desc: "Automated moisture control systems ensuring optimal hydration for every tree." },
        { title: "Soil Health Monitoring", img: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=2940&auto=format&fit=crop", desc: "Continuous sensor-based tracking of nutrient levels and soil conditions." },
        { title: "Harvest Operations", img: "/fruit-harvest.png", desc: "Professional harvesting and post-harvest management for maximum export quality." }
    ];

    const faqs = [
        { q: "What returns can plantation investments generate?", a: "Returns are generated from fruit sales and biological asset appreciation, typically targeting significant long-term growth consistent with estate yields." },
        { q: "How long is the investment cycle?", a: "The primary investment cycle is approximately 3 years for the initial production phase, after which harvests become more frequent." },
        { q: "Can investors visit the plantation estate?", a: "Yes, we encourage transparency. Investors can schedule visits to Greenhaven Estate to see their managed blocks in person." },
        { q: "How is plantation maintenance handled?", a: "Our professional estate team handles all maintenance, including irrigation, pest control, and soil management, at no extra effort for you." },
        { q: "What happens after the investment period ends?", a: "Investors can choose to continue holding for recurring harvest yields or liquidate their stake in the mature plantation asset." }
    ];

    return (
        <div className="min-h-screen bg-[#F9FAF8] text-[#1A302B] font-sans selection:bg-[#10B981]/30 overflow-x-hidden">

            {/* 1. Executive Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-12 py-2 bg-white border-b-2 border-[#10B981] shadow-[0_4px_30px_rgba(16,185,129,0.3)] ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-[0_10px_40px_rgba(16,185,129,0.4)]' : ''}`}>
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    {/* Left: Brand */}
                    <div className="flex items-center group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="h-12 md:h-16 flex items-center justify-center overflow-hidden">
                            <img 
                                src="/logo.png" 
                                alt="Greenhaven Estate" 
                                className="h-28 md:h-40 w-auto object-contain" 
                            />
                        </div>
                    </div>

                    {/* Right: Auth Actions */}
                    <div className="flex items-center gap-3 md:gap-6">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-[#1A302B] hover:text-[#10B981] transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-[#10B981] text-[#F9FAF8] px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-[10px] md:text-[11px] font-bold uppercase tracking-widest hover:bg-[#1A302B] transition-all shadow-md active:scale-95"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            {/* 2. Panoramic Hero */}
            <section className="relative pt-32 md:pt-40 pb-0 px-6 md:px-8 text-center overflow-hidden bg-[#1A302B]">
                {/* Background Video */}
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover opacity-50"
                        src="/hero.mp4"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0d1f1b]/60 via-[#1A302B]/30 to-[#1A302B]" />
                </div>

                {/* Floating Glow Orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#10B981]/10 rounded-full blur-[120px] pointer-events-none z-10" />
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-[#10B981]/8 rounded-full blur-[100px] pointer-events-none z-10" />

                {/* Staircase Cutouts */}
                <motion.div
                    initial={{ y: -800, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-0 left-0 w-1/4 h-full bg-white/10 z-20 pointer-events-none hidden xl:block"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 25%, 66% 25%, 66% 50%, 33% 50%, 33% 75%, 0% 75%)' }}
                />
                <motion.div
                    initial={{ y: -800, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="absolute top-0 right-0 w-1/4 h-full bg-[#10B981]/10 z-20 pointer-events-none hidden xl:block"
                    style={{ clipPath: 'polygon(100% 0, 0% 0, 0% 25%, 33% 25%, 33% 50%, 66% 50%, 66% 75%, 100% 75%)' }}
                />

                {/* Content */}
                <div className="max-w-6xl mx-auto relative z-30 pb-16 md:pb-24">
                    <div className="flex flex-col items-center">

                        {/* Badge Pill */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 bg-[#10B981]/20 border border-[#10B981]/40 rounded-full px-5 py-2 mb-4 backdrop-blur-sm"
                        >
                            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                            <span className="text-[#10B981] text-xs font-black uppercase tracking-[0.25em]">Premium Plantation Investment Platform</span>
                        </motion.div>

                        <motion.h1
                            initial={{ x: -40, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-6xl md:text-[100px] lg:text-[110px] font-black tracking-tighter leading-[0.85] text-white uppercase"
                        >
                            INVEST<span className="text-[#10B981]" style={{textShadow: '0 0 40px rgba(16,185,129,0.6)'}}>.</span>
                        </motion.h1>
                        <motion.h1
                            initial={{ x: 40, opacity: 0 }}
                            animate={{ x: 0, y: 0, opacity: 1 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                            className="text-6xl md:text-[100px] lg:text-[110px] font-black tracking-tighter leading-[0.85] text-white uppercase"
                        >
                            MAP<span className="text-[#10B981]" style={{textShadow: '0 0 40px rgba(16,185,129,0.6)'}}>.</span>
                        </motion.h1>
                        <motion.h1
                            initial={{ x: -40, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                            className="text-6xl md:text-[100px] lg:text-[110px] font-black tracking-tighter leading-[0.85] text-white mb-4 md:mb-6 uppercase"
                        >
                            GROW<span className="text-[#10B981]" style={{textShadow: '0 0 40px rgba(16,185,129,0.6)'}}>.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="text-white/60 text-base md:text-xl font-medium leading-relaxed max-w-2xl mx-auto mb-6 md:mb-8 px-4 text-center"
                        >
                            The premium standard for biological asset tracking and plantation investment transparency. Discover private parcel data with high-yield interactive maps.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
                        >
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate('/login')}
                                className="bg-[#10B981] text-white px-10 py-5 rounded-xl text-[13px] font-black uppercase tracking-widest shadow-2xl shadow-[#10B981]/40 hover:bg-white hover:text-[#1A302B] transition-all"
                                style={{boxShadow: '0 0 40px rgba(16,185,129,0.3)'}}
                            >
                                Get Started For Free
                            </motion.button>
                            <button
                                onClick={() => navigate('/topography-view')}
                                className="bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-xl text-[13px] font-black uppercase tracking-widest border border-white/20 hover:border-[#10B981] hover:bg-white/20 transition-all"
                            >
                                View Live Map
                            </button>
                        </motion.div>

                        {/* Live Stats Row */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1, duration: 0.8 }}
                            className="flex flex-wrap items-center justify-center gap-8 md:gap-16 border-t border-white/10 pt-6 w-full max-w-2xl relative z-40"
                        >
                            {[
                                { value: '11', unit: 'Acres', label: 'Total Estate' },
                                { value: '3+', unit: 'Crops', label: 'Premium Varieties' },
                                { value: '100%', unit: '', label: 'Satellite Verified' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-white font-black text-2xl md:text-3xl tracking-tighter">
                                        {stat.value}<span className="text-[#10B981]">{stat.unit}</span>
                                    </div>
                                    <div className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10 z-10">
                    <motion.div
                        initial={{ x: 40, y: -40, opacity: 0 }}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.8 }}
                        className="absolute top-20 right-0 w-32 h-32 border-r-8 border-t-8 border-white"
                    />
                    <motion.div
                        initial={{ x: -40, y: 40, opacity: 0 }}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.8 }}
                        className="absolute bottom-20 left-0 w-32 h-32 border-l-8 border-b-8 border-white"
                    />
                </div>

                {/* Bottom Wave */}
                <div className="absolute bottom-0 left-0 w-full z-30 leading-none pointer-events-none">
                    <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 md:h-20">
                        <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#F9FAF8"/>
                    </svg>
                </div>
            </section>

            {/* 3. CENTERPIECE MAP VIEW */}
            <section id="estate-map" className="px-4 md:px-16 pb-12 bg-[#F9FAF8] flex justify-center">
                <div className="max-w-[1400px] w-full">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="relative group p-2 md:p-4 bg-white/50 rounded-xl md:rounded-2xl border border-slate-200 shadow-2xl backdrop-blur-sm"
                    >
                        {/* The Large Map Container */}
                        <div className="relative aspect-square md:aspect-[16/9] w-full bg-slate-900 rounded-lg md:rounded-xl overflow-hidden border border-slate-200 shadow-inner">
                            <FarmMap
                                allowParallax={true}
                                showTooltip={true}
                                onFeatureClick={(id) => id === 'caretaker-house' && setIsModalOpen(true)}
                            />

                            {/* Overlay Controls UI */}
                            <div className="absolute bottom-10 right-10 flex items-center gap-5 pointer-events-none">
                                <div
                                    onClick={() => navigate('/topography-view')}
                                    className="w-16 h-16 bg-[#3EB489] rounded-xl flex items-center justify-center text-white shadow-xl shadow-[#3EB489]/20 transition-all hover:scale-110 active:scale-95 cursor-pointer pointer-events-auto"
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

            {/* SECTION 1 — Why Biological Asset Investment */}
            <section className="py-24 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 text-[#10B981] text-[10px] font-black uppercase tracking-[0.3em] mb-4 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                            <Leaf size={12} /> Nature-Backed Returns
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-[#1A302B] mb-4">Why Biological Asset <span className="text-[#10B981] italic font-serif">Investment</span></h2>
                        <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">Discover the power of nature-based assets that grow in value while providing environmental stability.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
                        {whyInvest.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                        className="group p-8 rounded-xl bg-[#F2F8F6] hover:bg-white hover:shadow-2xl hover:shadow-[#10B981]/10 transition-all border border-transparent hover:border-[#10B981]/20 flex flex-col h-full"
                            >
                                <div className="w-14 h-14 bg-white rounded-md flex items-center justify-center text-[#10B981] mb-8 shadow-sm group-hover:scale-110 transition-transform">
                                    {React.cloneElement(item.icon, { size: 28 })}
                                </div>
                                <h3 className="text-xl font-black text-[#1A302B] mb-4 leading-tight uppercase italic">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">{item.desc}</p>
                                <div className="h-40 rounded-md overflow-hidden mt-auto border border-slate-100">
                                    <img src={item.img} alt={item.title} className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 2 — Investor Questions (Interactive Flip Cards) */}
            <section className="py-24 px-6 md:px-12 bg-[#F9FAF8]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-[#1A302B]">Investor <span className="text-[#10B981] italic font-serif">Questions</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {investorQuestions.map((q) => (
                            <div
                                key={q.id}
                                className="h-[280px] perspective"
                                onClick={() => setFlippedCard(flippedCard === q.id ? null : q.id)}
                            >
                                <motion.div
                                    className="relative w-full h-full text-center cursor-pointer preserve-3d"
                                    animate={{ rotateY: flippedCard === q.id ? 180 : 0 }}
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                >
                                    {/* Front */}
                                    <div className="absolute inset-0 backface-hidden bg-white rounded-xl p-8 flex flex-col items-center justify-center border border-slate-100 shadow-sm">
                                        <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                                            <MessageSquare className="text-[#10B981]" size={24} />
                                        </div>
                                        <h3 className="text-lg font-black text-[#1A302B] uppercase text-center leading-tight">{q.q}</h3>
                                        <div className="mt-8 text-[10px] font-bold text-[#10B981] uppercase tracking-[0.2em]">See Solution →</div>
                                    </div>
                                    {/* Back */}
                                    <div 
                                        className="absolute inset-0 backface-hidden bg-[#ECFDF5] rounded-xl p-8 flex flex-col items-center justify-center border border-[#10B981]/20"
                                        style={{ transform: 'rotateY(180deg)' }}
                                    >
                                        <p className="text-[#1A302B] text-sm leading-relaxed font-medium">{q.a}</p>
                                        <div className="mt-8 text-[10px] font-bold text-[#10B981]/60 uppercase tracking-[0.2em]">← Return to Question</div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 3 — How the Investment Works */}
            <section className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto position-relative z-10">
                    <div className="text-center mb-16 md:mb-24">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-[#1A302B] mb-4">
                            How it <span className="text-[#10B981]">Works</span>.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 group/grid relative">
                        {/* Desktop connecting line behind cards */}
                        <div className="absolute top-[3.25rem] left-0 w-full h-[1px] bg-slate-200 hidden lg:block z-0" />

                        {howItWorks.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: i * 0.15, duration: 0.6 }}
                                className="relative bg-[#F9FAF8] border border-slate-200 rounded-3xl p-8 hover:border-[#10B981]/40 hover:shadow-2xl hover:shadow-[#10B981]/10 transition-all duration-500 overflow-hidden flex flex-col h-full z-10 group cursor-default"
                            >
                                {/* Massive Background Watermark */}
                                <div className="absolute -bottom-8 -right-6 text-[180px] font-black text-[#10B981] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 leading-none pointer-events-none select-none tracking-tighter italic">
                                    0{item.step}
                                </div>
                                
                                {/* Step Header */}
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[#1A302B] font-black text-lg group-hover:bg-[#10B981] group-hover:text-white group-hover:border-[#10B981] transition-all duration-500 z-10 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[#10B981]/20 scale-0 rounded-2xl group-hover:scale-150 transition-transform duration-700 ease-out origin-center"></div>
                                        <span className="relative z-10">{item.step}</span>
                                    </div>
                                </div>

                                {/* Main Content */}
                                <div className="relative z-10">
                                    <h3 className="text-xl font-black text-[#1A302B] mb-3 uppercase tracking-tight leading-tight">{item.title}</h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 4 — Three-Year Growth Cycle */}
            <section className="py-24 px-6 md:px-12 bg-[#F9FAF8] relative overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#10B981]/5 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#10B981]/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                        <div>
                            <div className="inline-flex items-center gap-3 text-[#10B981] text-[11px] font-black uppercase tracking-[0.3em] mb-6 bg-[#10B981]/10 px-4 py-2 rounded-full border border-[#10B981]/20">
                                <Activity size={16} /> Biological Roadmap
                            </div>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase text-[#1A302B] leading-none">
                                Three-Year <br/><span className="text-[#10B981] italic font-serif">Growth Cycle</span>
                            </h2>
                        </div>
                        <div className="text-slate-500 font-medium max-w-sm md:text-right leading-relaxed text-lg">
                            Our plantations are managed for rapid establishment and high early-stage production.
                        </div>
                    </div>

                    <div className="relative">
                        {/* Continuous Horizontal Timeline Line for Desktop */}
                        <div className="absolute top-8 left-8 right-8 w-[calc(100%-4rem)] h-[2px] bg-slate-200 hidden lg:block" />
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                            {growthCycle.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: i * 0.15, duration: 0.7 }}
                                    className="relative flex flex-col group cursor-default"
                                >
                                    {/* Timeline Node */}
                                    <div className="flex items-center gap-6 mb-12 relative">
                                        <div className="w-16 h-16 rounded-full bg-white border-[3px] border-slate-200 group-hover:border-[#10B981] flex items-center justify-center shadow-sm group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-all duration-500 z-10 shrink-0">
                                            <span className="text-slate-400 group-hover:text-[#10B981] font-black text-xl transition-colors">0{item.year}</span>
                                        </div>
                                        {/* Mobile vertical line */}
                                        <div className="absolute top-16 left-8 w-[2px] h-[calc(100%+3rem)] bg-slate-200 lg:hidden -z-10" />
                                        
                                        <div className="text-[14px] font-black text-slate-400 group-hover:text-[#1A302B] uppercase tracking-[0.2em] transition-colors">
                                            Year {item.year}
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="bg-white rounded-3xl p-8 border border-slate-200 group-hover:border-[#10B981]/30 group-hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] transition-all duration-500 h-full flex flex-col relative overflow-hidden">
                                        <div className="mb-8 w-14 h-14 rounded-2xl bg-[#F9FAF8] flex items-center justify-center group-hover:bg-[#10B981]/10 group-hover:scale-110 transition-all duration-500 border border-slate-100">
                                            {item.year === 1 ? <Search className="text-slate-400 group-hover:text-[#10B981] transition-colors" size={24} /> : 
                                             item.year === 2 ? <TrendingUp className="text-slate-400 group-hover:text-[#10B981] transition-colors" size={24} /> : 
                                             <Calendar className="text-slate-400 group-hover:text-[#10B981] transition-colors" size={24} />}
                                        </div>
                                        <h3 className="text-2xl font-black text-[#1A302B] mb-4 uppercase tracking-tight leading-tight">{item.title}</h3>
                                        <p className="text-slate-500 text-sm font-medium leading-relaxed flex-1">{item.desc}</p>
                                        
                                        {/* Animated Progress Mini-bar */}
                                        <div className="mt-8 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div 
                                                className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399]"
                                                initial={{ width: 0 }}
                                                whileInView={{ width: '100%' }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1.5, delay: 0.3 + (i * 0.2), ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 5 — Plantation Management */}
            <section className="py-24 px-6 md:px-12 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-[#1A302B] mb-4">Plantation <span className="text-[#10B981] italic font-serif">Management</span></h2>
                        <p className="text-slate-500 max-w-2xl mx-auto font-medium">Professional oversight at every stage, from soil preparation to final harvest.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {managementFeatures.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-white rounded-xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50"
                            >
                                <div className="aspect-[16/10] overflow-hidden relative">
                                    <img src={feature.img} alt={feature.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                                <div className="p-10">
                                    <h3 className="text-2xl font-black text-[#1A302B] mb-4 uppercase italic tracking-tighter">{feature.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
                                    <div className="mt-8 flex items-center gap-3 text-[#10B981] text-[10px] font-black uppercase tracking-widest group-hover:gap-5 transition-all cursor-pointer">
                                        Learn More <ChevronRight size={14} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>



            {/* SECTION 7 — Frequently Asked Questions */}
            <section className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
                <div className="max-w-[800px] mx-auto relative z-10 w-full">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-3 text-[#10B981] text-[11px] font-black uppercase tracking-[0.3em] mb-4">
                            <Activity size={16} /> Information Support
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-[#1A302B] mb-6">
                            Frequently Asked <span className="text-[#10B981]">Questions</span>
                        </h2>
                    </div>

                    <div className="space-y-0">
                        {faqs.map((faq, i) => (
                            <div key={i} className="border-b border-slate-200 transition-all duration-300 group">
                                <button 
                                    className="w-full py-8 text-left flex items-start justify-between bg-transparent outline-none focus:outline-none cursor-pointer gap-6"
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                >
                                    <span className={`text-lg md:text-xl font-bold tracking-tight pr-8 transition-colors duration-300 mt-1 leading-snug ${openFaq === i ? 'text-[#10B981]' : 'text-[#1A302B] group-hover:text-slate-600'}`}>
                                        {faq.q}
                                    </span>
                                    {/* Animated Custom Plus / Minus */}
                                    <div className={`relative shrink-0 w-10 h-10 rounded-full border transition-all duration-300 ease-out flex items-center justify-center ${openFaq === i ? 'bg-[#10B981] border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'border-slate-200 bg-white group-hover:border-[#10B981]/50'}`}>
                                        {/* Horizontal Line */}
                                        <div className={`absolute w-3 h-[2px] rounded-full transition-all duration-300 bg-current ${openFaq === i ? 'text-white' : 'text-[#1A302B] group-hover:text-[#10B981]'}`} />
                                        {/* Vertical Line */}
                                        <div className={`absolute w-3 h-[2px] rounded-full transition-all duration-300 bg-current ${openFaq === i ? 'text-white rotate-90 opacity-0' : 'text-[#1A302B] group-hover:text-[#10B981] rotate-90'}`} />
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pb-8 pt-1 text-slate-500 font-medium leading-relaxed max-w-2xl text-base">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 8 — Call to Action */}
            <section className="py-24 px-6 md:px-12 bg-[#F9FAF8]">
                <div className="max-w-7xl mx-auto">
                    <div className="relative bg-[#1A302B] rounded-xl p-12 md:p-24 text-center overflow-hidden shadow-2xl">
                        {/* Glow orbs */}
                        <div className="absolute top-[-30%] left-[-10%] w-[60%] h-[200%] bg-[#10B981] rounded-full blur-[150px] opacity-20 pointer-events-none" />
                        <div className="absolute bottom-[-30%] right-[-10%] w-[60%] h-[200%] bg-[#10B981] rounded-full blur-[150px] opacity-20 pointer-events-none" />
                        {/* Grid lines */}
                        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'linear-gradient(#10B981 1px, transparent 1px), linear-gradient(90deg, #10B981 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 bg-[#10B981]/20 border border-[#10B981]/40 rounded-full px-5 py-2 mb-8">
                                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                                <span className="text-[#10B981] text-xs font-black uppercase tracking-[0.2em]">Live Estate Available</span>
                            </div>
                            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-white leading-none mb-8">Explore the <br /><span className="text-[#10B981] italic font-serif" style={{textShadow: '0 0 60px rgba(16,185,129,0.5)'}}>Estate Layout</span></h2>
                            <p className="text-white/60 text-lg font-medium leading-relaxed mb-12">
                                Dive into our interactive visualization of Greenhaven Estate and see the biological assets yourself.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => document.getElementById('estate-map').scrollIntoView({ behavior: 'smooth' })}
                                    className="bg-[#10B981] text-white px-10 py-5 rounded-full text-[13px] font-black uppercase tracking-widest shadow-xl shadow-[#10B981]/30 hover:bg-white hover:text-[#1A302B] transition-all min-w-[240px]"
                                    style={{boxShadow: '0 0 40px rgba(16,185,129,0.4)'}}
                                >
                                    View Plantation Map
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-full text-[13px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-3 min-w-[240px] justify-center"
                                >
                                    <Download size={18} /> Download Overview
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>





            {/* 5. Minimalist Tech Utility */}
            <section className="py-12 px-8 bg-[#F9FAF8]">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-8">
                            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                                <ShieldCheck size={36} className="text-[#10B981]" />
                            </div>
                            <div>
                                <h4 className="text-[#1A302B] font-black tracking-tighter uppercase text-xl mb-4">Secured Title</h4>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">Legal verification of every land parcel integrated into the digital ledger.</p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                                <Globe size={36} className="text-blue-500" />
                            </div>
                            <div>
                                <h4 className="text-[#1A302B] font-black tracking-tighter uppercase text-xl mb-4">Precision Growth</h4>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">Real-time mapping ensuring that physical growth is always digitally verifiable.</p>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mx-auto shadow-sm border border-slate-100">
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

            {/* 6. Simple Footer */}
            <footer className="py-12 px-6 border-t border-emerald-100 bg-[#F0FDF4]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start text-center md:text-left mb-12">
                        {/* Brand Column */}
                        <div className="flex flex-col items-center md:items-start">
                            <img src="/logo.png" alt="Greenhaven" className="h-12 w-auto mb-4" />
                            <p className="text-[#10B981] text-[10px] font-black uppercase tracking-widest italic mb-2">Powered by Vriksha</p>
                            <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-[320px]">
                                Premium biological assets and fractional farmland investment.
                            </p>
                        </div>

                        {/* Contact Column */}
                        <div className="flex flex-col items-center md:items-end">
                            <h4 className="text-[#1A302B] text-[10px] font-black uppercase tracking-[0.2em] mb-4">Contact Us</h4>
                            <p className="text-[#1A302B] text-lg font-bold mb-1 tracking-tight">+91 99080 66699</p>
                            <p className="text-slate-600 text-sm font-medium mb-3">info@greenhaven.com</p>
                            <p className="text-slate-500 text-sm font-medium italic">Bangalore, Hanur</p>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-emerald-200/30 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#10B981]/60">
                        <p>© 2026 Greenhaven. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-[#1A302B] transition-colors">Privacy</a>
                            <a href="#" className="hover:text-[#1A302B] transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Simple Floating WhatsApp */}
            <a 
                href="https://wa.me/919908066699?text=hi%20i%20am%20interest%20in%20your%20green%20haven%20investment"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-[100] w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 text-white text-2xl"
                aria-label="Chat on WhatsApp"
            >
                <i className="fa-brands fa-whatsapp"></i>
            </a>

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
                            className="bg-white/95 backdrop-blur-2xl rounded-xl p-5 md:p-6 max-w-5xl w-full max-h-[85vh] overflow-y-auto shadow-[0_30px_100px_rgba(15,23,42,0.2)] border border-white relative scrollbar-hide"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Close Trigger */}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-2 bg-slate-100/50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all duration-300 z-50 shadow-sm"
                            >
                                <X size={18} />
                            </button>

                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col md:flex-row items-end justify-between gap-3 px-1">
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-[0.3em]">Live Node View</span>
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Estate Operations Hub</h3>
                                    </div>
                                    <div className="flex gap-4 text-right">
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Asset ID</p>
                                            <p className="text-slate-900 font-bold text-[10px]">HUB-01</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                                            <p className="text-emerald-600 font-bold text-[10px]">Operational</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {GalleryImages.map((src, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="relative aspect-video rounded-2xl overflow-hidden group shadow-md border border-slate-100"
                                        >
                                            <img
                                                src={src}
                                                alt={`Hub View ${i + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500" />
                                            <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-md px-2 py-1 rounded-full border border-white/50 shadow-sm">
                                                <p className="text-[7px] font-black text-slate-900 uppercase tracking-widest">Node {i + 1}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                                    <p className="text-[9px] text-slate-500 font-medium leading-relaxed max-w-lg italic">
                                        "Visual verification of the central command unit, providing real-time oversight and asset management for the 11-acre diversified estate."
                                    </p>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="whitespace-nowrap px-6 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-600 transition-all shadow-md active:scale-95"
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

// CSS for 3D card flip
const styles = `
  .perspective {
    perspective: 1000px;
  }
  .preserve-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
`;

// Inject styles directly or you can move to a separate CSS file
if (typeof document !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

export default LandingPage;
