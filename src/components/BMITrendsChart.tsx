import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import { BMICalculation } from '../types/bmi';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface BMITrendsChartProps {
  history: BMICalculation[];
}

export const BMITrendsChart: React.FC<BMITrendsChartProps> = ({ history }) => {
  const [showNormalRange, setShowNormalRange] = useState(true);

  if (history.length === 0) return null;

  // Chronological order: oldest to newest for the timeline
  const chronologicalData = [...history].reverse().map((item, index) => {
    // Short date formatting
    let shortDate = item.date;
    try {
      const d = new Date(item.timestamp || item.date);
      if (!isNaN(d.getTime())) {
        shortDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      }
    } catch {
      shortDate = item.date;
    }

    return {
      id: item.id,
      index: index + 1,
      label: shortDate || `#${index + 1}`,
      date: item.date,
      bmi: Number(item.bmi.toFixed(1)),
      weightKg: item.weightKg,
      heightCm: item.heightCm,
      categoryLabel: item.categoryLabel,
      categoryColor: item.categoryColor,
      category: item.category,
    };
  });

  // Calculate statistics
  const bmiValues = chronologicalData.map((d) => d.bmi);
  const minBmi = Math.min(...bmiValues);
  const maxBmi = Math.max(...bmiValues);
  const latestBmi = bmiValues[bmiValues.length - 1];
  const firstBmi = bmiValues[0];
  const bmiDiff = Number((latestBmi - firstBmi).toFixed(1));

  // Determine Y domain with comfortable padding
  const yMin = Math.max(10, Math.floor(Math.min(minBmi, 18.0) - 1));
  const yMax = Math.ceil(Math.max(maxBmi, 25.0) + 1);

  return (
    <div className="flex flex-col space-y-4">
      {/* Metric Summary Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col">
          <span className="text-[11px] text-neutral-400 font-normal">Latest</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg sm:text-xl font-bold text-white">{latestBmi}</span>
            <span className="text-[10px] text-neutral-500">BMI</span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col">
          <span className="text-[11px] text-neutral-400 font-normal">Min / Max</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-sm font-semibold text-white">
              {minBmi} - {maxBmi}
            </span>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex flex-col">
          <span className="text-[11px] text-neutral-400 font-normal">Net Change</span>
          <div className="flex items-center gap-1 mt-0.5">
            {bmiDiff > 0 ? (
              <span className="flex items-center text-sm font-semibold text-amber-400">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />+{bmiDiff}
              </span>
            ) : bmiDiff < 0 ? (
              <span className="flex items-center text-sm font-semibold text-emerald-400">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />{bmiDiff}
              </span>
            ) : (
              <span className="flex items-center text-sm font-semibold text-neutral-400">
                <Minus className="w-3.5 h-3.5 mr-0.5" /> 0.0
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chart Container Card */}
      <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-300">BMI Timeline</span>
            <span className="text-[10px] text-neutral-500">
              ({chronologicalData.length} {chronologicalData.length === 1 ? 'entry' : 'entries'})
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowNormalRange(!showNormalRange)}
            className={`text-[11px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
              showNormalRange
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500'
            }`}
          >
            Normal (18.5 - 24.0)
          </button>
        </div>

        {chronologicalData.length === 1 ? (
          <div className="py-8 text-center text-neutral-400 flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-orange-500 mb-2">
              <Info className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-neutral-300">Sirf 1 record mojood hai ({latestBmi} BMI)</p>
            <p className="text-[11px] text-neutral-500 mt-1 max-w-xs">
              Mazed entries calculate karne par yahan live progress line graph ban jayega.
            </p>
          </div>
        ) : (
          <div className="w-full h-56 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chronologicalData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#222227" strokeDasharray="3 3" vertical={false} />
                
                <XAxis
                  dataKey="label"
                  stroke="#52525b"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#27272a' }}
                />
                
                <YAxis
                  domain={[yMin, yMax]}
                  stroke="#52525b"
                  tick={{ fill: '#71717a', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickCount={5}
                />

                <Tooltip content={<CustomTooltip />} />

                {/* Normal BMI bounds (18.5 to 24.0) */}
                {showNormalRange && (
                  <>
                    <ReferenceLine
                      y={18.5}
                      stroke="#22c55e"
                      strokeDasharray="4 4"
                      strokeOpacity={0.6}
                      label={{
                        value: '18.5',
                        position: 'right',
                        fill: '#22c55e',
                        fontSize: 10,
                      }}
                    />
                    <ReferenceLine
                      y={24.0}
                      stroke="#22c55e"
                      strokeDasharray="4 4"
                      strokeOpacity={0.6}
                      label={{
                        value: '24.0',
                        position: 'right',
                        fill: '#22c55e',
                        fontSize: 10,
                      }}
                    />
                  </>
                )}

                <Line
                  type="monotone"
                  dataKey="bmi"
                  stroke="#ff6900"
                  strokeWidth={2.5}
                  dot={{
                    r: 4,
                    fill: '#ff6900',
                    stroke: '#000000',
                    strokeWidth: 2,
                  }}
                  activeDot={{
                    r: 6,
                    fill: '#ffffff',
                    stroke: '#ff6900',
                    strokeWidth: 3,
                  }}
                  animationDuration={600}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

// Custom dark-themed MIUI Tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-neutral-950/95 border border-neutral-800 rounded-xl p-2.5 shadow-2xl backdrop-blur-md text-xs min-w-[140px] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between gap-2 border-b border-neutral-900 pb-1.5 mb-1.5">
          <span className="text-neutral-400 font-medium text-[11px]">{data.date}</span>
          <span
            className="text-[10px] px-1.5 py-0.2 rounded font-semibold"
            style={{
              backgroundColor: `${data.categoryColor}22`,
              color: data.categoryColor,
            }}
          >
            {data.categoryLabel}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-neutral-400">BMI:</span>
          <span className="text-white font-bold text-sm">{data.bmi}</span>
        </div>
        <div className="flex items-baseline justify-between gap-4 mt-0.5">
          <span className="text-neutral-400">Weight:</span>
          <span className="text-neutral-200">{data.weightKg} kg</span>
        </div>
        <div className="flex items-baseline justify-between gap-4 mt-0.5">
          <span className="text-neutral-400">Height:</span>
          <span className="text-neutral-200">{data.heightCm} cm</span>
        </div>
      </div>
    );
  }
  return null;
};

