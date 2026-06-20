import { Transaction, Budget, AssetHistory, ChatMessage, PotentialSaving, BudgetOptimization } from './types';

export const INITIAL_INCOME_TRANSACTIONS: Transaction[] = [
  {
    id: 'inc-1',
    source: 'Tech Corp Ltd.',
    date: 'Oct 24, 2023',
    category: 'Salary',
    type: 'Direct Deposit',
    amount: 6200.00,
    status: 'Completed'
  },
  {
    id: 'inc-2',
    source: 'Creative UI Designs',
    date: 'Oct 20, 2023',
    category: 'Freelance',
    type: 'Invoice Payment',
    amount: 2450.00,
    status: 'Completed'
  },
  {
    id: 'inc-3',
    source: 'S&P 500 Dividends',
    date: 'Oct 18, 2023',
    category: 'Investment',
    type: 'Automated',
    amount: 850.50,
    status: 'Completed'
  },
  {
    id: 'inc-4',
    source: 'Birthday Gift (Family)',
    date: 'Oct 12, 2023',
    category: 'Gift',
    type: 'Zelle Transfer',
    amount: 500.00,
    status: 'Completed'
  },
  {
    id: 'inc-5',
    source: 'E-commerce Sales',
    date: 'Oct 05, 2023',
    category: 'Business',
    type: 'Stripe Payout',
    amount: 2449.50,
    status: 'Completed'
  },
  {
    id: 'inc-6',
    source: 'Web Development Consultation',
    date: 'Sep 28, 2023',
    category: 'Freelance',
    type: 'Invoice Payment',
    amount: 1200.00,
    status: 'Completed'
  },
  {
    id: 'inc-7',
    source: 'Tech Corp Ltd.',
    date: 'Sep 24, 2023',
    category: 'Salary',
    type: 'Direct Deposit',
    amount: 6200.00,
    status: 'Completed'
  }
];

export const INITIAL_EXPENSE_TRANSACTIONS: Transaction[] = [
  {
    id: 'exp-1',
    source: 'Amazon Marketplace',
    date: 'Oct 15, 2023',
    category: 'Shopping',
    type: 'General',
    amount: -45.20,
    status: 'Completed'
  },
  {
    id: 'exp-2',
    source: 'The Coffee Club',
    date: 'Oct 14, 2023',
    category: 'Food',
    type: 'Cafe',
    amount: -12.80,
    status: 'Completed'
  },
  {
    id: 'exp-3',
    source: 'Whole Foods Market',
    date: 'Oct 14, 2023',
    category: 'Food',
    type: 'Groceries',
    amount: -184.20,
    status: 'Completed'
  },
  {
    id: 'exp-4',
    source: 'The Sage Bistro',
    date: 'Oct 12, 2023',
    category: 'Food',
    type: 'Dining Out',
    amount: -65.00,
    status: 'Pending'
  },
  {
    id: 'exp-5',
    source: 'Blue Bottle Coffee',
    date: 'Oct 11, 2023',
    category: 'Food',
    type: 'Cafe',
    amount: -12.40,
    status: 'Completed'
  },
  {
    id: 'exp-6',
    source: 'HelloFresh Subscription',
    date: 'Oct 10, 2023',
    category: 'Food',
    type: 'Meal Kits',
    amount: -89.99,
    status: 'Completed'
  },
  {
    id: 'exp-7',
    source: 'Utility Corp',
    date: 'Oct 08, 2023',
    category: 'Housing',
    type: 'Electricity',
    amount: -112.50,
    status: 'Completed'
  },
  {
    id: 'exp-8',
    source: 'Netflix Inc',
    date: 'Oct 05, 2023',
    category: 'Entertainment',
    type: 'Subscription',
    amount: -15.49,
    status: 'Completed'
  },
  {
    id: 'exp-9',
    source: 'Gas Station Premium',
    date: 'Oct 04, 2023',
    category: 'Transportation',
    type: 'Automotive',
    amount: -42.00,
    status: 'Completed'
  },
  {
    id: 'exp-10',
    source: 'Landlord Rent Automatic',
    date: 'Oct 01, 2023',
    category: 'Housing',
    type: 'Rent',
    amount: -1687.50,
    status: 'Completed'
  }
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'b-housing',
    name: 'Housing',
    limit: 2000.00,
    spent: 1800.00,
    category: 'Housing',
    alertThreshold: 90,
    isRecurring: true,
    onTrackStatus: 'On Track',
    note: 'Next payment due in 4 days'
  },
  {
    id: 'b-food',
    name: 'Food & Dining',
    limit: 800.00,
    spent: 785.20,
    category: 'Food',
    alertThreshold: 80,
    isRecurring: true,
    onTrackStatus: 'At Risk',
    note: 'Only $14.80 remaining'
  },
  {
    id: 'b-entertainment',
    name: 'Entertainment',
    limit: 300.00,
    spent: 145.00,
    category: 'Entertainment',
    alertThreshold: 80,
    isRecurring: true,
    onTrackStatus: 'On Track',
    note: 'Well within monthly limits'
  },
  {
    id: 'b-vacation',
    name: 'Vacation Fund',
    limit: 500.00,
    spent: 350.00,
    category: 'Vacation',
    alertThreshold: 75,
    isRecurring: false,
    onTrackStatus: 'Growing',
    note: 'Automatic transfer active'
  }
];

export const INITIAL_ASSET_HISTORY: AssetHistory[] = [
  { month: 'Jan', netWorth: 200, savings: 100, investments: 50, debt: -20 },
  { month: 'Feb', netWorth: 700, savings: 450, investments: 200, debt: -30 },
  { month: 'Mar', netWorth: 680, savings: 400, investments: 180, debt: -40 },
  { month: 'Apr', netWorth: 1250, savings: 850, investments: 350, debt: -50 },
  { month: 'May', netWorth: 1240, savings: 800, investments: 380, debt: -60 },
  { month: 'Jun', netWorth: 1650, savings: 990, investments: 600, debt: -60 },
  { month: 'Aug', netWorth: 1900, savings: 1100, investments: 800, debt: -2.31 }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: 'Hello! I\'ve analyzed your recent transactions. You spent 15% more on entertainment this week. Would you like a breakdown?',
    timestamp: '9:41 AM'
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'Yes, please. Why did it increase so much?',
    timestamp: '9:42 AM'
  },
  {
    id: 'msg-3',
    sender: 'ai',
    text: 'It looks like the \'Concert Tickets\' purchase of $240 at Ticketmaster was the main driver. This wasn\'t in your typical monthly pattern.',
    timestamp: '9:43 AM'
  }
];

export const POTENTIAL_SAVINGS: PotentialSaving[] = [
  {
    id: 'ps-1',
    title: 'Potential Savings',
    description: 'We found 3 recurring subscriptions you haven\'t used in 90 days.',
    impactValue: '$84.00/mo',
    actionText: 'Review Subscriptions'
  }
];

export const BUDGET_OPTIMIZATIONS: BudgetOptimization[] = [
  {
    id: 'bo-1',
    title: 'Coffee & Snacks',
    recommendedChange: '-$40',
    trend: 'down'
  },
  {
    id: 'bo-2',
    title: 'Grocery Limit',
    recommendedChange: '+$100',
    trend: 'up'
  }
];
