import React, { useState } from 'react';
import { 
  ArrowDownRight, 
  TrendingUp, 
  Calendar, 
  Filter, 
  SlidersHorizontal,
  ChevronDown,
  PlusCircle,
  Tag,
  Clock,
  Trash2,
  DollarSign
} from 'lucide-react';
import { Transaction } from '../types';

interface ExpensesDashboardProps {
  expenses: Transaction[];
  onAddExpense: (expense: Omit<Transaction, 'id' | 'status'>) => void;
  onDeleteExpense: (id: string) => void;
}

export default function ExpensesDashboard({ expenses, onAddExpense, onDeleteExpense }: ExpensesDashboardProps) {
  // TODO: App should fetch expenses from /api/expenses and pass them in as props.
  // TODO: Alternatively, this component may fetch /api/expenses itself via useEffect if you want local data loading.
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);

  // New Expense form state
  const [newSource, setNewSource] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newCategory, setNewCategory] = useState("Food");
  const [newType, setNewType] = useState("Groceries");
  const [newDate, setNewDate] = useState("Oct 26, 2023");

  const categories = ["All", "Food", "Housing", "Entertainment", "Shopping", "Transportation"];

  const sumExpenses = expenses.reduce((sum, item) => sum + Math.abs(item.amount), 0);

  const handleSubmitNewExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.trim() || !newAmount) return;

    onAddExpense({
      source: newSource,
      amount: -Math.abs(parseFloat(newAmount)), // ensure it's negative
      category: newCategory,
      type: newType,
      date: newDate
    });

    setNewSource("");
    setNewAmount("");
    setShowAddForm(false);
  };

  // Filter & sort list
  const filteredExpenses = expenses.filter(item => {
    if (selectedCategory === "All") return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (selectedSort === "newest") {
      return b.date.localeCompare(a.date);
    } else if (selectedSort === "amount-high") {
      return Math.abs(b.amount) - Math.abs(a.amount);
    } else if (selectedSort === "amount-low") {
      return Math.abs(a.amount) - Math.abs(b.amount);
    }
    return 0;
  });

  // Client pagination
  const entriesPerPage = 5;
  const totalEntries = sortedExpenses.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedExpenses = sortedExpenses.slice(startIndex, startIndex + entriesPerPage);

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'housing': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'food': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'entertainment': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shopping': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-[#dae4c1] text-[#414a30] border-[#c1cba9]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-[#1e1c10] tracking-tight">Expenses ledger</h2>
          <p className="font-sans text-sm text-[#51443b] mt-1 font-medium font-sans">Audit and filter historical outgoings.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#834c36] hover:bg-[#9f644c] text-white font-sans font-bold text-sm rounded-lg shadow-xs hover-lift active:scale-98 select-none"
        >
          <PlusCircle className="w-5 h-5" />
          Log New Expense
        </button>
      </section>

      {/* Log Expense collapsible */}
      {showAddForm && (
        <form onSubmit={handleSubmitNewExpense} className="bg-[#fff9e8] border border-[#d6c3b6] rounded-2xl p-5 shadow-xs space-y-4 animate-fadeIn font-sans">
          <div className="flex justify-between items-center border-b border-[#eee8d5] pb-2">
            <h3 className="font-display text-sm font-bold text-[#1e1c10] uppercase tracking-wider">Log New Outgoing Statement</h3>
            <button type="button" onClick={() => setShowAddForm(false)} className="text-xs text-[#ba1a1a] font-bold">Cancel</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#847469] uppercase mb-1">Merchant / Vendor</label>
              <input 
                type="text" 
                placeholder="e.g. Blue Bottle Coffee" 
                value={newSource} 
                onChange={(e) => setNewSource(e.target.value)}
                className="w-full bg-white border border-[#d6c3b6] rounded-lg px-3 py-2 text-sm text-[#1e1c10] focus:ring-1 focus:ring-[#834c36] outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#847469] uppercase mb-1">Amount ($ USD)</label>
              <input 
                type="number" 
                placeholder="e.g. 12.50" 
                value={newAmount} 
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full bg-white border border-[#d6c3b6] rounded-lg px-3 py-2 text-sm text-[#1e1c10] focus:ring-1 focus:ring-[#834c36] outline-hidden"
                min="0.01" 
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#847469] uppercase mb-1">Capped Category</label>
              <select 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-white border border-[#d6c3b6] rounded-lg px-3 py-2 text-sm text-[#1e1c10] focus:ring-1 focus:ring-[#834c36] outline-hidden"
              >
                <option value="Food">Food</option>
                <option value="Housing">Housing</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Transportation">Transportation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#847469] uppercase mb-1">Receipt Date</label>
              <input 
                type="text" 
                value={newDate} 
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full bg-white border border-[#d6c3b6] rounded-lg px-3 py-2 text-sm text-[#1e1c10] focus:ring-1 focus:ring-[#834c36] outline-hidden"
                required
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="px-6 py-2 bg-[#834c36] hover:bg-[#9f644c] text-white rounded-lg text-xs font-bold tracking-wide"
          >
            Submit Expense
          </button>
        </form>
      )}

      {/* Primary summary indicators */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Cost card */}
        <div className="bg-[#ffffff] border border-[#d6c3b6] p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#847469]">Total Month Expenditure</span>
            <p className="font-display text-2xl font-black text-[#1e1c10] mt-1">${sumExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 text-rose-700">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        {/* Most demanding cost group */}
        <div className="bg-[#faf3e0] border border-[#d6c3b6] p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#847469]">Top Expenditure category</span>
            <p className="font-display text-lg font-black text-[#1e1c10] mt-1">Food & Dining</p>
            <span className="text-[10px] text-[#847469] font-bold block mt-1">Reflects 26% of overall consumption</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-[#d6c3b6] text-amber-700">
            <Tag className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* Filters control block */}
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
            <SlidersHorizontal className="w-4 h-4 text-[#804e22] mr-1.5" />
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

      {/* Ledger Table */}
      <section className="bg-white border border-[#d6c3b6] rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse font-sans text-sm">
          <thead>
            <tr className="bg-[#1e1c10] text-[#faf3e0] font-display text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4.5">date</th>
              <th className="px-6 py-4.5">vendor</th>
              <th className="px-6 py-4.5">category</th>
              <th className="px-6 py-4.5">type/detail</th>
              <th className="px-6 py-4.5">amount</th>
              <th className="px-6 py-4.5 text-center">actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eee8d5]">
            {paginatedExpenses.length > 0 ? (
              paginatedExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-[#faf3e0]/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-[#1e1c10] whitespace-nowrap">{expense.date}</td>
                  <td className="px-6 py-4 font-bold text-[#1e1c10]">{expense.source}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryColor(expense.category)}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#847469] font-medium">{expense.type}</td>
                  <td className="px-6 py-4 font-mono font-bold text-rose-700 whitespace-nowrap">
                    -${Math.abs(expense.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDeleteExpense(expense.id)}
                      className="text-[#847469] hover:text-[#ba1a1a] p-1 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 font-sans text-[#847469] font-medium">
                  No expenditure records registered matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Dense Table Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-[#faf3e0]/45 border-t border-[#eee8d5] flex items-center justify-between select-none">
            <span className="text-xs font-semibold text-[#847469]">
              Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} expense logs
            </span>
            <div className="flex gap-1.5">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  id={`expense-pagination-page-${i + 1}`}
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
    </div>
  );
}
