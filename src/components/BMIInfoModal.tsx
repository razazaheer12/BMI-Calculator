import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { BMICategory } from '../types/bmi';

interface BMIInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBmi: number;
  currentCategory: BMICategory;
}

export const BMIInfoModal: React.FC<BMIInfoModalProps> = ({
  isOpen,
  onClose,
  currentBmi,
  currentCategory,
}) => {
  if (!isOpen) return null;

  const categories = [
    {
      key: 'underweight',
      label: 'Underweight',
      whoRange: '< 18.5',
      asianRange: '< 18.5',
      color: '#38bdf8',
      bgClass: 'bg-sky-950/40 border-sky-500/30',
      textClass: 'text-sky-400',
      badgeClass: 'bg-sky-400 text-slate-950',
      description: 'Wazan qad ke hisab se kam hai. Behtar tawanai aur immunity ke liye nutritious food aur safe weight gain zaroori hai.',
    },
    {
      key: 'normal',
      label: 'Normal weight',
      whoRange: '18.5 – 24.9',
      asianRange: '18.5 – 24.0',
      color: '#22c55e',
      bgClass: 'bg-emerald-950/40 border-emerald-500/30',
      textClass: 'text-emerald-400',
      badgeClass: 'bg-emerald-500 text-white',
      description: 'Ideal aur sehat-mand wazan. Dil aur sehat ke masail ka khatra sab se kam hota hai.',
    },
    {
      key: 'overweight',
      label: 'Overweight',
      whoRange: '25.0 – 29.9',
      asianRange: '24.0 – 27.9',
      color: '#f59e0b',
      bgClass: 'bg-amber-950/40 border-amber-500/30',
      textClass: 'text-amber-400',
      badgeClass: 'bg-amber-500 text-neutral-950',
      description: 'Wazan normal range se thora zyada hai. Rozana walk, physical exercise aur diet control mufeed hai.',
    },
    {
      key: 'obese',
      label: 'Obese (Ziyada Wazan)',
      whoRange: '≥ 30.0',
      asianRange: '≥ 28.0',
      color: '#f97316',
      bgClass: 'bg-orange-950/40 border-orange-500/30',
      textClass: 'text-orange-400',
      badgeClass: 'bg-orange-500 text-white',
      description: 'Wazan kafi zyada hai. Blood pressure, cholesterol aur diabetes se bachne ke liye weight management zaroori hai.',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-lg max-h-[88vh] bg-neutral-950 border-t sm:border border-neutral-800 rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Mobile Drag Indicator */}
          <div className="pt-3 pb-1 sm:hidden flex justify-center">
            <div className="w-10 h-1 rounded-full bg-neutral-700" />
          </div>

          {/* Header */}
          <div className="px-6 py-4 border-b border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Understanding BMI</h3>
                <p className="text-xs text-neutral-400">WHO & Asian Weight Categories</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-5 text-neutral-300 text-sm">
            {/* What is BMI */}
            <div className="bg-neutral-900/70 border border-neutral-800/80 rounded-2xl p-4 space-y-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                BMI Kya Hota Hai?
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed font-normal">
                <strong className="text-white">Body Mass Index (BMI)</strong> ek aisi calculation hai jo insaan ke wazan (kg) ko uski height (meters) ke square se divide karke nikali jati hai:
              </p>
              <div className="p-2.5 rounded-xl bg-black/60 border border-neutral-800 text-center font-mono text-xs text-orange-400">
                BMI = Weight (kg) ÷ [Height (m)]²
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Yeh screening ke tor par batata hai ke aapka wazan aapki lambai ke mutabiq sahi hai ya nahi.
              </p>
            </div>

            {/* WHO & MIUI Standard Categories */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Weight Categories
                </span>
                <span className="text-[11px] text-neutral-500">WHO Standard (kg/m²)</span>
              </div>

              <div className="space-y-2.5">
                {categories.map((cat) => {
                  const isCurrent = cat.key === currentCategory;

                  return (
                    <div
                      key={cat.key}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? `${cat.bgClass} ring-1 ring-white/20 shadow-md`
                          : 'bg-neutral-900/40 border-neutral-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                          <span className="font-semibold text-white text-sm">
                            {cat.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-neutral-200">
                            {cat.whoRange}
                          </span>
                          {isCurrent && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/30">
                              <CheckCircle2 className="w-3 h-3" />
                              Aap Ka BMI ({currentBmi.toFixed(1)})
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-neutral-400 leading-relaxed pl-4.5">
                        {cat.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note & Limitation */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/60 text-xs text-neutral-400">
              <AlertCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-neutral-300">Zaroori Baat:</strong> BMI sirf ek andaza lagata hai. Yeh body fat aur muscle mass mein farq nahi karta (maslan athletes ya bodybuilders jin ke muscles zyada hote hain unka BMI zyada aa sakta hai).
              </p>
            </div>
          </div>

          {/* Footer Close Button */}
          <div className="p-4 border-t border-neutral-900 bg-neutral-950/80">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white text-sm font-semibold transition cursor-pointer shadow-lg shadow-orange-950/40"
            >
              Samajh Aa Gaya (Got It)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
