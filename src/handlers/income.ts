import type { Transaction } from '../types';

export const addIncome = (raw: Omit<Transaction, 'id' | 'status'>): Transaction => ({
  ...raw,
  id: `inc-${Date.now()}`,
  status: 'Completed',
});

export const deleteIncome = (id: string, incomes: Transaction[]) => {
  return incomes.filter((income) => income.id !== id);
};
