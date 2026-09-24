export type Gender = 'male' | 'female';

export type UnitSystem = 'metric' | 'imperial';

export type BMICategory = 'underweight' | 'normal' | 'overweight' | 'obese';

export interface BMICategoryConfig {
  key: BMICategory;
  label: string;
  minBmi: number;
  maxBmi: number;
  color: string;
  badgeBg: string;
  textColor: string;
}

export interface BMICalculation {
  id: string;
  date: string;
  timestamp: number;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  bmi: number;
  formattedBmi: string;
  category: BMICategory;
  categoryLabel: string;
  categoryColor: string;
  suggestedWeightMin: number;
  suggestedWeightMax: number;
  weightDiffKg: number; // e.g. -2.0 means under by 2kg, +5.0 means over by 5kg, 0 if normal
}
