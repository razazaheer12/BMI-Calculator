import { BMICalculation, BMICategory, Gender } from '../types/bmi';

export interface StandardThresholds {
  name: string;
  underweightMax: number;
  normalMax: number;
  overweightMax: number;
}

export const MIUI_STANDARD: StandardThresholds = {
  name: 'MIUI / Asian Standard',
  underweightMax: 18.5,
  normalMax: 24.0,
  overweightMax: 28.0,
};

export const WHO_STANDARD: StandardThresholds = {
  name: 'WHO International',
  underweightMax: 18.5,
  normalMax: 25.0,
  overweightMax: 30.0,
};

export function getCategory(bmi: number, thresholds: StandardThresholds = MIUI_STANDARD): {
  category: BMICategory;
  label: string;
  color: string;
  badgeBg: string;
  textColor: string;
} {
  if (bmi < thresholds.underweightMax) {
    return {
      category: 'underweight',
      label: 'Underweight',
      color: '#38bdf8', // Cyan blue
      badgeBg: 'bg-sky-400',
      textColor: 'text-sky-400',
    };
  } else if (bmi < thresholds.normalMax) {
    return {
      category: 'normal',
      label: 'Normal',
      color: '#22c55e', // Emerald green
      badgeBg: 'bg-emerald-500',
      textColor: 'text-emerald-500',
    };
  } else if (bmi < thresholds.overweightMax) {
    return {
      category: 'overweight',
      label: 'Overweight',
      color: '#f59e0b', // Amber/gold
      badgeBg: 'bg-amber-500',
      textColor: 'text-amber-500',
    };
  } else {
    return {
      category: 'obese',
      label: 'Obese',
      color: '#f97316', // Orange-red
      badgeBg: 'bg-orange-500',
      textColor: 'text-orange-500',
    };
  }
}

export function calculateBMI(
  heightCm: number,
  weightKg: number,
  age: number = 26,
  gender: Gender = 'male',
  thresholds: StandardThresholds = MIUI_STANDARD
): BMICalculation {
  const heightM = heightCm / 100;
  const bmiValue = heightM > 0 ? weightKg / (heightM * heightM) : 0;
  const roundedBmi = Math.round(bmiValue * 10) / 10;

  // Suggested weight formula (MIUI uses 18.5 to 24.0 healthy range)
  const minWeight = Math.round(thresholds.underweightMax * (heightM * heightM) * 10) / 10;
  const maxWeight = Math.round(thresholds.normalMax * (heightM * heightM) * 10) / 10;

  let weightDiff = 0;
  if (weightKg < minWeight) {
    weightDiff = Math.round((weightKg - minWeight) * 10) / 10; // negative: gain needed
  } else if (weightKg > maxWeight) {
    weightDiff = Math.round((weightKg - maxWeight) * 10) / 10; // positive: loss needed
  }

  const cat = getCategory(roundedBmi, thresholds);

  return {
    id: `bmi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    timestamp: Date.now(),
    age,
    gender,
    heightCm: Math.round(heightCm * 100) / 100,
    weightKg: Math.round(weightKg * 10) / 10,
    bmi: roundedBmi,
    formattedBmi: roundedBmi.toFixed(1),
    category: cat.category,
    categoryLabel: cat.label,
    categoryColor: cat.color,
    suggestedWeightMin: minWeight,
    suggestedWeightMax: maxWeight,
    weightDiffKg: weightDiff,
  };
}

/**
 * Calculates pointer position on gradient bar from 0% to 100%
 * Scale range spans from 12 to 34 (covering underweight to severe obese)
 */
export function getBarPositionPercent(
  bmi: number,
  thresholds: StandardThresholds = MIUI_STANDARD
): number {
  const minRange = 12;
  const maxRange = 36;
  const clamped = Math.max(minRange, Math.min(maxRange, bmi));
  return ((clamped - minRange) / (maxRange - minRange)) * 100;
}

/**
 * Unit conversion helpers
 */
export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round((totalInches % 12) * 10) / 10;
  return { feet, inches };
}

export function feetInchesToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * 2.54;
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

export function lbsToKg(lbs: number): number {
  return Math.round((lbs / 2.20462) * 10) / 10;
}
