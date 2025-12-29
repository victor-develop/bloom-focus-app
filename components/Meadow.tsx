
import React from 'react';
import { Flower2, Mountain, Trash2, ArrowLeft, Sun, Calendar } from 'lucide-react';
import { DayStats, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface MeadowProps {
  stats: DayStats[];
  lang: Language;
  onBack: () => void;
  onClear: () => void;
}

const Meadow: React.FC<MeadowProps> = ({ stats, lang, onBack, onClear }) => {
  const t = TRANSLATIONS[lang];
  const todayDate = new Date().toISOString().split('T')[0];
  const todayStats = stats.find(s => s.date === todayDate) || { flowers: 0, stones: 0 };
  const history = stats.filter(s => s.date !== todayDate).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-white overflow-y-auto pb-20">
      <div className="w-full max-w-4xl mx-auto p-6 md:p-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 px-4 py-2 bg-white/40 hover:bg-white/60 backdrop-blur-md rounded-full transition-all border border-white/50 text-slate-600 shadow-sm"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">{t.back}</span>
          </button>
          
          <div className="text-center flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-sky-600">
              {t.statsTitle}
            </h2>
            <div className="w-12 h-1 bg-emerald-200 rounded-full mt-2 opacity-50"></div>
          </div>

          <button 
            onClick={onClear}
            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
            title={t.clearStats}
          >
            <Trash2 size={22} />
          </button>
        </div>

        {/* Today's Immersive Section */}
        <div className="relative mb-16">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-yellow-200/20 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-200/20 blur-3xl rounded-full"></div>
          
          <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-emerald-100/50 border border-white relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div>
                <div className="flex items-center gap-2 text-emerald-600 font-bold tracking-widest uppercase text-[10px] mb-1">
                  <Sun size={14} className="animate-spin-slow" />
                  {t.today}
                </div>
                <h3 className="text-3xl font-extrabold text-slate-800">{todayDate}</h3>
              </div>
              
              <div className="flex gap-4">
                {/* Visual Indicator: Bloom Badge */}
                <div className="flex items-center gap-3 bg-gradient-to-br from-pink-400 to-rose-500 px-6 py-3 rounded-2xl shadow-lg shadow-pink-100 transform hover:scale-105 transition-transform cursor-default">
                  <Flower2 className="text-white" size={24} />
                  <span className="text-3xl font-black text-white tabular-nums">{todayStats.flowers}</span>
                </div>
                
                {/* Visual Indicator: Stone Badge */}
                <div className="flex items-center gap-3 bg-gradient-to-br from-slate-500 to-slate-700 px-6 py-3 rounded-2xl shadow-lg shadow-slate-200 transform hover:scale-105 transition-transform cursor-default">
                  <Mountain className="text-white" size={24} />
                  <span className="text-3xl font-black text-white tabular-nums">{todayStats.stones}</span>
                </div>
              </div>
            </div>

            {/* The Garden Floor */}
            <div className="min-h-[280px] bg-gradient-to-b from-white/30 to-emerald-50/50 rounded-3xl p-8 border border-white/50 relative flex flex-wrap justify-center items-center gap-6 overflow-hidden">
              {todayStats.flowers === 0 && todayStats.stones === 0 ? (
                <div className="text-center">
                  <p className="text-slate-400 italic max-w-xs">{t.noHistory}</p>
                </div>
              ) : (
                <>
                  {Array.from({ length: todayStats.flowers }).map((_, i) => {
                    const rotation = (i * 137) % 360;
                    const scale = 0.8 + (Math.random() * 0.4);
                    return (
                      <div 
                        key={`flower-${i}`} 
                        className="animate-in zoom-in fade-in duration-700 hover:scale-125 transition-transform cursor-pointer"
                        style={{ 
                          animationDelay: `${i * 80}ms`,
                          transform: `rotate(${rotation}deg) scale(${scale})`
                        }}
                      >
                        <Flower2 className="text-pink-400 drop-shadow-md" size={56} />
                      </div>
                    );
                  })}
                  {Array.from({ length: todayStats.stones }).map((_, i) => {
                    const rotation = (i * 71) % 40 - 20;
                    const scale = 0.9 + (Math.random() * 0.3);
                    return (
                      <div 
                        key={`stone-${i}`} 
                        className="animate-in zoom-in fade-in duration-700 hover:scale-125 transition-transform cursor-pointer"
                        style={{ 
                          animationDelay: `${(todayStats.flowers + i) * 80}ms`,
                          transform: `rotate(${rotation}deg) scale(${scale})`
                        }}
                      >
                        <Mountain className="text-slate-400 drop-shadow-sm" size={52} />
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>

        {/* History Section */}
        {history.length > 0 && (
          <section className="px-2">
            <div className="flex items-center gap-3 mb-6">
              <Calendar size={20} className="text-sky-500" />
              <h3 className="text-xl font-bold text-slate-700 uppercase tracking-tight">{t.history}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((day, idx) => (
                <div 
                  key={day.date} 
                  className="group bg-white/40 backdrop-blur-sm hover:bg-white/60 rounded-[2rem] p-5 flex justify-between items-center shadow-sm border border-white transition-all hover:shadow-md hover:-translate-y-1"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Session Date</span>
                    <span className="text-lg font-bold text-slate-700">{day.date}</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="bg-pink-50 text-pink-600 px-3 py-2 rounded-xl border border-pink-100 flex items-center gap-2">
                      <Flower2 size={16} />
                      <span className="font-black">{day.flowers}</span>
                    </div>
                    <div className="bg-slate-50 text-slate-600 px-3 py-2 rounded-xl border border-slate-100 flex items-center gap-2">
                      <Mountain size={16} />
                      <span className="font-black">{day.stones}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Meadow;
