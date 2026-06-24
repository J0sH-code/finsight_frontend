import type { Transaction, Budget, ChatMessage, AssetHistory, PotentialSaving, BudgetOptimization } from '../types';

export interface AppDataPayload {
  incomes: Transaction[];
  expenses: Transaction[];
  budgets: Budget[];
  assetHistory: AssetHistory[];
  chatMessages: ChatMessage[];
  potentialSavings: PotentialSaving[];
  budgetOptimizations: BudgetOptimization[];
}

export const fetchAppData = async (): Promise<AppDataPayload | null> => {
  try {
    const [incomeRes, expenseRes, budgetRes, assetRes, chatRes, savingsRes, optimizationRes] = await Promise.all([
      fetch('/api/incomes'),
      fetch('/api/expenses'),
      fetch('/api/budgets'),
      fetch('/api/assets/history'),
      fetch('/api/chat/messages'),
      fetch('/api/insights/savings'),
      fetch('/api/insights/optimizations'),
    ]);

    if (!incomeRes.ok || !expenseRes.ok || !budgetRes.ok || !assetRes.ok || !chatRes.ok || !savingsRes.ok || !optimizationRes.ok) {
      console.error('Failed to fetch one or more initial data endpoints');
      return null;
    }

    const [incomeData, expenseData, budgetData, assetData, chatData, savingsData, optimizationData] = await Promise.all([
      incomeRes.json(),
      expenseRes.json(),
      budgetRes.json(),
      assetRes.json(),
      chatRes.json(),
      savingsRes.json(),
      optimizationRes.json(),
    ]);

    return {
      incomes: incomeData,
      expenses: expenseData,
      budgets: budgetData,
      assetHistory: assetData,
      chatMessages: chatData,
      potentialSavings: savingsData,
      budgetOptimizations: optimizationData,
    };
  } catch (error) {
    console.error('Error loading initial app data', error);
    return null;
  }
};
