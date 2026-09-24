import React, { useState } from 'react';
import { BMICalculation } from '../types/bmi';
import { StandardThresholds, MIUI_STANDARD, WHO_STANDARD } from '../utils/bmiCalculator';
import { ArrowLeft, Share2, Check, Sparkles, Scale, Info, RotateCcw, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { BMIInfoModal } from './BMIInfoModal';

interface BMIResultScreenProps {
  result: BMICalculation;
  onBack: () => void;
  onRecalculate: () => void;
}

export const BMIResultScreen: React.FC<BMIResultScreenProps> = ({
  result,
  onBack,
  onRecalculate,
}) => {
  const [copied, setCopied] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [thresholds, setThresholds] = useState<StandardThresholds>(MIUI_STANDARD);

  // Map BMI to 0% - 100% position on bar
  // Scale spans 13 to 33 so 18.5 is at ~27.5%, 24.0 is at ~55%, 28.0 is at ~75%
  const calculatePercent = (val: number) => {
    const min = 13.0;
    const max = 33.0;
    const clamped = Math.max(min, Math.min(max, val));
    return ((clamped - min) / (max - min)) * 100;
  };

  const pointerPercent = calculatePercent(result.bmi);
  // Clamping badge center so it doesn't overflow container edges
  const badgePercent = Math.max(12, Math.min(88, pointerPercent));

  const handleShare = async () => {
    const shareText = `My BMI is ${result.formattedBmi} (${result.categoryLabel}) on MIUI BMI Calculator! Suggested weight for my height (${result.heightCm} cm) is ${result.suggestedWeightMin} ~ ${result.suggestedWeightMax} kg.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My BMI Result',
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // Fallback to copy
        copyToClipboard(shareText);
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Badge color based on category
  const getBadgeStyle = () => {
    switch (result.category) {
      case 'underweight':
        return {
          bg: 'bg-[#38bdf8]',
          text: 'text-slate-950 font-bold',
          border: 'border-[#38bdf8]',
          tail: 'border-t-[#38bdf8]',
        };
      case 'normal':
        return {
          bg: 'bg-[#22c55e]',
          text: 'text-white font-bold',
          border: 'border-[#22c55e]',
          tail: 'border-t-[#22c55e]',
        };
      case 'overweight':
        return {
          bg: 'bg-[#f59e0b]',
          text: 'text-neutral-950 font-bold',
          border: 'border-[#f59e0b]',
          tail: 'border-t-[#f59e0b]',
        };
      case 'obese':
      default:
        return {
          bg: 'bg-[#f97316]',
          text: 'text-white font-bold',
          border: 'border-[#f97316]',
          tail: 'border-t-[#f97316]',
        };
    }
  };

  const badgeStyle = getBadgeStyle();

  return (
    <div className="flex flex-col flex-1 min-h-[100dvh] bg-black text-white px-5 sm:px-7 pt-3 pb-8 select-none">
      {/* Top Bar with Back Arrow & Title */}
      <div className="flex items-center justify-between py-3 mb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="text-neutral-300 hover:text-white active:scale-95 transition-transform p-1 rounded-full cursor-pointer"
            title="Go back"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-xl font-medium tracking-tight text-white">Your current BMI</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsInfoOpen(true)}
            className="p-2 text-neutral-400 hover:text-orange-400 active:scale-95 transition-all rounded-full bg-neutral-900 border border-neutral-800 cursor-pointer"
            title="What is BMI & WHO Categories"
            aria-label="BMI Info"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="p-2 text-neutral-400 hover:text-orange-400 active:scale-95 transition-all rounded-full bg-neutral-900 border border-neutral-800 cursor-pointer"
            title="Share result"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-8">
          {/* Main BMI Numeric Display */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="flex items-end justify-between"
          >
            <div className="flex flex-col">
              <span className="text-7xl font-extrabold tracking-tight text-white leading-none">
                {result.formattedBmi}
              </span>
              <span className="text-sm font-normal text-neutral-400 mt-2">Body mass index</span>
            </div>
            <button
              type="button"
              onClick={() => setIsInfoOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-400 hover:text-white transition active:scale-95 cursor-pointer mb-1"
            >
              <Info className="w-3.5 h-3.5 text-orange-400" />
              <span>WHO Standards</span>
            </button>
          </motion.div>

          {/* Visual Gauge Meter */}
          <div className="pt-4 pb-2">
            {/* Dynamic Pointer Callout Badge */}
            <div className="relative h-11 w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                style={{ left: `${badgePercent}%` }}
                className="absolute bottom-2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
              >
                <div
                  className={`px-3 py-1 rounded-full text-xs shadow-md shadow-black/50 ${badgeStyle.bg} ${badgeStyle.text}`}
                >
                  {result.categoryLabel}
                </div>
                {/* Downward pointing triangle tail */}
                <div
                  className={`w-0 h-0 border-x-4 border-x-transparent border-t-[6px] ${badgeStyle.tail}`}
                />
              </motion.div>
            </div>

            {/* Gradient Bar Track */}
            <div className="relative w-full">
              <div
                className="h-2.5 w-full rounded-full overflow-hidden shadow-inner"
                style={{
                  background:
                    'linear-gradient(to right, #38bdf8 0%, #38bdf8 26%, #22c55e 28%, #22c55e 54%, #f59e0b 56%, #f59e0b 74%, #f97316 76%, #f97316 100%)',
                }}
              />
            </div>

            {/* Threshold Numbers Below Bar */}
            <div className="relative w-full h-5 mt-2 text-[11px] text-neutral-400 font-mono">
              <span
                style={{ left: `${calculatePercent(18.5)}%` }}
                className="absolute -translate-x-1/2"
              >
                18.5
              </span>
              <span
                style={{ left: `${calculatePercent(24.0)}%` }}
                className="absolute -translate-x-1/2"
              >
                24.0
              </span>
              <span
                style={{ left: `${calculatePercent(28.0)}%` }}
                className="absolute -translate-x-1/2"
              >
                28.0
              </span>
            </div>

            {/* Categories Legend Underneath */}
            <div className="flex items-center justify-between text-[11px] text-neutral-300 mt-4 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] inline-block" />
                <span>Underweight</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] inline-block" />
                <span>Normal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] inline-block" />
                <span>Overweight</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] inline-block" />
                <span>Obese</span>
              </div>
            </div>
          </div>

          {/* Divider Line */}
          <div className="border-t border-neutral-900 pt-6">
            <h3 className="text-sm font-normal text-neutral-400 mb-6">Analysis</h3>

            {/* Key Value Metrics */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-white">Height (cm)</span>
                <span className="text-base font-semibold text-neutral-300">
                  {result.heightCm}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-white">Suggested weight (kg)</span>
                <span className="text-base font-semibold text-neutral-300">
                  {result.suggestedWeightMin.toFixed(1)} ~ {result.suggestedWeightMax.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Extra Health Insight Card */}
            <div className="mt-7 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-neutral-800 text-orange-400 shrink-0 mt-0.5">
                <Scale className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-1">
                <span className="font-semibold text-white block">
                  {result.category === 'normal'
                    ? 'Healthy Weight Status'
                    : result.category === 'underweight'
                    ? 'Weight Gain Target'
                    : 'Weight Management Target'}
                </span>
                <p className="text-neutral-400 leading-relaxed font-normal">
                  {result.category === 'normal' ? (
                    'Aapka wazan normal aur healthy category mein hai. Daily balanced diet aur exercise se ise maintain rakhein.'
                  ) : result.weightDiffKg < 0 ? (
                    `Normal BMI (18.5) tak pohanchne ke liye taqreeban ${Math.abs(
                      result.weightDiffKg
                    )} kg wazan barhane ki zaroorat hai.`
                  ) : (
                    `Normal BMI (24.0) tak pohanchne ke liye taqreeban ${result.weightDiffKg} kg wazan kam karne ki zaroorat hai.`
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recalculate / Back Button */}
        <div className="pt-8 pb-2 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-4 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 active:scale-[0.98] text-white font-medium text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-neutral-400" />
            <span>Edit Values</span>
          </button>

          <button
            type="button"
            onClick={onRecalculate}
            className="flex-1 py-4 px-6 rounded-2xl bg-[#ff6900] hover:bg-[#f56000] active:scale-[0.98] text-white font-semibold text-base shadow-lg shadow-orange-950/40 transition-all flex items-center justify-center cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>

      {/* WHO Standards Slide-Up Info Modal */}
      <BMIInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        currentBmi={result.bmi}
        currentCategory={result.category}
      />
    </div>
  );
};
