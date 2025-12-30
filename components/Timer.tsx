
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Square, Settings2, Sparkles, Flower2 } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS, PROGRESS_QUOTES } from '../constants';

interface TimerProps {
  lang: Language;
  onComplete: () => void;
  isPaused: boolean;
  initialMins: number;
  onDurationChange: (mins: number) => void;
}

// Celebration Particle Component
const Particle: React.FC<{ delay: number; color: string; type: 'flower' | 'sparkle' }> = ({ delay, color, type }) => {
  const angle = Math.random() * Math.PI * 2;
  const velocity = 5 + Math.random() * 10;
  const tx = Math.cos(angle) * velocity * 20;
  const ty = Math.sin(angle) * velocity * 20;
  const rotation = Math.random() * 360;

  return (
    <div 
      className="absolute pointer-events-none animate-particle"
      style={{
        '--tx': `${tx}px`,
        '--ty': `${ty}px`,
        '--tr': `${rotation}deg`,
        left: '50%',
        top: '50%',
        animationDelay: `${delay}ms`,
        color: color
      } as any}
    >
      {type === 'flower' ? <Flower2 size={24} fill="currentColor" /> : <Sparkles size={16} />}
    </div>
  );
};

const Timer: React.FC<TimerProps> = ({ lang, onComplete, isPaused, initialMins, onDurationChange }) => {
  const t = TRANSLATIONS[lang];
  const [targetMins, setTargetMins] = useState(initialMins);
  const [secondsRemaining, setSecondsRemaining] = useState(initialMins * 60);
  const [isActive, setIsActive] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [interimMessage, setInterimMessage] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const lastMarkRef = useRef<number>(0);
  const hasCompletedRef = useRef(false);
  const audioCtx = useRef<AudioContext | null>(null);

  // Sound Synthesizer
  const playSound = useCallback((type: 'interim' | 'complete') => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume();
    }

    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.current.destination);

    if (type === 'interim') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.current.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.current.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + 0.4);
      osc.start();
      osc.stop(audioCtx.current.currentTime + 0.4);
    } else {
      // Zen Chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, audioCtx.current.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, audioCtx.current.currentTime + 1.5);
      gain.gain.setValueAtTime(0.2, audioCtx.current.currentTime);
      gain.gain.linearRampToValueAtTime(0, audioCtx.current.currentTime + 2);
      osc.start();
      osc.stop(audioCtx.current.currentTime + 2);
    }
  }, []);

  useEffect(() => {
    if (!isActive) {
      setTargetMins(initialMins);
      setSecondsRemaining(initialMins * 60);
      lastMarkRef.current = 0;
      hasCompletedRef.current = false;
    }
  }, [initialMins, isActive]);

  const progress = 1 - (secondsRemaining / (targetMins * 60));

  useEffect(() => {
    if (isActive && secondsRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => Math.max(prev - 1, 0));
      }, 1000);

      const marks = [0.25, 0.5, 0.75, 0.9];
      marks.forEach((mark, index) => {
        if (progress >= mark && lastMarkRef.current < mark) {
          lastMarkRef.current = mark;
          playSound('interim');
          
          const key = `q${index + 1}` as keyof typeof PROGRESS_QUOTES;
          const variations = PROGRESS_QUOTES[key];
          // Randomly select one variation from the array
          const randomIndex = Math.floor(Math.random() * variations.length);
          const quote = variations[randomIndex];
          const msg = lang === 'en' ? quote.en : quote.zh;
          
          setInterimMessage(msg);
          setTimeout(() => setInterimMessage(null), 4000);
        }
      });
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, secondsRemaining, progress, lang, playSound]);

  const finishSession = useCallback(() => {
    if (hasCompletedRef.current) return;
    hasCompletedRef.current = true;

    setIsActive(false);
    playSound('complete');
    setShowCelebration(true);
    setInterimMessage(null);

    setTimeout(() => {
      setShowCelebration(false);
      onComplete();
    }, 2500);
  }, [onComplete, playSound]);

  useEffect(() => {
    if (isActive && secondsRemaining <= 0) {
      finishSession();
    }
  }, [isActive, secondsRemaining, finishSession]);

  const toggleTimer = () => {
    // Resume AudioContext on user gesture
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    audioCtx.current.resume();

    if (!isActive) {
      hasCompletedRef.current = false;
    }

    setIsActive(!isActive);
    setShowSettings(false);
    setShowCelebration(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsRemaining(targetMins * 60);
    lastMarkRef.current = 0;
    setInterimMessage(null);
    setShowCelebration(false);
    hasCompletedRef.current = false;
  };

  const updateTarget = (mins: number) => {
    setTargetMins(mins);
    setSecondsRemaining(mins * 60);
    onDurationChange(mins);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center relative">
      {/* Background Ripening Effect */}
      {isActive && (
        <div 
          className="fixed inset-0 pointer-events-none transition-opacity duration-1000 -z-10"
          style={{ 
            backgroundColor: `rgba(16, 185, 129, ${progress * 0.15})`,
            boxShadow: `inset 0 0 ${progress * 250}px rgba(34, 197, 94, ${progress * 0.5})`
          }}
        />
      )}

      {/* Explosion Celebration Overlay */}
      {showCelebration && (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-visible">
          {Array.from({ length: 40 }).map((_, i) => (
            <Particle 
              key={i} 
              delay={Math.random() * 500} 
              color={i % 2 === 0 ? '#ec4899' : '#10b981'} 
              type={i % 3 === 0 ? 'sparkle' : 'flower'} 
            />
          ))}
          <div className="fixed inset-0 bg-emerald-500/10 animate-pulse-fast pointer-events-none" />
        </div>
      )}

      {/* Encouragement Pop-up */}
      {interimMessage && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-max max-w-sm animate-in slide-in-from-bottom-2 fade-in duration-500 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl border border-emerald-100 text-emerald-700 font-bold flex items-center gap-3 z-50">
          <Sparkles size={18} className="text-amber-400 shrink-0" />
          <span className="text-sm leading-tight text-center">{interimMessage}</span>
        </div>
      )}

      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        {/* SVG Progress Circle */}
        <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="45" 
            fill="none" 
            stroke="currentColor" 
            className="text-slate-200" 
            strokeWidth="3.5" 
          />
          <circle 
            cx="50" cy="50" r="45" 
            fill="none" 
            stroke="currentColor" 
            className={`${progress > 0.9 ? 'text-emerald-500' : 'text-pink-500'} transition-all duration-1000 ease-linear drop-shadow-[0_0_12px_rgba(236,72,153,0.4)]`} 
            strokeWidth="4" 
            strokeDasharray="282.7" 
            strokeDashoffset={282.7 * (1 - progress)} 
            strokeLinecap="round"
          />
        </svg>

        <div className="text-center z-10">
          <span className={`text-6xl md:text-7xl font-bold tracking-tighter tabular-nums transition-colors duration-1000 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
            {formatTime(secondsRemaining)}
          </span>
          <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">
            {isActive ? (lang === 'en' ? 'Blooming...' : '正在绽放...') : (lang === 'en' ? 'Ready' : '就绪')}
          </p>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-6 z-20">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className={`p-4 rounded-full transition-all ${showSettings ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 shadow-lg border border-slate-50'}`}
        >
          <Settings2 size={24} />
        </button>

        <button 
          onClick={toggleTimer}
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95 ${isActive ? 'bg-slate-800 text-white' : 'bg-pink-500 text-white shadow-pink-200'}`}
        >
          {isActive ? <Square size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>

        <button 
          onClick={resetTimer}
          className="p-4 bg-white text-slate-600 rounded-full shadow-lg border border-slate-50 hover:bg-slate-50 transition-all font-black text-[10px] tracking-widest"
        >
          RESET
        </button>
      </div>

      {showSettings && !isActive && (
        <div className="mt-8 bg-white/60 backdrop-blur-xl p-6 rounded-[2.5rem] shadow-2xl border border-white flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 z-30">
          <div className="flex gap-2">
            {[1, 5, 15, 25, 45, 60].map(m => (
              <button 
                key={m}
                onClick={() => updateTarget(m)}
                className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black transition-all text-sm ${targetMins === m ? 'bg-pink-500 text-white shadow-lg shadow-pink-100' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
              >
                {m}
              </button>
            ))}
          </div>
          <p className="text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">{t.minutes}</p>
        </div>
      )}

      <style>{`
        @keyframes particle {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          15% { opacity: 1; transform: translate(calc(var(--tx) * 0.2), calc(var(--ty) * 0.2)) scale(1.5); }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--tr)) scale(0); opacity: 0; }
        }
        .animate-particle {
          animation: particle 2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
        @keyframes pulse-fast {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-pulse-fast {
          animation: pulse-fast 0.2s ease-in-out 3;
        }
      `}</style>
    </div>
  );
};

export default Timer;
