'use client';

import React, { useState } from 'react';
import { Copy, Check, Trash2, Code, Terminal } from 'lucide-react';

interface BuilderSidebarProps {
  selectedIcons: string[];
  onRemove: (id: string) => void;
  onClear: () => void;
  theme: 'dark' | 'light';
}

export function BuilderSidebar({ selectedIcons, onRemove, onClear, theme }: BuilderSidebarProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const baseUrl = 'https://skillicons.dev/icons';
  const iconQuery = selectedIcons.join(',');
  const themeParam = theme === 'light' ? '&theme=light' : '';
  const fullUrl = `${baseUrl}?i=${iconQuery}${themeParam}`;

  const markdown = `[![My Skills](${fullUrl})](https://skillicons.dev)`;
  const html = `<a href="https://skillicons.dev">\n  <img src="${fullUrl}" />\n</a>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-6">
      <div className="glass p-6 rounded-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-zinc-100">
            Selected <span className="text-primary">({selectedIcons.length})</span>
          </h2>
          {selectedIcons.length > 0 && (
            <button 
              onClick={onClear}
              className="text-zinc-500 hover:text-accent transition-colors p-1"
              title="Clear All"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {selectedIcons.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-zinc-500 text-sm italic">
            Click icons to add them...
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {selectedIcons.map(id => (
              <div 
                key={id}
                className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full py-1 px-3 text-xs group"
              >
                <span className="text-zinc-300">{id}</span>
                <button 
                  onClick={() => onRemove(id)}
                  className="text-zinc-500 group-hover:text-accent transition-colors"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass p-6 rounded-2xl flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Code className="w-4 h-4" /> Markdown
            </label>
            <button 
              onClick={() => copyToClipboard(markdown, 'markdown')}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {copiedType === 'markdown' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="bg-black/40 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-300 break-all">
            {markdown}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> HTML
            </label>
            <button 
              onClick={() => copyToClipboard(html, 'html')}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {copiedType === 'html' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="bg-black/40 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-300 overflow-x-auto">
            <pre>{html}</pre>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-400 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Direct URL
            </label>
            <button 
              onClick={() => copyToClipboard(fullUrl, 'url')}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {copiedType === 'url' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="bg-black/40 border border-white/5 rounded-lg p-3 text-xs font-mono text-zinc-300 break-all">
            {fullUrl}
          </div>
        </div>

        <div className="pt-4 mt-2 border-t border-white/10">
          <p className="text-[10px] text-zinc-500 leading-relaxed uppercase tracking-widest font-bold text-center">
            Powered by SkillIconsPlus
          </p>
        </div>
      </div>
    </aside>
  );
}
