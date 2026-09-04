'use client';

import { useState } from 'react';
import { themes } from '@/config/themes';

export default function ThemesGallery() {
  const themeNames = Object.keys(themes);
  const [activeTab, setActiveTab] = useState<'streak'|'graph'|'lang'|'rank'>('streak');

  return (
    <main className="flex flex-col items-center p-6 sm:p-12 max-w-7xl mx-auto">
      <div className="mb-12 text-center space-y-4 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
          Themes Gallery
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Browse through {themeNames.length}+ beautifully crafted developer themes for your GitHub Streak Stats. 
          Find the perfect colors to match your README aesthetic.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-lg mb-12 border border-slate-200">
        <button
          onClick={() => setActiveTab('streak')}
          className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'streak' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Streak Stats
        </button>
        <button
          onClick={() => setActiveTab('graph')}
          className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'graph' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Contribution Graph
        </button>
        <button
          onClick={() => setActiveTab('lang')}
          className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'lang' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Top Languages
        </button>
        <button
          onClick={() => setActiveTab('rank')}
          className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${activeTab === 'rank' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
        >
          GitHub Rank
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 w-full">
        {themeNames.map((theme) => (
          <div key={theme} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-semibold text-slate-800 capitalize tracking-wide">{theme}</h2>
              <span className="text-xs font-mono bg-slate-200 text-slate-600 px-2 py-1 rounded">theme={theme}</span>
            </div>
            <div className="p-4 sm:p-6 bg-[#FAFAFA] flex justify-center items-center overflow-hidden min-h-[220px]">
              <img 
                src={`/api/${activeTab}?user=torvalds&theme=${theme}${activeTab === 'graph' ? '&hide_title=true' : ''}`} 
                alt={`${theme} theme preview`} 
                className="w-full h-auto drop-shadow-sm group-hover:scale-[1.02] transition-transform duration-300"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
