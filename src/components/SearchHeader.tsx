'use client';

import React from 'react';
import { Search, Moon, Sun, LayoutGrid, Rows } from 'lucide-react';

interface SearchHeaderProps {
  search: string;
  setSearch: (s: string) => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  layout: 'grid' | 'row';
  setLayout: (l: 'grid' | 'row') => void;
}

export function SearchHeader({ search, setSearch, theme, setTheme, layout, setLayout }: SearchHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4 glass mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">S+</span>
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
          SkillIcons<span className="text-primary">Plus</span>
        </h1>
      </div>

      <div className="relative flex-1 max-w-xl w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
        <input 
          type="text"
          placeholder="Search 400+ icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-zinc-100 placeholder:text-zinc-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-zinc-400"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button 
          onClick={() => setLayout(layout === 'grid' ? 'row' : 'grid')}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-zinc-400"
          title="Toggle Layout"
        >
          {layout === 'grid' ? <Rows className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
