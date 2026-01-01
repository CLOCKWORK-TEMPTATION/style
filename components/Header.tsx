/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ShirtIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-6 md:px-12 fixed top-0 z-50 pointer-events-none mix-blend-difference text-white">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 pointer-events-auto">
             {/* Logo Mark */}
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm">
                 <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <h1 className="text-xl font-serif tracking-[0.2em] leading-none text-white">
                  CINEFIT
                </h1>
                <p className="text-[9px] text-white/60 font-mono tracking-widest uppercase mt-1">Production Suite v2.0</p>
              </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-[10px] font-bold tracking-widest uppercase text-white/50">
              <span>Script</span>
              <span className="text-white">Design</span>
              <span>Fitting</span>
              <span>Export</span>
          </div>
      </div>
    </header>
  );
};

export default Header;