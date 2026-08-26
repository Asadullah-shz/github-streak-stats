'use client';
import { useState, useEffect, useRef } from 'react';
import { themes } from '@/config/themes';

export default function Home() {
  const [username, setUsername] = useState('');
  const [theme, setTheme] = useState('default');
  const [locale, setLocale] = useState('en');
  const [cardType, setCardType] = useState<'streak'|'graph'|'lang'|'rank'>('streak');
  const [animation, setAnimation] = useState('fade');
  const [hideBorder, setHideBorder] = useState(false);
  const [transparentBg, setTransparentBg] = useState(false);

  const [useCustomColors, setUseCustomColors] = useState(false);
  const [customBg, setCustomBg] = useState('#ffffff');
  const [customBorder, setCustomBorder] = useState('#e4e2e2');
  const [customTitle, setCustomTitle] = useState('#151515');
  const [customText, setCustomText] = useState('#434d58');
  const [customRing, setCustomRing] = useState('#fb8c00');
  
  const [url, setUrl] = useState('');
  const [toast, setToast] = useState<{show: boolean, message: string}>({show: false, message: ''});
  const [availableThemes] = useState<string[]>(Object.keys(themes));
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!username) {
      setUrl('');
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    debounceTimer.current = setTimeout(() => {
      const apiRoute = cardType; 
      let newUrl = `${window.location.origin}/api/${apiRoute}?user=${username}&theme=${theme}&locale=${locale}`;
      
      if (cardType === 'graph' && animation !== 'fade') {
        newUrl += `&animation=${animation}`;
      }
      if (useCustomColors) {
        newUrl += `&bg_color=${customBg.replace('#', '')}&border_color=${customBorder.replace('#', '')}&title_color=${customTitle.replace('#', '')}&text_color=${customText.replace('#', '')}&ring_color=${customRing.replace('#', '')}`;
      }
      if (hideBorder) newUrl += '&hide_border=true';
      if (transparentBg) newUrl += '&bg_color=transparent';
      
      newUrl += `&v=${Date.now()}`; // cache buster for live preview
      setUrl(newUrl);
    }, 500);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [username, theme, locale, cardType, animation, hideBorder, transparentBg, useCustomColors, customBg, customBorder, customTitle, customText, customRing]);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const copyToClipboard = () => {
    if (!url) return;
    navigator.clipboard.writeText(`[![GitHub Streak](${url.split('&v=')[0]})](https://github.com/${username})`);
    showToast('Markdown copied to clipboard!');
  };

  return (
    <main className="flex h-screen bg-[#fafafa] font-sans selection:bg-blue-200 overflow-hidden flex-col lg:flex-row">
<div className={`fixed top-6 right-6 z-50 transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 font-medium text-sm">
          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {toast.message}
        </div>
      </div>
<div className="w-full lg:w-[420px] h-full bg-white border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 flex flex-col overflow-y-auto">
        <div className="p-8 border-b border-slate-100 bg-white sticky top-0 z-20">
          <div className="inline-flex items-center px-3 py-1 mb-6 text-[11px] font-bold uppercase tracking-wider text-green-700 bg-green-100 rounded-full">
            <span className="w-1.5 h-1.5 mr-2 bg-green-500 rounded-full animate-pulse"></span>
            System Online
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Card Builder</h1>
          <p className="text-sm text-slate-500">Design your perfect GitHub stats card.</p>
        </div>

        <div className="p-8 space-y-8">
<div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Settings</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">GitHub Username</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                placeholder="e.g. torvalds"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Card Type</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                value={cardType}
                onChange={(e) => setCardType(e.target.value as any)}
              >
                <option value="streak">Streak Stats</option>
                <option value="graph">Contribution Graph</option>
                <option value="lang">Top Languages</option>
                <option value="rank">GitHub Rank & Trophies</option>
              </select>
            </div>
          </div>

          <hr className="border-slate-100" />
<div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Appearance</h3>
              <label className="flex items-center gap-2 cursor-pointer group">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Custom Colors</span>
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" checked={useCustomColors} onChange={() => setUseCustomColors(!useCustomColors)} />
                  <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>
            </div>
            
            {!useCustomColors ? (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Theme Preset</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                >
                  {availableThemes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Background</label>
                  <div className="flex gap-2"><input type="color" value={customBg} onChange={(e) => setCustomBg(e.target.value)} className="h-8 w-8 rounded cursor-pointer"/><input type="text" value={customBg} onChange={(e) => setCustomBg(e.target.value)} className="w-full text-xs px-2 py-1 border border-slate-200 rounded"/></div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Border</label>
                  <div className="flex gap-2"><input type="color" value={customBorder} onChange={(e) => setCustomBorder(e.target.value)} className="h-8 w-8 rounded cursor-pointer"/><input type="text" value={customBorder} onChange={(e) => setCustomBorder(e.target.value)} className="w-full text-xs px-2 py-1 border border-slate-200 rounded"/></div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Title</label>
                  <div className="flex gap-2"><input type="color" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} className="h-8 w-8 rounded cursor-pointer"/><input type="text" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} className="w-full text-xs px-2 py-1 border border-slate-200 rounded"/></div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Text</label>
                  <div className="flex gap-2"><input type="color" value={customText} onChange={(e) => setCustomText(e.target.value)} className="h-8 w-8 rounded cursor-pointer"/><input type="text" value={customText} onChange={(e) => setCustomText(e.target.value)} className="w-full text-xs px-2 py-1 border border-slate-200 rounded"/></div>
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-semibold text-slate-600">Accent (Ring/Fire)</label>
                  <div className="flex gap-2"><input type="color" value={customRing} onChange={(e) => setCustomRing(e.target.value)} className="h-8 w-8 rounded cursor-pointer"/><input type="text" value={customRing} onChange={(e) => setCustomRing(e.target.value)} className="w-full text-xs px-2 py-1 border border-slate-200 rounded"/></div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Language</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
              </select>
            </div>

            {cardType === 'graph' && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Animation Style</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                  value={animation}
                  onChange={(e) => setAnimation(e.target.value)}
                >
                  <option value="fade">Fade In (Default)</option>
                  <option value="scanner">Laser Scanner</option>
                  <option value="pulse">Breathing Pulse</option>
                  <option value="matrix">Matrix Rain</option>
                  <option value="sparkles">Sparkles</option>
                  <option value="typing">Typing Reveal</option>
                </select>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />
<div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Advanced Options</h3>
            
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Hide Border</span>
              <div className="relative">
                <input type="checkbox" className="sr-only peer" checked={hideBorder} onChange={() => setHideBorder(!hideBorder)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Transparent Background</span>
              <div className="relative">
                <input type="checkbox" className="sr-only peer" checked={transparentBg} onChange={() => setTransparentBg(!transparentBg)} />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </div>
            </label>
          </div>
<div className="pt-4 pb-12">
            <button 
              onClick={copyToClipboard}
              disabled={!url}
              className="w-full h-12 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-md hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              Copy Markdown
            </button>
          </div>
        </div>
      </div>
<div className="flex-1 h-full bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:2rem_2rem] flex flex-col relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_50%,transparent,rgba(250,250,250,0.8))] pointer-events-none"></div>
        
        <div className="flex-1 flex items-center justify-center p-8 overflow-auto z-10">
          {!username ? (
            <div className="text-center space-y-4 max-w-sm">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <h2 className="text-xl font-bold text-slate-700">Live Preview</h2>
              <p className="text-slate-500 text-sm">Enter a GitHub username on the left to instantly preview your generated card.</p>
            </div>
          ) : (
            <div className={`transition-all duration-500 ${!url ? 'opacity-50 blur-sm scale-95' : 'opacity-100 scale-100'}`}>
              <div className={`bg-white ${transparentBg ? 'bg-transparent shadow-none border-none' : 'shadow-xl border border-slate-200/60'} rounded-2xl overflow-hidden p-8 flex justify-center transition-all`}>
                {url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={url} alt={`${username}'s GitHub Stats`} className="max-w-full drop-shadow-sm" />
                ) : (
                  <div className="w-[495px] h-[195px] flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

    </main>
  );
}
