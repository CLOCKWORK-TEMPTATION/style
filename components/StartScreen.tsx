/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DesignBrief } from '../types';
import { ChevronRightIcon, MicIcon, VideoIcon, SparklesIcon } from './icons';
import { transcribeAudio, analyzeVideoContent } from '../services/geminiService';

interface StartScreenProps {
  onComplete: (brief: DesignBrief) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [brief, setBrief] = useState<DesignBrief>({
    projectType: '',
    sceneContext: '',
    characterProfile: '',
    psychologicalState: '',
    filmingLocation: '',
    productionConstraints: ''
  });

  // AI Input State
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzingMedia, setIsAnalyzingMedia] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else onComplete(brief);
  };

  // Validation Logic
  const currentValidity = 
    step === 1 ? (brief.projectType.length > 2 && brief.sceneContext.length > 5) :
    step === 2 ? (brief.characterProfile.length > 2 && brief.psychologicalState.length > 2) :
    (brief.filmingLocation.length > 2);

  // عناوين المراحل بلغة مصمم الأزياء
  const stepTitles = {
      1: "The World & Palette",  // العالم واللوحة اللونية
      2: "The Silhouette",       // الظل الخارجي (الشخصية)
      3: "Fabric & Function"     // الوظيفة والحركة
  };

  // --- AI Input Handlers ---
  const handleDictation = async () => {
    if (isRecording) {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    } else {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            const audioChunks: Blob[] = [];

            mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioFile = new File([audioBlob], "dictation.wav", { type: 'audio/wav' });
                
                setIsAnalyzingMedia(true);
                try {
                    const text = await transcribeAudio(audioFile);
                    // Smart Append based on active step
                    if (step === 1) setBrief(prev => ({ ...prev, sceneContext: prev.sceneContext + " " + text }));
                    if (step === 2) setBrief(prev => ({ ...prev, psychologicalState: prev.psychologicalState + " " + text }));
                    if (step === 3) setBrief(prev => ({ ...prev, productionConstraints: prev.productionConstraints + " " + text }));
                } catch (e) {
                    console.error("Transcription failed", e);
                } finally {
                    setIsAnalyzingMedia(false);
                }
            };
            mediaRecorder.start();
            setIsRecording(true);
        } catch (e) {
            alert("Microphone access denied");
        }
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setIsAnalyzingMedia(true);
      try {
          const analysis = await analyzeVideoContent(file);
          setBrief(prev => ({ 
              ...prev, 
              projectType: prev.projectType || "Visual Reference",
              sceneContext: prev.sceneContext + "\n[Moodboard Analysis]: " + analysis 
          }));
      } catch (err) {
          console.error(err);
      } finally {
          setIsAnalyzingMedia(false);
      }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 font-sans relative flex items-start gap-12 h-[80vh]">
      
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none" />

      {/* LEFT COLUMN: THE COSTUME BREAKDOWN (The core change) */}
      <div className="w-2/3 h-full flex flex-col">
          
          {/* Header */}
          <div className="mb-10 pl-2 border-l-2 border-[#d4b483]">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d4b483] mb-2">Costume Department Breakdown</h2>
            <h1 className="text-6xl font-serif text-white">{stepTitles[step]}</h1>
          </div>

          {/* The "Script" Paper Container */}
          <div className="flex-grow bg-[#121214] border border-white/5 rounded-sm p-10 shadow-2xl relative overflow-hidden flex flex-col justify-center">
             {/* Subtle grid lines like a cutting mat */}
             <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
             <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-12 relative z-10"
                >
                    {step === 1 && (
                        <>
                            <div className="group">
                                <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 group-focus-within:text-[#d4b483] transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-zinc-700 group-focus-within:bg-[#d4b483]"></span>
                                    Era & Visual Texture
                                </label>
                                <input
                                    type="text"
                                    value={brief.projectType}
                                    onChange={(e) => setBrief({ ...brief, projectType: e.target.value })}
                                    className="w-full bg-transparent border-b border-zinc-800 text-3xl font-serif text-white pb-3 focus:outline-none focus:border-[#d4b483] transition-colors placeholder:text-zinc-800 placeholder:italic"
                                    placeholder="e.g. Victorian Gothic, Gritty 70s, Cyberpunk..."
                                    autoFocus
                                />
                                <p className="mt-2 text-[10px] text-zinc-600 font-mono">Defines the silhouette rules and fabric availability.</p>
                            </div>
                            <div className="group">
                                <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 group-focus-within:text-[#d4b483] transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-zinc-700 group-focus-within:bg-[#d4b483]"></span>
                                    Atmosphere & Lighting
                                </label>
                                <textarea
                                    value={brief.sceneContext}
                                    onChange={(e) => setBrief({ ...brief, sceneContext: e.target.value })}
                                    className="w-full bg-transparent border-b border-zinc-800 text-xl font-mono text-zinc-300 pb-2 focus:outline-none focus:border-[#d4b483] transition-colors min-h-[120px] resize-none leading-relaxed placeholder:text-zinc-800"
                                    placeholder="Is it raining? High contrast noir lighting? Neon city? (Affects fabric sheen and texture choice)"
                                />
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="group">
                                <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 group-focus-within:text-[#d4b483] transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-zinc-700 group-focus-within:bg-[#d4b483]"></span>
                                    Archetype & Social Class
                                </label>
                                <input
                                    type="text"
                                    value={brief.characterProfile}
                                    onChange={(e) => setBrief({ ...brief, characterProfile: e.target.value })}
                                    className="w-full bg-transparent border-b border-zinc-800 text-3xl font-serif text-white pb-3 focus:outline-none focus:border-[#d4b483] transition-colors placeholder:text-zinc-800 placeholder:italic"
                                    placeholder="e.g. 'The Fallen Aristocrat', 'Blue Collar Hero'..."
                                    autoFocus
                                />
                                <p className="mt-2 text-[10px] text-zinc-600 font-mono">Dictates the wear-and-tear and quality of garments.</p>
                            </div>
                            <div className="group">
                                <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 group-focus-within:text-[#d4b483] transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-zinc-700 group-focus-within:bg-[#d4b483]"></span>
                                    Visual Subtext (The Mask)
                                </label>
                                <textarea
                                    value={brief.psychologicalState}
                                    onChange={(e) => setBrief({ ...brief, psychologicalState: e.target.value })}
                                    className="w-full bg-transparent border-b border-zinc-800 text-xl font-serif italic text-zinc-300 pb-2 focus:outline-none focus:border-[#d4b483] transition-colors min-h-[120px] resize-none leading-relaxed placeholder:text-zinc-800"
                                    placeholder="What are they hiding? e.g. 'Trying to look rich but failing', 'Armored against the world'..."
                                />
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="group">
                                <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 group-focus-within:text-[#d4b483] transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-zinc-700 group-focus-within:bg-[#d4b483]"></span>
                                    Filming Location (Weather Check)
                                </label>
                                <input
                                    type="text"
                                    value={brief.filmingLocation}
                                    onChange={(e) => setBrief({ ...brief, filmingLocation: e.target.value })}
                                    className="w-full bg-transparent border-b border-zinc-800 text-3xl font-serif text-white pb-3 focus:outline-none focus:border-[#d4b483] transition-colors placeholder:text-zinc-800 placeholder:italic"
                                    placeholder="e.g. Cairo, Egypt (July)"
                                    autoFocus
                                />
                                <p className="mt-2 text-[10px] text-zinc-600 font-mono">We will check real weather data to suggest fabric weight.</p>
                            </div>
                            <div className="group">
                                <label className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 group-focus-within:text-[#d4b483] transition-colors">
                                    <span className="w-2 h-2 rounded-full bg-zinc-700 group-focus-within:bg-[#d4b483]"></span>
                                    Movement & Stunt Requirements
                                </label>
                                <textarea
                                    value={brief.productionConstraints}
                                    onChange={(e) => setBrief({ ...brief, productionConstraints: e.target.value })}
                                    className="w-full bg-transparent border-b border-zinc-800 text-xl font-mono text-zinc-300 pb-2 focus:outline-none focus:border-[#d4b483] transition-colors min-h-[120px] resize-none leading-relaxed placeholder:text-zinc-800"
                                    placeholder="Running, Fighting, Wire-work? (Need gussets? Hidden padding?)"
                                />
                            </div>
                        </>
                    )}
             </AnimatePresence>
          </div>
      </div>

      {/* RIGHT COLUMN: TOOLS & NAVIGATION */}
      <div className="w-1/3 h-full flex flex-col pt-24 gap-6">
            
            {/* AI Tools Panel (Styled as 'Assistants') */}
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-sm backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-white/60">
                        <SparklesIcon className="w-4 h-4 text-[#d4b483]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Studio Assistants</span>
                    </div>
                    {isAnalyzingMedia && <span className="text-[9px] text-[#d4b483] animate-pulse">PROCESSING...</span>}
                </div>
                
                <div className="space-y-3">
                    <button 
                        onClick={handleDictation}
                        className={`w-full py-4 px-4 border flex items-center gap-4 transition-all group ${isRecording ? 'bg-red-900/10 border-red-500/30' : 'bg-black/40 border-zinc-800 hover:border-zinc-600'}`}
                    >
                        <div className={`p-2 rounded-full ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-zinc-800 text-zinc-400 group-hover:text-white'}`}>
                            <MicIcon className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <span className="block text-[10px] font-bold uppercase text-zinc-300">Voice Note</span>
                            <span className="block text-[9px] text-zinc-600">Dictate scene notes</span>
                        </div>
                    </button>

                    <label className="w-full py-4 px-4 border border-zinc-800 bg-black/40 hover:border-zinc-600 flex items-center gap-4 transition-all cursor-pointer group">
                        <div className="p-2 rounded-full bg-zinc-800 text-zinc-400 group-hover:text-white">
                            <VideoIcon className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <span className="block text-[10px] font-bold uppercase text-zinc-300">Import Ref</span>
                            <span className="block text-[9px] text-zinc-600">Analyze moodboard/video</span>
                        </div>
                        <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                    </label>
                </div>
            </div>

            {/* Step Progress & Navigation */}
            <div className="mt-auto">
                <div className="flex justify-between items-end mb-4 px-1">
                    <span className="text-4xl font-serif text-zinc-700">0{step}</span>
                    <div className="flex gap-1 mb-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`h-1 w-8 ${step >= i ? 'bg-[#d4b483]' : 'bg-zinc-800'}`} />
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleNext}
                    disabled={!currentValidity}
                    className="w-full py-5 bg-[#d4b483] text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-between px-6 group"
                >
                    <span>{step === 3 ? 'Generate Design Look' : 'Next Phase'}</span>
                    <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                {step > 1 && (
                     <button onClick={() => setStep(step - 1 as any)} className="w-full mt-3 py-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest hover:text-white transition-colors text-center border border-transparent hover:border-zinc-800">
                        Previous Phase
                    </button>
                )}
            </div>

        </div>

    </div>
  );
};

export default StartScreen;