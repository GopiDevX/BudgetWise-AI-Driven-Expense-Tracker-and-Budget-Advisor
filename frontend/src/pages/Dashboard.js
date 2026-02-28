import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FiTrendingUp, FiDollarSign, FiCreditCard, FiPieChart, FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiEye, FiEyeOff, FiChevronDown, FiHeart, FiLoader, FiDownload, FiCamera, FiX, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

import TransactionForm from '../components/TransactionForm';
import ReceiptScanner from '../components/ReceiptScanner';
import ConfirmationModal from '../components/Common/ConfirmationModal';
import Skeleton from '../components/Common/Skeleton';
import usePageTitle from '../hooks/usePageTitle';
import { useCurrency } from '../contexts/CurrencyContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import transactionService from '../services/transactionService';
import categoryService from '../services/categoryService';
import budgetService from '../services/budgetService';
import exportService from '../services/exportService';

// Styled Components
const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
`;

const WelcomeSection = styled.div`
  margin-bottom: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary, #0f172a);
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
`;

const WelcomeSubtitle = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin: 0;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-secondary, white);
  border: 1px solid var(--border-primary, #e2e8f0);
  border-radius: 0.75rem;
  cursor: pointer;
  color: var(--text-secondary, #64748b);
  transition: all 0.2s;

  &:hover {
    background: var(--bg-tertiary, #f8fafc);
    color: var(--accent-primary, #3b82f6);
  }
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: var(--bg-secondary, white);
  border: 1px solid var(--border-primary, #e2e8f0);
  border-radius: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary, #0f172a);
  transition: all 0.2s;

  &:hover {
    background: var(--bg-tertiary, #f8fafc);
  }

  svg {
    color: var(--text-secondary, #64748b);
  }
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: white;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px -2px rgba(37, 99, 235, 0.3);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: var(--bg-secondary, white);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid var(--border-primary, #e2e8f0);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${props => {
    switch (props.$variant) {
      case 'primary': return 'linear-gradient(90deg, #4f46e5, #3b82f6)';
      case 'success': return 'linear-gradient(90deg, #10b981, #34d399)';
      case 'warning': return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
      case 'danger': return 'linear-gradient(90deg, #ef4444, #f87171)';
      default: return 'transparent';
    }
  }};
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.$variant) {
      case 'primary': return 'rgba(59, 130, 246, 0.1)';
      case 'success': return 'rgba(16, 185, 129, 0.1)';
      case 'warning': return 'rgba(245, 158, 11, 0.1)';
      case 'danger': return 'rgba(239, 68, 68, 0.1)';
      default: return 'var(--bg-tertiary, #f1f5f9)';
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'primary': return '#3b82f6';
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      default: return 'var(--text-tertiary, #64748b)';
    }
  }};
`;

const StatInfo = styled.div`
  text-align: right;
`;

const StatTitle = styled.h3`
  font-size: 0.875rem;
  color: var(--text-secondary, #64748b);
  margin: 0 0 0.5rem 0;
  font-weight: 500;
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  color: var(--text-primary, #1e293b);
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const StatChange = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  background: ${props => props.$positive ? '#f0fdf4' : '#fef2f2'};
  color: ${props => props.$positive ? '#16a34a' : '#dc2626'};
  
  svg {
    margin-right: 0.25rem;
  }
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const BudgetAlertsContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border-radius: 1rem;
  border: 1px solid #fcd34d;
  box-shadow: 0 4px 6px -1px rgba(251, 191, 36, 0.1);

  [data-theme='dark'] & {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(180, 83, 9, 0.1) 100%);
    border-color: rgba(245, 158, 11, 0.3);
  }
`;

const AlertsHeader = styled.h3`
  margin: 0 0 1rem 0;
  color: #92400e;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  [data-theme='dark'] & {
    color: #fbbf24;
  }
`;

const AlertsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AlertItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: ${props => props.status === 'over' ? '#fef2f2' : '#fffbeb'};
  border-radius: 0.75rem;
  border: 1px solid ${props => props.status === 'over' ? '#fee2e2' : '#fef3c7'};
  transition: all 0.2s;

  &:hover {
    transform: translateX(4px);
  }

  [data-theme='dark'] & {
    color: ${props => props.status === 'over' ? '#f87171' : '#fbbf24'};
    background: ${props => props.status === 'over' ? 'rgba(248, 113, 113, 0.15)' : 'rgba(251, 191, 36, 0.15)'};
    border-color: ${props => props.status === 'over' ? 'rgba(248, 113, 113, 0.2)' : 'rgba(251, 191, 36, 0.2)'};
  }
`;

const AlertCategory = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-primary, #1e293b);
`;

const AlertMessage = styled.span`
  color: ${props => props.status === 'over' ? '#dc2626' : '#d97706'};
  font-weight: 600;
  font-size: 0.9rem;

  [data-theme='dark'] & {
    color: ${props => props.status === 'over' ? '#f87171' : '#fbbf24'};
  }
`;

const ChartCard = styled.div`
  background: var(--bg-secondary, white);
  border-radius: 1.25rem;
  padding: 1.75rem;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid var(--border-primary, rgba(255,255,255,0.5));
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin: 0 0 1.5rem 0;

  [data-theme='dark'] & {
    color: #f1f5f9;
  }
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
`;

const TransactionsSection = styled.div`
  background: var(--bg-secondary, white);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-primary, #e2e8f0);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin: 0;

  [data-theme='dark'] & {
    color: #f1f5f9;
  }
`;

const ViewAllLink = styled(Link)`
  color: #3b82f6;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const TransactionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--bg-primary, #f8fafc);
  border-radius: 0.75rem;
  transition: all 0.2s;
  border: 1px solid var(--border-primary, transparent);

  &:hover {
    transform: translateX(4px);
    background: var(--bg-tertiary, #f1f5f9);
    border-color: var(--border-secondary, #cbd5e1);
  }
`;

const TransactionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  background: ${props => props.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.type === 'income' ? '#10b981' : '#ef4444'};

  [data-theme='dark'] & {
    background: ${props => props.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  }
`;

const TransactionInfo = styled.div`
  flex-grow: 1;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  border: 1px solid #fecaca;
`;

const TransactionDetails = styled.div`
  flex: 1;
  margin-left: 1rem;
`;

const TransactionTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary, #1e293b);
  margin: 0 0 0.25rem 0;

  [data-theme='dark'] & {
    color: #f1f5f9;
  }
`;

const TransactionCategory = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--text-secondary, #64748b);
  margin: 0;
`;

const TransactionMeta = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-secondary, #64748b);

  [data-theme='dark'] & {
    color: #94a3b8;
  }
`;

const TransactionDate = styled.p`
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-tertiary, #94a3b8);
  margin: 0;
`;

const TransactionActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-right: 1.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: var(--bg-tertiary, #f1f5f9);
  }
`;

const EditButton = styled(ActionButton)`
  color: #3b82f6;
`;

const DeleteButton = styled(ActionButton)`
  color: #ef4444;
`;

const TransactionAmount = styled.div`
  font-weight: 700;
  color: ${props => props.type === 'income' ? '#10b981' : '#ef4444'};
  text-align: right;
  min-width: 100px;
`;

const NoTransactions = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary, #64748b);
  background: var(--bg-tertiary, #f8fafc);
  border-radius: 1rem;
  border: 2px dashed var(--border-primary, #e2e8f0);
`;

const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  color: white;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
  }
`;

const ProfileButton = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.375rem 1rem 0.375rem 0.375rem;
  background: var(--bg-secondary, white);
  border: 1px solid var(--border-primary, #e2e8f0);
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary, #0f172a);

  &:hover {
    background: var(--bg-tertiary, #f8fafc);
    border-color: var(--border-secondary, #cbd5e1);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }
`;

const ProfileAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
`;

const ProfileName = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
  padding-right: 0.25rem;
`;

// Mock data for charts
const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#64748b'];

