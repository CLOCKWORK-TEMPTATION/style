/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ShirtIcon } from './icons';

/**
 * مكون الرأس (Header)
 * يعرض اسم الاستوديو وشعاره
 */
const Header: React.FC = () => {
  return (
    <header className="w-full py-5 px-4 md:px-8 bg-white sticky top-0 z-40 border-b border-gray-100">
      <div className="flex items-center gap-3">
          <div className="bg-gray-900 text-white p-2 rounded-lg">
            <ShirtIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-serif tracking-widest text-gray-900">
              CINEFIT STUDIO
            </h1>
            <p className="text-xs text-gray-500 font-sans tracking-wide uppercase">Digital Costume Department</p>
          </div>
      </div>
    </header>
  );
};

export default Header;