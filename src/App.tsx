import React, { useState, useEffect } from 'react';
import { BMIInputScreen } from './components/BMIInputScreen';
import { BMIResultScreen } from './components/BMIResultScreen';
import { BMIHistoryModal } from './components/BMIHistoryModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { BMICalculation, Gender } from './types/bmi';
import { calculateBMI } from './utils/bmiCalculator';
import { AnimatePresence, motion } from 'motion/react';

const STORAGE_KEY = 'miui_bmi_history_v1';
const DEFAULTS_KEY = 'miui_bmi_defaults_v1';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'input' | 'result'>('input');
  const [currentResult, setCurrentResult] = useState<BMICalculation | null>(null);
  const [history, setHistory] = useState<BMICalculation[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [savedDefaults, setSavedDefaults] = useState<{
    age?: number;
    gender?: Gender;
    heightCm?: number;
    weightKg?: number;
  } | null>(null);

  // Load history & defaults from localStorage
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }

      const storedDefaults = localStorage.getItem(DEFAULTS_KEY);
      if (storedDefaults) {
        setSavedDefaults(JSON.parse(storedDefaults));
      }
    } catch (e) {
      console.error('Failed to load local storage data', e);
    }
  }, []);

  const handleCalculate = (data: {
    age: number;
    gender: Gender;
    heightCm: number;
    weightKg: number;
  }) => {
    const result = calculateBMI(data.heightCm, data.weightKg, data.age, data.gender);
    setCurrentResult(result);
    setSavedDefaults(data);
    setCurrentScreen('result');

    // Save to history & defaults
    const updatedHistory = [result, ...history.slice(0, 29)];
    setHistory(updatedHistory);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      localStorage.setItem(DEFAULTS_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  };

  const handleSelectHistoryItem = (item: BMICalculation) => {
    setCurrentResult(item);
    setSavedDefaults({
      age: item.age,
      gender: item.gender,
      heightCm: item.heightCm,
      weightKg: item.weightKg,
    });
    setCurrentScreen('result');
  };

  return (
    <main className="min-h-[100dvh] w-full bg-black text-white flex flex-col items-center justify-start relative overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-200">
      {/* Subtle ambient lighting for large screens */}
      <div className="hidden lg:block absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="hidden lg:block absolute -bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-sky-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Main App Container - Natural clean web app filling screen with responsive max width */}
      <div className="w-full max-w-xl mx-auto min-h-[100dvh] flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          {currentScreen === 'input' ? (
            <motion.div
              key="input-screen"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="flex-1 flex flex-col"
            >
              <BMIInputScreen
                onCalculate={handleCalculate}
                onOpenHistory={() => setIsHistoryOpen(true)}
                savedDefaults={savedDefaults}
              />
            </motion.div>
          ) : currentResult ? (
            <motion.div
              key="result-screen"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="flex-1 flex flex-col"
            >
              <BMIResultScreen
                result={currentResult}
                onBack={() => setCurrentScreen('input')}
                onRecalculate={() => setCurrentScreen('input')}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* History Modal */}
      <BMIHistoryModal
        isOpen={isHistoryOpen}
        history={history}
        onClose={() => setIsHistoryOpen(false)}
        onClear={handleClearHistory}
        onSelect={handleSelectHistoryItem}
      />

      {/* Offline Status Toast indicator */}
      <OfflineIndicator />
    </main>
  );
}
