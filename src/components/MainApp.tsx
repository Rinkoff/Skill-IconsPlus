'use client';

import React, { useState, useMemo } from 'react';
import { SearchHeader } from './SearchHeader';
import { IconCard } from './IconCard';
import { BuilderSidebar } from './BuilderSidebar';
import { IconInfo } from '../lib/icons';

interface MainAppProps {
  initialIcons: IconInfo[];
}

export default function MainApp({ initialIcons }: MainAppProps) {
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [layout, setLayout] = useState<'grid' | 'row'>('grid');
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);

  const filteredIcons = useMemo(() => {
    return initialIcons.filter(icon => 
      icon.id.toLowerCase().includes(search.toLowerCase()) ||
      icon.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [initialIcons, search]);

  const handleToggleIcon = (id: string) => {
    setSelectedIcons(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  const handleClear = () => setSelectedIcons([]);

  return (
    <div className="min-h-screen flex flex-col">
      <SearchHeader 
        search={search} 
        setSearch={setSearch} 
        theme={theme} 
        setTheme={setTheme}
        layout={layout}
        setLayout={setLayout}
      />

      <main className="flex-1 flex flex-col lg:flex-row gap-8 px-6 pb-12 max-w-[1600px] mx-auto w-full">
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">
              Available Icons <span className="text-zinc-600 ml-1">({filteredIcons.length})</span>
            </h2>
          </div>

          <div className={`grid gap-4 ${
            layout === 'grid' 
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
              : 'grid-cols-1'
          }`}>
            {filteredIcons.map(icon => (
              <IconCard 
                key={icon.id}
                id={icon.id}
                name={icon.id}
                hasDark={icon.hasDark}
                hasLight={icon.hasLight}
                theme={theme}
                isSelected={selectedIcons.includes(icon.id)}
                onToggle={handleToggleIcon}
              />
            ))}
          </div>

          {filteredIcons.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
              <p className="text-lg">No icons found matching "{search}"</p>
              <button 
                onClick={() => setSearch('')}
                className="mt-4 text-primary hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        <BuilderSidebar 
          selectedIcons={selectedIcons}
          onRemove={handleToggleIcon}
          onClear={handleClear}
          theme={theme}
        />
      </main>
    </div>
  );
}
