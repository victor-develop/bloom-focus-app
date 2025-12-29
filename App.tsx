
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Flower2, Languages, BarChart3, X, Sparkles } from 'lucide-react';
import Timer from './components/Timer';
import Meadow from './components/Meadow';
import { Language, AppMode, DayStats, Quote } from './types';
import { TRANSLATIONS, YES_QUOTES, NO_QUOTES, LOCAL_STORAGE_KEY, PREF_DURATION_KEY, PREF_LANG_KEY } from './constants';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh'); // Default to Chinese
  const [mode, setMode] = useState<AppMode>('idle');
  const [stats, setStats] = useState<DayStats[]>([]);
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [preferredDuration, setPreferredDuration] = useState(25);

  // Load state from local storage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) { console.error(e); }
    }

    const savedDuration = localStorage.getItem(PREF_DURATION_KEY);
    if (savedDuration) {
      setPreferredDuration(parseInt(savedDuration, 10));
    }

    const savedLang = localStorage.getItem(PREF_LANG_KEY) as Language;
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  const toggleLanguage = () => {
    setLang(prev => {
      const next = prev === 'en' ? 'zh' : 'en';
      localStorage.setItem(PREF_LANG_KEY, next);
      return next;
    });
  };

  const handleTimerComplete = useCallback(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("BloomFocus", {
        body: lang === 'en' ? "Session Complete! How was your focus?" : "专注时段结束！感觉如何？",
      });
    } else if ("Notification" in window && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
    setMode('feedback');
  }, [lang]);

  const handleDurationChange = (mins: number) => {
    setPreferredDuration(mins);
    localStorage.setItem(PREF_DURATION_KEY, mins.toString());
  };

  const recordStats = (type: 'yes' | 'no') => {
    const today = new Date().toISOString().split('T')[0];
    setStats(prev => {
      const existing = prev.find(s => s.date === today);
      if (existing) {
        return prev.map(s => s.date === today 
          ? { ...s, [type === 'yes' ? 'flowers' : 'stones']: s[type === 'yes' ? 'flowers' : 'stones'] + 1 } 
          : s
        );
      } else {
        return [...prev, { date: today, flowers: type === 'yes' ? 1 : 0, stones: type === 'no' ? 1 : 0 }];
      }
    });

    const quotes = type === 'yes' ? YES_QUOTES : NO_QUOTES;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setActiveQuote(randomQuote);
    setMode(type === 'yes' ? 'golden' : 'iron');
  };

  const resetToIdle = () => {
    setMode('idle');
    setActiveQuote(null);
  };

  const clearStats = () => {
    if (window.confirm(lang === 'en' ? 'Are you sure you want to clear your garden?' : '确定要清空花园吗？')) {
      setStats([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const t = TRANSLATIONS[lang];

  const todayFlowers = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return stats.find(s => s.date === today)?.flowers || 0;
  }, [stats]);

  const getThemeClasses = () => {
    switch (mode) {
      case 'golden': return 'bg-gradient-to-br from-amber-50 via-pink-50 to-rose-100 text-rose-800';
      case 'iron': return 'bg-gradient-to-br from-slate-900 via-indigo-950 to-orange-950 text-orange-100';
      case 'feedback': return 'bg-slate-100 text-slate-900';
      default: return 'bg-slate-50 text-slate-900';
    }
  };

  if (showStats) {
    return (
      <div className={`min-h-screen transition-colors duration-1000 ${getThemeClasses()}`}>
        <Meadow lang={lang} stats={stats} onBack={() => setShowStats(false)} onClear={clearStats} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${getThemeClasses()} flex flex-col p-6`}>
      <div className="fixed top-6 right-6 flex flex-col gap-4 z-50">
        <button onClick={toggleLanguage} className="p-4 bg-white/40 backdrop-blur-md rounded-full shadow-lg border border-white/50 hover:bg-white/60 transition-all flex items-center justify-center">
          <Languages size={24} className={mode === 'iron' ? 'text-white' : 'text-slate-700'} />
        </button>
        <button onClick={() => setShowStats(true)} className="p-4 bg-white/40 backdrop-blur-md rounded-full shadow-lg border border-white/50 hover:bg-white/60 transition-all flex items-center justify-center">
          <BarChart3 size={24} className={mode === 'iron' ? 'text-white' : 'text-slate-700'} />
        </button>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
        {mode === 'idle' || mode === 'focusing' ? (
          <div className="text-center animate-in fade-in slide-in-from-top-4 duration-700 w-full">
            <header className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-600 rounded-full text-[10px] font-black tracking-widest uppercase mb-4 shadow-sm border border-pink-200">
                <Flower2 size={14} />
                <span>BloomFocus</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-2">{t.title}</h1>
              <p className="text-slate-500 font-medium tracking-tight mb-8">{t.subtitle}</p>
              
              {/* Daily Progress Bar */}
              <div className="flex flex-col items-center gap-2 mb-4">
                <div className="flex items-center gap-3 bg-white/30 backdrop-blur-md px-6 py-3 rounded-full border border-white/50 shadow-inner">
                  <div className="flex -space-x-1">
                    {Array.from({ length: Math.min(todayFlowers, 5) }).map((_, i) => (
                      <Flower2 key={i} size={20} className="text-pink-400 drop-shadow-sm animate-bounce" style={{ animationDelay: `${i * 150}ms`, animationDuration: '2s' }} />
                    ))}
                    {todayFlowers > 5 && <span className="pl-2 text-pink-400 font-bold self-center">+</span>}
                    {todayFlowers === 0 && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-2">{lang === 'en' ? 'First seed' : '第一颗种子'}</span>}
                  </div>
                  <div className="h-4 w-px bg-slate-200 mx-1" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-2xl font-black text-slate-700 tabular-nums">{todayFlowers}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{lang === 'en' ? 'Blooms' : '次绽放'}</span>
                  </div>
                </div>
              </div>
            </header>

            <Timer 
              lang={lang} 
              onComplete={handleTimerComplete} 
              isPaused={false} 
              initialMins={preferredDuration}
              onDurationChange={handleDurationChange}
            />
          </div>
        ) : mode === 'feedback' ? (
          <div className="text-center space-y-8 animate-in zoom-in-95 fade-in duration-500">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight">{t.feedbackPrompt}</h2>
            <div className="flex flex-col gap-4 w-full">
              <button onClick={() => recordStats('yes')} className="group relative overflow-hidden bg-pink-500 text-white p-6 rounded-[2.5rem] shadow-2xl shadow-pink-200 hover:scale-[1.02] active:scale-95 transition-all text-2xl font-black flex items-center justify-center gap-3">
                <Flower2 size={28} /> {t.proud}
              </button>
              <button onClick={() => recordStats('no')} className="bg-white text-slate-700 border-2 border-slate-100 p-6 rounded-[2.5rem] shadow-xl hover:border-slate-300 hover:bg-slate-50 active:scale-95 transition-all text-2xl font-black">
                {t.resetting}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-8 max-w-md animate-in fade-in zoom-in-90 duration-1000">
            <div className="mb-8">
              {mode === 'golden' ? (
                <div className="w-32 h-32 bg-pink-200/50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Flower2 size={64} className="text-pink-500" />
                </div>
              ) : (
                <div className="w-32 h-32 bg-orange-900/50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <BarChart3 size={64} className="text-orange-500 rotate-90" />
                </div>
              )}
            </div>
            <p className={`text-2xl md:text-3xl font-light italic leading-relaxed ${mode === 'iron' ? 'text-orange-100' : 'text-rose-900'}`}>
              "{activeQuote ? (lang === 'en' ? activeQuote.en : activeQuote.zh) : ''}"
            </p>
            <button onClick={resetToIdle} className={`mt-12 px-10 py-4 rounded-full font-black shadow-lg transition-all active:scale-95 ${mode === 'golden' ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-orange-600 text-white hover:bg-orange-700'}`}>
              {t.back}
            </button>
          </div>
        )}
      </main>
      <footer className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.2em] opacity-30 py-4">
        &copy; {new Date().getFullYear()} BloomFocus &bull; Privacy-first
      </footer>
    </div>
  );
};

export default App;
