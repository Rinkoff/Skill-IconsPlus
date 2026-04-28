'use client';

import React from 'react';
import Image from 'next/image';

interface IconCardProps {
  id: string;
  name: string;
  hasDark: boolean;
  hasLight: boolean;
  theme: 'dark' | 'light';
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export function IconCard({ id, name, hasDark, hasLight, theme, isSelected, onToggle }: IconCardProps) {
  const iconPath = hasDark && theme === 'dark' 
    ? `/icons/${id}-Dark.svg` 
    : hasLight && theme === 'light'
    ? `/icons/${id}-Light.svg`
    : `/icons/${id}.svg`;

  return (
    <div 
      onClick={() => onToggle(id)}
      className={`group relative flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
      } border`}
    >
      <div className="relative w-12 h-12 mb-3 transform group-hover:scale-110 transition-transform duration-300">
        <Image 
          src={iconPath} 
          alt={name} 
          fill
          className="object-contain"
        />
      </div>
      <span className={`text-xs font-medium truncate w-full text-center ${
        isSelected ? 'text-primary' : 'text-zinc-400 group-hover:text-zinc-200'
      }`}>
        {name}
      </span>
      
      {isSelected && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
}
