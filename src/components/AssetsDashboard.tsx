import React, { useState } from 'react';
import { 
  Building, 
  Wallet, 
  ShieldCheck, 
  TrendingUp, 
  Percent, 
  DollarSign, 
  Scale, 
  ChevronUp, 
  ArrowUpRight,
  TrendingDown,
  Coins
} from 'lucide-react';
import { AssetHistory } from '../types';

interface AssetsDashboardProps {
  assetHistory: AssetHistory[];
}

export default function AssetsDashboard({ assetHistory }: AssetsDashboardProps) {
  // TODO: App should fetch assetHistory from /api/assets/history and provide it here.
  // TODO: Active holdings and aggregate net worth should also come from backend or a shared portfolio endpoint.
  // Simulator state variables
  const [initialSavings, setInitialSavings] = useState(12450);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(8);
  const [years, setYears] = useState(10);

  // Compute compound interest simulation
  const compoundResults = [];
  let currentBalance = initialSavings;
  const monthlyRate = annualReturn / 100 / 12;

  for (let year = 1; year <= years; year++) {
    for (let month = 1; month <= 12; month++) {
      currentBalance = currentBalance * (1 + monthlyRate) + monthlyContribution;
    }
    compoundResults.push({ year, balance: Math.round(currentBalance) });
  }

  const finalCompoundSum = Math.round(currentBalance);
  const totalPrincipalDeposited = initialSavings + (monthlyContribution * 12 * years);
  const compoundInterestEarned = Math.max(0, finalCompoundSum - totalPrincipalDeposited);

  // Hardcoded real-life active holdings list
  const activeHoldings = [
    { id: 'ah-1', name: 'Cash Reserves (High-Yield Savings)', category: 'Liquid Cash', balance: 12450.00, yield: '4.25% APY', icon: Wallet, color: 'text-emerald-700 bg-emerald-100/60' },
    { id: 'ah-2', name: 'S&P 500 Brokerage Portfolio', category: 'Investments', balance: 42500.00, yield: '8.4% YTD', icon: Coins, color: 'text-[#804e22] bg-amber-100/60' },
    { id: 'ah-3', name: 'Roth IRA Retirement Growth', category: 'Investments', balance: 21700.00, yield: '7.8% YTD', icon: ShieldCheck, color: 'text-blue-700 bg-blue-100/60' },
    { id: 'ah-4', name: 'Primary Credit Statement', category: 'Liabilities', balance: -1400.00, yield: '19.9% APR (Autopay)', icon: Scale, color: 'text-rose-700 bg-rose-100/60' },
    { id: 'ah-5', name: 'Premium Car Auto Loan', category: 'Liabilities', balance: -1310.00, yield: '3.5% Fixed', icon: Scale, color: 'text-rose-700 bg-rose-100/60' },
  ];

  const totalAssetsValue = 12450 + 42500 + 21700;
  const totalLiabilitiesValue = 1400 + 1310;
  const absoluteNetWorth = totalAssetsValue - totalLiabilitiesValue;

  return (
    <div className="space-y-6">
      {/* Wave Header */}
      <section>
        <h2 className="font-display text-3xl font-extrabold text-[#1e1c10] tracking-tight">Wealth Portfolio</h2>
        <p className="font-sans text-sm text-[#51443b] mt-1 font-medium">A comprehensive trace of assets, liabilities, and compounding capital over time.</p>
      </section>

      {/* Aggregate stats row */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Absolute Net worth */}
        <div className="bg-[#ffffff] border border-[#d6c3b6] p-5 rounded-2xl shadow-xs md:col-span-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#847469]">Consolidated Net Worth</span>
          <p className="font-display text-3xl font-black text-[#1e1c10] mt-1.5">${absoluteNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1 leading-none">
            <ChevronUp className="w-4 h-4" /> +15.4% YoY Growth index
          </span>
        </div>

        {/* Liquid Cash */}
        <div className="bg-[#ffffff] border border-[#d6c3b6] p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#847469]">Liquid Cash</span>
          <p className="font-display text-xl font-bold text-[#1e1c10] mt-1.5">${totalHoldingsForGroup(activeHoldings, 'Liquid Cash')}</p>
        </div>

        {/* Total Investments */}
        <div className="bg-[#ffffff] border border-[#d6c3b6] p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#847469]">Investments</span>
          <p className="font-display text-xl font-bold text-[#1e1c10] mt-1.5">${totalHoldingsForGroup(activeHoldings, 'Investments')}</p>
        </div>
      </section>

      {/* Core Split layout: Compound calculator or asset traces */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column (7 cols) - active holdings lists */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#d6c3b6] p-6 rounded-2xl shadow-xs">
            <h3 className="font-display text-base font-bold text-[#1e1c10] mb-5">Wealth & Asset Allocation</h3>
            
            {/* Visual allocation ribbon */}
            <div className="w-full flex h-5 rounded-full overflow-hidden border border-[#eee8d5] mb-5 font-sans text-[9px] font-bold text-[#fff9e8] text-center uppercase tracking-wider select-none leading-5">
              <div className="bg-[#596245]" style={{ width: '16%' }} title="Cash: 16.2%">Cash</div>
              <div className="bg-[#804e22]" style={{ width: '80%' }} title="Investments: 80.2%">Investments</div>
              <div className="bg-[#333124]" style={{ width: '4%' }} title="Debt: 3.5%">Debt</div>
            </div>

            {/* Holdings items */}
            <div className="space-y-3.5">
              {activeHoldings.map((h, i) => {
                const ItemIcon = h.icon;
                const isDebt = h.balance < 0;
                return (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-[#faf3e0]/45 border border-[#d6c3b6]/50 rounded-xl hover:bg-white transition-all">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${h.color}`}>
                        <ItemIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1e1c10]">{h.name}</p>
                        <span className="text-[10px] text-[#847469] font-semibold">{h.category} • Yield: {h.yield}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-mono font-bold ${
                      isDebt ? 'text-rose-700' : 'text-[#1e1c10]'
                    }`}>
                      {isDebt ? '-' : ''}${Math.abs(h.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column (5 cols) - Advanced compound interest forecasting */}
        <div className="lg:col-span-5 bg-[#ffffff] border border-[#d6c3b6] p-6 rounded-2xl shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-[#eee8d5] pb-3">
            <Building className="w-5.5 h-5.5 text-[#804e22]" />
            <div>
              <h3 className="font-display text-sm font-bold text-[#1e1c10] uppercase tracking-wider">Passive Growth Forecast</h3>
              <p className="text-[10px] text-[#847469] font-medium leading-none mt-1">Simulate multi-year geometric wealth gains</p>
            </div>
          </div>

          {/* Form controllers */}
          <div className="space-y-4 font-sans text-xs">
            {/* Monthly saving slider */}
            <div>
              <div className="flex justify-between font-bold text-[#51443b] mb-1.5">
                <span>Monthly Addition</span>
                <span className="font-extrabold text-[#804e22]">${monthlyContribution}/mo</span>
              </div>
              <input 
                type="range" 
                min="50" 
                max="2500" 
                step="50"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#f4eedb] rounded-lg appearance-none cursor-pointer accent-[#804e22] rounded-full"
              />
            </div>

            {/* Annual Yield slider */}
            <div>
              <div className="flex justify-between font-bold text-[#51443b] mb-1.5">
                <span>Target Annual Yield</span>
                <span className="font-extrabold text-[#804e22]">{annualReturn}% API</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="15" 
                step="0.5"
                value={annualReturn}
                onChange={(e) => setAnnualReturn(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#f4eedb] rounded-lg appearance-none cursor-pointer accent-[#804e22] rounded-full"
              />
            </div>

            {/* Year slider */}
            <div>
              <div className="flex justify-between font-bold text-[#51443b] mb-1.5">
                <span>Timeline Length</span>
                <span className="font-extrabold text-[#804e22]">{years} Years</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="30" 
                step="1"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#f4eedb] rounded-lg appearance-none cursor-pointer accent-[#804e22] rounded-full"
              />
            </div>
          </div>

          {/* Simulation Output Dashboard */}
          <div className="bg-[#414a30] text-[#fff9e8] rounded-xl p-4 flex flex-col justify-between font-sans">
            <div>
              <span className="text-[10px] text-[#dae4c1] font-bold uppercase tracking-wider block">Estimated Ending Wealth</span>
              <p className="font-display text-2xl font-black text-white mt-1">
                ${finalCompoundSum.toLocaleString('en-US')}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[10px] font-semibold text-[#dae4c1]">
              <div>
                <span className="block text-[8.5px] uppercase text-white/60">deposits</span>
                <span className="font-bold text-white">${totalPrincipalDeposited.toLocaleString('en-US')}</span>
              </div>
              <div>
                <span className="block text-[8.5px] uppercase text-white/60">comp interest</span>
                <span className="font-bold text-[#dde7c4]">+${compoundInterestEarned.toLocaleString('en-US')}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

function totalHoldingsForGroup(list: any[], group: string): string {
  const sum = list
    .filter((h) => h.category === group)
    .reduce((acc, h) => acc + Math.abs(h.balance), 0);
  return sum.toLocaleString('en-US', { minimumFractionDigits: 2 });
}
