/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { RotateCcwIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';
import Spinner from './Spinner';
import { AnimatePresence, motion } from 'framer-motion';
import { Compare } from './ui/compare';

interface CanvasProps {
  displayImageUrl: string | null;
  videoUrl?: string | null;
  compareImages?: { left: string; right: string } | null;
  onStartOver: () => void;
  isLoading: boolean;
  loadingMessage: string;
  onSelectPose: (index: number) => void;
  poseInstructions: string[];
  currentPoseIndex: number;
  availablePoseKeys: string[];
}

const Canvas: React.FC<CanvasProps> = ({ 
    displayImageUrl, 
    videoUrl,
    compareImages,
    onStartOver, 
    isLoading, 
    loadingMessage, 
    onSelectPose, 
    poseInstructions, 
    currentPoseIndex, 
    availablePoseKeys 
}) => {
  const [isPoseMenuOpen, setIsPoseMenuOpen] = useState(false);
  
  const handlePreviousPose = () => {
    // Logic for traversing poses (simplified for now)
  };

  const handleNextPose = () => {
     // Logic for traversing poses
  };

  // 1. حالة العرض: فيديو (اختبار ضغط)
  if (videoUrl) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4 relative animate-zoom-in bg-black">
             <button 
                onClick={onStartOver}
                className="absolute top-4 left-4 z-30 flex items-center justify-center text-center bg-white/60 text-gray-900 font-bold py-2 px-4 rounded-full text-xs backdrop-blur-sm hover:bg-white"
            >
                <ChevronLeftIcon className="w-4 h-4 mr-2" />
                Back to Image
            </button>
            <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="max-w-full max-h-full rounded-lg shadow-2xl border border-gray-800"
            />
        </div>
      );
  }

  // 2. حالة العرض: مقارنة (A/B Testing)
  if (compareImages) {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 relative animate-fade-in">
             <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest z-30 shadow-lg">
                 A/B Comparison Mode
             </div>
             <Compare 
                firstImage={compareImages.left}
                secondImage={compareImages.right}
                className="w-full h-full max-w-3xl max-h-[80vh] rounded-xl shadow-2xl border border-gray-200"
                slideMode="drag"
             />
             <div className="mt-4 flex gap-8 text-xs font-bold uppercase tracking-widest text-gray-500">
                 <span>Left: Previous Design</span>
                 <span>Right: Current Simulation</span>
             </div>
          </div>
      );
  }

  // 3. حالة العرض: صورة عادية (Standard Fit)
  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative animate-zoom-in group">
      {/* CSS Animation for Scanning Effect defined inline for scope */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
      
      {/* Start Over Button */}
      <button 
          onClick={onStartOver}
          className="absolute top-4 left-4 z-30 flex items-center justify-center text-center bg-white/60 border border-gray-300/80 text-gray-700 font-semibold py-2 px-4 rounded-full transition-all duration-200 ease-in-out hover:bg-white hover:border-gray-400 active:scale-95 text-sm backdrop-blur-sm"
      >
          <RotateCcwIcon className="w-4 h-4 mr-2" />
          Start Over
      </button>

      {/* Image Display or Placeholder */}
      <div className="relative w-full h-full flex items-center justify-center">
        {displayImageUrl ? (
          <img
            key={displayImageUrl} // Use key to force re-render
            src={displayImageUrl}
            alt="Virtual try-on model"
            className="max-w-full max-h-full object-contain transition-opacity duration-500 animate-fade-in rounded-lg shadow-md"
          />
        ) : (
            <div className="w-[400px] h-[600px] bg-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center">
              <Spinner />
              <p className="text-md font-serif text-gray-600 mt-4">Initializing Reality Engine...</p>
            </div>
        )}
        
        <AnimatePresence>
          {isLoading && (
              <motion.div
                  className="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-20 rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
              >
                  <Spinner />
                  {loadingMessage && (
                      <p className="text-lg font-serif text-gray-700 mt-4 text-center px-4 animate-pulse">{loadingMessage}</p>
                  )}
              </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Basic Pose Controls (Visual only for now) */}
      {displayImageUrl && !isLoading && (
        <div 
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="flex items-center justify-center gap-2 bg-white/60 backdrop-blur-md rounded-full p-2 border border-gray-300/50 shadow-sm">
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 px-2">Static View</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;