import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  TrendingUp, 
  Calendar, 
  Filter, 
  SlidersHorizontal,
  ChevronDown,
  PlusCircle,
  Briefcase,
  Banknote,
  PiggyBank,
  CheckCircle,
  Trash2,
  FileSpreadsheet
} from 'lucide-react';
import { Transaction } from '../types';

interface IncomeDashboardProps {
  incomes: Transaction[];
  onAddIncome: (income: Omit<Transaction, 'id' | 'status'>) => void;
  onDeleteIncome: (id: string) => void;
}

export default function IncomeDashboard({ incomes, onAddIncome, onDeleteIncome }: IncomeDashboardProps) {
  // TODO: App should fetch incomes from /api/incomes and pass them down.
  // TODO: If this page owns its data, fetch /api/incomes here and replace prop dependency.
  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Income form state
  const [newSource, setNewSource] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState("Salary");
  const [newType, setNewType] = useState("Direct Deposit");
  const [newDate, setNewDate] = useState("Oct 26, 2023");

  const categories = ["All", "Salary", "Freelance", "Investment", "Gift", "Business"];

  // Compute stats
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  
  // Calculate top source
  const sourceGrouping = incomes.reduce((acc: any, cur) => {
    acc[cur.category] = (acc[cur.category] || 0) + cur.amount;
    return acc;
  }, {});

  let topSourceCategory = "None";
  let topSourceAmount = 0;
  Object.keys(sourceGrouping).forEach(cat => {
    if (sourceGrouping[cat] > topSourceAmount) {
      topSourceAmount = sourceGrouping[cat];
      topSourceCategory = cat;
    }
  });

  const topSourceRatio = totalIncome > 0 ? Math.round((topSourceAmount / totalIncome) * 100) : 0;
  
  // Goal parameters
  const goalTarget = 15000.00;
  const goalPercent = Math.min(100, Math.round((totalIncome / goalTarget) * 100));

  // Handle form submission
  const handleSubmitNewIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.trim() || !newAmount) return;
    
    onAddIncome({
      source: newSource,
      amount: parseFloat(newAmount),
      category: newCategory,
      type: newType,
      date: newDate
    });

    setNewSource("");
    setNewAmount("");
    setShowAddForm(false);
  };

  // Filter and sort listings
  const filteredIncomes = incomes.filter(item => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  const sortedIncomes = [...filteredIncomes].sort((a, b) => {
    if (selectedSort === "newest") {
      return b.date.localeCompare(a.date); // rough date sorting
    } else if (selectedSort === "amount-high") {
      return b.amount - a.amount;
    } else if (selectedSort === "amount-low") {
      return a.amount - b.amount;
    }
    return 0;
  });

  // Client pagination
  const entriesPerPage = 5;
  const totalEntries = sortedIncomes.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedIncomes = sortedIncomes.slice(startIndex, startIndex + entriesPerPage);

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'salary': return 'bg-emerald-100/80 text-emerald-800 border-emerald-200';
      case 'freelance': return 'bg-[#dae4c1] text-[#414a30] border-[#c1cba9]';
      case 'investment': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'gift': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-[#1e1c10] tracking-tight">Income Analytics</h2>
          <p className="font-sans text-sm text-[#51443b] mt-1 font-medium font-sans">Track and manage your earnings across all sources.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#804e22] hover:bg-[#9d6638] text-white font-sans font-bold text-sm rounded-lg shadow-xs hover-lift active:scale-98 select-none"
        >
          <PlusCircle className="w-5 h-5" />
          Add Future Income
        </button>
      </section>

      {/* Add Income Drawer form collapsible style */}
      {showAddForm && (
        <form onSubmit={handleSubmitNewIncome} className="bg-[#fff9e8] border border-[#d6c3b6] rounded-2xl p-5 shadow-xs space-y-4 animate-fadeIn font-sans">
          <div className="flex justify-between items-center border-b border-[#eee8d5] pb-2">
            <h3 className="font-display text-sm font-bold text-[#1e1c10] uppercase tracking-wider">Submit New Deposit</h3>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-xs text-[#ba1a1a] font-bold">Cancel</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#847469] uppercase mb-1">Income Source</label>
              <input 
                type="text" 
                placeholder="e.g. S&P 500 Dividend" 
                value={newSource} 
                onChange={(e) => setNewSource(e.target.value)}
                className="w-full bg-white border border-[#d6c3b6] rounded-lg px-3 py-2 text-sm text-[#1e1c10] focus:ring-1 focus:ring-[#804e22] outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#847469] uppercase mb-1">Amount ($ USD)</label>
              <input 
                type="number" 
                placeholder="e.g. 500.00" 
                value={newAmount} 
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full bg-white border border-[#d6c3b6] rounded-lg px-3 py-2 text-sm text-[#1e1c10] focus:ring-1 focus:ring-[#804e22] outline-hidden"
                min="0.01" 
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#847469] uppercase mb-1">Stream category</label>
              <select 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-white border border-[#d6c3b6] rounded-lg px-3 py-2 text-sm text-[#1e1c10] focus:ring-1 focus:ring-[#804e22] outline-hidden"
              >
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Investment">Investment</option>
                <option value="Gift">Gift</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#847469] uppercase mb-1">Receipt Date</label>
              <input 
                type="text" 
                value={newDate} 
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-white border border-[#d6c3b6] rounded-lg px-3 py-2 text-sm text-[#1e1c10] focus:ring-1 focus:ring-[#804e22] outline-hidden"
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="px-6 py-2 bg-[#804e22] hover:bg-[#9d6638] text-white rounded-lg text-xs font-bold tracking-wide"
          >
            Submit Entry
          </button>
        </form>
      )}

      {/* Primary summary cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
        <div className="bg-[#ffffff] border border-[#d6c3b6] p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#847469]">Total income (Month)</span>
            <p className="font-display text-2xl font-black text-[#1e1c10] mt-1">${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-[#596246]/10 p-3 rounded-xl border border-[#dde7c4]">
            <TrendingUp className="w-6 h-6 text-[#596246]" />
          </div>
        </div>

        {/* Top Earnings Source */}
        <div className="bg-[#596246]/5 border border-[#c1cba9] p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#847469]">Top Source</span>
            <p className="font-display text-lg font-black text-[#1e1c10] mt-1">
              {topSourceCategory === 'Freelance' ? 'Freelance Work' : topSourceCategory}
            </p>
            <span className="text-[10px] font-bold text-[#596246] block mt-1">Contributing {topSourceRatio}% of total</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#c1cba9]">
            <Briefcase className="w-6 h-6 text-[#596246]" />
          </div>
        </div>

        {/* Dynamic Goal Progress */}
        <div className="bg-white border border-[#d6c3b6] p-5 rounded-2xl shadow-xs">
          <div className="flex justify-between items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#847469]">Goal Progress</span>
            <span className="text-xs font-sans font-extrabold text-[#804e22]">{goalPercent}%</span>
          </div>
          
          <div className="w-full bg-[#f4eedb] h-3 rounded-full mt-3 overflow-hidden border border-[#eee8d5]">
            <div className="bg-[#804e22] h-full rounded-full transition-all duration-500" style={{ width: `${goalPercent}%` }}></div>
          </div>
          <p className="text-[10px] text-[#847469] font-semibold mt-1">Target: $15,000.00</p>
        </div>
      </section>

      {/* Filters bar */}
      <section className="bg-white border border-[#d6c3b6] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans text-sm font-medium text-[#51443b]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center bg-[#faf3e0] px-3.5 py-1.5 rounded-lg border border-[#d6c3b6]">
            <Calendar className="w-4 h-4 text-[#804e22] mr-2" />
            <select className="bg-transparent border-none text-xs text-[#1e1c10] font-bold py-0 focus:ring-0 outline-hidden">
              <option>October 2023</option>
              <option>September 2023</option>
            </select>
          </div>

          <div className="flex items-center bg-[#faf3e0] px-3.5 py-1.5 rounded-lg border border-[#d6c3b6]">
            <Filter className="w-4 h-4 text-[#804e22] mr-2" />
            <select 
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none text-xs text-[#1e1c10] font-bold py-0 focus:ring-0 outline-hidden"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All categories' : c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-[#faf3e0] px-3.5 py-1.5 rounded-lg border border-[#d6c3b6]">
            <SlidersHorizontal className="w-4 h-4 text-[#804e22] mr-2" />
            <select 
              value={selectedSort}
              onChange={(e) => { setSelectedSort(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none text-[#1e1c10] text-xs font-bold py-0 focus:ring-0 outline-hidden"
            >
              <option value="newest">Newest first</option>
              <option value="amount-high">Amount (High to Low)</option>
              <option value="amount-low">Amount (Low to High)</option>
            </select>
          </div>
        </div>

        <button 
          onClick={() => { setSelectedCategory("All"); setSelectedSort("newest"); }}
          className="text-xs text-[#804e22] hover:underline font-bold"
        >
          Clear Filters
        </button>
      </section>

      {/* Main Income Ledger table */}
      <section className="bg-white border border-[#d6c3b6] rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse font-sans text-sm">
          <thead>
            <tr className="bg-[#1e1c10] text-[#faf3e0] font-display text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4.5">date</th>
              <th className="px-6 py-4.5">source</th>
              <th className="px-6 py-4.5">category</th>
              <th className="px-6 py-4.5">type</th>
              <th className="px-6 py-4.5">amount</th>
              <th className="px-6 py-4.5 text-center">actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee8d5]">
            {paginatedIncomes.length > 0 ? (
              paginatedIncomes.map((item) => (
                <tr key={item.id} className="hover:bg-[#faf3e0]/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#1e1c10] whitespace-nowrap">{item.date}</td>
                  <td className="px-6 py-4 font-bold text-[#1e1c10]">{item.source}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#847469] font-medium">{item.type}</td>
                  <td className="px-6 py-4 font-mono font-bold text-emerald-700 whitespace-nowrap">
                    +${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDeleteIncome(item.id)}
                      className="text-[#847469] hover:text-[#ba1a1a] p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Deplane transaction"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 font-sans text-[#847469] font-medium">
                  No income transactions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Dense Table Pagination bottom helper */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-[#faf3e0]/45 border-t border-[#eee8d5] flex items-center justify-between select-none">
            <span className="text-xs font-semibold text-[#847469]">
              Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} income entries
            </span>
            <div className="flex gap-1.5">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  id={`income-pagination-page-${i + 1}`}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                    currentPage === i + 1 
                      ? 'bg-[#804e22] text-white border-[#804e22]' 
                      : 'bg-white text-[#51443b] border-[#d6c3b6] hover:bg-[#faf3e0]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Bottom Insights row list */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income category breakdown */}
        <div className="bg-[#ffffff] border border-[#d6c3b6] p-6 rounded-2xl shadow-xs">
          <h4 className="font-display font-bold text-sm text-[#1e1c10] mb-4">Earning Breakdown</h4>
          <div className="space-y-3">
            {Object.keys(sourceGrouping).map((cat) => {
              const amountValue = sourceGrouping[cat];
              const ratioPercent = Math.round((amountValue / totalIncome) * 100);
              return (
                <div key={cat} className="space-y-1 font-sans">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#1e1c10]">{cat}</span>
                    <span className="font-semibold text-[#847469]">${amountValue.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({ratioPercent}%)</span>
                  </div>
                  <div className="w-full bg-[#f4eedb] h-2 rounded-full overflow-hidden border border-[#eee8d5]">
                    <div className="bg-[#596246] h-full rounded-full" style={{ width: `${ratioPercent}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top specific AI Insight card in brown border overlay */}
        <div className="bg-[#faf3e0] border border-[#b0ba99] p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="flex gap-4 items-start font-sans">
            <div className="bg-[#804e22]/10 p-3 rounded-lg flex-shrink-0">
              <PiggyBank className="w-6 h-6 text-[#804e22]" />
            </div>
            <div>
              <h4 className="font-display font-medium text-[#1e1c10]">AI Income Insight</h4>
              <p className="text-xs text-[#51443b] mt-1 leading-relaxed">
                Your freelancer surplus yields <span className="font-bold text-[#804e22]">{topSourceRatio}%</span> of overall earnings. Allocate a portion of this to your <span className="font-bold text-[#596246]">Emergency Fund</span> budget to lock in compound savings.
              </p>
            </div>
          </div>
          <div className="mt-6 border-t border-[#d6c3b6] pt-3 flex justify-end">
            <button 
              onClick={() => alert("Simulating detail insights analysis: Surplus index +22.4% vs last Q.")}
              className="font-sans text-xs text-[#804e22] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              Analyze Earnings Forecast
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
