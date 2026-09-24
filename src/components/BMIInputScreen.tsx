import React, { useState } from 'react';
import { MaleIcon, FemaleIcon } from './GenderIcons';
import { Gender } from '../types/bmi';
import { cmToFeetInches, feetInchesToCm, kgToLbs, lbsToKg } from '../utils/bmiCalculator';
import { History, AlertCircle } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface BMIInputScreenProps {
  onCalculate: (data: { age: number; gender: Gender; heightCm: number; weightKg: number }) => void;
  onOpenHistory: () => void;
  savedDefaults?: { age?: number; gender?: Gender; heightCm?: number; weightKg?: number } | null;
}

export const BMIInputScreen: React.FC<BMIInputScreenProps> = ({
  onCalculate,
  onOpenHistory,
  savedDefaults = null,
}) => {
  const [ageStr, setAgeStr] = useState<string>(
    savedDefaults?.age ? savedDefaults.age.toString() : ''
  );
  const [gender, setGender] = useState<Gender>(savedDefaults?.gender || 'male');

  // Height & Weight strings (empty by default)
  const [heightStr, setHeightStr] = useState<string>(
    savedDefaults?.heightCm ? savedDefaults.heightCm.toString() : ''
  );
  const [weightStr, setWeightStr] = useState<string>(
    savedDefaults?.weightKg ? savedDefaults.weightKg.toString() : ''
  );

  // Unit systems
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');

  // Imperial feet / inches
  const initialImperial = savedDefaults?.heightCm ? cmToFeetInches(savedDefaults.heightCm) : { feet: '', inches: '' };
  const [feetStr, setFeetStr] = useState<string>(initialImperial.feet ? initialImperial.feet.toString() : '');
  const [inchesStr, setInchesStr] = useState<string>(initialImperial.inches !== '' ? initialImperial.inches.toString() : '');

  // Validation error
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenderToggle = (newGender: Gender) => {
    setGender(newGender);
  };

  const handleAgeChange = (val: string) => {
    setAgeStr(val);
    if (errorMessage) setErrorMessage(null);
  };

  const handleHeightChange = (val: string) => {
    setHeightStr(val);
    if (errorMessage) setErrorMessage(null);
  };

  const handleFeetChange = (f: string, i: string) => {
    setFeetStr(f);
    setInchesStr(i);
    if (errorMessage) setErrorMessage(null);
    const fNum = parseInt(f, 10);
    const iNum = parseFloat(i) || 0;
    if (!isNaN(fNum) && fNum > 0) {
      const cm = feetInchesToCm(fNum, iNum);
      setHeightStr((Math.round(cm * 10) / 10).toString());
    } else {
      setHeightStr('');
    }
  };

  const handleWeightChange = (val: string) => {
    setWeightStr(val);
    if (errorMessage) setErrorMessage(null);
  };

  const toggleHeightUnit = (unit: 'cm' | 'ft') => {
    if (unit === heightUnit) return;
    setHeightUnit(unit);
    if (unit === 'ft') {
      const parsedCm = parseFloat(heightStr);
      if (!isNaN(parsedCm) && parsedCm > 0) {
        const { feet, inches } = cmToFeetInches(parsedCm);
        setFeetStr(feet.toString());
        setInchesStr(inches.toString());
      } else {
        setFeetStr('');
        setInchesStr('');
      }
    } else {
      const fNum = parseInt(feetStr, 10);
      const iNum = parseFloat(inchesStr) || 0;
      if (!isNaN(fNum) && fNum > 0) {
        const cm = feetInchesToCm(fNum, iNum);
        setHeightStr((Math.round(cm * 10) / 10).toString());
      }
    }
  };

  const toggleWeightUnit = (unit: 'kg' | 'lbs') => {
    if (unit === weightUnit) return;
    setWeightUnit(unit);
    const parsed = parseFloat(weightStr);
    if (!isNaN(parsed) && parsed > 0) {
      if (unit === 'lbs') {
        const lbs = kgToLbs(parsed);
        setWeightStr(lbs.toString());
      } else {
        const kg = lbsToKg(parsed);
        setWeightStr(kg.toString());
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Age
    const parsedAge = parseInt(ageStr.trim(), 10);
    if (!ageStr.trim() || isNaN(parsedAge) || parsedAge <= 0 || parsedAge > 120) {
      setErrorMessage('Please enter your age (1 - 120)');
      return;
    }

    // Validate Height
    let finalHeightCm = 0;
    if (heightUnit === 'ft') {
      const fNum = parseInt(feetStr.trim(), 10);
      const iNum = parseFloat(inchesStr.trim()) || 0;
      if (isNaN(fNum) || fNum <= 0 || fNum > 9) {
        setErrorMessage('Please enter your height in feet and inches');
        return;
      }
      finalHeightCm = Math.round(feetInchesToCm(fNum, iNum) * 100) / 100;
    } else {
      const parsedHeight = parseFloat(heightStr.trim());
      if (!heightStr.trim() || isNaN(parsedHeight) || parsedHeight < 40 || parsedHeight > 300) {
        setErrorMessage('Please enter your height in cm (40 - 300 cm)');
        return;
      }
      finalHeightCm = parsedHeight;
    }

    // Validate Weight
    let finalWeightKg = 0;
    const parsedWeight = parseFloat(weightStr.trim());
    if (!weightStr.trim() || isNaN(parsedWeight) || parsedWeight <= 2 || parsedWeight > 500) {
      setErrorMessage(
        weightUnit === 'lbs'
          ? 'Please enter your weight in lbs (5 - 1000 lbs)'
          : 'Please enter your weight in kg (3 - 500 kg)'
      );
      return;
    }

    if (weightUnit === 'lbs') {
      finalWeightKg = lbsToKg(parsedWeight);
    } else {
      finalWeightKg = parsedWeight;
    }

    setErrorMessage(null);
    onCalculate({
      age: parsedAge,
      gender,
      heightCm: finalHeightCm,
      weightKg: finalWeightKg,
    });
  };

  return (
    <div className="flex flex-col min-h-full h-full bg-black text-white px-6 pt-3 pb-8 select-none">
      {/* Top Bar on Main Screen: Root screen without back arrow */}
      <div className="flex items-center justify-between py-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">BMI</h1>
        </div>

        <div className="flex items-center gap-2">
          <PWAInstallButton compact />
          <button
            type="button"
            onClick={onOpenHistory}
            className="p-2 text-neutral-400 hover:text-orange-400 active:scale-95 transition-all rounded-full bg-neutral-900 border border-neutral-800 cursor-pointer"
            title="View History"
            aria-label="View BMI History"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
        <div className="space-y-7">
          {/* Validation Error Alert Banner */}
          {errorMessage && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Row 1: Age & Gender */}
          <div className="grid grid-cols-2 gap-6 items-start">
            {/* Age Column */}
            <div className="flex flex-col">
              <span className="text-sm font-normal text-neutral-400 mb-2">Age</span>
              <div className="relative border-b border-neutral-800 focus-within:border-orange-500 transition-colors pb-1">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={ageStr}
                  onChange={(e) => handleAgeChange(e.target.value)}
                  className="w-full bg-transparent text-2xl sm:text-3xl font-semibold text-white focus:outline-none tracking-tight placeholder:text-neutral-600 placeholder:text-base placeholder:font-normal"
                  placeholder="Enter your age"
                />
              </div>
            </div>

            {/* Gender Column */}
            <div className="flex flex-col items-end">
              <span className="text-sm font-normal text-neutral-400 mb-2 self-start pl-1">
                Gender: <span className="text-neutral-200 capitalize">{gender}</span>
              </span>
              <div className="flex items-center gap-2.5">
                {/* Male Squircle */}
                <button
                  type="button"
                  onClick={() => handleGenderToggle('male')}
                  aria-label="Select Male"
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    gender === 'male'
                      ? 'bg-[#262628] ring-1 ring-orange-500/30'
                      : 'bg-[#1e1e20] hover:bg-[#262628]'
                  }`}
                >
                  <MaleIcon active={gender === 'male'} className="w-8 h-8" />
                </button>

                {/* Female Squircle */}
                <button
                  type="button"
                  onClick={() => handleGenderToggle('female')}
                  aria-label="Select Female"
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                    gender === 'female'
                      ? 'bg-[#262628] ring-1 ring-orange-500/30'
                      : 'bg-[#1e1e20] hover:bg-[#262628]'
                  }`}
                >
                  <FemaleIcon active={gender === 'female'} className="w-8 h-8" />
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Height */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-normal text-neutral-400">
                Height ({heightUnit})
              </span>
              <div className="flex items-center text-xs bg-neutral-900 rounded-lg p-0.5 border border-neutral-800">
                <button
                  type="button"
                  onClick={() => toggleHeightUnit('cm')}
                  className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                    heightUnit === 'cm'
                      ? 'bg-neutral-800 text-orange-400 font-medium'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  cm
                </button>
                <button
                  type="button"
                  onClick={() => toggleHeightUnit('ft')}
                  className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                    heightUnit === 'ft'
                      ? 'bg-neutral-800 text-orange-400 font-medium'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  ft / in
                </button>
              </div>
            </div>

            <div className="border-b border-neutral-800 focus-within:border-orange-500 transition-colors pb-1">
              {heightUnit === 'cm' ? (
                <input
                  type="text"
                  inputMode="decimal"
                  value={heightStr}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="w-full bg-transparent text-2xl sm:text-3xl font-semibold text-white focus:outline-none tracking-tight placeholder:text-neutral-600 placeholder:text-base placeholder:font-normal"
                  placeholder="Enter your height"
                />
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex items-baseline gap-1.5 flex-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={feetStr}
                      onChange={(e) => handleFeetChange(e.target.value, inchesStr)}
                      className="w-full bg-transparent text-2xl sm:text-3xl font-semibold text-white focus:outline-none tracking-tight placeholder:text-neutral-600 placeholder:text-base placeholder:font-normal"
                      placeholder="Feet"
                    />
                    <span className="text-neutral-500 text-sm">ft</span>
                  </div>
                  <div className="flex items-baseline gap-1.5 flex-1">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={inchesStr}
                      onChange={(e) => handleFeetChange(feetStr, e.target.value)}
                      className="w-full bg-transparent text-2xl sm:text-3xl font-semibold text-white focus:outline-none tracking-tight placeholder:text-neutral-600 placeholder:text-base placeholder:font-normal"
                      placeholder="Inches"
                    />
                    <span className="text-neutral-500 text-sm">in</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Weight */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-normal text-neutral-400">
                Weight ({weightUnit})
              </span>
              <div className="flex items-center text-xs bg-neutral-900 rounded-lg p-0.5 border border-neutral-800">
                <button
                  type="button"
                  onClick={() => toggleWeightUnit('kg')}
                  className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                    weightUnit === 'kg'
                      ? 'bg-neutral-800 text-orange-400 font-medium'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  kg
                </button>
                <button
                  type="button"
                  onClick={() => toggleWeightUnit('lbs')}
                  className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                    weightUnit === 'lbs'
                      ? 'bg-neutral-800 text-orange-400 font-medium'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  lbs
                </button>
              </div>
            </div>

            <div className="border-b border-neutral-800 focus-within:border-orange-500 transition-colors pb-1">
              <input
                type="text"
                inputMode="decimal"
                value={weightStr}
                onChange={(e) => handleWeightChange(e.target.value)}
                className="w-full bg-transparent text-2xl sm:text-3xl font-semibold text-white focus:outline-none tracking-tight placeholder:text-neutral-600 placeholder:text-base placeholder:font-normal"
                placeholder="Enter your weight"
              />
            </div>
          </div>

          {/* About BMI Section (Exact text from screenshot) */}
          <div className="pt-2">
            <h3 className="text-sm font-medium text-neutral-400 mb-2">About BMI</h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-normal">
              Body mass index (BMI) is a person's weight in kilograms divided by the square of
              height in meters. BMI is an easy screening method for weight category.
            </p>
          </div>
        </div>

        {/* Bottom Calculate Action Button (Xiaomi Orange) */}
        <div className="pt-8 pb-2">
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-[#ff6900] hover:bg-[#f56000] active:scale-[0.98] text-white font-semibold text-base shadow-lg shadow-orange-950/40 transition-all flex items-center justify-center cursor-pointer"
          >
            Calculate
          </button>
        </div>
      </form>
    </div>
  );
};
