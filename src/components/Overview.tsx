import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  DollarSign, 
  ShoppingBag, 
  Utensils, 
  PiggyBank, 
  Briefcase,
  Layers,
  ArrowRight,
  Bot
} from 'lucide-react';
import { Budget, Transaction } from '../types';

interface OverviewProps {
  incomeTotal: number;
  expensesTotal: number;
  remainingBudget: number;
  savingsRate: number;
  recentExpenses: Transaction[];
  recentIncomes: Transaction[];
  budgets: Budget[];
  onNavigate: (tab: any) => void;
  onAskAI: (prompt: string) => void;
}

export default function Overview({
  incomeTotal,
  expensesTotal,
  remainingBudget,
  savingsRate,
  recentExpenses,
  recentIncomes,
  budgets,
  onNavigate,
  onAskAI
}: OverviewProps) {
  // TODO: App should fetch overview summary and recent transaction data from /api/overview or equivalent.
  // TODO: If this component is converted to its own loader, fetch totals, recentExpenses, recentIncomes, and budgets here.

  // Mix of transactions for "recent activity" view
  const consolidatedActivity = [
    { id: 'act-1', title: 'Amazon Marketplace', detail: '2 hours ago', amount: -45.20, type: 'expense', icon: ShoppingBag, color: 'text-rose-700 bg-rose-100' },
    { id: 'act-2', title: 'The Coffee Club', detail: 'Yesterday', amount: -12.80, type: 'expense', icon: Utensils, color: 'text-amber-700 bg-amber-100' },
    { id: 'act-3', title: 'Paycheck Deposit', detail: '2 days ago', amount: 3200.00, type: 'income', icon: Briefcase, color: 'text-emerald-700 bg-emerald-100' },
  ];

  const totalSpentFormatted = expensesTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const totalIncomeFormatted = incomeTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const remainingBudgetFormatted = remainingBudget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section>
        <h2 id="overview-welcome-title" className="font-display text-3xl font-extrabold text-[#1e1c10] tracking-tight">Financial Overview</h2>
        <p className="font-sans text-sm text-[#51443b] mt-1 font-medium">Welcome back, Alex. Your finances are looking healthy today.</p>
      </section>

      {/* Highlights Dashboard Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-[#faf3e0] border border-[#d6c3b6] p-5 rounded-xl shadow-xs hover-lift flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="bg-[#804e22]/10 p-2 rounded-lg">
              <Briefcase className="w-5 h-5 text-[#804e22]" />
            </div>
            <span className="text-[#596246] font-display text-xs font-bold flex items-center">
              +8.2% <TrendingUp className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>
          <div className="mt-4">
            <p className="font-sans text-[11px] font-bold text-[#51443b] uppercase tracking-wider">Total Income</p>
            <p className="font-display text-xl font-extrabold text-[#1e1c10] mt-0.5">${totalIncomeFormatted}</p>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-[#faf3e0] border border-[#d6c3b6] p-5 rounded-xl shadow-xs hover-lift flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="bg-[#834c36]/10 p-2 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-[#834c36]" />
            </div>
            <span className="text-[#ba1a1a] font-display text-xs font-bold flex items-center">
              +12.4% <TrendingUp className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>
          <div className="mt-4">
            <p className="font-sans text-[11px] font-bold text-[#51443b] uppercase tracking-wider">Total Expenses</p>
            <p className="font-display text-xl font-extrabold text-[#1e1c10] mt-0.5">${totalSpentFormatted}</p>
          </div>
        </div>

        {/* Remaining Budget */}
        <div className="bg-[#faf3e0] border border-[#d6c3b6] p-5 rounded-xl shadow-xs hover-lift flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="bg-[#596246]/10 p-2 rounded-lg">
              <PiggyBank className="w-5 h-5 text-[#596246]" />
            </div>
            <span className="text-[#596246] font-display text-xs font-bold flex items-center">
              -2.1% <TrendingDown className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>
          <div className="mt-4">
            <p className="font-sans text-[11px] font-bold text-[#51443b] uppercase tracking-wider">Remaining Budget</p>
            <p className="font-display text-xl font-extrabold text-[#1e1c10] mt-0.5">${remainingBudgetFormatted}</p>
          </div>
        </div>

        {/* Savings Rate Accent Card */}
        <div className="bg-[#804e22] text-[#fff9e8] p-5 rounded-xl shadow-xs hover-lift flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="bg-white/10 p-2 rounded-lg">
              <Layers className="w-5 h-5 text-[#fff9e8]" />
            </div>
            <span className="text-[#dde7c4] font-display text-xs font-bold flex items-center">
              +4.5% <TrendingUp className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>
          <div className="mt-4">
            <p className="font-sans text-[11px] font-bold text-white/80 uppercase tracking-wider">Savings Rate</p>
            <p className="font-display text-xl font-extrabold text-[#fff9e8] mt-0.5">{savingsRate}%</p>
          </div>
        </div>
      </section>

      {/* Main Stats Charts & Right Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column Charts (8 of 12 grid) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Monthly Spending Spline Chart Card */}
          <div className="bg-[#ffffff] border border-[#d6c3b6] p-5 rounded-2xl shadow-xs hover-lift flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-display text-base font-bold text-[#1e1c10]">Monthly Spending</h3>
                <p className="font-sans text-[11px] text-[#847469] font-medium leading-tight">Timeline across past 12 Months</p>
              </div>
              <div className="flex gap-1.5">
                <button className="px-2.5 py-1 bg-[#faf3e0] text-[#1e1c10] text-[10px] font-bold rounded-lg border border-[#d6c3b6]">6M</button>
                <button className="px-2.5 py-1 bg-[#804e22] text-white text-[10px] font-bold rounded-lg">1Y</button>
              </div>
            </div>
            
            {/* Elegant SVG Spent Trace Graph */}
            <div className="flex-1 min-h-[220px] w-full relative flex items-end pt-4">
              <svg className="w-full h-full" viewBox="0 0 320 140" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="spending-line-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#804e22" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#804e22" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Horizontal Guide lines */}
                <line x1="0" y1="35" x2="320" y2="35" stroke="#eee8d5" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="70" x2="320" y2="70" stroke="#eee8d5" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="105" x2="320" y2="105" stroke="#eee8d5" strokeWidth="1" strokeDasharray="3,3" />
                
                {/* Solid curve */}
                <path 
                  d="M0,110 Q30,95 60,105 T125,75 T190,90 T255,42 T320,55" 
                  fill="none" 
                  stroke="#804e22" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                />
                
                {/* Gradient area */}
                <path 
                  d="M0,110 Q30,95 60,105 T125,75 T190,90 T255,42 T320,55 L320,140 L0,140 Z" 
                  fill="url(#spending-line-gradient)" 
                />
                
                {/* Peak point indicator dot */}
                <circle cx="255" cy="42" r="5" fill="#804e22" stroke="#fff9e8" strokeWidth="1.5" className="animate-pulse" />
              </svg>
              
              {/* Chart Months Axis */}
              <div className="absolute bottom-0 left-0 w-full flex justify-between px-1 text-[9px] text-[#847469] font-bold uppercase tracking-wider select-none font-sans mt-2">
                <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
              </div>
            </div>
          </div>

          {/* Expense Categories Donut Ring Card */}
          <div className="bg-[#ffffff] border border-[#d6c3b6] p-5 rounded-2xl shadow-xs hover-lift flex flex-col h-full">
            <h3 className="font-display text-base font-bold text-[#1e1c10] mb-6">Expense Categories</h3>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Housing (45%) => dasharray="282.7" base, stroke-dashoffset="155.5" */}
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    stroke="#804e22" 
                    strokeWidth="11" 
                    strokeDasharray="251.3" 
                    strokeDashoffset="138" 
                  />
                  {/* Groceries (25%) */}
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    stroke="#596246" 
                    strokeWidth="11" 
                    strokeDasharray="251.3" 
                    strokeDashoffset="188" 
                    transform="rotate(162 50 50)"
                  />
                  {/* Lifestyle (30%) */}
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="transparent" 
                    stroke="#333124" 
                    strokeWidth="11" 
                    strokeDasharray="251.3" 
                    strokeDashoffset="176" 
                    transform="rotate(252 50 50)"
                  />
                </svg>
                {/* Center text sum */}
                <div className="absolute text-center">
                  <p className="text-[10px] font-sans font-bold text-[#847469] uppercase tracking-wider">Total spent</p>
                  <p className="font-display text-xl font-extrabold text-[#1e1c10] mt-0.5">${Math.round(expensesTotal)}</p>
                </div>
              </div>

              {/* Categorical labels */}
              <div className="mt-6 w-full space-y-1.5 px-3">
                <div className="flex justify-between items-center text-xs font-sans font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#804e22]" />
                    <span className="text-[#51443b]">Housing</span>
                  </div>
                  <span className="font-bold text-[#1e1c10]">45%</span>
                </div>
                <div className="flex justify-between items-center text-xs font-sans font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#596246]" />
                    <span className="text-[#51443b]">Groceries</span>
                  </div>
                  <span className="font-bold text-[#1e1c10]">25%</span>
                </div>
                <div className="flex justify-between items-center text-xs font-sans font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#333124]" />
                    <span className="text-[#51443b]">Lifestyle</span>
                  </div>
                  <span className="font-bold text-[#1e1c10]">30%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column Layout Widgets (4 of 12 grid) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* AI Advisor Box widget */}
          <div className="bg-[#414a30] text-[#fff9e8] rounded-2xl p-5 shadow-xs border border-white/5 relative overflow-hidden flex flex-col hover-lift">
            <div className="absolute -right-4 -top-4 w-28 h-28 bg-[#804e22]/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-[#dde7c4] flex items-center justify-center text-[#596246]">
                <Bot className="w-5.5 h-5.5 text-[#596246]" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-white leading-tight">AI Advisor</h4>
                <p className="text-[10px] text-[#dae4c1] font-medium uppercase tracking-wider">Contextual co-pilot</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 mb-5 relative z-10">
              <p className="font-sans text-xs text-white italic leading-relaxed">
                "Your dining & snack spending increased by 12% this month. Consider checking your food target limits."
              </p>
            </div>

            <button 
              id="ai-insight-gen-btn"
              onClick={() => {
                onNavigate('expenses');
                setTimeout(() => {
                  onAskAI("Could you analyze my grocery spending versus budget statistics?");
                }, 100);
              }}
              className="w-full bg-[#804e22] text-[#fff9e8] font-sans font-bold text-xs py-3 rounded-lg hover:bg-[#9d6638] transition-colors active:scale-98 select-none flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              Analyze Budgets
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Recent Activity Mini-Card list */}
          <div className="bg-[#f4eedb] border border-[#d6c3b6] p-5 rounded-2xl flex-1 flex flex-col hover-lift">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-display text-sm font-bold text-[#1e1c10]">Recent Activity</h4>
              <button 
                onClick={() => onNavigate('expenses')}
                className="text-[10px] text-[#804e22] font-bold hover:underline select-none border-none outline-hidden cursor-pointer"
              >
                View Expenses
              </button>
            </div>

            <div className="flex flex-col gap-3 overflow-y-auto max-h-[220px] custom-scrollbar pr-1">
              {consolidatedActivity.map((act) => {
                const ActIcon = act.icon;
                return (
                  <div key={act.id} className="flex items-center justify-between p-2 hover:bg-white/45 rounded-xl transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center ${act.color}`}>
                        <ActIcon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1e1c10]">{act.title}</p>
                        <p className="text-[10px] text-[#847469] font-medium">{act.detail}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-mono font-bold ${
                      act.type === 'income' ? 'text-emerald-700' : 'text-[#ba1a1a]'
                    }`}>
                      {act.type === 'income' ? '+' : '-'}${Math.abs(act.amount).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
