/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface FooterProps {
  isOnDressingScreen?: boolean;
}

const Footer: React.FC<FooterProps> = ({ isOnDressingScreen = false }) => {
  return (
    <footer className={`fixed bottom-0 left-0 right-0 bg-gray-900 text-gray-400 border-t border-gray-800 p-3 z-50 ${isOnDressingScreen ? 'hidden sm:block' : ''}`}>
      <div className="mx-auto flex flex-col sm:flex-row items-center justify-between text-xs max-w-7xl px-4">
        <p>
          CineFit Studio &copy; {new Date().getFullYear()} | Powered by Gemini Pro Vision
        </p>
        <p className="mt-1 sm:mt-0 opacity-70">
           Professional Use Only • Costume Design Module v1.0
        </p>
      </div>
    </footer>
  );
};

export default Footer;