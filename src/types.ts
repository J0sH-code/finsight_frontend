export interface Transaction {
  id: string;
  source: string; // or merchant
  date: string;
  category: string;
  type: string; // e.g. "Direct Deposit", "Invoice Payment", "Groceries", "Dining Out", "Cafe", "Subscription", "Automated"
  amount: number; // positive for income, negative for expense
  status: 'Completed' | 'Pending';
}

export interface User{
  id: string;
  username: string;
  email: string;
}

export interface Budget {
  id: string;
  name: string;
  limit: number;
  spent: number;
  category: string; // matches transaction category
  alertThreshold: number; // percentage (e.g. 80)
  isRecurring: boolean;
  onTrackStatus: 'On Track' | 'At Risk' | 'Growing' | 'Completed';
  note: string; // e.g. "Next payment due in 4 days"
}

export interface AssetHistory {
  month: string;
  netWorth: number;
  savings: number;
  investments: number;
  debt: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface PotentialSaving {
  id: string;
  title: string;
  description: string;
  impactValue: string;
  actionText: string;
}

export interface BudgetOptimization {
  id: string;
  title: string;
  recommendedChange: string;
  trend: 'up' | 'down';
}

export type TabId = 'dashboard' | 'income' | 'expenses' | 'budgets' | 'assets' | 'insights';
