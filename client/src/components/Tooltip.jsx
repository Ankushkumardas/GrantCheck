import React, { useState } from 'react';
import { Info } from 'lucide-react';

export default function Tooltip({ text, children, icon = false, position = 'top' }) {
  const [visible, setVisible] = useState(false);

  if (!text) return children || null;

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {icon && (
        <button
          type="button"
          aria-label="More info"
          className="ml-1 text-slate-400 hover:text-slate-600 focus:outline-none"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      )}

      {visible && (
        <div 
          role="tooltip"
          className={`absolute z-50 p-3 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-xl w-64 whitespace-normal transition-opacity duration-150 pointer-events-none text-left leading-relaxed ${
            position === 'bottom' ? 'top-full mt-2 left-1/2 -translate-x-1/2' : 'bottom-full mb-2 left-1/2 -translate-x-1/2'
          }`}
        >
          {text}
          <div 
            className={`absolute left-1/2 -translate-x-1/2 border-[5px] border-transparent ${
              position === 'bottom' ? 'bottom-full border-b-slate-200' : 'top-full border-t-slate-200'
            }`}
          />
          <div 
            className={`absolute left-1/2 -translate-x-1/2 border-[4px] border-transparent ${
              position === 'bottom' ? 'bottom-full border-b-white' : 'top-full border-t-white'
            }`}
          />
        </div>
      )}
    </div>
  );
}
