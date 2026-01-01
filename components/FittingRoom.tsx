/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import LightingStudio from './LightingStudio';
import Dashboard from './Dashboard';
import { ProjectProvider, useProject } from '../contexts/ProjectContext';
import { evaluateSafety, FabricType, SceneHazard } from '../services/rulesEngine';
import { generateFullTechPack, TechPackSpec } from '../services/techPackService';
import { ChevronLeftIcon, PlusIcon, CheckCircleIcon } from './icons';
import WardrobeModal from './WardrobeSheet';
import { WardrobeItem } from '../types';
import ContinuityTimeline, { SceneCardData } from './ContinuityTimeline';
import { TechPackView } from './TechPackView';

interface FittingRoomProps {
    onBack: () => void;
    initialGarmentUrl?: string;
    initialGarmentName?: string;
    initialWeather?: string;
}

const EngineeringWorkspace: React.FC<FittingRoomProps> = ({ onBack, initialGarmentUrl, initialGarmentName, initialWeather }) => {
    const { projectName, currentRole, addNotification } = useProject();
    
    const [textureUrl, setTextureUrl] = useState<string | null>(initialGarmentUrl || null);
    const [selectedFabric, setSelectedFabric] = useState<FabricType>('cotton');
    const [hazards, setHazards] = useState<SceneHazard[]>([]);
    const [safetyReport, setSafetyReport] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'3d' | 'data'>('3d');
    const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
    
    const [projectYear, setProjectYear] = useState<number>(2024);
    const [techPack, setTechPack] = useState<TechPackSpec | null>(null);
    const [showTechPackModal, setShowTechPackModal] = useState(false);
    
    const [activeSceneId, setActiveSceneId] = useState('SC-4');
    const [scenes, setScenes] = useState<SceneCardData[]>([
        { id: 'SC-1', sceneNumber: 'SC-1', slugline: 'INT. APARTMENT', time: 'DAY', costumeId: 'costume-a', isContinuous: false },
        { id: 'SC-2', sceneNumber: 'SC-2', slugline: 'EXT. STREET', time: 'DAY', costumeId: 'costume-a', isContinuous: true },
        { id: 'SC-3', sceneNumber: 'SC-3', slugline: 'INT. CAFE', time: 'DAY', costumeId: 'costume-a', isContinuous: true },
        { id: 'SC-4', sceneNumber: 'SC-4', slugline: 'EXT. ALLEY', time: 'NIGHT', costumeId: null, isContinuous: true },
        { id: 'SC-5', sceneNumber: 'SC-5', slugline: 'INT. SAFEHOUSE', time: 'NIGHT', costumeId: 'costume-b', isContinuous: true },
    ]);

    useEffect(() => {
        const report = evaluateSafety(selectedFabric, hazards);
        setSafetyReport(report);
        const tp = generateFullTechPack(selectedFabric, 'coat', projectYear, 'black');
        setTechPack(tp);
        if (report.status === 'critical') addNotification(`تنبيه سلامة: ${report.issues[0]}`);
        if (tp.historicalWarning) addNotification(tp.historicalWarning);
    }, [selectedFabric, hazards, projectYear, addNotification]);

    const toggleHazard = (h: SceneHazard) => setHazards(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);

    const handleGarmentSelect = (file: File, item: WardrobeItem) => {
        const url = URL.createObjectURL(file);
        setTextureUrl(url);
        setIsWardrobeOpen(false);
        setScenes(prev => prev.map(s => s.id === activeSceneId ? { ...s, costumeId: item.id } : s));
        addNotification('Scene costume updated. Checking continuity...');
    };

    const handleFixContinuity = (targetSceneId: string, sourceOutfitId: string) => {
        setScenes(prev => prev.map(s => s.id === targetSceneId ? { ...s, costumeId: sourceOutfitId } : s));
        addNotification(`Continuity fixed for ${targetSceneId}`);
    };

    return (
        <div className="flex flex-col h-screen bg-[#09090b] text-white overflow-hidden font-sans">
            
            {/* Top Navigation Bar */}
            <div className="h-14 border-b border-white/10 flex items-center px-6 justify-between z-30 bg-[#09090b]/90 backdrop-blur-sm">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                        <ChevronLeftIcon className="w-4 h-4" /> Exit
                    </button>
                    <div className="h-4 w-px bg-zinc-800"></div>
                    <div>
                        <h2 className="text-sm font-bold tracking-widest text-white">{projectName}</h2>
                        <span className="text-[9px] text-[#d4b483] font-mono uppercase tracking-widest">Scene: {activeSceneId}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                     {/* Year Selector */}
                     <div className="flex items-center bg-zinc-900 rounded border border-zinc-800 px-3 py-1">
                        <span className="text-[10px] font-bold text-zinc-500 mr-2 uppercase">Era:</span>
                        <input 
                            type="number" 
                            value={projectYear} 
                            onChange={(e) => setProjectYear(parseInt(e.target.value))}
                            className="bg-transparent w-12 text-xs font-bold text-white outline-none text-right font-mono"
                        />
                     </div>

                    <div className="flex bg-zinc-900 rounded p-1 border border-zinc-800">
                        <button 
                            onClick={() => setActiveTab('3d')}
                            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${activeTab === '3d' ? 'bg-white text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Viewport
                        </button>
                        <button 
                            onClick={() => setActiveTab('data')}
                            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded transition-all ${activeTab === 'data' ? 'bg-white text-black' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Analysis
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-grow flex overflow-hidden relative">
                
                {/* Main Viewport */}
                <div className="flex-grow relative flex flex-col">
                     {activeTab === '3d' ? (
                        <div className="w-full h-full relative">
                            <LightingStudio textureUrl={textureUrl || undefined} />
                            
                            {/* Overlay Controls for Quick Material Change (Floating) */}
                            <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
                                <button 
                                    onClick={() => setIsWardrobeOpen(true)}
                                    className="bg-black/60 backdrop-blur border border-white/10 text-white p-3 rounded-full hover:bg-[#d4b483] hover:text-black transition-colors shadow-xl"
                                    title="Change Outfit"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Historical Warning Overlay */}
                            {techPack?.historicalWarning && (
                                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-yellow-900/90 text-yellow-100 px-6 py-3 rounded border border-yellow-600 shadow-2xl z-30 flex items-center gap-3 backdrop-blur-md">
                                    <span className="text-xl">⚠️</span>
                                    <p className="text-xs font-bold uppercase tracking-wide">{techPack.historicalWarning}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Dashboard />
                    )}
                    
                    {/* Continuity Rail (Bottom) */}
                    <div className="absolute bottom-0 left-0 w-full z-20">
                        <ContinuityTimeline 
                            scenes={scenes} 
                            activeSceneId={activeSceneId} 
                            onSceneSelect={setActiveSceneId}
                            onFixContinuity={handleFixContinuity}
                        />
                    </div>
                </div>

                {/* Right Floating Panel (Inspector) */}
                <div className="absolute top-6 right-6 bottom-40 w-72 bg-[#09090b]/80 backdrop-blur-xl border border-white/10 rounded-xl flex flex-col z-10 shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-black/20">
                        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Inspector</h3>
                    </div>
                    
                    <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar">
                        {/* Fabric Selector */}
                        <div>
                            <label className="block text-[10px] font-bold text-[#d4b483] uppercase mb-2">Material Physics</label>
                             <select 
                                value={selectedFabric}
                                onChange={(e) => setSelectedFabric(e.target.value as FabricType)}
                                className="w-full bg-zinc-900 border border-zinc-700 text-xs text-white p-2 rounded focus:border-[#d4b483] outline-none"
                             >
                                 <option value="cotton">Cotton</option>
                                 <option value="polyester">Polyester</option>
                                 <option value="silk">Silk</option>
                                 <option value="wool">Wool</option>
                                 <option value="leather">Leather</option>
                             </select>
                        </div>
                        
                        {/* Hazards */}
                        <div>
                            <label className="block text-[10px] font-bold text-[#d4b483] uppercase mb-2">Scene Hazards</label>
                            <div className="flex flex-wrap gap-2">
                                {['fire', 'water', 'stunt'].map((h) => (
                                    <button
                                        key={h}
                                        onClick={() => toggleHazard(h as SceneHazard)}
                                        className={`px-2 py-1 text-[9px] font-bold uppercase rounded border transition-colors ${hazards.includes(h as SceneHazard) ? 'bg-red-900/50 text-red-200 border-red-500' : 'bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-500'}`}
                                    >
                                        {h}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Safety Report */}
                        <div className="p-4 bg-zinc-900/50 rounded border border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase">Safety Score</span>
                                <span className={`text-lg font-mono font-bold ${safetyReport?.score > 80 ? 'text-green-500' : 'text-red-500'}`}>{safetyReport?.score}%</span>
                            </div>
                            {safetyReport?.issues.map((issue: string, i: number) => (
                                <div key={i} className="text-[9px] text-red-300 border-l-2 border-red-500 pl-2 py-1 mb-1 leading-tight">
                                    {issue}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-white/5 bg-black/20 mt-auto">
                        <button 
                            onClick={() => setShowTechPackModal(true)}
                            className="w-full bg-white text-black py-3 rounded text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#d4b483] transition-colors"
                        >
                            Generate Tech Pack
                        </button>
                    </div>
                </div>
            </div>

            {/* Tech Pack Modal */}
            {showTechPackModal && techPack && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowTechPackModal(false)}>
                    <div className="bg-white text-black p-0 w-full max-w-md shadow-2xl rounded-sm overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="bg-zinc-900 text-white p-4 flex justify-between items-center">
                            <h3 className="font-serif text-lg tracking-wider">TECH PACK GENERATOR</h3>
                            <button onClick={() => setShowTechPackModal(false)} className="text-zinc-500 hover:text-white">✕</button>
                        </div>
                        <div className="p-6">
                            <TechPackView data={techPack as any} fabricName={selectedFabric} />
                            <button className="w-full mt-4 border-2 border-zinc-900 text-zinc-900 font-bold py-2 hover:bg-zinc-900 hover:text-white transition-colors text-xs uppercase tracking-widest">
                                Export PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <WardrobeModal 
                isOpen={isWardrobeOpen}
                onClose={() => setIsWardrobeOpen(false)}
                onGarmentSelect={handleGarmentSelect}
                activeGarmentIds={[]}
                isLoading={false}
            />
        </div>
    );
};

const FittingRoom: React.FC<FittingRoomProps> = (props) => {
    return (
        <ProjectProvider>
            <EngineeringWorkspace {...props} />
        </ProjectProvider>
    );
};

export default FittingRoom;
