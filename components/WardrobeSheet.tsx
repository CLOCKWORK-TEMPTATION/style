/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { defaultWardrobe } from '../wardrobe';
import type { WardrobeItem } from '../types';
import { UploadCloudIcon, CheckCircleIcon, XIcon, SparklesIcon } from './icons';
import { AnimatePresence, motion } from 'framer-motion';
import { generateGarmentAsset } from '../services/geminiService';
import Spinner from './Spinner';
import { urlToFile } from '../lib/utils';


interface WardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGarmentSelect: (garmentFile: File, garmentInfo: WardrobeItem) => void;
  activeGarmentIds: string[];
  isLoading: boolean;
}

const WardrobeModal: React.FC<WardrobeModalProps> = ({ isOpen, onClose, onGarmentSelect, activeGarmentIds, isLoading }) => {
    const [activeTab, setActiveTab] = useState<'library' | 'ai'>('library');
    const [error, setError] = useState<string | null>(null);
    
    // AI Gen State
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedItem, setGeneratedItem] = useState<WardrobeItem | null>(null);

    const handleGarmentClick = async (item: WardrobeItem) => {
        if (isLoading || activeGarmentIds.includes(item.id)) return;
        setError(null);
        try {
            const file = await urlToFile(item.url, `${item.name || item.id}.png`);
            onGarmentSelect(file, item);
        } catch (err) {
            console.error("Garment select error:", err);
            setError('Could not load wardrobe item. Please try again.');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file.');
                return;
            }
            const customGarmentInfo: WardrobeItem = {
                id: `custom-${Date.now()}`,
                name: file.name,
                url: URL.createObjectURL(file), // for preview, not used by API
            };
            onGarmentSelect(file, customGarmentInfo);
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setError(null);
        setGeneratedItem(null);
        try {
            const url = await generateGarmentAsset(prompt);
            setGeneratedItem({
                id: `gen-${Date.now()}`,
                name: prompt,
                url: url
            });
        } catch (err) {
            console.error("Generation error:", err);
            setError('Failed to generate garment. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleUseGenerated = async () => {
        if (generatedItem) {
            await handleGarmentClick(generatedItem);
        }
    };

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-xl overflow-hidden"
                >
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-xl font-serif tracking-wider text-gray-800">Select Garment</h2>
                        <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                            <XIcon className="w-6 h-6"/>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b">
                        <button 
                            onClick={() => setActiveTab('library')}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'library' ? 'bg-white text-gray-900 border-b-2 border-gray-900' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                        >
                            Library / Upload
                        </button>
                        <button 
                            onClick={() => setActiveTab('ai')}
                            className={`flex-1 py-3 text-sm font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${activeTab === 'ai' ? 'bg-white text-purple-700 border-b-2 border-purple-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                        >
                            <SparklesIcon className="w-4 h-4" />
                            AI Gen
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-grow">
                        {activeTab === 'library' && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {defaultWardrobe.map((item) => {
                                const isActive = activeGarmentIds.includes(item.id);
                                return (
                                    <button
                                    key={item.id}
                                    onClick={() => handleGarmentClick(item)}
                                    disabled={isLoading || isActive}
                                    className="relative aspect-square border rounded-lg overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 group disabled:opacity-60 disabled:cursor-not-allowed"
                                    aria-label={`Select ${item.name}`}
                                    >
                                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="text-white text-xs font-bold text-center p-1">{item.name}</p>
                                    </div>
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gray-900/70 flex items-center justify-center">
                                            <CheckCircleIcon className="w-8 h-8 text-white" />
                                        </div>
                                    )}
                                    </button>
                                );
                                })}
                                <label htmlFor="custom-garment-upload" className={`relative aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500 transition-colors ${isLoading ? 'cursor-not-allowed bg-gray-100' : 'hover:border-gray-400 hover:text-gray-600 cursor-pointer'}`}>
                                    <UploadCloudIcon className="w-6 h-6 mb-1"/>
                                    <span className="text-xs text-center">Upload</span>
                                    <input id="custom-garment-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" onChange={handleFileChange} disabled={isLoading}/>
                                </label>
                            </div>
                        )}

                        {activeTab === 'ai' && (
                            <div className="flex flex-col h-full">
                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Describe the Item</label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            placeholder="e.g. A distressed brown leather trench coat, cyberpunk style"
                                            className="flex-grow p-3 bg-gray-50 border border-gray-300 rounded focus:border-purple-500 focus:outline-none text-sm"
                                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                        />
                                        <button 
                                            onClick={handleGenerate}
                                            disabled={isGenerating || !prompt.trim()}
                                            className="bg-purple-700 text-white px-4 py-2 rounded font-bold text-xs uppercase tracking-wider hover:bg-purple-800 disabled:opacity-50 transition-colors"
                                        >
                                            {isGenerating ? 'Creating...' : 'Generate'}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-grow flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg relative min-h-[250px]">
                                    {isGenerating ? (
                                        <div className="flex flex-col items-center">
                                            <Spinner />
                                            <p className="text-xs text-gray-500 mt-2 animate-pulse">Designing Asset...</p>
                                        </div>
                                    ) : generatedItem ? (
                                        <div className="relative w-full h-full flex items-center justify-center p-4">
                                            <img src={generatedItem.url} alt="Generated Asset" className="max-w-full max-h-[300px] object-contain shadow-lg rounded" />
                                            <div className="absolute bottom-4">
                                                <button 
                                                    onClick={handleUseGenerated}
                                                    disabled={isLoading}
                                                    className="bg-gray-900 text-white px-6 py-2 rounded-full font-bold text-sm shadow-xl hover:bg-black transition-transform active:scale-95"
                                                >
                                                    Select This Item
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <SparklesIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                            <p className="text-sm">Enter a prompt to generate a unique fashion item.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};

export default WardrobeModal;