const Dashboard = () => {
  // Set page title
  usePageTitle('Dashboard | BudgetWise');
  const { format: formatCurrency, symbol: currencySymbol } = useCurrency();
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();

  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [showBalances, setShowBalances] = useState(true);

  // Delete Confirmation State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Calculate financial metrics
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [savings, setSavings] = useState(0);

  // Chart data states
  const [monthlyExpensesData, setMonthlyExpensesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [budgetAlerts, setBudgetAlerts] = useState([]);

  // Helper function to calculate total income up to a given date (inclusive)
  const calculateIncomeUpToDate = (transactions, date) => {
    return transactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return tx.type === 'income' && txDate <= date;
      })
      .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0);
  };

  // Helper function to calculate total expenses up to a given date (inclusive)
  const calculateExpensesUpToDate = (transactions, date) => {
    return transactions
      .filter(tx => {
        const txDate = new Date(tx.date);
        return tx.type === 'expense' && txDate <= date;
      })
      .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0);
  };

  // Validate transaction before adding/updating
  const validateTransaction = (transaction, isUpdate = false, originalTransaction = null) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of day
    const txDate = new Date(transaction.date);
    txDate.setHours(23, 59, 59, 999); // Normalize to end of day for comparison

    // Check if amount is valid
    const amount = Math.abs(parseFloat(transaction.amount));
    if (isNaN(amount) || amount <= 0) {
      return { valid: false, message: 'Amount must be greater than zero' };
    }

    // Business Logic: Expenses cannot be added for future dates (Income CAN be future-dated)
    if (transaction.type === 'expense' && txDate > today) {
      return {
        valid: false,
        message: 'Expenses cannot be added for a future date. Only income can be scheduled for future dates.'
      };
    }

    // For expense transactions, check if it would make savings negative
    if (transaction.type === 'expense') {
      const checkDate = new Date(transaction.date);
      checkDate.setHours(23, 59, 59, 999);

      let currentSavings = calculateIncomeUpToDate(transactions, checkDate) -
        calculateExpensesUpToDate(transactions, checkDate);

      // If updating, add back the original amount if it was an expense
      // Note: We only add back if the original tx date is <= checkDate. 
      // If we are moving a future expense to the past, the original wouldn't be in the calc anyway (if logic is sound),
      // but if we are moving past to past, it is included. 
      // Simplified: Since 'transactions' includes the item being edited, calculate...UpToDate INCLUDES it.
      // So we MUST add it back.
      if (isUpdate && originalTransaction && originalTransaction.type === 'expense') {
        const originalDate = new Date(originalTransaction.date);
        if (originalDate <= checkDate) {
          currentSavings += Math.abs(originalTransaction.amount);
        }
      }

      if (amount > currentSavings) {
        return {
          valid: false,
          message: `Insufficient balance on ${checkDate.toLocaleDateString()}.Available: ${currencySymbol}${currentSavings.toFixed(2)}.`
        };
      }
    }

    return { valid: true };
  };

  // Calculate percentage changes from previous month
  const calculateMonthChange = (currentMonth, previousMonth) => {
    if (previousMonth === 0) return currentMonth > 0 ? 100 : 0;
    return parseFloat((((currentMonth - previousMonth) / previousMonth) * 100).toFixed(1));
  };

  // Load transactions from backend on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load categories
        try {
          const cats = await categoryService.getCategories();
          setCategories(cats);
        } catch (catError) {
          console.warn('Failed to load categories, using defaults:', catError);
          setCategories(categoryService.getDefaultCategories());
        }
        // Load transactions
        const txns = await transactionService.getTransactions();
        setTransactions(txns);
      } catch (error) {
        console.error('Failed to load transactions:', error);
        setFormError('Failed to load transactions. Please try refreshing.');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);


  // Calculate financial metrics and chart data when transactions change
  useEffect(() => {
    if (transactions.length === 0) {
      setTotalBalance(0);
      setMonthlyIncome(0);
      setMonthlyExpenses(0);
      setSavings(0);
      setMonthlyExpensesData([]);
      setCategoryData([]);
      return;
    }

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Filter transactions for current month
    const monthlyData = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });

    // Calculate income and expenses
    const income = monthlyData
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const expenses = monthlyData
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0);

    // Calculate total income and expenses from all transactions
    const totalIncome = transactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

    const totalExpenses = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0);

    // Total balance is total income minus total expenses
    const balance = totalIncome - totalExpenses;

    // Calculate savings (income - expenses for current month)
    const monthlySavings = income - expenses;

    // Generate monthly expenses data for the last 6 months
    const monthlyDataByMonth = Array.from({ length: 6 }, (_, i) => {
      const date = new Date(currentYear, currentMonth - i, 1);
      const monthTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === date.getMonth() &&
          txDate.getFullYear() === date.getFullYear() &&
          tx.type === 'expense';
      });

      const totalExpenses = monthTransactions.reduce(
        (sum, tx) => sum + Math.abs(parseFloat(tx.amount)),
        0
      );

      return {
        name: date.toLocaleString('default', { month: 'short' }),
        amount: totalExpenses
      };
    }).reverse();

    // Calculate category-wise expenses
    const categoryMap = new Map();
    monthlyData
      .filter(tx => tx.type === 'expense')
      .forEach(tx => {
        const amount = Math.abs(parseFloat(tx.amount));
        if (categoryMap.has(tx.category)) {
          categoryMap.set(tx.category, categoryMap.get(tx.category) + amount);
        } else {
          categoryMap.set(tx.category, amount);
        }
      });

    const categoryTotalExpenses = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);

    const categoryChartData = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value: parseFloat(((value / categoryTotalExpenses) * 100).toFixed(1)),
      amount: value
    })).sort((a, b) => b.value - a.value);

    // Update state
    setMonthlyIncome(parseFloat(income.toFixed(2)));
    setMonthlyExpenses(parseFloat(expenses.toFixed(2)));
    setTotalBalance(parseFloat(balance.toFixed(2)));
    setSavings(parseFloat(monthlySavings.toFixed(2)));
    setMonthlyExpensesData(monthlyDataByMonth);
    setCategoryData(categoryChartData);
  }, [transactions]);

  // Refresh transactions from server
  const refreshTransactions = async () => {
    setIsLoading(true);
    try {
      const txns = await transactionService.getTransactions();
      setTransactions(txns);
    } catch (error) {
      console.error('Failed to refresh transactions:', error);
      setFormError('Failed to refresh transactions.');
    } finally {
      setIsLoading(false);
    }

    // Also refresh budget alerts
    try {
      const status = await budgetService.getBudgetStatus();
      // Filter to show only warning and over budget items
      const alerts = status.filter(b => b.status === 'warning' || b.status === 'over');
      setBudgetAlerts(alerts);
    } catch (error) {
      console.log('Could not load budget alerts:', error);
    }
  };

  // CRUD Operations
  const addTransaction = async (transaction) => {
    // Reset any previous errors
    setFormError('');

    // Validate the transaction
    const validation = validateTransaction(transaction);
    if (!validation.valid) {
      setFormError(validation.message);
      return false;
    }

    try {
      setIsLoading(true);
      await transactionService.createTransaction(transaction);
      await refreshTransactions();
      setShowForm(false);
      return true;
    } catch (error) {
      console.error('Failed to add transaction:', error);
      setFormError(error.message || 'Failed to add transaction');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransaction = async (updatedTransaction) => {
    // Reset any previous errors
    setFormError('');

    // Find the original transaction for validation
    const originalTransaction = transactions.find(tx => tx.id === updatedTransaction.id);
    if (!originalTransaction) {
      setFormError('Transaction not found');
      return false;
    }

    // Validate the updated transaction
    const validation = validateTransaction(updatedTransaction, true, originalTransaction);
    if (!validation.valid) {
      setFormError(validation.message);
      return false;
    }

    try {
      setIsLoading(true);
      await transactionService.updateTransaction(updatedTransaction.id, updatedTransaction);
      await refreshTransactions();
      setEditingTransaction(null);
      setShowForm(false);
      return true;
    } catch (error) {
      console.error('Failed to update transaction:', error);
      setFormError(error.message || 'Failed to update transaction');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const initiateDelete = (id) => {
    setTransactionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;

    const id = transactionToDelete;
    // Logic from original deleteTransaction
    const transactionToDeleteObj = transactions.find(tx => tx.id === id);
    if (!transactionToDeleteObj) {
      setShowDeleteModal(false);
      return;
    }

    // For expense transactions, check if deletion would make any future expenses invalid
    if (transactionToDeleteObj.type === 'income') {
      const futureExpenses = transactions.filter(tx => {
        if (tx.type !== 'expense') return false;
        const txDate = new Date(tx.date);
        const deleteDate = new Date(transactionToDeleteObj.date);
        return txDate > deleteDate;
      });

      if (futureExpenses.length > 0) {
        const incomeUpToNow = calculateIncomeUpToDate(transactions, new Date());
        const expensesUpToNow = calculateExpensesUpToDate(transactions, new Date());
        // Calculate savings using the same logic as render
        const currentSavings = incomeUpToNow - expensesUpToNow;

        // If the income being deleted is before now, check if any future expenses would be invalid
        if (new Date(transactionToDeleteObj.date) <= new Date()) {
          const updatedIncome = incomeUpToNow - Math.abs(transactionToDeleteObj.amount);
          const futureExpenseTotal = futureExpenses.reduce(
            (sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0
          );

          // We need to check if the cumulative balance drops below zero at any point in the future
          // But for now, using the simplified check from before
          if (updatedIncome - (expensesUpToNow - futureExpenseTotal) < 0) {
            setFormError(
              `Cannot delete this income as it would make ${futureExpenses.length} future expense(s) invalid. ` +
              'Please delete or modify those expenses first.'
            );
            setShowDeleteModal(false);
            return;
          }
        }
      }
    }

    try {
      setIsLoading(true);
      await transactionService.deleteTransaction(id);
      await refreshTransactions();
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      setFormError(error.message || 'Failed to delete transaction');
      setShowDeleteModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const previousMonthIncome = transactions
    .filter(tx => {
      const txDate = new Date(tx.date);
      const prevMonth = new Date().getMonth() - 1;
      const year = prevMonth < 0 ? new Date().getFullYear() - 1 : new Date().getFullYear();
      return txDate.getMonth() === (prevMonth < 0 ? 11 : prevMonth) &&
        txDate.getFullYear() === year &&
        tx.type === 'income';
    })
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const previousMonthExpenses = transactions
    .filter(tx => {
      const txDate = new Date(tx.date);
      const prevMonth = new Date().getMonth() - 1;
      const year = prevMonth < 0 ? new Date().getFullYear() - 1 : new Date().getFullYear();
      return txDate.getMonth() === (prevMonth < 0 ? 11 : prevMonth) &&
        txDate.getFullYear() === year &&
        tx.type === 'expense';
    })
    .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0);

  const previousMonthSavings = previousMonthIncome - previousMonthExpenses;

  const incomeChange = calculateMonthChange(monthlyIncome, previousMonthIncome);
  const expensesChange = calculateMonthChange(monthlyExpenses, previousMonthExpenses);
  const savingsChange = calculateMonthChange(savings, previousMonthSavings);

  return (
    <>
      <DashboardContainer>
        {/* Background Gradient Mesh */}
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: -1,
          background: 'radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 25%), radial-gradient(circle at 85% 30%, rgba(16, 185, 129, 0.08) 0%, transparent 25%)',
          pointerEvents: 'none'
        }} />

        <WelcomeSection as={motion.div} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div>
            <WelcomeTitle>Welcome back, {currentUser?.firstName || 'User'}! 👋</WelcomeTitle>
            <WelcomeSubtitle>Here's what's happening with your finance today.</WelcomeSubtitle>
          </div>
          <HeaderControls>
            <IconButton onClick={refreshTransactions} title="Refresh Data">
              <FiRefreshCw />
            </IconButton>
            <Link to="/settings" style={{ textDecoration: 'none' }}>
              <ProfileButton>
                <ProfileAvatar>
                  {currentUser?.firstName ? currentUser.firstName[0]?.toUpperCase() : <FiUser />}
                </ProfileAvatar>
                <ProfileName>
                  {currentUser?.firstName || 'User'}
                </ProfileName>
              </ProfileButton>
            </Link>
            <DropdownButton onClick={() => exportService.exportToCSV(transactions, exportService.getFilename('transactions'))} title="Export to CSV">
              <FiDownload size={16} /> CSV
            </DropdownButton>
            <DropdownButton onClick={() => exportService.exportToPDF(transactions, exportService.getFilename('report'))} title="Export to PDF">
              <FiDownload size={16} /> PDF
            </DropdownButton>
            <DropdownButton onClick={() => { setEditingTransaction(null); setShowForm(true); }} title="Add Transaction" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', color: 'white', border: 'none' }}>
              <FiPlus size={16} /> Add
            </DropdownButton>
            <DropdownButton onClick={() => setShowScanner(true)} title="Scan Receipt" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none' }}>
              <FiCamera size={16} /> Scan
            </DropdownButton>
          </HeaderControls>
        </WelcomeSection>

        {formError && !showForm && (
          <ErrorMessage style={{ marginBottom: '2rem' }}>
            <FiX size={16} /> {formError}
            <button onClick={() => setFormError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
              <FiX size={16} />
            </button>
          </ErrorMessage>
        )}

        {showForm && (
          <TransactionForm
            transaction={editingTransaction}
            initialData={scannedData}
            onSubmit={editingTransaction ? updateTransaction : addTransaction}
            onCancel={() => {
              setEditingTransaction(null);
              setScannedData(null);
              setShowForm(false);
              setFormError('');
            }}
            error={formError}
            categories={categories}
          />
        )}

        {showScanner && (
          <ReceiptScanner
            onScanComplete={(data) => {
              setScannedData(data);
              setShowScanner(false);
              setShowForm(true);
            }}
            onClose={() => setShowScanner(false)}
          />
        )}

        {/* Stats Grid */}
        <StatsGrid as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, staggerChildren: 0.1 }}>
          <StatCard $variant="primary" as={motion.div} whileHover={{ y: -5 }}>
            <StatHeader>
              <StatIcon $variant="primary">
                <FiDollarSign size={24} />
              </StatIcon>
              <StatInfo>
                <StatTitle>Total Balance</StatTitle>
                <StatValue>{showBalances ? formatCurrency(totalBalance) : '••••••'}</StatValue>
              </StatInfo>
            </StatHeader>
          </StatCard>

          <StatCard $variant="success" as={motion.div} whileHover={{ y: -5 }}>
            <StatHeader>
              <StatIcon $variant="success">
                <FiTrendingUp size={24} />
              </StatIcon>
              <StatInfo>
                <StatTitle>Monthly Income</StatTitle>
                <StatValue>{showBalances ? formatCurrency(monthlyIncome) : '••••••'}</StatValue>
              </StatInfo>
            </StatHeader>
          </StatCard>

          <StatCard $variant="danger" as={motion.div} whileHover={{ y: -5 }}>
            <StatHeader>
              <StatIcon $variant="danger">
                <FiCreditCard size={24} />
              </StatIcon>
              <StatInfo>
                <StatTitle>Monthly Expenses</StatTitle>
                <StatValue>{showBalances ? formatCurrency(monthlyExpenses) : '••••••'}</StatValue>
              </StatInfo>
            </StatHeader>
          </StatCard>

          <StatCard $variant="warning" as={motion.div} whileHover={{ y: -5 }}>
            <StatHeader>
              <StatIcon $variant="warning">
                <FiPieChart size={24} />
              </StatIcon>
              <StatInfo>
                <StatTitle>Total Savings</StatTitle>
                <StatValue>{showBalances ? formatCurrency(savings) : '••••••'}</StatValue>
              </StatInfo>
            </StatHeader>
          </StatCard>
        </StatsGrid>

        {/* Budget Alerts Section */}
        {/* Budget Alerts Section */}
        {budgetAlerts.length > 0 && (
          <BudgetAlertsContainer
            as={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AlertsHeader>
              <span role="img" aria-label="warning">⚠️</span> Budget Alerts
            </AlertsHeader>
            <AlertsList>
              {budgetAlerts.map(alert => (
                <AlertItem key={alert.categoryId} status={alert.status}>
                  <AlertCategory>
                    {alert.categoryName}
                  </AlertCategory>
                  <AlertMessage status={alert.status}>
                    {alert.status === 'over'
                      ? `${currencySymbol}${Math.abs(alert.remaining).toFixed(0)} over budget`
                      : `${currencySymbol}${alert.remaining.toFixed(0)} remaining(${alert.percentage.toFixed(0)} % used)`}
                  </AlertMessage>
                </AlertItem>
              ))}
            </AlertsList>
            <Link to="/settings" style={{
              display: 'inline-block',
              marginTop: '0.75rem',
              color: 'var(--text-secondary, #64748b)',
              fontSize: '0.85rem',
              textDecoration: 'underline'
            }}>
              Manage budgets →
            </Link>
          </BudgetAlertsContainer>
        )}

        <ChartsSection>
          <ChartCard>
            <ChartHeader>
              <ChartTitle>Monthly Expenses</ChartTitle>
            </ChartHeader>
            <ChartContainer>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyExpensesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#334155' : '#f1f5f9'} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `${currencySymbol}${value} `}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1e293b' : 'white',
                      borderRadius: '0.5rem',
                      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      color: isDarkMode ? '#f1f5f9' : '#1e293b'
                    }}
                    itemStyle={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}
                    cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                    formatter={(value) => [formatCurrency(value), 'Amount']}
                  />
                  <Bar
                    dataKey="amount"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    name="Expenses"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartCard>

          <ChartCard>
            <ChartHeader>
              <ChartTitle>Spending by Category</ChartTitle>
            </ChartHeader>
            <ChartContainer>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                    labelLine={false}
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}% `}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell - ${index} `} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDarkMode ? '#1e293b' : 'white',
                      borderRadius: '0.5rem',
                      border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      color: isDarkMode ? '#f1f5f9' : '#1e293b'
                    }}
                    itemStyle={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}
                    cursor={{ fill: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                    formatter={(value) => [formatCurrency(value), 'Amount']}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      paddingTop: '20px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </ChartCard>
        </ChartsSection>

        <TransactionsSection>
          <SectionHeader>
            <SectionTitle>Recent Transactions</SectionTitle>
            <ViewAllLink to="/transactions">View All</ViewAllLink>
          </SectionHeader>
          <TransactionsList>
            {transactions.length === 0 ? (
              <NoTransactions>No transactions yet. Add your first transaction to get started!</NoTransactions>
            ) : (
              [...transactions]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5)
                .map(transaction => (
                  <TransactionItem key={transaction.id} type={transaction.type}>
                    <TransactionIcon type={transaction.type}>
                      {transaction.type === 'income' ? <FiDollarSign /> : <FiCreditCard />}
                    </TransactionIcon>
                    <TransactionInfo>
                      <TransactionTitle>{transaction.description}</TransactionTitle>
                      <TransactionCategory>{transaction.category}</TransactionCategory>
                      <TransactionDate>
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TransactionDate>
                    </TransactionInfo>
                    <TransactionActions>
                      <EditButton onClick={() => startEditing(transaction)}>
                        <FiEdit2 size={16} />
                      </EditButton>
                      <DeleteButton onClick={() => initiateDelete(transaction.id)} title="Delete">
                        <FiTrash2 size={16} />
                      </DeleteButton>
                    </TransactionActions>
                    <TransactionAmount type={transaction.type}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(parseFloat(transaction.amount)))}
                    </TransactionAmount>
                  </TransactionItem>
                ))
            )}
            {transactions.length > 5 && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <ViewAllLink to="/transactions">View All Transactions</ViewAllLink>
              </div>
            )}
          </TransactionsList>
        </TransactionsSection>
      </DashboardContainer>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        type="danger"
        isLoading={isLoading}
      />

      {/* Receipt Scanner Modal */}
      <ReceiptScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanComplete={(data) => {
          setScannedData(data);
          // Do NOT set editingTransaction here, as that triggers "Edit" mode with PUT request
          setShowForm(true);
        }}
      />
    </>
  );
};

export default Dashboard;
