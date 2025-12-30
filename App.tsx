/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StartScreen from './components/StartScreen';
import FittingRoom from './components/FittingRoom';
import Header from './components/Header';
import Footer from './components/Footer';
import Spinner from './components/Spinner';
import { generateProfessionalDesign } from './services/geminiService';
import { DesignBrief, ProfessionalDesignResult } from './types';
import { RotateCcwIcon, CheckCircleIcon, ShirtIcon } from './components/icons';
import { getFriendlyErrorMessage } from './lib/utils';

type AppMode = 'home' | 'director' | 'fitting';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('home');
  
  // Director Mode State
  const [directorView, setDirectorView] = useState<'brief' | 'processing' | 'lookbook'>('brief');
  const [directorResult, setDirectorResult] = useState<ProfessionalDesignResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State to pass from Director to Fitting
  // Enhanced to include analysis constraints
  const [designToFit, setDesignToFit] = useState<{
      url: string; 
      name: string; 
      description: string;
      weather: string;
      constraints: string;
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
        // Construct a rich description for the fitting AI
        const richDescription = `
            Title: ${directorResult.lookTitle}.
            Basics: ${directorResult.breakdown.basics}.
            Layers: ${directorResult.breakdown.layers}.
            Materials: ${directorResult.breakdown.materials}.
            Color Palette: ${directorResult.breakdown.colorPalette}.
        `;
        
        // Extract analysis data
        const weatherInfo = `${directorResult.realWeather.condition}, ${directorResult.realWeather.temp}°F`;
        const constraintsInfo = `Camera: ${directorResult.productionNotes.cameraWarnings}. Notes: ${directorResult.productionNotes.copies}`;

        setDesignToFit({
            url: directorResult.conceptArtUrl,
            name: directorResult.lookTitle,
            description: richDescription,
            weather: weatherInfo,
            constraints: constraintsInfo
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
            initialGarmentDescription={designToFit?.description}
            initialWeather={designToFit?.weather}
            initialConstraints={designToFit?.constraints}
        />
      );
  }

  return (
    <div className="font-sans bg-gray-100 text-gray-900 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 relative">
        <AnimatePresence mode="wait">
          
          {/* HOME / DASHBOARD */}
          {mode === 'home' && (
            <motion.div 
                key="home"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8"
            >
                {/* Card 1: Director */}
                <button 
                    onClick={() => setMode('director')}
                    className="group bg-white p-10 border border-gray-200 hover:border-gray-900 transition-all duration-300 shadow-xl hover:shadow-2xl text-left flex flex-col h-80 justify-between relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-32 bg-gray-50 rounded-full -mr-16 -mt-16 group-hover:bg-gray-100 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-gray-900 text-white flex items-center justify-center mb-6 rounded-sm">
                            <span className="font-serif font-bold text-2xl">A</span>
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Costume Director</h2>
                        <p className="text-gray-500 font-medium">AI Script Analysis & Concept Design.</p>
                    </div>
                    <div className="relative z-10 flex items-center text-sm font-bold uppercase tracking-widest text-gray-900 group-hover:underline decoration-2 underline-offset-4">
                        Analyze Script &rarr;
                    </div>
                </button>

                {/* Card 2: Fitting Room */}
                <button 
                    onClick={() => setMode('fitting')}
                    className="group bg-gray-900 p-10 border border-gray-900 transition-all duration-300 shadow-xl hover:shadow-2xl text-left flex flex-col h-80 justify-between relative overflow-hidden"
                >
                     <div className="absolute top-0 right-0 p-32 bg-gray-800 rounded-full -mr-16 -mt-16 group-hover:bg-gray-700 transition-colors opacity-50"></div>
                     <div className="relative z-10">
                        <div className="w-12 h-12 bg-white text-gray-900 flex items-center justify-center mb-6 rounded-sm">
                             <ShirtIcon className="w-6 h-6" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-2">Fitting Room</h2>
                        <p className="text-gray-400 font-medium">Virtual Try-On & Visual Testing.</p>
                     </div>
                     <div className="relative z-10 flex items-center text-sm font-bold uppercase tracking-widest text-white group-hover:underline decoration-2 underline-offset-4">
                        Enter Fitting &rarr;
                    </div>
                </button>
            </motion.div>
          )}

          {/* DIRECTOR MODE */}
          {mode === 'director' && (
            <motion.div
              key="director"
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
                <div className="absolute top-0 left-0 p-4">
                    <button onClick={() => setMode('home')} className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900">
                        &larr; Back to Hub
                    </button>
                </div>

                {/* Director Sub-Views */}
                {directorView === 'brief' && (
                    <>
                        <StartScreen onComplete={handleBriefComplete} />
                        {error && (
                            <div className="max-w-md mx-auto mt-6 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 shadow-sm text-center">
                            <p className="font-bold text-xs uppercase mb-1">System Error</p>
                            <p className="text-sm">{error}</p>
                            </div>
                        )}
                    </>
                )}

                {directorView === 'processing' && (
                    <div className="text-center flex justify-center">
                        <div className="bg-white p-12 max-w-md w-full border border-gray-200 shadow-2xl flex flex-col items-center">
                            <Spinner />
                            <h3 className="mt-8 text-2xl font-serif font-bold text-gray-900 tracking-wide">Developing Look...</h3>
                            <div className="mt-6 space-y-3 w-full text-left">
                                <p className="text-xs font-mono text-gray-400">1. ANALYZING SCRIPT DRAMA...</p>
                                <p className="text-xs font-mono text-gray-400">2. CHECKING LOCATION WEATHER...</p>
                                <p className="text-xs font-mono text-gray-400">3. SOURCING MATERIALS & FABRICS...</p>
                                <p className="text-xs font-mono text-gray-400">4. FINALIZING PRODUCTION NOTES...</p>
                            </div>
                        </div>
                    </div>
                )}

                {directorView === 'lookbook' && directorResult && (
                    <div className="w-full max-w-7xl mx-auto bg-white shadow-2xl flex flex-col lg:flex-row min-h-[800px] border border-gray-200">
                         {/* Visual Side (Left) */}
                        <div className="w-full lg:w-5/12 relative bg-gray-900 group">
                            <img 
                            src={directorResult.conceptArtUrl} 
                            alt="Character Concept Art" 
                            className="w-full h-full object-cover opacity-95"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                            
                            {/* Weather Badge */}
                            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-3 py-2 border-l-4 border-gray-900 shadow-lg">
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Location Reality</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-gray-900">{directorResult.realWeather.temp}°F</span>
                                    <span className="text-xs font-medium text-gray-700 uppercase">{directorResult.realWeather.condition}</span>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                                <div className="inline-block px-2 py-1 bg-gray-900 border border-white/30 text-white text-[10px] font-bold tracking-widest uppercase mb-2">
                                    Look #{Math.floor(Math.random() * 100) + 1}
                                </div>
                                <h2 className="text-4xl font-serif leading-tight mb-2 text-right lg:text-left dir-rtl" style={{ direction: 'rtl' }}>
                                    {directorResult.lookTitle}
                                </h2>
                                {/* NEW: Action Button to Pipeline */}
                                <button 
                                    onClick={handleMoveToFitting}
                                    className="mt-4 bg-white text-gray-900 px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-2"
                                >
                                    <ShirtIcon className="w-4 h-4" />
                                    Try on Actor
                                </button>
                            </div>
                        </div>

                        {/* Data Side (Right) */}
                        <div className="w-full lg:w-7/12 p-8 lg:p-10 flex flex-col bg-white overflow-y-auto" style={{ direction: 'rtl' }}>
                            {/* Header */}
                            <div className="mb-8 border-b-2 border-gray-100 pb-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-left">Dramatic Intent</h3>
                                <p className="text-lg font-serif text-gray-800 leading-relaxed">
                                    {directorResult.dramaticDescription}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* Breakdown Column */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-left border-b border-gray-100 pb-2">Costume Breakdown</h3>
                                    <ul className="space-y-4 text-sm">
                                        <li className="flex flex-col"><span className="font-bold text-gray-900">ملابس أساسية:</span><span className="text-gray-600">{directorResult.breakdown.basics}</span></li>
                                        <li className="flex flex-col"><span className="font-bold text-gray-900">طبقات إضافية:</span><span className="text-gray-600">{directorResult.breakdown.layers}</span></li>
                                        <li className="flex flex-col"><span className="font-bold text-gray-900">خامات / ملمس:</span><span className="text-gray-600">{directorResult.breakdown.materials}</span></li>
                                        <li className="flex flex-col"><span className="font-bold text-gray-900">ألوان:</span><span className="text-gray-600">{directorResult.breakdown.colorPalette}</span></li>
                                    </ul>
                                </div>

                                {/* Rationale Column */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-left border-b border-gray-100 pb-2">Why this Look?</h3>
                                    <ul className="space-y-3">
                                        {directorResult.rationale.map((point, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                                <CheckCircleIcon className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Production Notes Section */}
                            <div className="bg-gray-50 p-6 border border-gray-200 rounded-sm mt-auto">
                                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 text-left flex items-center gap-2">Production Logistics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-gray-600">
                                    <div><span className="block font-bold text-gray-800 mb-1">نسخ (Continuity):</span>{directorResult.productionNotes.copies}</div>
                                    <div><span className="block font-bold text-gray-800 mb-1">تعتيق (Distressing):</span>{directorResult.productionNotes.distressing}</div>
                                    <div><span className="block font-bold text-red-700 mb-1">تحذير كاميرا:</span>{directorResult.productionNotes.cameraWarnings}</div>
                                    <div><span className="block font-bold text-blue-700 mb-1">بديل طقس:</span>{directorResult.productionNotes.weatherAlt}</div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between" style={{ direction: 'ltr' }}>
                                <div className="text-[10px] text-gray-400 font-mono">PRO_STYLIST_AI<br/>DEPT: COSTUME</div>
                                <button onClick={handleDirectorStartOver} className="flex items-center px-6 py-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors">
                                    <RotateCcwIcon className="w-4 h-4 mr-2" />New Brief
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <Footer isOnDressingScreen={false} />
    </div>
  );
};

export default App;