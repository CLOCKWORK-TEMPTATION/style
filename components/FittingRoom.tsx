/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import Canvas from './Canvas';
import WardrobeModal from './WardrobeSheet';
import { UploadCloudIcon, PlusIcon, ChevronLeftIcon } from './icons';
import { generateVirtualFit, generateStressTestVideo } from '../services/geminiService';
import { WardrobeItem, SimulationConfig } from '../types';
import { getFriendlyErrorMessage, urlToFile } from '../lib/utils';

interface FittingRoomProps {
    onBack: () => void;
    initialGarmentUrl?: string;
    initialGarmentName?: string;
    initialGarmentDescription?: string;
    initialWeather?: string;
    initialConstraints?: string;
}

const FittingRoom: React.FC<FittingRoomProps> = ({ 
    onBack, 
    initialGarmentUrl, 
    initialGarmentName,
    initialGarmentDescription,
    initialWeather,
    initialConstraints
}) => {
    // Basic State
    const [modelFile, setModelFile] = useState<File | null>(null);
    const [modelPreview, setModelPreview] = useState<string | null>(null);
    const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    
    // Engine State
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [previousImage, setPreviousImage] = useState<string | null>(null); // For A/B
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isCompareMode, setIsCompareMode] = useState(false);
    
    // Simulation Config State
    const [simConfig, setSimConfig] = useState<SimulationConfig>({
        lighting: 'natural',
        physics: 'static',
        action: 'idle',
        actorConstraints: ''
    });

    const [selectedGarment, setSelectedGarment] = useState<WardrobeItem | null>(null);
    const [currentGarmentFile, setCurrentGarmentFile] = useState<File | null>(null);

    // Initial Load Effect
    useEffect(() => {
        const loadInitialGarment = async () => {
            if (initialGarmentUrl && initialGarmentName) {
                try {
                    setIsLoading(true);
                    setLoadingMessage('Initializing Digital Asset...');
                    const file = await urlToFile(initialGarmentUrl, initialGarmentName);
                    setSelectedGarment({ id: 'ai-design', name: initialGarmentName, url: initialGarmentUrl });
                    setCurrentGarmentFile(file);
                } catch (error) {
                    console.error("Failed to load initial garment", error);
                } finally {
                    setIsLoading(false);
                    setLoadingMessage('');
                }
            }
        };
        loadInitialGarment();
    }, [initialGarmentUrl, initialGarmentName]);

    const handleModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setModelFile(file);
            setModelPreview(URL.createObjectURL(file));
            setGeneratedImage(null);
            setVideoUrl(null);
        }
    };

    const handleGarmentSelect = (garmentFile: File, garmentInfo: WardrobeItem) => {
        setIsWardrobeOpen(false);
        setSelectedGarment(garmentInfo);
        setCurrentGarmentFile(garmentFile);
    };

    const handleFitProcess = async () => {
        if (!modelFile) return alert("Please upload an actor photo first.");
        if (!currentGarmentFile || !selectedGarment) return alert("No costume selected.");

        // Store current image as previous for A/B testing before generating new one
        if (generatedImage) {
            setPreviousImage(generatedImage);
        }

        setIsLoading(true);
        setLoadingMessage(`Compiling Simulation: ${simConfig.lighting} lighting + ${simConfig.physics} physics...`);
        setVideoUrl(null); 
        setIsCompareMode(false);

        try {
            const descriptionToUse = (selectedGarment.id === 'ai-design' && initialGarmentDescription) 
                ? initialGarmentDescription 
                : selectedGarment.name;

            const contextParts = [];
            if (initialWeather) contextParts.push(`Weather: ${initialWeather}`);
            if (initialConstraints) contextParts.push(`Constraints: ${initialConstraints}`);
            const fitContext = contextParts.join('. ');

            const resultUrl = await generateVirtualFit(
                modelFile, 
                currentGarmentFile, 
                descriptionToUse, 
                fitContext,
                simConfig
            );
            setGeneratedImage(resultUrl);
        } catch (error) {
            alert(getFriendlyErrorMessage(error, "Simulation failed"));
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    const handleVideoExport = async () => {
        if (!generatedImage) return;
        setIsLoading(true);
        setLoadingMessage('Rendering Dynamic Stress Test Video (1080p)... Please wait.');
        try {
            const url = await generateStressTestVideo(generatedImage, simConfig.action === 'idle' ? 'walking' : simConfig.action);
            setVideoUrl(url);
        } catch (err) {
            alert(getFriendlyErrorMessage(err, "Video rendering failed"));
        } finally {
            setIsLoading(false);
        }
    }

    const toggleCompare = () => {
        if (previousImage && generatedImage) {
            setIsCompareMode(!isCompareMode);
        } else {
            alert("Generate at least two variations to compare.");
        }
    };

    const handleStartOver = () => {
        setModelFile(null);
        setModelPreview(null);
        setGeneratedImage(null);
        setVideoUrl(null);
        setPreviousImage(null);
        setIsCompareMode(false);
        if (!initialGarmentUrl) {
            setSelectedGarment(null);
            setCurrentGarmentFile(null);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between z-20">
                <button onClick={onBack} className="flex items-center text-sm font-bold text-gray-600 hover:text-gray-900">
                    <ChevronLeftIcon className="w-4 h-4 mr-1" />
                    BACK TO HUB
                </button>
                <div className="flex flex-col items-center">
                    <h2 className="text-lg font-serif font-bold tracking-wider">REALISM ENGINE v2.0</h2>
                    <span className="text-[10px] text-green-600 font-mono font-bold tracking-widest uppercase">● Online</span>
                </div>
                <div className="w-20"></div> 
            </div>

            {/* Main Workspace */}
            <div className="flex-grow flex flex-col md:flex-row overflow-hidden relative">
                
                {/* 1. Simulation Controls (Left Sidebar) */}
                <div className="w-full md:w-64 bg-gray-900 text-white p-6 overflow-y-auto flex flex-col z-20 shadow-xl border-r border-gray-800">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-700 pb-2">Physics & Environment</h3>
                    
                    {/* Lighting Control */}
                    <div className="mb-6">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Lighting Synthesis</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['natural', 'studio', 'dramatic', 'neon'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setSimConfig({...simConfig, lighting: mode as any})}
                                    className={`text-xs py-2 px-1 border rounded transition-colors ${simConfig.lighting === mode ? 'bg-white text-black border-white' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Physics Control */}
                    <div className="mb-6">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Fabric Physics</label>
                        <select 
                            value={simConfig.physics}
                            onChange={(e) => setSimConfig({...simConfig, physics: e.target.value as any})}
                            className="w-full bg-gray-800 border border-gray-700 text-white text-xs p-2 rounded focus:outline-none focus:border-white"
                        >
                            <option value="static">Static (Standard)</option>
                            <option value="flow">High Flow (Windy)</option>
                            <option value="heavy">Heavy Weight (Wool/Leather)</option>
                            <option value="wet">Wet/Damp (Environmental)</option>
                        </select>
                    </div>

                    {/* Action Control */}
                    <div className="mb-6">
                         <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Pose / Action</label>
                         <div className="flex flex-col gap-2">
                            {['idle', 'walking', 'running', 'fighting'].map((action) => (
                                <button 
                                    key={action}
                                    onClick={() => setSimConfig({...simConfig, action: action as any})}
                                    className={`flex items-center text-xs text-left px-2 py-2 rounded transition-all ${simConfig.action === action ? 'bg-blue-900/50 text-blue-200 border border-blue-800' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    <span className={`w-2 h-2 rounded-full mr-2 ${simConfig.action === action ? 'bg-blue-400' : 'bg-gray-600'}`}></span>
                                    {action.charAt(0).toUpperCase() + action.slice(1)}
                                </button>
                            ))}
                         </div>
                    </div>

                    {/* Actor Constraints */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Actor Constraints</label>
                            <span className="text-[9px] text-gray-500 bg-gray-800 px-1 rounded">OPTIONAL</span>
                        </div>
                        <textarea
                            value={simConfig.actorConstraints || ''}
                            onChange={(e) => setSimConfig({...simConfig, actorConstraints: e.target.value})}
                            placeholder="e.g. Uncomfortable with tight collars, restricted arm movement, sensitive skin..."
                            className="w-full bg-gray-800 border border-gray-700 text-white text-xs p-2 rounded focus:outline-none focus:border-white resize-none h-20 placeholder-gray-500"
                        />
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-800">
                        <button 
                            onClick={handleVideoExport}
                            disabled={!generatedImage || isLoading}
                            className="w-full py-3 bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-900/50 rounded flex flex-col items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest">Run Stress Test</span>
                            <span className="text-[9px] opacity-70">Generate Video (1080p)</span>
                        </button>
                    </div>
                </div>

                {/* 2. Canvas Area (Center) */}
                <div className="flex-grow relative bg-gray-100 flex items-center justify-center p-4">
                    {!modelPreview ? (
                         <div className="text-center animate-fade-in flex flex-col items-center">
                            <div className="mb-8 flex flex-col items-center gap-2">
                                <span className="bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Step 1</span>
                                <h3 className="text-xl font-serif text-gray-800">Digitize Actor</h3>
                            </div>
                            <label className="cursor-pointer group block relative">
                                <div className="w-64 h-80 border-4 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-white group-hover:border-gray-900 transition-all shadow-sm group-hover:shadow-lg group-hover:-translate-y-1">
                                    <div className="p-4 bg-gray-50 rounded-full mb-4 group-hover:bg-gray-100 transition-colors">
                                        <UploadCloudIcon className="w-8 h-8 text-gray-400 group-hover:text-gray-900" />
                                    </div>
                                    <span className="text-sm font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-900">Upload Photo</span>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleModelUpload} />
                            </label>
                            <p className="mt-6 text-xs text-gray-400 font-mono max-w-xs leading-relaxed">
                                Upload a full-body or mid-shot of the actor. <br/>
                                This will serve as the base for all physics simulations.
                            </p>
                         </div>
                    ) : (
                        <Canvas 
                            displayImageUrl={generatedImage || modelPreview} 
                            videoUrl={videoUrl}
                            compareImages={isCompareMode && previousImage && generatedImage ? { left: previousImage, right: generatedImage } : null}
                            onStartOver={handleStartOver}
                            isLoading={isLoading}
                            loadingMessage={loadingMessage}
                            onSelectPose={() => {}}
                            poseInstructions={[]}
                            currentPoseIndex={0}
                            availablePoseKeys={[]}
                        />
                    )}
                </div>

                {/* 3. Asset & Render Controls (Right Sidebar) */}
                <div className="bg-white border-l border-gray-200 p-6 w-full md:w-80 flex flex-col z-10 shadow-xl overflow-y-auto">
                     {/* Compare Toggle */}
                     {previousImage && generatedImage && !videoUrl && (
                        <button 
                            onClick={toggleCompare}
                            className={`w-full mb-4 py-2 px-4 rounded text-xs font-bold uppercase tracking-widest border transition-colors ${isCompareMode ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}
                        >
                            {isCompareMode ? 'Exit Comparison' : 'A/B Compare Mode'}
                        </button>
                    )}

                    {/* Source Info (if from Director) */}
                    {initialGarmentName && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
                            <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Asset: Script Analysis</div>
                            <p className="text-xs text-blue-900 font-medium line-clamp-2">{initialGarmentName}</p>
                        </div>
                    )}

                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">1. Digital Actor</h3>
                        <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${modelPreview ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-100'}`}>
                            <div className={`w-3 h-3 rounded-full ${modelPreview ? 'bg-green-500' : 'bg-red-400 animate-pulse'}`}></div>
                            <span className={`text-sm font-medium ${modelPreview ? 'text-green-800' : 'text-red-800'}`}>
                                {modelPreview ? 'Model Active' : 'No Model Uploaded'}
                            </span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">2. Garment Asset</h3>
                            <button 
                                onClick={() => setIsWardrobeOpen(true)} 
                                disabled={!modelPreview} 
                                className={`text-[10px] font-bold underline transition-colors ${!modelPreview ? 'text-gray-300 cursor-not-allowed' : 'text-gray-900 hover:text-black'}`}
                                title={!modelPreview ? "Upload actor first" : "Select Garment"}
                            >
                                SWAP
                            </button>
                        </div>
                        
                        {selectedGarment ? (
                             <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <img src={selectedGarment.url} className="w-12 h-12 object-cover rounded bg-white border border-gray-200" alt="garment" />
                                <div className="overflow-hidden">
                                    <span className="block text-xs font-bold text-gray-900 truncate">{selectedGarment.name}</span>
                                    <span className="block text-[10px] text-gray-500 truncate">Ready to Render</span>
                                </div>
                             </div>
                        ) : (
                            <div className={`text-sm italic p-3 rounded-lg border border-dashed transition-colors ${!modelPreview ? 'bg-gray-50 text-gray-300 border-gray-200' : 'bg-white text-gray-400 border-gray-300'}`}>
                                {!modelPreview ? "Locked: Upload Actor" : "No asset selected"}
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleFitProcess}
                        disabled={!modelPreview || !selectedGarment || isLoading}
                        className="mt-auto w-full py-4 bg-gray-900 text-white font-bold tracking-widest uppercase text-xs hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                    >
                        {isLoading ? 'RENDERING...' : 'RENDER SIMULATION'}
                        {!isLoading && <PlusIcon className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <WardrobeModal 
                isOpen={isWardrobeOpen}
                onClose={() => setIsWardrobeOpen(false)}
                onGarmentSelect={handleGarmentSelect}
                activeGarmentIds={selectedGarment ? [selectedGarment.id] : []}
                isLoading={isLoading}
            />
        </div>
    );
};

export default FittingRoom;