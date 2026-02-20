import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    TrendingUp,
    ShieldCheck,
    Map as MapIcon,
    BarChart3,
    Layers,
    Leaf,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';

// Token handling


const Landing = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const navigate = useNavigate();
    const [hoveredFeature, setHoveredFeature] = useState(null);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [error, setError] = useState(null);

    // Farm Data
    const farmData = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'id': 1,
                'properties': {
                    'name': 'Alpha Mango Orchard',
                    'type': 'Mango Garden',
                    'acres': '5.5',
                    'roi': '18.4%',
                    'color': '#10b981',
                    'description': 'Premium Alphonso and Kesar varieties.'
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [[
                        [77.596, 12.976],
                        [77.600, 12.976],
                        [77.600, 12.972],
                        [77.596, 12.972],
                        [77.596, 12.976]
                    ]]
                }
            },
            {
                'type': 'Feature',
                'id': 2,
                'properties': {
                    'name': 'Avocado Ridge',
                    'type': 'Avocado Garden',
                    'acres': '3.5',
                    'roi': '22.1%',
                    'color': '#84cc16',
                    'description': 'Hass avocado with automated drip irrigation.'
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [[
                        [77.596, 12.969],
                        [77.600, 12.969],
                        [77.600, 12.965],
                        [77.596, 12.965],
                        [77.596, 12.969]
                    ]]
                }
            },
            {
                'type': 'Feature',
                'id': 4,
                'properties': {
                    'name': 'Vriksha Reservoir',
                    'type': 'Natural Water Hub',
                    'acres': '2.0',
                    'roi': 'N/A',
                    'color': '#3b82f6',
                    'description': 'Natural rainwater catchment system for the 11-acre estate.'
                },
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [[
                        [77.593, 12.970],
                        [77.596, 12.970],
                        [77.596, 12.967],
                        [77.593, 12.967],
                        [77.593, 12.970]
                    ]]
                }
            }
        ]
    };

    useEffect(() => {
        if (map.current) return; // Prevent double initialization

        // Check for WebGL support
        if (!mapboxgl.supported()) {
            setError("WebGL not supported");
            return;
        }

        try {
            console.log("Using Token:", MAPBOX_TOKEN.substring(0, 10) + "...");
            map.current = new mapboxgl.Map({
                accessToken: MAPBOX_TOKEN, // Explicitly pass the token
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/satellite-v9',
                center: [77.5946, 12.9716],
                zoom: 15,
                pitch: 60,
                bearing: -15,
                antialias: true,
                renderWorldCopies: false
            });

            map.current.on('load', () => {
                setIsMapLoaded(true);
                console.log("Map successfully loaded");

                // Add 3D Terrain
                map.current.addSource('mapbox-dem', {
                    'type': 'raster-dem',
                    'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                    'tileSize': 512
                });
                map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

                // Add Atmosphere
                map.current.setFog({
                    'range': [0.5, 10],
                    'color': '#050505',
                    'horizon-blend': 0.1
                });

                // Add GeoJSON
                map.current.addSource('farm-sectors', {
                    'type': 'geojson',
                    'data': farmData,
                    'generateId': true
                });

                map.current.addLayer({
                    'id': 'farm-fills',
                    'type': 'fill',
                    'source': 'farm-sectors',
                    'paint': {
                        'fill-color': ['get', 'color'],
                        'fill-opacity': [
                            'case',
                            ['boolean', ['feature-state', 'hover'], false],
                            0.5,
                            0.2
                        ]
                    }
                });

                map.current.addLayer({
                    'id': 'farm-borders',
                    'type': 'line',
                    'source': 'farm-sectors',
                    'paint': {
                        'line-color': ['get', 'color'],
                        'line-width': 2
                    }
                });

                let hoveredId = null;

                map.current.on('mousemove', 'farm-fills', (e) => {
                    if (e.features.length > 0) {
                        if (hoveredId !== null) {
                            map.current.setFeatureState(
                                { source: 'farm-sectors', id: hoveredId },
                                { hover: false }
                            );
                        }
                        hoveredId = e.features[0].id;
                        map.current.setFeatureState(
                            { source: 'farm-sectors', id: hoveredId },
                            { hover: true }
                        );
                        setHoveredFeature(e.features[0].properties);
                        map.current.getCanvas().style.cursor = 'pointer';
                    }
                });

                map.current.on('mouseleave', 'farm-fills', () => {
                    if (hoveredId !== null) {
                        map.current.setFeatureState(
                            { source: 'farm-sectors', id: hoveredId },
                            { hover: false }
                        );
                    }
                    hoveredId = null;
                    setHoveredFeature(null);
                    map.current.getCanvas().style.cursor = '';
                });
            });

            map.current.on('error', (e) => {
                console.error("Mapbox error:", e);
                if (e.error?.status === 401 || e.error?.message?.includes('Unauthorized')) {
                    setError("Mapbox 401 Unauthorized: Your access token is invalid or expired. Please add a valid VITE_MAPBOX_TOKEN to your .env file.");
                } else {
                    setError(`Mapbox Relay Error: ${e.error?.message || 'Check network connection'}`);
                }
            });

        } catch (err) {
            console.error("Initialization error:", err);
            setError(err.message);
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null; // CRITICAL: Reset the ref for React 18
            }
        };
    }, []);

    const features = [
        {
            icon: <ShieldCheck className="text-emerald-500" />,
            title: "Verified Equity",
            desc: "Each plot is backed by real agricultural assets."
        },
        {
            icon: <TrendingUp className="text-emerald-500" />,
            title: "Consistent ROI",
            desc: "Targeted annual returns of 12-24%."
        },
        {
            icon: <Layers className="text-emerald-500" />,
            title: "Diversification",
            desc: "Invest across different crop types."
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">

            {/* 1. Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 backdrop-blur-md bg-black/40 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                        <Leaf className="text-black" size={24} />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase italic">Vriksha</span>
                </div>

                <div className="hidden md:flex items-center gap-10 text-[10px] font-bold tracking-[0.3em] uppercase text-white/60">
                    <a href="#how-it-works" className="hover:text-emerald-500 transition-colors">How it works</a>
                    <a href="#featured" className="hover:text-emerald-500 transition-colors">Farms</a>
                    <a href="#benefits" className="hover:text-emerald-500 transition-colors">Benefits</a>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2.5 bg-emerald-500 text-black rounded-full hover:bg-white transition-all shadow-lg pointer-events-auto"
                    >
                        Dashboard
                    </button>
                </div>
            </nav>

            {/* 2. Hero Section */}
            <section className="relative h-screen w-full">
                {/* Map Container - MUST have dimensions */}
                <div
                    ref={mapContainer}
                    className="absolute inset-0 z-0 bg-[#0a0a0a]"
                    style={{ width: '100vw', height: '100vh' }}
                />

                {/* Loading/Error State */}
                {!isMapLoaded && !error && (
                    <div className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin text-emerald-500 mb-4" size={32} />
                        <p className="text-white/40 text-xs font-bold tracking-[0.5em] uppercase animate-pulse">
                            SYNCING SATELLITE RELAY
                        </p>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 z-40 bg-black flex flex-col items-center justify-center p-8 text-center">
                        <p className="text-red-500 mb-2">Map Error</p>
                        <p className="text-white/40 text-sm max-w-xs">{error}</p>
                    </div>
                )}

                {/* Dynamic Vignette Overlay */}
                <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_200px_rgba(0,0,0,0.9)] bg-gradient-to-t from-[#050505] via-transparent to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 z-20 pointer-events-none flex items-center px-[8%]">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-10">
                                MODERN <br />
                                <span className="text-emerald-500 italic font-serif font-light lowercase">agri-equity</span>
                            </h1>
                            <p className="text-lg md:text-xl text-white/50 font-light mb-12 max-w-lg leading-relaxed">
                                Invest in high-performance agricultural estates with real-time satellite verification and AI-driven yield optimization.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-8 pointer-events-auto">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="group flex items-center gap-4 bg-white text-black px-12 py-5 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-emerald-500 transition-all shadow-2xl"
                                >
                                    INVEST NOW <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest">
                                    View Roadmap <ChevronRight size={16} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Hover Popup Detail */}
                <AnimatePresence>
                    {hoveredFeature && (
                        <motion.div
                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            className="absolute bottom-12 right-12 z-30 w-80 pointer-events-none"
                        >
                            <div className="bg-black/60 backdrop-blur-3xl border border-white/10 p-8 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-emerald-500/20 text-emerald-500">
                                        <BarChart3 size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30">Sector Identity</p>
                                        <h3 className="text-white font-bold tracking-tight">{hoveredFeature.name}</h3>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end border-b border-white/5 pb-3">
                                        <span className="text-white/40 text-[10px] uppercase tracking-widest">Area</span>
                                        <span className="text-lg font-bold font-mono tracking-tighter">{hoveredFeature.acres} Ac</span>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-white/5 pb-3">
                                        <span className="text-white/40 text-[10px] uppercase tracking-widest">Returns</span>
                                        <span className="text-lg font-bold text-emerald-400 font-mono tracking-tighter">{hoveredFeature.roi}</span>
                                    </div>
                                </div>

                                <p className="mt-6 text-[11px] text-white/40 leading-relaxed italic border-t border-white/5 pt-4">
                                    {hoveredFeature.description}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Map UI Elements */}
                {!hoveredFeature && (
                    <div className="absolute bottom-12 right-12 z-30 flex flex-col items-end gap-2 text-right">
                        <div className="flex items-center gap-2 text-emerald-500 mb-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">SATELLITE RELAY LIVE</span>
                        </div>
                        <div className="w-48 h-[1px] bg-white/10" />
                        <div className="flex items-center gap-4 text-white/20 text-[9px] font-medium tracking-widest uppercase mt-2">
                            <span>LAT: 12.9716</span>
                            <span>LON: 77.5946</span>
                        </div>
                    </div>
                )}
            </section>

            {/* 3. Stats Section */}
            <section className="py-24 border-y border-white/5 bg-black">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    <div>
                        <div className="text-3xl md:text-5xl font-black mb-2 text-emerald-500 tracking-tighter">₹2.6B+</div>
                        <div className="text-[9px] text-white/30 uppercase font-bold tracking-[0.3em]">Total value</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-5xl font-black mb-2 italic tracking-tighter">11.0</div>
                        <div className="text-[9px] text-white/30 uppercase font-bold tracking-[0.3em]">Managed acres</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-5xl font-black mb-2 text-emerald-500 tracking-tighter">18.5%</div>
                        <div className="text-[9px] text-white/30 uppercase font-bold tracking-[0.3em]">Avg annual ROI</div>
                    </div>
                    <div>
                        <div className="text-3xl md:text-5xl font-black mb-2 italic tracking-tighter underline decoration-emerald-500 decoration-4 underline-offset-8">2.4K</div>
                        <div className="text-[9px] text-white/30 uppercase font-bold tracking-[0.3em]">Active investors</div>
                    </div>
                </div>
            </section>

            {/* 4. Benefits */}
            <section id="benefits" className="py-32 bg-[#050505]">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-16">
                            <div>
                                <h2 className="text-5xl font-black tracking-tighter mb-8 leading-[0.9] uppercase">THE FUTURE OF <br /><span className="text-emerald-500 italic">DIGITAL HARVEST</span></h2>
                                <p className="text-white/40 text-lg font-light leading-relaxed">
                                    We combine institutional-grade asset management with cutting-edge satellite monitoring to deliver a transparent investment pipeline.
                                </p>
                            </div>

                            <div className="grid gap-12">
                                {features.map((f, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="mt-1 p-3 bg-white/5 rounded-xl group-hover:bg-emerald-500 transition-colors group-hover:text-black">
                                            {f.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold mb-2 uppercase tracking-tighter italic">{f.title}</h4>
                                            <p className="text-white/40 text-sm font-light leading-relaxed">{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative aspect-square">
                            <div className="absolute inset-0 bg-emerald-500/10 blur-[120px] rounded-full" />
                            <div className="relative h-full w-full rounded-[60px] overflow-hidden border border-white/10 grayscale hover:grayscale-0 transition-all duration-1000">
                                <img
                                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
                                    className="h-full w-full object-cover opacity-60"
                                    alt="Farm"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                                <div className="absolute bottom-10 left-10 p-8 bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl max-w-xs">
                                    <p className="text-emerald-500 font-bold mb-1 tracking-widest text-[9px] uppercase">Verified Unit #704</p>
                                    <p className="text-white font-serif italic text-xl mb-4">Hillside Avocado Orchard</p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-white/40">Equity value:</span>
                                        <span className="text-emerald-400 font-bold">₹12,40,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Footer */}
            <footer className="py-20 border-t border-white/5 bg-black">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-3">
                        <Leaf className="text-emerald-500" size={32} />
                        <span className="text-3xl font-black tracking-tighter uppercase italic">Vriksha</span>
                    </div>
                    <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Risk portal</a>
                        <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    </div>
                    <p className="text-[10px] text-white/10 uppercase tracking-[0.5em]">© 2026 Vriksha Estate Management</p>
                </div>
            </footer>

        </div>
    );
};

export default Landing;
