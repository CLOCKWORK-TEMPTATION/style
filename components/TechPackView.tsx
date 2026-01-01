/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TechPackSpec } from '../services/techPackService';

interface TechPackViewProps {
  data: TechPackSpec;
  fabricName: string;
}

export const TechPackView: React.FC<TechPackViewProps> = ({ data, fabricName }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-sm font-mono text-xs">
        {/* Header */}
        <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-4">
            <div>
                <h3 className="text-lg font-bold uppercase tracking-tighter text-black">TECH PACK</h3>
                <span className="text-[10px] text-gray-500">REF: {Math.floor(Math.random() * 10000)}</span>
            </div>
            <div className="text-right">
                <span className="block font-bold text-gray-900 uppercase">{fabricName}</span>
                <span className="block text-[10px] text-gray-500">{data.threadCount}</span>
            </div>
        </div>

        {/* Color Swatch */}
        <div className="flex gap-4 mb-4">
            <div className="w-16 h-16 rounded border border-gray-300 shadow-inner flex items-center justify-center text-[9px] text-white/50 bg-gray-800" style={{backgroundColor: data.pantoneName === 'Fiery Red' ? '#ef4444' : data.pantoneName === 'Stretch Limo Black' ? '#1a1a1a' : data.hexPreview}}>
                SWATCH
            </div>
            <div className="flex-grow flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div>
                        <span className="block text-[9px] text-gray-400 uppercase">Pantone Ref</span>
                        <span className="font-bold text-gray-900">{data.pantoneCode}</span>
                    </div>
                    <div>
                        <span className="block text-[9px] text-gray-400 uppercase">Color Name</span>
                        <span className="font-bold text-gray-900">{data.pantoneName}</span>
                    </div>
                    <div>
                         <span className="block text-[9px] text-gray-400 uppercase">Est. Consumption</span>
                         <span className="font-bold text-blue-700">{data.fabricConsump}m / Unit</span>
                    </div>
                    <div>
                         <span className="block text-[9px] text-gray-400 uppercase">Lining</span>
                         <span className={`font-bold ${data.liningRequired ? 'text-red-600' : 'text-gray-900'}`}>{data.liningRequired ? 'REQUIRED' : 'NONE'}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-2 border border-gray-100 text-[10px] text-gray-600">
            <span className="font-bold mr-1">CARE:</span> {data.careLabel}
        </div>
    </div>
  );
};