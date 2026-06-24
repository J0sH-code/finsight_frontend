import type { Budget, Transaction } from '../types';

export const createBudget = (raw: Omit<Budget, 'id' | 'spent' | 'onTrackStatus'>, expenses: Transaction[]): Budget => {
  const previousSpent = expenses
    .filter((expense) => expense.category.toLowerCase() === raw.category.toLowerCase())
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  return {
    ...raw,
    id: `b-${raw.category.toLowerCase()}-${Date.now()}`,
    spent: previousSpent,
    onTrackStatus: previousSpent / raw.limit >= 0.85 ? 'At Risk' : 'On Track',
  };
};

export const deleteBudget = (id: string, budgets: Budget[]) => {
  return budgets.filter((budget) => budget.id !== id);
};
