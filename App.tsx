/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StartScreen from './components/StartScreen';
import FittingRoom from './components/FittingRoom';
import Header from './components/Header';
import Spinner from './components/Spinner';
import { generateProfessionalDesign } from './services/geminiService';
import { DesignBrief, ProfessionalDesignResult } from './types';
import { RotateCcwIcon, CheckCircleIcon, ShirtIcon, SparklesIcon, ChevronRightIcon } from './components/icons';
import { getFriendlyErrorMessage } from './lib/utils';

type AppMode = 'home' | 'director' | 'fitting';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('home');
  
  // Director Mode State
  const [directorView, setDirectorView] = useState<'brief' | 'processing' | 'lookbook'>('brief');
  const [directorResult, setDirectorResult] = useState<ProfessionalDesignResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State to pass from Director to Fitting
  const [designToFit, setDesignToFit] = useState<{
      url: string; 
      name: string; 
      weather: string;
  } | undefined>(undefined);

  const handleBriefComplete = async (brief: DesignBrief) => {
    setDirectorView('processing');
    setError(null);
    try {
      const data = await generateProfessionalDesign(brief);
      setDirectorResult(data);
      setDirectorView('lookbook');
    } catch (err) {
      setError(getFriendlyErrorMessage(err as any, 'Design generation failed'));
      setDirectorView('brief');
    }
  };

  const handleDirectorStartOver = () => {
    setDirectorResult(null);
    setDirectorView('brief');
    setError(null);
  };

  const handleMoveToFitting = () => {
    if (directorResult) {
        setDesignToFit({
            url: directorResult.conceptArtUrl,
            name: directorResult.lookTitle,
            weather: `${directorResult.realWeather.condition}, ${directorResult.realWeather.temp}°F`
        });
        setMode('fitting');
    }
  };

  // Main Render Logic
  if (mode === 'fitting') {
      return (
        <FittingRoom 
            onBack={() => {
                setMode('home');
                setDesignToFit(undefined); // Clear state on exit
            }}
            initialGarmentUrl={designToFit?.url}
            initialGarmentName={designToFit?.name}
            initialWeather={designToFit?.weather}
        />
      );
  }

  return (
    <div className="font-sans bg-zinc-950 text-zinc-100 min-h-screen flex flex-col selection:bg-[#d4b483] selection:text-black">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center relative">
        {/* Ambient Light Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#d4b483]/5 blur-[120px] rounded-full mix-blend-screen" />
        </div>

        <AnimatePresence mode="wait">
          
          {/* HOME / DASHBOARD */}
          {mode === 'home' && (
            <motion.div 
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 p-6 z-10 mt-20"
            >
                {/* Card 1: Director (Renamed to Design Strategy) */}
                <button 
                    onClick={() => setMode('director')}
                    className="group relative h-[500px] overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900/40 hover:border-[#d4b483]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#d4b483]/10 text-left"
                >
                     {/* Image Background with Gradient */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1533158307587-828f0a76ef93?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 p-10 w-full z-20">
                        <div className="w-10 h-10 border border-zinc-600 rounded-full flex items-center justify-center mb-6 group-hover:border-[#d4b483] group-hover:bg-[#d4b483] group-hover:text-black transition-all">
                            <span className="font-serif italic text-lg">1</span>
                        </div>
                        <h2 className="text-5xl font-serif text-white mb-3 group-hover:translate-x-2 transition-transform duration-500">Design Brief</h2>
                        <p className="text-zinc-400 font-light max-w-sm text-sm leading-relaxed mb-6 group-hover:text-zinc-200">
                            Translate script requirements into visual language. Breakdown character arc, period, and atmosphere.
                        </p>
                        <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4b483] group-hover:text-white transition-colors">
                            Start Breakdown <ChevronRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </button>

                {/* Card 2: Fitting Room (Renamed to Atelier) */}
                <button 
                    onClick={() => setMode('fitting')}
                    className="group relative h-[500px] overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900/40 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 text-left"
                >
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"></div>
                     <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

                     <div className="absolute bottom-0 left-0 p-10 w-full z-20">
                        <div className="w-10 h-10 border border-zinc-600 rounded-full flex items-center justify-center mb-6 group-hover:border-purple-400 group-hover:bg-purple-400 group-hover:text-black transition-all">
                             <ShirtIcon className="w-4 h-4" />
                        </div>
                        <h2 className="text-5xl font-serif text-white mb-3 group-hover:translate-x-2 transition-transform duration-500">The Atelier</h2>
                        <p className="text-zinc-400 font-light max-w-sm text-sm leading-relaxed mb-6 group-hover:text-zinc-200">
                            Virtual fitting and stress testing. Check materials against lighting, stunts, and camera requirements.
                        </p>
                         <div className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-purple-400 group-hover:text-white transition-colors">
                            Enter Studio <ChevronRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                     </div>
                </button>
            </motion.div>
          )}

          {/* DIRECTOR MODE */}
          {mode === 'director' && (
            <motion.div
              key="director"
              className="w-full min-h-screen flex flex-col pt-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
                {/* Back Button */}
                <div className="fixed top-8 left-8 z-50">
                    <button onClick={() => setMode('home')} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                        <span className="w-6 h-[1px] bg-zinc-500 group-hover:bg-white"></span> Back
                    </button>
                </div>

                {/* Director Sub-Views */}
                {directorView === 'brief' && (
                    <div className="flex-grow flex items-center justify-center">
                        <StartScreen onComplete={handleBriefComplete} />
                        {error && (
                            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 p-4 bg-red-900/80 backdrop-blur text-red-100 border border-red-800 rounded shadow-2xl flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                <p className="text-xs font-mono">{error}</p>
                            </div>
                        )}
                    </div>
                )}

                {directorView === 'processing' && (
                    <div className="flex-grow flex items-center justify-center">
                        <div className="text-center">
                            <Spinner />
                            <h3 className="mt-8 text-3xl font-serif text-[#d4b483] tracking-wide animate-pulse">Designing...</h3>
                            <div className="mt-8 flex flex-col gap-2 items-center">
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">Researching Era...</span>
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600">Sourcing Fabrics...</span>
                                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-700">Building Silhouette...</span>
                            </div>
                        </div>
                    </div>
                )}

                {directorView === 'lookbook' && directorResult && (
                    <div className="w-full flex-grow flex flex-col lg:flex-row bg-zinc-950">
                         {/* Visual Side (Left) */}
                        <div className="w-full lg:w-1/2 relative h-[60vh] lg:h-auto overflow-hidden group">
                            <motion.img 
                                initial={{ scale: 1.1, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                src={directorResult.conceptArtUrl} 
                                alt="Character Concept Art" 
                                className="w-full h-full object-cover object-top opacity-90 transition-transform duration-[10s] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/50 via-transparent to-transparent opacity-50" />
                            
                            {/* Weather Badge - Minimal */}
                            <div className="absolute top-8 right-8 text-right">
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">Location Data</p>
                                <div className="text-2xl font-serif text-white">
                                    {directorResult.realWeather.temp > 0 ? `${directorResult.realWeather.temp}°F` : 'N/A'}
                                </div>
                                <div className="text-xs text-[#d4b483] font-medium uppercase tracking-wider">{directorResult.realWeather.condition}</div>
                            </div>

                            <div className="absolute bottom-12 left-12 max-w-lg z-20">
                                <div className="flex items-center gap-2 mb-4">
                                     <span className="w-8 h-[1px] bg-[#d4b483]"></span>
                                     <span className="text-[10px] font-bold uppercase tracking-widest text-[#d4b483]">Final Concept</span>
                                </div>
                                <h2 className="text-5xl md:text-7xl font-serif text-white leading-[0.9] mb-4 dir-rtl" style={{ direction: 'rtl' }}>
                                    {directorResult.lookTitle}
                                </h2>
                                
                                <button 
                                    onClick={handleMoveToFitting}
                                    className="mt-6 group/btn flex items-center gap-4 pl-0 pr-6 py-3 text-white hover:text-[#d4b483] transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-full border border-white/20 group-hover/btn:border-[#d4b483] flex items-center justify-center backdrop-blur-md transition-all">
                                         <ShirtIcon className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-[10px] font-bold uppercase tracking-widest opacity-50">Next Phase</span>
                                        <span className="block text-sm font-serif italic">Engineering & Fit Check</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Data Side (Right) */}
                        <div className="w-full lg:w-1/2 p-8 lg:p-20 overflow-y-auto max-h-screen custom-scrollbar relative">
                            <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none">
                                <h1 className="text-9xl font-serif text-white">REF</h1>
                            </div>

                            <div className="space-y-16" style={{ direction: 'rtl' }}>
                                {/* Narrative */}
                                <section>
                                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 text-left border-b border-zinc-800 pb-2">Dramatic Intent</h3>
                                    <p className="text-xl md:text-2xl font-serif text-zinc-200 leading-relaxed pl-10 border-r-2 border-[#d4b483] pr-6">
                                        "{directorResult.dramaticDescription}"
                                    </p>
                                </section>

                                {/* Rationale */}
                                <section>
                                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 text-left border-b border-zinc-800 pb-2">Design Rationale</h3>
                                    <ul className="grid grid-cols-1 gap-4">
                                        {directorResult.rationale.map((point, idx) => (
                                            <li key={idx} className="bg-zinc-900/50 p-4 border border-zinc-800/50 rounded flex gap-4 hover:border-zinc-700 transition-colors">
                                                <span className="text-[#d4b483] mt-1 text-lg">✦</span>
                                                <span className="text-sm text-zinc-300 font-light leading-relaxed">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                     {/* Breakdown */}
                                    <section>
                                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 text-left border-b border-zinc-800 pb-2">Wardrobe Breakdown</h3>
                                        <dl className="space-y-4 text-sm">
                                            {[
                                                { k: 'ملابس أساسية', v: directorResult.breakdown.basics },
                                                { k: 'طبقات', v: directorResult.breakdown.layers },
                                                { k: 'خامات', v: directorResult.breakdown.materials },
                                                { k: 'ألوان', v: directorResult.breakdown.colorPalette },
                                            ].map((item, i) => (
                                                <div key={i} className="group">
                                                    <dt className="text-xs font-bold text-zinc-500 mb-1">{item.k}</dt>
                                                    <dd className="text-zinc-200 border-r border-zinc-800 pr-3 group-hover:border-[#d4b483] transition-colors">{item.v}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </section>

                                    {/* Production Notes */}
                                    <section>
                                        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 text-left border-b border-zinc-800 pb-2">Production Logistics</h3>
                                        <div className="bg-zinc-900 p-6 rounded-lg space-y-4">
                                            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                                                <span className="text-xs text-zinc-500">Continuity Copies</span>
                                                <span className="font-mono text-[#d4b483]">{directorResult.productionNotes.copies}</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                                                <span className="text-xs text-zinc-500">Distressing</span>
                                                <span className="font-mono text-zinc-300">{directorResult.productionNotes.distressing}</span>
                                            </div>
                                            {directorResult.productionNotes.cameraWarnings && (
                                                <div className="pt-2">
                                                    <span className="text-[9px] text-red-500 uppercase font-bold block mb-1">Camera Warning</span>
                                                    <p className="text-xs text-zinc-400">{directorResult.productionNotes.cameraWarnings}</p>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                </div>
                            </div>

                            <div className="mt-20 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity" style={{ direction: 'ltr' }}>
                                <button onClick={handleDirectorStartOver} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white flex items-center gap-2">
                                    <RotateCcwIcon className="w-3 h-3" /> Discard & Restart
                                </button>
                                <span className="text-[9px] font-mono text-zinc-600">AI MODEL: GEMINI 3.0 PRO</span>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;