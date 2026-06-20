import React, { useState } from 'react';
import { X, Sparkles, AlertCircle, TrendingUp, CheckCircle, HelpCircle } from 'lucide-react';
import { Budget } from '../types';

interface CreateBudgetModalProps {
  onClose: () => void;
  onSubmit: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  incomeTotal: number;
}

export default function CreateBudgetModal({ onClose, onSubmit, incomeTotal = 12450.00 }: CreateBudgetModalProps) {
  // TODO: incomeTotal should come from backend summary data (e.g. /api/incomes/summary) when this modal opens.
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState(500);
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [isRecurring, setIsRecurring] = useState(true);

  // Compute live prediction metrics
  const percentageOfIncome = Math.round((limit / incomeTotal) * 100);
  
  let probabilityText = "High";
  let probabilityColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
  let analysisOpinion = "This is a conservative, highly sustainable cap based on your surplus earnings profile.";

  if (percentageOfIncome > 25) {
    probabilityText = "Moderate";
    probabilityColor = "text-amber-700 bg-amber-50 border-amber-200";
    analysisOpinion = "Warning: This category accounts for a significant portion of active net receipts. Watch for creep.";
  } else if (limit < 100) {
    probabilityText = "At Risk";
    probabilityColor = "text-rose-700 bg-rose-50 border-rose-200";
    analysisOpinion = "Risk: A very low threshold limit might trigger overflow alerts within the first 10 days of the month.";
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name,
      category,
      limit,
      alertThreshold,
      isRecurring,
      onTrackStatus: 'On Track',
      note: isRecurring ? 'Resets automatically next month' : 'One-time flexible cap'
    });
    
    onClose();
  };

  const categories = [
    { value: "Food", label: "🍔 Food & Dining" },
    { value: "Housing", label: "🏠 Rent & Housing" },
    { value: "Entertainment", label: "🎬 Entertainment & Media" },
    { value: "Vacation", label: "✈️ Vacation & Savings Goal" },
    { value: "Shopping", label: "🛍️ Shopping & Apparel" },
    { value: "Transportation", label: "🚗 Gas & Commute" }
  ];

  return (
    <div className="fixed inset-0 bg-[#1e1c10]/45 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-[#d6c3b6] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp font-sans">
        
        {/* Header bar */}
        <div className="px-6 py-4.5 bg-[#faf3e0] border-b border-[#d6c3b6] flex justify-between items-center">
          <div>
            <h3 className="font-display text-base font-black text-[#1e1c10] tracking-tight">Create New Budget Target</h3>
            <p className="text-[11px] text-[#847469] font-medium leading-none mt-1">Set up customizable caps to safeguard your monthly cash flow.</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-[#847469] hover:text-[#1e1c10] p-1 bg-white hover:bg-[#faf3e0] rounded-lg border border-[#d6c3b6] transition-all cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Input Form Fields */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Row: Budget Name */}
          <div>
            <label className="block text-xs font-bold text-[#847469] uppercase tracking-wider mb-1.5">
              Budget Target Name
            </label>
            <input 
              type="text" 
              placeholder="e.g. Winter Snowboard Trip"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-[#d6c3b6] rounded-xl px-3.5 py-2.5 text-sm text-[#1e1c10] placeholder-[#847469] focus:ring-1 focus:ring-[#804e22] focus:border-[#804e22] outline-hidden shadow-2xs font-medium"
              required
            />
          </div>

          {/* Row: Target Category dropdown selection */}
          <div>
            <label className="block text-xs font-bold text-[#847469] uppercase tracking-wider mb-1.5">
              Expense Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white border border-[#d6c3b6] rounded-xl px-3.5 py-2.5 text-sm text-[#1e1c10] focus:ring-1 focus:ring-[#804e22] outline-hidden cursor-pointer shadow-2xs"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Slider Row: Limit amount */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-[#847469] uppercase tracking-wider">
                Monthly Cap Limit ($)
              </label>
              <input 
                type="number" 
                value={limit}
                onChange={(e) => setLimit(Math.max(10, parseInt(e.target.value) || 0))}
                className="w-20 bg-[#faf3e0] text-right font-mono font-bold text-xs text-[#804e22] border border-[#d6c3b6] rounded-md px-1.5 py-0.5"
                min="10"
                max="10000"
              />
            </div>
            <input 
              type="range" 
              min="50" 
              max="5000" 
              step="50"
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#f4eedb] rounded-lg appearance-none cursor-pointer accent-[#804e22] rounded-full"
            />
            <div className="flex justify-between text-[10px] text-[#847469] font-bold mt-1">
              <span>$50</span>
              <span>$2,500</span>
              <span>$5,000</span>
            </div>
          </div>

          {/* Threshold alert row */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-[#847469] uppercase tracking-wider">
                Trigger Alerts at (% spent)
              </label>
              <span className="font-mono font-bold text-xs text-[#1e1c10] bg-[#dde7c4] px-1.5 py-0.5 rounded-md border border-[#c1cba9]">
                {alertThreshold}%
              </span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="100" 
              step="5"
              value={alertThreshold}
              onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#f4eedb] rounded-lg appearance-none cursor-pointer accent-[#596246] rounded-full"
            />
          </div>

          {/* Checkbox: Recurring Option */}
          <label className="flex items-center gap-3 bg-[#faf3e0]/45 p-3 rounded-xl border border-[#d6c3b6]/50 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 rounded-md border-[#d6c3b6] text-[#804e22] focus:ring-0 outline-hidden cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-[#1e1c10] block">Recurring Budget</span>
              <span className="text-[10px] text-[#847469] block">Automatically reset usage counters back to zero on the 1st of every month</span>
            </div>
          </label>

          {/* Dynamic Projection Live Banner */}
          <div className={`p-3.5 border rounded-xl flex items-start gap-2.5 transition-all font-sans ${probabilityColor}`}>
            <Sparkles className="w-5 h-5 text-[#804e22] flex-shrink-0 animate-pulse mt-0.5" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider">Dynamic Projection Analysis:</span>
                <span className="text-[10.5px] font-bold underline px-1.5 rounded">{probabilityText} Success Rate</span>
              </div>
              <p className="text-[11px] font-medium leading-relaxed mt-1">
                A ${limit} cap represents <span className="font-bold">{percentageOfIncome}%</span> of total positive cash inflows (${incomeTotal}). {analysisOpinion}
              </p>
            </div>
          </div>

          {/* Submit/Cancel bar */}
          <div className="pt-3 border-t border-[#eee8d5] flex justify-end gap-3 font-sans">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 bg-white border border-[#d6c3b6] hover:bg-[#faf3e0] text-[#51443b] text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-[#804e22] hover:bg-[#9d6638] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Create Budget
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
