/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { defaultWardrobe } from '../wardrobe';
import type { WardrobeItem, ImageGenerationSize } from '../types';
import { UploadCloudIcon, CheckCircleIcon, XIcon, SparklesIcon, WandIcon } from './icons';
import { AnimatePresence, motion } from 'framer-motion';
import { generateGarmentAsset, editGarmentImage } from '../services/geminiService';
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
    const [prompt, setPrompt] = useState('');
    const [imageSize, setImageSize] = useState<ImageGenerationSize>('2K');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedItem, setGeneratedItem] = useState<WardrobeItem | null>(null);
    const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);
    const [editPrompt, setEditPrompt] = useState('');

    const handleGarmentClick = async (item: WardrobeItem) => {
        if (isLoading || activeGarmentIds.includes(item.id)) return;
        setError(null);
        try {
            const file = await urlToFile(item.url, `${item.name || item.id}.png`);
            onGarmentSelect(file, item);
        } catch (err) {
            setError('Could not load item.');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const customGarmentInfo: WardrobeItem = {
                id: `custom-${Date.now()}`,
                name: file.name,
                url: URL.createObjectURL(file),
            };
            onGarmentSelect(file, customGarmentInfo);
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setError(null);
        try {
            const url = await generateGarmentAsset(prompt, imageSize);
            setGeneratedItem({ id: `gen-${Date.now()}`, name: prompt, url: url });
        } catch (err) { setError('Failed to generate.'); } 
        finally { setIsGenerating(false); }
    };
    
    const startEditing = (item: WardrobeItem) => {
        setEditingItem(item);
        setActiveTab('ai');
        setEditPrompt('');
        setGeneratedItem(item);
        setPrompt('');
    };

    const handleEdit = async () => {
        if (!editPrompt.trim() || !editingItem) return;
        setIsGenerating(true);
        try {
            const file = await urlToFile(editingItem.url, "source.png");
            const newUrl = await editGarmentImage(file, editPrompt);
            setGeneratedItem({ id: `edit-${Date.now()}`, name: `${editingItem.name} (Edited)`, url: newUrl });
            setEditingItem(null);
        } catch (err) { setError("Failed to edit."); } 
        finally { setIsGenerating(false); }
    };

  return (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-[#18181b] border border-white/10 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
                >
                    <div className="flex items-center justify-between p-6 border-b border-white/5">
                        <h2 className="text-xl font-serif text-white tracking-wider">Wardrobe Department</h2>
                        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                            <XIcon className="w-6 h-6"/>
                        </button>
                    </div>

                    <div className="flex border-b border-white/5">
                        <button 
                            onClick={() => setActiveTab('library')}
                            className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${activeTab === 'library' ? 'bg-white/5 text-white border-b-2 border-[#d4b483]' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            Archive
                        </button>
                        <button 
                            onClick={() => { setActiveTab('ai'); setEditingItem(null); setGeneratedItem(null); }}
                            className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 ${activeTab === 'ai' ? 'bg-white/5 text-[#d4b483] border-b-2 border-[#d4b483]' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <SparklesIcon className="w-4 h-4" />
                            AI Atelier
                        </button>
                    </div>

                    <div className="p-8 overflow-y-auto flex-grow custom-scrollbar bg-[#09090b]">
                        {activeTab === 'library' && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {defaultWardrobe.map((item) => {
                                const isActive = activeGarmentIds.includes(item.id);
                                return (
                                    <div key={item.id} className="relative group aspect-square">
                                        <button
                                            onClick={() => handleGarmentClick(item)}
                                            disabled={isLoading || isActive}
                                            className="w-full h-full border border-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:border-[#d4b483] disabled:opacity-50"
                                        >
                                            <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                                            {isActive && (
                                                <div className="absolute inset-0 bg-[#d4b483]/80 flex items-center justify-center">
                                                    <CheckCircleIcon className="w-8 h-8 text-black" />
                                                </div>
                                            )}
                                        </button>
                                        
                                        {!isActive && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); startEditing(item); }}
                                                className="absolute top-1 right-1 bg-black/80 text-[#d4b483] p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-black"
                                            >
                                                <WandIcon className="w-3 h-3" />
                                            </button>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <p className="text-white text-[9px] font-bold truncate">{item.name}</p>
                                        </div>
                                    </div>
                                );
                                })}
                                <label className="relative aspect-square border border-dashed border-zinc-700 rounded-lg flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-500 transition-colors cursor-pointer hover:bg-white/5">
                                    <UploadCloudIcon className="w-6 h-6 mb-2"/>
                                    <span className="text-[9px] uppercase tracking-widest">Upload</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isLoading}/>
                                </label>
                            </div>
                        )}

                        {activeTab === 'ai' && (
                            <div className="flex flex-col h-full">
                                <div className="mb-6">
                                    {editingItem ? (
                                         <div className="flex items-center justify-between mb-2">
                                            <label className="text-[10px] font-bold text-[#d4b483] uppercase tracking-widest">Editing Mode</label>
                                            <button onClick={() => setEditingItem(null)} className="text-[10px] text-zinc-500 hover:text-white">Cancel</button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-end mb-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Prompt</label>
                                            <select value={imageSize} onChange={(e) => setImageSize(e.target.value as any)} className="bg-zinc-900 text-white text-[10px] border border-zinc-700 rounded px-2 py-1">
                                                <option value="1K">1K Res</option>
                                                <option value="2K">2K Res</option>
                                                <option value="4K">4K Res</option>
                                            </select>
                                        </div>
                                    )}
                                    
                                    <div className="flex gap-0 border border-zinc-700 rounded-lg overflow-hidden focus-within:border-[#d4b483] transition-colors">
                                        <input 
                                            type="text" 
                                            value={editingItem ? editPrompt : prompt}
                                            onChange={(e) => editingItem ? setEditPrompt(e.target.value) : setPrompt(e.target.value)}
                                            placeholder={editingItem ? "How to change it?" : "Describe the garment..."}
                                            className="flex-grow p-4 bg-zinc-900 text-white text-sm focus:outline-none placeholder:text-zinc-600"
                                            onKeyDown={(e) => e.key === 'Enter' && (editingItem ? handleEdit() : handleGenerate())}
                                        />
                                        <button 
                                            onClick={editingItem ? handleEdit : handleGenerate}
                                            disabled={isGenerating}
                                            className="bg-white text-black px-6 py-2 font-bold text-[10px] uppercase tracking-widest hover:bg-[#d4b483] disabled:opacity-50 transition-colors"
                                        >
                                            {isGenerating ? 'Processing' : (editingItem ? 'Refine' : 'Generate')}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-grow flex items-center justify-center bg-zinc-900/50 border border-zinc-800 rounded-lg relative min-h-[250px] overflow-hidden">
                                    {isGenerating ? (
                                        <Spinner />
                                    ) : generatedItem ? (
                                        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 group">
                                            <img src={generatedItem.url} alt="Generated" className="max-h-[250px] object-contain drop-shadow-2xl" />
                                            <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                <button onClick={() => startEditing(generatedItem!)} className="bg-zinc-800 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-black">Edit</button>
                                                <button onClick={() => handleGarmentClick(generatedItem!)} className="bg-[#d4b483] text-black px-6 py-2 rounded-full text-xs font-bold hover:bg-white">Select</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-zinc-700">
                                            <SparklesIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                            <p className="text-xs">AI Canvas Empty</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        {error && <p className="text-red-500 text-xs mt-4 text-center">{error}</p>}
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  );
};

export default WardrobeModal;