import React, { useState, useEffect } from 'react';
import { BMIInputScreen } from './components/BMIInputScreen';
import { BMIResultScreen } from './components/BMIResultScreen';
import { BMIHistoryModal } from './components/BMIHistoryModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { BMICalculation, Gender } from './types/bmi';
import { calculateBMI } from './utils/bmiCalculator';
import { AnimatePresence, motion } from 'motion/react';
import { Monitor, Smartphone, Sparkles } from 'lucide-react';

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

  // Desktop view toggle: 'phone-frame' or 'expanded'
  const [desktopMode, setDesktopMode] = useState<'phone-frame' | 'expanded'>('phone-frame');

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
    <main className="min-h-[100dvh] w-full bg-[#050507] text-white flex flex-col items-center justify-center relative overflow-x-hidden selection:bg-orange-500/30 selection:text-orange-200">
      {/* Ambient background glow for large desktop monitors */}
      <div className="hidden lg:block absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="hidden lg:block absolute -bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-sky-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Desktop Mode Toggle for big screens */}
      <header className="hidden lg:flex fixed top-4 right-6 z-40 items-center gap-2 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-full p-1 text-xs text-neutral-400">
        <button
          onClick={() => setDesktopMode('phone-frame')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
            desktopMode === 'phone-frame'
              ? 'bg-neutral-800 text-orange-400 font-medium shadow-sm'
              : 'hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Redmi 13C View</span>
        </button>
        <button
          onClick={() => setDesktopMode('expanded')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
            desktopMode === 'expanded'
              ? 'bg-neutral-800 text-orange-400 font-medium shadow-sm'
              : 'hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Dual Screen</span>
        </button>
      </header>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          desktopMode === 'expanded'
            ? 'max-w-5xl py-6 px-4 hidden lg:grid lg:grid-cols-2 gap-8 items-start my-auto'
            : 'max-w-md w-full min-h-[100dvh] sm:min-h-[820px] sm:my-6 sm:rounded-[36px] sm:border sm:border-neutral-800/80 sm:shadow-2xl sm:shadow-black/90 flex flex-col bg-black overflow-hidden relative'
        }`}
      >
        {desktopMode === 'expanded' ? (
          /* Desktop Expanded Dual-Screen Mode */
          <>
            <div className="bg-black rounded-[32px] border border-neutral-800/80 shadow-2xl p-6 min-h-[720px] flex flex-col">
              <BMIInputScreen
                onCalculate={handleCalculate}
                onOpenHistory={() => setIsHistoryOpen(true)}
                savedDefaults={savedDefaults}
              />
            </div>

            <div className="bg-black rounded-[32px] border border-neutral-800/80 shadow-2xl p-6 min-h-[720px] flex flex-col justify-center">
              {currentResult ? (
                <BMIResultScreen
                  result={currentResult}
                  onBack={() => setCurrentScreen('input')}
                  onRecalculate={() => setCurrentScreen('input')}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-orange-500">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Your BMI Analysis</h3>
                  <p className="text-sm text-neutral-400 max-w-xs leading-relaxed">
                    Apni Age, Height aur Weight darj karein aur &quot;Calculate&quot; button dabayein taake aapka BMI aur suggested weight yahan live show ho sake.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Mobile / Redmi 13C Phone Frame Mode */
          <div className="w-full flex-1 flex flex-col bg-black relative">
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
        )}
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
