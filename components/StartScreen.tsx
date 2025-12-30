/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DesignBrief } from '../types';
import { ChevronRightIcon, ShirtIcon } from './icons';

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

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else onComplete(brief);
  };

  const isStep1Valid = brief.projectType.length > 2 && brief.sceneContext.length > 5;
  const isStep2Valid = brief.characterProfile.length > 2 && brief.psychologicalState.length > 2;
  const isStep3Valid = brief.filmingLocation.length > 2; // Constraints are optional

  const fadeIn = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 font-sans">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-gray-900 mb-4 shadow-lg rounded-sm">
             <ShirtIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight">
          CineFit Pro: Costume Director
        </h1>
        <p className="text-sm text-gray-500 mt-2 font-mono tracking-wider uppercase">
          Script Analysis • Production Logistics • Character Arc
        </p>
      </div>

      <div className="bg-white border border-gray-200 shadow-2xl overflow-hidden rounded-lg min-h-[550px] flex flex-col md:flex-row">
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-1/3 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-8 flex flex-col">
            <nav className="space-y-8">
                <div className={`transition-all ${step === 1 ? 'opacity-100 scale-105' : 'opacity-40'}`}>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">01 Context</span>
                    <h3 className="text-xl font-serif font-bold text-gray-900">Project & Scene</h3>
                </div>
                <div className={`transition-all ${step === 2 ? 'opacity-100 scale-105' : 'opacity-40'}`}>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">02 Persona</span>
                    <h3 className="text-xl font-serif font-bold text-gray-900">Character Profile</h3>
                </div>
                <div className={`transition-all ${step === 3 ? 'opacity-100 scale-105' : 'opacity-40'}`}>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">03 Logistics</span>
                    <h3 className="text-xl font-serif font-bold text-gray-900">Production Constraints</h3>
                </div>
            </nav>
            <div className="mt-auto pt-8">
                 <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-gray-900"
                        initial={{ width: "33%" }}
                        animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
                    />
                 </div>
            </div>
        </div>

        {/* Input Area */}
        <div className="w-full md:w-2/3 p-8 md:p-12 relative flex flex-col">
            {step === 1 && (
            <motion.div key="step1" {...fadeIn} className="flex-grow space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        1. Project Genre & Tone
                    </label>
                    <input
                        type="text"
                        placeholder="e.g. Neo-Noir Detective Film, Gritty 1970s Drama"
                        value={brief.projectType}
                        onChange={(e) => setBrief({ ...brief, projectType: e.target.value })}
                        className="w-full p-4 bg-gray-50 border-l-2 border-gray-300 focus:border-gray-900 focus:bg-white outline-none transition-colors"
                        autoFocus
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        2. Scene Context (Script Excerpt)
                    </label>
                    <textarea
                        placeholder="Briefly describe the scene action and mood. e.g. 'EXT. ALLEY - NIGHT. Chasing the suspect through heavy rain.'"
                        value={brief.sceneContext}
                        onChange={(e) => setBrief({ ...brief, sceneContext: e.target.value })}
                        className="w-full h-32 p-4 bg-gray-50 border-l-2 border-gray-300 focus:border-gray-900 focus:bg-white outline-none transition-colors resize-none"
                    />
                </div>
            </motion.div>
            )}

            {step === 2 && (
            <motion.div key="step2" {...fadeIn} className="flex-grow space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        3. Character Details
                    </label>
                    <input
                        type="text"
                        placeholder="Name, Age, Role, Social Class. e.g. 'Sarah, 30s, Undercover Cop, Working class pretending to be wealthy'"
                        value={brief.characterProfile}
                        onChange={(e) => setBrief({ ...brief, characterProfile: e.target.value })}
                        className="w-full p-4 bg-gray-50 border-l-2 border-gray-300 focus:border-gray-900 focus:bg-white outline-none transition-colors"
                        autoFocus
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        4. Psychological State / Intent
                    </label>
                    <textarea
                        placeholder="What is the character feeling? What do they want to SHOW vs HIDE? e.g. 'Nervous but trying to project authority.'"
                        value={brief.psychologicalState}
                        onChange={(e) => setBrief({ ...brief, psychologicalState: e.target.value })}
                        className="w-full h-32 p-4 bg-gray-50 border-l-2 border-gray-300 focus:border-gray-900 focus:bg-white outline-none transition-colors resize-none"
                    />
                </div>
            </motion.div>
            )}

            {step === 3 && (
            <motion.div key="step3" {...fadeIn} className="flex-grow space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        5. Filming Location (Real World)
                    </label>
                    <input
                        type="text"
                        placeholder="City/Country (for Weather check). e.g. London, UK"
                        value={brief.filmingLocation}
                        onChange={(e) => setBrief({ ...brief, filmingLocation: e.target.value })}
                        className="w-full p-4 bg-gray-50 border-l-2 border-gray-300 focus:border-gray-900 focus:bg-white outline-none transition-colors"
                        autoFocus
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        6. Production Constraints (Optional)
                    </label>
                    <textarea
                        placeholder="Budget, Stunts, Camera/Lens restrictions. e.g. 'Low Budget, Stunt Double needed, No pure whites'"
                        value={brief.productionConstraints}
                        onChange={(e) => setBrief({ ...brief, productionConstraints: e.target.value })}
                        className="w-full h-32 p-4 bg-gray-50 border-l-2 border-gray-300 focus:border-gray-900 focus:bg-white outline-none transition-colors resize-none"
                    />
                </div>
            </motion.div>
            )}

            <div className="pt-6 flex justify-between items-center border-t border-gray-100 mt-4">
                 {step > 1 ? (
                    <button onClick={() => setStep(step - 1 as any)} className="text-gray-500 text-sm font-semibold hover:text-gray-900">
                        Back
                    </button>
                 ) : <div></div>}
                 
                <button
                    onClick={handleNext}
                    disabled={step === 1 ? !isStep1Valid : step === 2 ? !isStep2Valid : !isStep3Valid}
                    className="flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-sm hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                    <span className="font-bold tracking-widest text-xs uppercase">{step === 3 ? 'Generate Look' : 'Next Step'}</span>
                    <ChevronRightIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;