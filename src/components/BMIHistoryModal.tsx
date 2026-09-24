import React, { useState } from 'react';
import { BMICalculation } from '../types/bmi';
import { X, Trash2, Calendar, TrendingUp, List } from 'lucide-react';
import { BMITrendsChart } from './BMITrendsChart';

interface BMIHistoryModalProps {
  history: BMICalculation[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
  onSelect: (item: BMICalculation) => void;
}

export const BMIHistoryModal: React.FC<BMIHistoryModalProps> = ({
  history,
  isOpen,
  onClose,
  onClear,
  onSelect,
}) => {
  const [activeTab, setActiveTab] = useState<'trends' | 'records'>('trends');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[90vh] rounded-3xl bg-neutral-950 border border-neutral-800 flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-white">BMI History & Trends</h2>
          </div>
          <div className="flex items-center gap-1.5">
            {history.length > 0 && (
              <button
                onClick={onClear}
                title="Clear all history"
                className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher (Trends vs Records) */}
        {history.length > 0 && (
          <div className="px-5 sm:px-6 pt-3 pb-2 border-b border-neutral-900/80 flex items-center gap-2 bg-neutral-950">
            <button
              type="button"
              onClick={() => setActiveTab('trends')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'trends'
                  ? 'bg-neutral-900 text-orange-400 border border-neutral-800 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Trends</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('records')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'records'
                  ? 'bg-neutral-900 text-orange-400 border border-neutral-800 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Records ({history.length})</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="py-14 text-center text-neutral-500 space-y-2">
              <TrendingUp className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
              <p className="text-sm font-medium text-neutral-400">Abhi koi record save nahi hua</p>
              <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                Jab aap values enter karke &quot;Calculate&quot; karenge to aapke calculations aur visual trends yahan display honge.
              </p>
            </div>
          ) : activeTab === 'trends' ? (
            <div className="space-y-4">
              <BMITrendsChart history={history} />
            </div>
          ) : (
            <div className="space-y-2.5">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className="p-3.5 sm:p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 cursor-pointer active:scale-[0.99] transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-white">{item.formattedBmi}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{
                          backgroundColor: `${item.categoryColor}22`,
                          color: item.categoryColor,
                        }}
                      >
                        {item.categoryLabel}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">
                      {item.heightCm} cm • {item.weightKg} kg • {item.age} yrs •{' '}
                      <span className="capitalize">{item.gender}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-neutral-500 block">{item.date}</span>
                    <span className="text-xs text-orange-400 font-medium">View &rarr;</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-900 bg-neutral-950/80">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-sm font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
