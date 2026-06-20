import React, { useState, useEffect } from 'react';
import { 
  TabId, 
  Transaction, 
  Budget, 
  ChatMessage, 
  AssetHistory, 
  PotentialSaving, 
  BudgetOptimization 
} from './types';
import { 
  INITIAL_INCOME_TRANSACTIONS, 
  INITIAL_EXPENSE_TRANSACTIONS, 
  INITIAL_BUDGETS, 
  INITIAL_ASSET_HISTORY, 
  INITIAL_CHAT_MESSAGES, 
  POTENTIAL_SAVINGS, 
  BUDGET_OPTIMIZATIONS 
} from './mockData';

// TODO: Replace mock data imports with API fetching and hydrate app state from backend services.
// TODO: Add useEffect in App to fetch initial data once on mount from endpoints like /api/incomes, /api/expenses, /api/budgets, /api/assets, /api/chat, /api/insights.
// Component Imports
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import ExpensesDashboard from './components/ExpensesDashboard';
import SpendingAnalysis from './components/SpendingAnalysis';
import IncomeDashboard from './components/IncomeDashboard';
import BudgetsOverview from './components/BudgetsOverview';
import AssetsDashboard from './components/AssetsDashboard';
import CreateBudgetModal from './components/CreateBudgetModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  
  // State variables in full React fidelity
  // TODO: Replace mock initialization with fetched income transactions from /api/incomes.
  const [incomes, setIncomes] = useState<Transaction[]>(INITIAL_INCOME_TRANSACTIONS);
  // TODO: Replace mock initialization with fetched expense transactions from /api/expenses.
  const [expenses, setExpenses] = useState<Transaction[]>(INITIAL_EXPENSE_TRANSACTIONS);
  // TODO: Replace mock initialization with fetched budgets from /api/budgets.
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  // TODO: Replace mock initialization with fetched chat/message history from /api/chat.
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  // TODO: Add separate fetch or derived summary data for asset history from /api/assets/history.
  const [assetHistory, setAssetHistory] = useState<AssetHistory[]>(INITIAL_ASSET_HISTORY);
  const [potentialSavings, setPotentialSavings] = useState<PotentialSaving[]>(POTENTIAL_SAVINGS);
  const [budgetOptimizations, setBudgetOptimizations] = useState<BudgetOptimization[]>(BUDGET_OPTIMIZATIONS);
  const [isCreateBudgetModalOpen, setIsCreateBudgetModalOpen] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [incomeRes, expenseRes, budgetRes, assetRes, chatRes, savingsRes, optimizationRes] = await Promise.all([
          fetch('/api/incomes'),
          fetch('/api/expenses'),
          fetch('/api/budgets'),
          fetch('/api/assets/history'),
          fetch('/api/chat/messages'),
          fetch('/api/insights/savings'),
          fetch('/api/insights/optimizations')
        ]);

        if (!incomeRes.ok || !expenseRes.ok || !budgetRes.ok || !assetRes.ok || !chatRes.ok || !savingsRes.ok || !optimizationRes.ok) {
          console.error('Failed to fetch one or more initial data endpoints');
          return;
        }

        const [incomeData, expenseData, budgetData, assetData, chatData, savingsData, optimizationData] = await Promise.all([
          incomeRes.json(),
          expenseRes.json(),
          budgetRes.json(),
          assetRes.json(),
          chatRes.json(),
          savingsRes.json(),
          optimizationRes.json()
        ]);

        setIncomes(incomeData);
        setExpenses(expenseData);
        setBudgets(budgetData);
        setAssetHistory(assetData);
        setChatMessages(chatData);
        setPotentialSavings(savingsData);
        setBudgetOptimizations(optimizationData);
      } catch (error) {
        console.error('Error loading initial app data', error);
      }
    };

    loadInitialData();
  }, []);

  // Dynamic status triggers
  const totalIncomeCount = incomes.reduce((acc, cur) => acc + cur.amount, 0);
  const totalExpenseCount = expenses.reduce((acc, cur) => acc + Math.abs(cur.amount), 0);
  const remainingCashBalance = totalIncomeCount - totalExpenseCount;
  const currentSavingsPercent = totalIncomeCount > 0 ? Math.round((remainingCashBalance / totalIncomeCount) * 100) : 0;

  // Add handlers
  const handleAddIncome = (raw: Omit<Transaction, 'id' | 'status'>) => {
    const fresh: Transaction = {
      ...raw,
      id: `inc-${Date.now()}`,
      status: 'Completed'
    };
    setIncomes((prev) => [fresh, ...prev]);
    
    // Auto-inform chat model of positive updates!
    triggerBotWelcomeNotification(`You just recorded a new deposit of $${raw.amount} from '${raw.source}'. That raises this month's total cash flow to $${(totalIncomeCount + raw.amount).toLocaleString('en-US')}!`);
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  };

  const handleAddExpense = (raw: Omit<Transaction, 'id' | 'status'>) => {
    const fresh: Transaction = {
      ...raw,
      id: `exp-${Date.now()}`,
      status: 'Completed'
    };
    const positiveAmt = Math.abs(raw.amount);

    setExpenses((p) => [fresh, ...p]);

    // Recalculate associated budget limits immediately!
    setBudgets((prevBudgets) => {
      return prevBudgets.map((b) => {
        if (b.category.toLowerCase() === raw.category.toLowerCase()) {
          const updatedSpent = b.spent + positiveAmt;
          const status = updatedSpent / b.limit >= 0.85 ? 'At Risk' : b.onTrackStatus;
          const note = updatedSpent >= b.limit 
            ? 'Limit exceeded! Minimize outgoings' 
            : `Only $${Math.max(0, b.limit - updatedSpent).toFixed(2)} remaining`;
          return {
            ...b,
            spent: updatedSpent,
            onTrackStatus: status,
            note
          };
        }
        return b;
      });
    });

    // Notify bot
    triggerBotWelcomeNotification(`Recorded card swipe: $${positiveAmt} spent at '${raw.source}'. Checked against active budget limit thresholds.`);
  };

  const handleDeleteExpense = (id: string) => {
    const target = expenses.find((e) => e.id === id);
    if (!target) return;
    setExpenses((prev) => prev.filter((e) => e.id !== id));

    // Deduct from budget too
    setBudgets((prevBudgets) => {
      return prevBudgets.map((b) => {
        if (b.category.toLowerCase() === target.category.toLowerCase()) {
          const updatedSpent = Math.max(0, b.spent - Math.abs(target.amount));
          const status = updatedSpent / b.limit >= 0.85 ? 'At Risk' : 'On Track';
          return {
            ...b,
            spent: updatedSpent,
            onTrackStatus: status,
            note: `$${(b.limit - updatedSpent).toFixed(2)} capacity left`
          };
        }
        return b;
      });
    });
  };

  const handleAddBudget = (raw: Omit<Budget, 'id' | 'spent'>) => {
    // Check if category already has previous logs
    const previousSpent = expenses
      .filter((e) => e.category.toLowerCase() === raw.category.toLowerCase())
      .reduce((acc, e) => acc + Math.abs(e.amount), 0);

    const fresh: Budget = {
      ...raw,
      id: `b-${raw.category.toLowerCase()}-${Date.now()}`,
      spent: previousSpent,
      onTrackStatus: previousSpent / raw.limit >= 0.85 ? 'At Risk' : 'On Track'
    };

    setBudgets((prev) => [...prev, fresh]);

    triggerBotWelcomeNotification(`Established a new capping ceiling for '${raw.name}'. Monthly limit of $${raw.limit.toLocaleString()} registered.`);
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  // Co-Pilot Chat triggers
  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);

    // Intelligent context solver simulating real-life co-pilot logic
    setTimeout(() => {
      let responseText = "Checking your ledger to process request... Let me know if you would like me to adjust your budget ceilings.";
      const cleanInput = text.toLowerCase();

      if (cleanInput.includes("food") || cleanInput.includes("at risk")) {
        const foodBud = budgets.find((b) => b.category.toLowerCase() === 'food');
        if (foodBud) {
          const percentUsed = Math.round((foodBud.spent / foodBud.limit) * 100);
          responseText = `Checking your Food budget... You spent $${foodBud.spent.toFixed(2)} out of your $${foodBud.limit.toFixed(2)} limit (${percentUsed}%). If you cut dining out for the next 4 days, you have a 92% probability of finishing the month safe.`;
        } else {
          responseText = "You don't have an active 'Food & Dining' budget created yet. Would you like me to set an automated $800.00 limits cap?";
        }
      } else if (cleanInput.includes("subscription") || cleanInput.includes("cancel") || cleanInput.includes("save")) {
        responseText = "Analyzing silent subscriptions... I discovered 3 underutilized accounts: Premium Stream Plus ($14.99), Daily Fitness Online ($29.00), and Vintage Wine Club ($40.01). Cancelling these inactive plans will instantly lock in $84.00/mo ($1,008/yr) in savings.";
      } else if (cleanInput.includes("optimize") || cleanInput.includes("coffee")) {
        responseText = "Optimal Budget Recommendation:\n• Trim 'Coffee & Snacks' by $40.00.\n• Bolster 'Grocery Limit' by $100.00 to offset eating out.\nThis decreases grocery volatility according to past week metrics.";
      } else if (cleanInput.includes("afford") || cleanInput.includes("freelance")) {
        responseText = "Based on your high active savings rate of 66.9% ($8,329.70 remaining cache), you can easily absorb this asset acquisition without breaching any risk parameters. Highly recommended!";
      } else if (cleanInput.includes("net worth") || cleanInput.includes("assets") || cleanInput.includes("wealth")) {
        responseText = `Your current Net Worth is $${absoluteNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2 })}. Your investment assets (Roth IRA & Brokerage) are experiencing a solid +8.1% timeline gain. Keep investing $500 monthly to reach $100K soon!`;
      }

      const botMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages((prev) => [...prev, botMsg]);
    }, 850);
  };

  const triggerBotWelcomeNotification = (text: string) => {
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  const getHeaderPlaceholder = () => {
    switch (activeTab) {
      case 'insights': return "Ask FinSight AI about subscriptions, savings, or optimization...";
      case 'income': return "Search paycheck deposits, bonuses or consulting income...";
      case 'expenses': return "Search merchants, grocery targets or monthly bills...";
      case 'budgets': return "Filter budget categories or risk alerts...";
      case 'assets': return "Search high-yield holdings, IRAs or auto loans...";
      default: return "Search transactions, budgets or insights...";
    }
  };

  // Computed absolute values
  const totalAssetsValue = 12450 + 42500 + 21700;
  const totalLiabilitiesValue = 1400 + 1310;
  const absoluteNetWorth = totalAssetsValue - totalLiabilitiesValue;

  return (
    <div className="min-h-screen bg-[#f7f1de] flex flex-col md:flex-row antialiased">
      {/* Sidebar navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main app panel */}
      <main className="flex-1 md:pl-[72px] flex flex-col min-h-screen">
        {/* Universal Top Header */}
        <Header 
          title={activeTab} 
          searchPlaceholder={getHeaderPlaceholder()}
        />

        {/* Dynamic Inner Workspace Panel viewport */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-12">
          {activeTab === 'dashboard' && (
            <Overview 
              incomeTotal={totalIncomeCount}
              expensesTotal={totalExpenseCount}
              remainingBudget={remainingCashBalance}
              savingsRate={currentSavingsPercent}
              recentExpenses={expenses.slice(0, 3)}
              recentIncomes={incomes.slice(0, 3)}
              budgets={budgets}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onAskAI={(p) => {
                handleSendMessage(p);
              }}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpensesDashboard 
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
            />
          )}

          {activeTab === 'insights' && (
            <SpendingAnalysis 
              expenses={expenses}
              budgets={budgets}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              potentialSavings={potentialSavings}
              optimizations={budgetOptimizations}
              incomeTotal={totalIncomeCount}
              onNavigate={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {activeTab === 'income' && (
            <IncomeDashboard 
              incomes={incomes}
              onAddIncome={handleAddIncome}
              onDeleteIncome={handleDeleteIncome}
            />
          )}

          {activeTab === 'budgets' && (
            <BudgetsOverview 
              budgets={budgets}
              expenses={expenses}
              onAddBudget={handleAddBudget}
              onDeleteBudget={handleDeleteBudget}
              onTriggerCreateModal={() => setIsCreateBudgetModalOpen(true)}
            />
          )}

          {activeTab === 'assets' && (
            <AssetsDashboard 
              assetHistory={assetHistory}
            />
          )}
        </div>
      </main>

      {/* Modal overlays */}
      {isCreateBudgetModalOpen && (
        <CreateBudgetModal 
          onClose={() => setIsCreateBudgetModalOpen(false)}
          onSubmit={handleAddBudget}
          incomeTotal={totalIncomeCount}
        />
      )}
    </div>
  );
}
