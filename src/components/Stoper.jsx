import React, { useState, useEffect, useRef } from 'react';

function formatCzas(cs) {
  const h = Math.floor(cs / 360000);
  const m = Math.floor((cs % 360000) / 6000);
  const s = Math.floor((cs % 6000) / 100);
  const c = cs % 100;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(c).padStart(2, '0')}`;
}

export default function Stoper({ onTick, onRunningChange }) {
  const [isRunning, setIsRunning] = useState(() => localStorage.getItem('stoper-running') === 'true');
  const [elapsed, setElapsed] = useState(() => {
    const saved = parseInt(localStorage.getItem('stoper-elapsed') || '0', 10);
    const startTimestamp = parseInt(localStorage.getItem('stoper-startTimestamp') || '0', 10);
    if (localStorage.getItem('stoper-running') === 'true' && startTimestamp) {
      return saved + Math.floor((Date.now() - startTimestamp) / 10);
    }
    return saved;
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      const startTimestamp = Date.now();
      localStorage.setItem('stoper-startTimestamp', String(startTimestamp));
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          const next = prev + 1;
          localStorage.setItem('stoper-elapsed', String(next));
          if (onTick) onTick(next);
          return next;
        });
      }, 10);
    } else {
      clearInterval(intervalRef.current);
      localStorage.removeItem('stoper-startTimestamp');
    }
    localStorage.setItem('stoper-running', String(isRunning));
    if (onRunningChange) onRunningChange(isRunning);
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (isRunning && onTick) onTick(elapsed);
    if (onRunningChange) onRunningChange(isRunning);
  }, []);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsed(0);
    localStorage.setItem('stoper-elapsed', '0');
    localStorage.removeItem('stoper-startTimestamp');
    if (onTick) onTick(0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 flex flex-col items-center gap-4">
      <div className="text-5xl font-mono font-bold text-gray-800 dark:text-white tracking-widest">
        {formatCzas(elapsed)}
      </div>
      <div className="flex gap-3">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            ▶ Start biegu
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            ⏹ Zatrzymaj
          </button>
        )}
        {!isRunning && elapsed > 0 && (
          <button
            onClick={handleReset}
            className="px-5 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
          >
            🔄 Reset
          </button>
        )}
      </div>
    </div>
  );
}
