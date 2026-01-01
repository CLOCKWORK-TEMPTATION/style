/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { XIcon } from './icons';

export interface SceneCardData {
  id: string;
  sceneNumber: string;
  slugline: string;
  time: 'DAY' | 'NIGHT';
  costumeId: string | null;
  isContinuous: boolean;
}

interface ContinuityTimelineProps {
  scenes: SceneCardData[];
  activeSceneId: string;
  onSceneSelect: (id: string) => void;
  onFixContinuity: (targetSceneId: string, sourceOutfitId: string) => void;
}

const ContinuityTimeline: React.FC<ContinuityTimelineProps> = ({ 
  scenes, 
  activeSceneId, 
  onSceneSelect, 
  onFixContinuity 
}) => {
  return (
    <div className="w-full bg-[#09090b] border-t border-white/10 flex flex-col">
      <div className="px-6 py-2 flex justify-between items-center bg-black/40">
        <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500/80 animate-pulse"></span>
          Timeline Sequence
        </h3>
        <div className="flex gap-1">
            {Array.from({length: 20}).map((_, i) => (
                <div key={i} className={`w-px h-1 ${i % 5 === 0 ? 'bg-zinc-600 h-2' : 'bg-zinc-800'}`}></div>
            ))}
        </div>
      </div>

      <div className="flex overflow-x-auto p-4 gap-1 scrollbar-hide relative min-h-[100px] items-center">
        <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-800 -z-0"></div>
        
        {scenes.map((scene, index) => {
          const prevScene = scenes[index - 1];
          const hasRaccordError = scene.isContinuous && prevScene && prevScene.costumeId !== scene.costumeId;
          const isActive = scene.id === activeSceneId;

          return (
            <div key={scene.id} className="relative flex items-center group z-10">
              {hasRaccordError && (
                <button 
                  onClick={() => prevScene.costumeId && onFixContinuity(scene.id, prevScene.costumeId)}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500 text-red-400 text-[9px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-md"
                >
                  Fix Continuity
                </button>
              )}

              <motion.button
                onClick={() => onSceneSelect(scene.id)}
                whileHover={{ y: -2 }}
                className={`
                  relative w-28 h-16 rounded overflow-hidden flex flex-col justify-between p-2 text-left transition-all border
                  ${isActive ? 'bg-zinc-800 border-[#d4b483] shadow-[0_0_15px_rgba(212,180,131,0.1)]' : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'}
                  ${hasRaccordError ? 'border-red-500 ring-1 ring-red-500/50' : ''}
                `}
              >
                <div className="flex justify-between items-center w-full">
                   <span className="text-[9px] font-mono text-zinc-400 font-bold">{scene.sceneNumber}</span>
                   <div className={`w-1.5 h-1.5 rounded-full ${scene.costumeId ? 'bg-green-500' : 'bg-zinc-700'}`}></div>
                </div>
                
                <div>
                   <span className={`text-[8px] font-bold px-1 rounded ${scene.time === 'DAY' ? 'bg-blue-900/30 text-blue-200' : 'bg-purple-900/30 text-purple-200'}`}>{scene.time}</span>
                   <p className="text-[9px] text-zinc-400 truncate mt-1 font-mono uppercase opacity-70">{scene.slugline.split('.')[1] || scene.slugline}</p>
                </div>
              </motion.button>
              
              {/* Connector Line */}
              {index < scenes.length - 1 && (
                  <div className={`w-4 h-0.5 ${scene.isContinuous ? 'bg-zinc-600' : 'bg-zinc-800 border-t border-dashed border-zinc-600 bg-transparent'}`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContinuityTimeline;