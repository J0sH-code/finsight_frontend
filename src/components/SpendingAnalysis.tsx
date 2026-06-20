import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Coffee, 
  ShoppingBasket, 
  Bot, 
  Zap, 
  HelpCircle,
  Sparkles,
  Play
} from 'lucide-react';
import { Transaction, Budget, ChatMessage, PotentialSaving, BudgetOptimization } from '../types';
import AIAssistantChat from './AIAssistantChat';

interface SpendingAnalysisProps {
  expenses: Transaction[];
  budgets: Budget[];
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  potentialSavings: PotentialSaving[];
  optimizations: BudgetOptimization[];
  incomeTotal: number;
  onNavigate: (tab: any) => void;
}

export default function SpendingAnalysis({
  expenses,
  budgets,
  messages,
  onSendMessage,
  potentialSavings,
  optimizations,
  incomeTotal,
  onNavigate
}: SpendingAnalysisProps) {
  // TODO: App should fetch:
  //   - /api/expenses for expense history
  //   - /api/budgets for budget status
  //   - /api/chat for message history
  //   - /api/insights/savings for potentialSavings
  //   - /api/insights/optimizations for optimizations
  // If this component owns the data, use useEffect here to load those endpoints on mount.
  const [showSubscriptionAudit, setShowSubscriptionAudit] = useState(false);
  const [analyzingState, setAnalyzingState] = useState(false);

  const activeSubscriptions = [
    { id: 1, name: "Premium Stream Plus", cost: 14.99, lastUsed: "78 days ago", action: 'recommended' },
    { id: 2, name: "Daily Fitness Online", cost: 29.00, lastUsed: "90 days ago", action: 'recommended' },
    { id: 3, name: "Vintage Wine Club", cost: 40.01, lastUsed: "120 days ago", action: 'recommended' }
  ];

  const handleTriggerAnalysis = () => {
    setAnalyzingState(true);
    setTimeout(() => {
      setAnalyzingState(false);
      onSendMessage("Analyze my general spending and suggest quick ways to increase my savings.");
    }, 1500);
  };

  const totalSpentSum = expenses.reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-[#1e1c10] tracking-tight">Financial Insights</h2>
          <p className="font-sans text-sm text-[#51443b] mt-1 font-medium">Last updated today at 9:41 AM</p>
        </div>
        <button 
          id="insight-trigger-analysis-btn"
          onClick={handleTriggerAnalysis}
          disabled={analyzingState}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#804e22] hover:bg-[#9d6638] text-white font-sans font-bold text-sm rounded-lg shadow-sm transition-all active:scale-98 cursor-pointer disabled:opacity-50"
        >
          <Zap className={`w-4.5 h-4.5 ${analyzingState ? 'animate-bounce' : 'text-[#ffdbce]'}`} />
          {analyzingState ? 'Generating Analysis...' : 'Generate New Analysis'}
        </button>
      </section>

      {/* Main 2 Column Grid: Financial metrics + Chat Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column (8 cols) - Spending graphs and breakdown summaries */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Monthly Spending Metrics Panel */}
          <div className="bg-[#ffffff] border border-[#d6c3b6] p-6 rounded-2xl shadow-xs">
            <h3 className="font-display text-base font-bold text-[#1e1c10] mb-5">Monthly Spending Analysis</h3>
            
            {/* Quick cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-amber-50/50 p-3.5 border border-[#d6c3b6] rounded-xl">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#847469]">Total Spent</span>
                <p className="font-display text-lg font-extrabold text-[#804e22] mt-1">${totalSpentFormatted(totalSpentSum)}</p>
                <span className="text-[10px] text-[#ba1a1a] font-bold flex items-center mt-1 leading-none">
                  +12.4% vs last month
                </span>
              </div>
              <div className="bg-amber-50/50 p-3.5 border border-[#d6c3b6] rounded-xl">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#847469]">Top Category</span>
                <p className="font-display text-sm font-extrabold text-[#1e1c10] mt-1 truncate">Dining & Food</p>
                <span className="text-[10px] font-bold text-[#847469] block mt-1 leading-none">$1,120.00 (26%)</span>
              </div>
              <div className="bg-amber-50/50 p-3.5 border border-[#d6c3b6] rounded-xl">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#847469]">Predicted EOM</span>
                <p className="font-display text-lg font-extrabold text-[#1e1c10] mt-1">$5,100.00</p>
                <span className="text-[10px] text-[#596246] font-bold block mt-1 leading-none">Safe within budget</span>
              </div>
            </div>

            {/* Custom Visual Bar chart */}
            <h4 className="text-xs font-bold text-[#51443b] uppercase tracking-wider mb-4">Weekly Spend Distribution</h4>
            <div className="bg-[#faf3e0]/45 p-4 rounded-xl border border-[#d6c3b6]/50">
              <div className="h-28 w-full flex items-end gap-3.5 justify-between px-2 pt-2">
                {/* Simulated bar columns */}
                <div className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full bg-[#dde7c4] hover:bg-[#c1cba9] rounded-sm transition-all h-[40%]" title="Week 1: $120"></div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full bg-[#dde7c4] hover:bg-[#c1cba9] rounded-sm transition-all h-[25%]" title="Week 2: $80"></div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full bg-[#dde7c4] hover:bg-[#c1cba9] rounded-sm transition-all h-[60%]" title="Week 3: $190"></div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full bg-[#dde7c4] hover:bg-[#c1cba9] rounded-sm transition-all h-[20%]" title="Week 4: $65"></div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full bg-[#804e22] rounded-sm transition-all h-[95%]" title="Week 5 (Peak Spike): $380"></div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full bg-[#dde7c4] rounded-sm transition-all h-[55%]"></div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full border-2 border-dashed border-[#847469] rounded-sm h-[75%]" title="Week 7 (Predicted EOM): $290"></div>
                </div>
              </div>
              <div className="flex justify-between text-[9px] text-[#847469] font-bold uppercase tracking-wider mt-2.5 px-2 select-none">
                <span>Wk 1</span><span>Wk 2</span><span>Wk 3</span><span>Wk 4</span><span>Wk 5</span><span>Wk 6</span><span>Proj EOM</span>
              </div>
            </div>
          </div>

          {/* Savings Audits & Optimizations Bento Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Subscription Auditor card */}
            <div className="bg-[#dde7c4]/50 border border-[#b0ba99] p-5 rounded-2xl shadow-xs flex flex-col hover-lift relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-white p-2 rounded-xl border border-[#b0ba99]">
                  <Sparkles className="w-5 h-5 text-[#804e22]" />
                </div>
                <span className="bg-white border border-[#b0ba99] text-[9px] font-bold text-[#804e22] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  High Impact
                </span>
              </div>

              <h4 className="font-display font-black text-sm text-[#1e1c10]">Potential Savings</h4>
              <p className="font-sans text-xs text-[#51443b] mt-1 leading-relaxed">
                We found 3 recurring subscriptions you haven't used in 90 days.
              </p>

              <div className="my-4">
                <span className="font-display text-2xl font-black text-[#596246]">$84.00/mo</span>
              </div>

              <button 
                id="review-subscriptions-btn"
                onClick={() => setShowSubscriptionAudit(!showSubscriptionAudit)}
                className="w-full py-3 bg-[#596246] text-white hover:bg-[#414a30] transition-colors font-sans font-bold text-xs rounded-lg cursor-pointer"
              >
                {showSubscriptionAudit ? 'Close Audit View' : 'Review Subscriptions'}
              </button>

              {/* Collapsible details for high fidelity subscription popup list */}
              {showSubscriptionAudit && (
                <div className="absolute inset-0 bg-white p-5 flex flex-col z-10 transition-all font-sans overflow-y-auto">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-display text-xs font-black text-[#1e1c10] uppercase tracking-wider">Review Subscriptions</h5>
                    <button onClick={() => setShowSubscriptionAudit(false)} className="text-xs font-bold text-[#ba1a1a]">Close</button>
                  </div>
                  <div className="space-y-2 mb-3">
                    {activeSubscriptions.map((sub) => (
                      <div key={sub.id} className="flex justify-between items-center bg-[#faf3e0] border border-[#d6c3b6] rounded-lg p-2.5">
                        <div>
                          <p className="text-xs font-bold text-[#1e1c10]">{sub.name}</p>
                          <span className="text-[10px] text-[#847469]">Inactive: {sub.lastUsed}</span>
                        </div>
                        <span className="text-xs font-bold text-[#ba1a1a]">${sub.cost}/mo</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      onSendMessage("Cancel all three of my inactive subscriptions.");
                      setShowSubscriptionAudit(false);
                    }}
                    className="w-full bg-[#ba1a1a] text-white text-xs py-2 rounded font-bold cursor-pointer hover:bg-red-800"
                  >
                    Generate Cancel Templates
                  </button>
                </div>
              )}
            </div>

            {/* Budget Optimization targets list card */}
            <div className="bg-[#ffffff] border border-[#d6c3b6] p-5 rounded-2xl shadow-xs flex flex-col hover-lift">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5.5 h-5.5 text-[#804e22]" />
                <h4 className="font-display font-bold text-sm text-[#1e1c10]">Budget Optimization</h4>
              </div>

              <div className="space-y-3 flex-1 mb-5">
                {optimizations.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => onSendMessage(`What optimization can I do for ${item.title}?`)}
                    className="p-3 bg-[#faf3e0] hover:bg-[#fff9e8] transition-colors border border-[#d6c3b6] rounded-xl flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-[#1e1c10] leading-tight">{item.title}</h5>
                      <span className="text-[10px] text-[#847469]">Recommended: {item.recommendedChange}</span>
                    </div>
                    {item.trend === 'down' ? (
                      <div className="text-amber-700 bg-amber-50 p-1.5 rounded-full">
                        <TrendingDown className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="text-emerald-700 bg-emerald-50 p-1.5 rounded-full">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button 
                onClick={() => onNavigate('budgets')}
                className="font-sans text-xs text-[#804e22] hover:underline font-bold self-center flex items-center gap-1.5 cursor-pointer outline-hidden border-none bg-transparent"
              >
                View all suggestions
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Historical Spending waveforms comparing past year vs current year */}
          <div className="bg-[#ffffff] border border-[#d6c3b6] p-5 rounded-2xl shadow-xs">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h4 className="font-display text-sm font-bold text-[#1e1c10]">Historical Spending Trends</h4>
              </div>
              <div className="flex gap-4 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#804e22]" />
                  <span className="text-[10px] text-[#847469] font-bold uppercase tracking-wider">Current Year</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#596246]/50" />
                  <span className="text-[10px] text-[#847469] font-bold uppercase tracking-wider">Previous Year</span>
                </div>
              </div>
            </div>

            {/* Custom SVG waveforms spline paths */}
            <div className="h-44 w-full relative pt-4 flex items-end">
              <svg className="w-full h-full" viewBox="0 0 320 120" preserveAspectRatio="none">
                {/* Previous spline waveform (desaturated green) */}
                <path 
                  d="M0,100 C30,95 60,110 90,105 C120,95 150,85 180,95 C210,110 240,105 270,82 C300,75 320,89 350,90" 
                  fill="none" 
                  stroke="#596246" 
                  strokeWidth="2.5" 
                  strokeOpacity="0.4"
                  strokeLinecap="round" 
                />
                
                {/* Current spline waveform (terracotta brown) */}
                <path 
                  d="M0,115 C30,108 60,115 90,106 C120,90 150,65 180,72 C210,85 240,78 270,55 C300,45 320,68 350,60" 
                  fill="none" 
                  stroke="#804e22" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                />
              </svg>
              {/* Axes Labels */}
              <div className="absolute bottom-0 left-0 w-full flex justify-between px-2 text-[8px] text-[#847469] font-bold uppercase tracking-widest font-sans">
                <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right column (4 cols) - Live AI chatbot pane */}
        <div id="finsight-chatbot-sidebar" className="lg:col-span-4 h-full">
          <AIAssistantChat 
            messages={messages} 
            onSendMessage={onSendMessage} 
            budgets={budgets} 
            incomeTotal={incomeTotal} 
            expensesTotal={totalSpentSum} 
          />
        </div>

      </div>
    </div>
  );
}

function totalSpentFormatted(val: number): string {
  return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
