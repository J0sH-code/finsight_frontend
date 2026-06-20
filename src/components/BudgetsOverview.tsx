import React, { useState } from 'react';
import { 
  PlusCircle, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle2, 
  Calendar, 
  Search,
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  Utensils,
  Home,
  Tv,
  Palmtree,
  Sparkles,
  Info
} from 'lucide-react';
import { Budget, Transaction } from '../types';

interface BudgetsOverviewProps {
  budgets: Budget[];
  expenses: Transaction[];
  onAddBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  onDeleteBudget: (id: string) => void;
  onTriggerCreateModal: () => void;
}

export default function BudgetsOverview({
  budgets,
  expenses,
  onAddBudget,
  onDeleteBudget,
  onTriggerCreateModal
}: BudgetsOverviewProps) {
  // TODO: App should fetch budgets from /api/budgets and expenses from /api/expenses, then pass them down.
  // TODO: If this view owns loading, fetch both budgets and expense transactions here.
  const [selectedBudgetFilter, setSelectedBudgetFilter] = useState<'All' | 'At Risk' | 'On Track'>('All');
  const [activeBudgetDrilldownId, setActiveBudgetDrilldownId] = useState<string | null>(null);

  const getIconForCategory = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'food': return Utensils;
      case 'housing': return Home;
      case 'entertainment': return Tv;
      case 'vacation': return Palmtree;
      default: return Sparkles;
    }
  };

  const filteredBudgets = budgets.filter((b) => {
    if (selectedBudgetFilter === 'All') return true;
    if (selectedBudgetFilter === 'At Risk') return b.spent / b.limit >= 0.85;
    if (selectedBudgetFilter === 'On Track') return b.spent / b.limit < 0.85;
    return true;
  });

  const activeDrilldownBudget = budgets.find(b => b.id === activeBudgetDrilldownId);

  // Filter transactions belonging to selected budget category
  const drilldownTransactions = expenses.filter(
    (t) => activeDrilldownBudget && t.category.toLowerCase() === activeDrilldownBudget.category.toLowerCase()
  );

  const getStatusColor = (spent: number, limit: number) => {
    const ratio = spent / limit;
    if (ratio >= 0.9) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (ratio >= 0.75) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  };

  const getProgressColorClass = (spent: number, limit: number) => {
    const ratio = spent / limit;
    if (ratio >= 0.9) return 'bg-[#ba1a1a]';
    if (ratio >= 0.75) return 'bg-amber-600';
    return 'bg-[#596246]';
  };

  return (
    <div className="space-y-6">
      {/* Drilldown Back Button Header if inside specific budget detail */}
      {activeBudgetDrilldownId && activeDrilldownBudget ? (
        <div className="flex flex-col gap-4">
          <button 
            id="back-to-budgets-list-btn"
            onClick={() => setActiveBudgetDrilldownId(null)}
            className="flex items-center gap-2 self-start font-sans text-xs font-bold text-[#804e22] hover:underline cursor-pointer border-none bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Budget Catalogs
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#804e22]/10 border border-[#d6c3b6] flex items-center justify-center">
                {React.createElement(getIconForCategory(activeDrilldownBudget.category), { className: "w-6 h-6 text-[#804e22]" })}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#847469]">Budget category detail</span>
                <h2 className="font-display text-2xl font-extrabold text-[#1e1c10] tracking-tight">{activeDrilldownBudget.name} Target</h2>
              </div>
            </div>
            
            <button
              onClick={() => { onDeleteBudget(activeDrilldownBudget.id); setActiveBudgetDrilldownId(null); }}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Delete Budget
            </button>
          </div>

          {/* Drilldown Layout matches Image 1 precisely */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left box stats */}
            <div className="bg-white border border-[#d6c3b6] rounded-2xl p-6 shadow-xs space-y-6 lg:col-span-1">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#847469]">Limit Remaining</span>
                <p className="font-display text-3xl font-black text-[#1e1c10] mt-1">
                  ${(activeDrilldownBudget.limit - activeDrilldownBudget.spent).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 p-2 bg-[#faf3e0] border border-[#d6c3b6] rounded-lg">
                  <Info className="w-4 h-4 text-[#804e22] flex-shrink-0" />
                  <span className="text-[10px] text-[#51443b] font-medium leading-none">{activeDrilldownBudget.note}</span>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[#eee8d5] font-sans">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#847469] font-bold">Total Spent</span>
                  <span className="font-extrabold text-[#1e1c10]">${activeDrilldownBudget.spent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#847469] font-bold">Absolute Limit</span>
                  <span className="font-extrabold text-[#1e1c10]">${activeDrilldownBudget.limit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#847469] font-bold">Avg. Daily Spent</span>
                  <span className="font-extrabold text-[#1e1c10]">${(activeDrilldownBudget.spent / 16).toFixed(2)} / day</span>
                </div>
              </div>

              {/* Progress bar wave ratio */}
              <div className="pt-4 border-t border-[#eee8d5]">
                <div className="flex justify-between items-center text-xs font-semibold text-[#847469] mb-1.5">
                  <span>Threshold</span>
                  <span>{Math.round((activeDrilldownBudget.spent / activeDrilldownBudget.limit) * 100)}% Used</span>
                </div>
                <div className="w-full bg-[#f4eedb] h-3 rounded-full overflow-hidden border border-[#eee8d5]">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColorClass(activeDrilldownBudget.spent, activeDrilldownBudget.limit)}`}
                    style={{ width: `${Math.min(100, (activeDrilldownBudget.spent / activeDrilldownBudget.limit) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Right box related transactions table */}
            <div className="bg-[#ffffff] border border-[#d6c3b6] rounded-2xl p-6 shadow-xs lg:col-span-2 flex flex-col justify-between">
              <div>
                <h4 className="font-display text-base font-bold text-[#1e1c10] mb-4">Budget Associated Transactions</h4>
                <div className="divide-y divide-[#eee8d5] overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
                  {drilldownTransactions.length > 0 ? (
                    drilldownTransactions.map((t) => (
                      <div key={t.id} className="py-3 flex items-center justify-between hover:bg-[#faf3e0]/30 transition-all px-2 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#847469] font-mono mr-2">{t.date}</span>
                          <div>
                            <p className="text-xs font-bold text-[#1e1c10]">{t.source}</p>
                            <span className="text-[10px] text-[#847469] font-medium uppercase tracking-wider">{t.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-mono font-bold text-rose-700">
                            -${Math.abs(t.amount).toFixed(2)}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            t.status === 'Completed' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-semibold text-[#847469] text-center py-10 italic">
                      No matching expenditures recorded for this category yet this calendar month.
                    </p>
                  )}
                </div>
              </div>

              {/* Quick advisor recommendation box for this category specifically */}
              {activeDrilldownBudget.spent / activeDrilldownBudget.limit >= 0.85 && (
                <div className="mt-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 font-sans">
                  <ShieldAlert className="w-5 h-5 text-rose-700 flex-shrink-0" />
                  <p className="text-[11px] text-rose-800 leading-relaxed">
                    <span className="font-bold">Over Capacity warning:</span> This budget is exceeding {activeDrilldownBudget.alertThreshold}%. FinSight AI recommends suppressing non-essential shopping or auto-transferring $100 surplus to offset potential deficit.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      ) : (
        /* Budgets List Catalog Grid view */
        <div className="space-y-6">
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-extrabold text-[#1e1c10] tracking-tight">Active Budgets</h2>
              <p className="font-sans text-sm text-[#51443b] mt-1 font-medium">Configure thresholds and automated caps to structure compound wealth.</p>
            </div>
            <button
              onClick={onTriggerCreateModal}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[#804e22] hover:bg-[#9d6638] text-white font-sans font-bold text-sm rounded-lg shadow-sm hover-lift active:scale-98 cursor-pointer select-none"
            >
              <PlusCircle className="w-5 h-5" /> Add Budget Target
            </button>
          </section>

          {/* Quick Filter Caps tabs */}
          <div className="flex gap-2 select-none">
            {(['All', 'At Risk', 'On Track'] as const).map((filter) => (
              <button
                key={filter}
                id={`budget-filter-tab-${filter}`}
                onClick={() => setSelectedBudgetFilter(filter)}
                className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  selectedBudgetFilter === filter 
                    ? 'bg-[#804e22] text-white border-[#804e22] shadow-2xs' 
                    : 'bg-[#ffffff] text-[#51443b] border-[#d6c3b6] hover:bg-[#faf3e0]'
                }`}
              >
                {filter === 'All' ? 'All Budgets' : filter}
              </button>
            ))}
          </div>

          {/* Budget row grid listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBudgets.map((b) => {
              const IconComp = getIconForCategory(b.category);
              const ratio = b.spent / b.limit;
              const alertSpurred = ratio >= 0.8;

              return (
                <div 
                  key={b.id} 
                  id={`budget-card-${b.id}`}
                  onClick={() => setActiveBudgetDrilldownId(b.id)}
                  className="bg-[#ffffff] border border-[#d6c3b6] rounded-2xl p-5 hover-lift shadow-xs cursor-pointer flex flex-col justify-between group transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#faf3e0] border border-[#d6c3b6] flex items-center justify-center group-hover:bg-[#804e22]/5 transition-all">
                        <IconComp className="w-5 h-5 text-[#804e22]" />
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold text-[#1e1c10] group-hover:text-[#804e22] transition-colors">{b.name}</h4>
                        <span className="text-[10px] text-[#847469] font-medium">{b.isRecurring ? 'Resets monthly' : 'Flexible cap'}</span>
                      </div>
                    </div>
                    
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 border ${
                      getStatusColor(b.spent, b.limit)
                    }`}>
                      {alertSpurred && <AlertTriangle className="w-3 h-3 text-amber-700 animate-pulse" />}
                      {b.spent > b.limit ? 'Over limit' : ratio >= 0.85 ? 'At Risk' : 'On Track'}
                    </span>
                  </div>

                  {/* Limit tracking stats */}
                  <div className="flex justify-between items-end mb-3">
                    <div>
                      <p className="text-[11px] text-[#847469] font-semibold uppercase tracking-wider">Remaining</p>
                      <p className="font-display text-lg font-black text-[#1e1c10]">
                        ${(b.limit - b.spent).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-[#847469] font-medium">Spent of ${b.limit.toLocaleString()}</p>
                      <p className="text-xs font-extrabold text-[#1e1c10] font-mono mt-0.5">${b.spent.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Progress capping standard bar */}
                  <div className="w-full bg-[#f4eedb] h-2.5 rounded-full overflow-hidden border border-[#eee8d5] mb-4">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColorClass(b.spent, b.limit)}`}
                      style={{ width: `${Math.min(100, ratio * 100)}%` }}
                    ></div>
                  </div>

                  {/* Footer node detail click prompt */}
                  <div className="border-t border-[#eee8d5] pt-3 flex justify-between items-center text-[10px] text-[#847469] font-bold uppercase tracking-wider">
                    <span>{b.note}</span>
                    <span className="text-[#804e22] group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      Configure details <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
