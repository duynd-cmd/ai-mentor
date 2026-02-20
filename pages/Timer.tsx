import React, { useState, useEffect } from 'react';
import { useMemory } from '../contexts/MemoryContext';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';

export const Timer: React.FC = () => {
  const { updateMemory, memory } = useMemory();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
        if (mode === 'focus') {
           // Batch updates in real app
        }
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleComplete = () => {
    if (mode === 'focus') {
      const newSessions = sessions + 1;
      setSessions(newSessions);
      updateMemory({ 
        pomodoroSessions: memory.pomodoroSessions + 1,
        totalFocusTime: memory.totalFocusTime + 25 
      });

      if (newSessions % 4 === 0) {
        setMode('long');
        setTimeLeft(15 * 60);
      } else {
        setMode('short');
        setTimeLeft(5 * 60);
      }
    } else {
      setMode('focus');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMode('focus');
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = mode === 'focus' ? 25 * 60 : (mode === 'short' ? 5 * 60 : 15 * 60);
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
       <div className="mb-8 text-center">
         <h2 className="font-serif text-3xl font-bold text-slate-900">Đồng hồ Pomodoro</h2>
         <p className="text-slate-500 mt-2">Phương pháp tập trung tiêu chuẩn</p>
       </div>

       <div className="relative w-80 h-80 flex items-center justify-center bg-white rounded-full shadow-2xl border-8 border-cream-100">
         <div 
            className="absolute inset-0 rounded-full border-8 border-sage-500 transition-all duration-1000"
            style={{ 
              clipPath: `inset(0 0 ${100 - getProgress()}% 0)`
            }}
         />
         
         <div className="z-10 text-center">
            <div className={`text-6xl font-bold font-mono text-slate-800 mb-2`}>
              {formatTime(timeLeft)}
            </div>
            <p className="uppercase tracking-widest text-sm font-semibold text-slate-400">
              {mode === 'focus' ? 'Tập trung' : 'Nghỉ ngơi'}
            </p>
         </div>
       </div>

       <div className="flex gap-6 mt-12">
         <button 
           onClick={toggleTimer}
           className="w-16 h-16 rounded-2xl bg-slate-800 text-cream-50 flex items-center justify-center hover:bg-slate-700 hover:scale-105 transition-all shadow-lg shadow-slate-800/20"
         >
           {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
         </button>
         <button 
           onClick={resetTimer}
           className="w-16 h-16 rounded-2xl bg-white text-slate-600 border border-cream-200 flex items-center justify-center hover:bg-cream-50 hover:scale-105 transition-all"
         >
           <RotateCcw className="w-6 h-6" />
         </button>
       </div>

       <div className="mt-12 flex gap-8">
         <div className={`flex flex-col items-center ${mode === 'focus' ? 'opacity-100' : 'opacity-40'}`}>
            <Brain className="w-6 h-6 mb-2 text-slate-700" />
            <span className="text-xs font-bold uppercase tracking-wider">Tập trung</span>
            <span className="text-xs text-slate-400">25 phút</span>
         </div>
         <div className="w-px h-10 bg-cream-300"></div>
         <div className={`flex flex-col items-center ${mode !== 'focus' ? 'opacity-100' : 'opacity-40'}`}>
            <Coffee className="w-6 h-6 mb-2 text-sage-600" />
            <span className="text-xs font-bold uppercase tracking-wider">Nghỉ</span>
            <span className="text-xs text-slate-400">5 phút</span>
         </div>
       </div>
    </div>
  );
};