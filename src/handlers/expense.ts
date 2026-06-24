import type { Transaction, Budget } from '../types';

export const addExpense = (raw: Omit<Transaction, 'id' | 'status'>): Transaction => ({
  ...raw,
  id: `exp-${Date.now()}`,
  status: 'Completed',
});

export const deleteExpense = (id: string, expenses: Transaction[]) => {
  return expenses.filter((expense) => expense.id !== id);
};

export const adjustBudgetsForExpense = (budgets: Budget[], expense: Transaction): Budget[] => {
  const positiveAmt = Math.abs(expense.amount);

  return budgets.map((b) => {
    if (b.category.toLowerCase() === expense.category.toLowerCase()) {
      const updatedSpent = b.spent + positiveAmt;
      const status = updatedSpent / b.limit >= 0.85 ? 'At Risk' : b.onTrackStatus;
      const note = updatedSpent >= b.limit
        ? 'Limit exceeded! Minimize outgoings'
        : `Only $${Math.max(0, b.limit - updatedSpent).toFixed(2)} remaining`;

      return {
        ...b,
        spent: updatedSpent,
        onTrackStatus: status,
        note,
      };
    }

    return b;
  });
};

export const rollbackExpenseFromBudgets = (budgets: Budget[], expense: Transaction): Budget[] => {
  return budgets.map((b) => {
    if (b.category.toLowerCase() === expense.category.toLowerCase()) {
      const updatedSpent = Math.max(0, b.spent - Math.abs(expense.amount));
      const status = updatedSpent / b.limit >= 0.85 ? 'At Risk' : 'On Track';
      return {
        ...b,
        spent: updatedSpent,
        onTrackStatus: status,
        note: `$${(b.limit - updatedSpent).toFixed(2)} capacity left`,
      };
    }

    return b;
  });
};
