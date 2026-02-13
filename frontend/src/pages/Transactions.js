import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiFilter, FiDollarSign, FiRefreshCw, FiArrowUpCircle, FiArrowDownCircle, FiDownload } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';
import ConfirmationModal from '../components/Common/ConfirmationModal';
import categoryService from '../services/categoryService';
import transactionService from '../services/transactionService';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  margin-top: 80px;
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin-top: 60px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #64748b;
  margin: 0.5rem 0 0 0;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }
`;

const RefreshButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 1rem;

  &:hover {
    background: #f8fafc;
    color: #3b82f6;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  border-left: 4px solid ${props => props.color || '#e2e8f0'};
`;

const SummaryLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const SummaryValue = styled.div`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  
  /* Hide scrollbar */
  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
  }
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  border: 1px solid ${props => props.active ? props.activeColor || '#4f46e5' : '#e2e8f0'};
  background: ${props => props.active ? (props.activeBg || '#eef2ff') : 'white'};
  color: ${props => props.active ? (props.activeColor || '#4f46e5') : '#64748b'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  
  &:hover {
    border-color: ${props => props.activeColor || '#4f46e5'};
    color: ${props => props.activeColor || '#4f46e5'};
  }
`;

const TransactionsList = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8fafc;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.type === 'income' ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.type === 'income' ? '#16a34a' : '#dc2626'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const TransactionDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const TransactionDescription = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const TransactionMeta = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const TransactionAmount = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.type === 'income' ? '#16a34a' : '#dc2626'};
  white-space: nowrap;
  
  @media (max-width: 768px) {
    align-self: flex-end;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: 1.5rem;
  
  @media (max-width: 768px) {
    margin-left: 0;
    align-self: flex-end;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.edit && `
    background: #eff6ff;
    color: #3b82f6;
    &:hover { background: #dbeafe; }
  `}
  
  ${props => props.delete && `
    background: #fef2f2;
    color: #ef4444;
    &:hover { background: #fee2e2; }
  `}
`;

// Modal Components
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  
  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TypeSelector = styled.div`
  display: flex;
  gap: 1rem;
`;

const TypeButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${props => props.$active ? 'transparent' : '#e2e8f0'};
  background: ${props => props.$active ? (props.$txnType === 'income' ? '#dcfce7' : '#fee2e2') : 'white'};
  color: ${props => props.$active ? (props.$txnType === 'income' ? '#166534' : '#991b1b') : '#64748b'};
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${props => !props.$active && '#cbd5e1'};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
`;

const SecondaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #f8fafc;
    color: #1e293b;
  }
`;

const PrimaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
  color: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #fecaca;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
`;

const Transactions = () => {
  const { user } = useAuth();
  const { format: formatCurrency } = useCurrency();
  usePageTitle('Transactions | BudgetWise');

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all'); // all, income, expense
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    categoryId: 1,
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  // Delete Confirmation State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Initial load
  useEffect(() => {
    loadCategories();
    loadTransactions();
  }, []);

  // Filter transactions when filter or transactions change
  useEffect(() => {
    if (filterType === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(tx => tx.type === filterType));
    }
  }, [transactions, filterType]);

  const loadCategories = async () => {
    try {
      const cats = await categoryService.getCategories();
      if (cats && cats.length > 0) {
        setCategories(cats);
        // Set default category if not set
        if (!formData.categoryId) {
          setFormData(prev => ({
            ...prev,
            categoryId: cats[0].id,
            category: cats[0].name
          }));
        }
      } else {
        const defaults = categoryService.getDefaultCategories();
        setCategories(defaults);
      }
    } catch (err) {
      console.warn('Failed to load categories:', err);
      setCategories(categoryService.getDefaultCategories());
    }
  };

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const txns = await transactionService.getTransactions();
      setTransactions(txns);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      setError('Failed to load transactions. Please try refreshing.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper calculation functions (same as Dashboard)
  const calculateIncomeUpToDate = (txns, date) => {
    return txns
      .filter(tx => {
        const txDate = new Date(tx.date);
        return tx.type === 'income' && txDate <= date;
      })
      .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0);
  };

  const calculateExpensesUpToDate = (txns, date) => {
    return txns
      .filter(tx => {
        const txDate = new Date(tx.date);
        return tx.type === 'expense' && txDate <= date;
      })
      .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0);
  };

  const validateTransaction = (transaction, isUpdate = false, originalTransaction = null) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const txDate = new Date(transaction.date);
    txDate.setHours(23, 59, 59, 999);

    const amount = Math.abs(parseFloat(transaction.amount));
    if (isNaN(amount) || amount <= 0) {
      return { valid: false, message: 'Amount must be greater than zero' };
    }

    // Business Logic: Expenses cannot be added for future dates
    if (transaction.type === 'expense' && txDate > today) {
      return {
        valid: false,
        message: 'Expenses cannot be added for a future date.'
      };
    }

    // Check availability for expenses
    if (transaction.type === 'expense') {
      const checkDate = new Date(transaction.date);
      checkDate.setHours(23, 59, 59, 999);

      let currentSavings = calculateIncomeUpToDate(transactions, checkDate) -
        calculateExpensesUpToDate(transactions, checkDate);

      // Add back original amount if updating
      if (isUpdate && originalTransaction && originalTransaction.type === 'expense') {
        const originalDate = new Date(originalTransaction.date);
        if (originalDate <= checkDate) {
          currentSavings += Math.abs(originalTransaction.amount);
        }
      }

      if (amount > currentSavings) {
        return {
          valid: false,
          message: `Insufficient balance on ${checkDate.toLocaleDateString()}. Available: ${formatCurrency(currentSavings)}.`
        };
      }
    }

    return { valid: true };
  };

  const handleCategoryChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedCat = categories.find(c => c.id === selectedId);
    if (selectedCat) {
      setFormData(prev => ({
        ...prev,
        categoryId: selectedCat.id,
        category: selectedCat.name
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const transaction = {
      type: formData.type,
      description: formData.description,
      amount: formData.amount,
      categoryId: formData.categoryId,
      category: formData.category,
      date: formData.date
    };

    const validation = validateTransaction(transaction, !!editingTransaction, editingTransaction);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    try {
      setIsLoading(true);
      if (editingTransaction) {
        await transactionService.updateTransaction(editingTransaction.id, transaction);
      } else {
        await transactionService.createTransaction(transaction);
      }
      await loadTransactions();
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save transaction:', err);
      setError(err.message || 'Failed to save transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    const matchedCat = categories.find(c => c.name === transaction.category);

    setFormData({
      description: transaction.description,
      amount: Math.abs(transaction.amount).toString(),
      type: transaction.type,
      category: transaction.category,
      categoryId: matchedCat ? matchedCat.id : (transaction.categoryId || categories[0]?.id),
      date: transaction.date
    });
    setShowModal(true);
  };

  const initiateDelete = (id) => {
    const txToDelete = transactions.find(tx => tx.id === id);
    if (!txToDelete) return;

    // Check if deleting income invalidates future expenses
    if (txToDelete.type === 'income') {
      const today = new Date();
      // Only worry if income is in the past/present
      if (new Date(txToDelete.date) <= today) {
        const futureExpenses = transactions.filter(tx =>
          tx.type === 'expense' && new Date(tx.date) > new Date(txToDelete.date)
        );

        if (futureExpenses.length > 0) {
          // This is a simplified check - in reality we should check rolling balance
          const incomeUpToNow = calculateIncomeUpToDate(transactions, today);
          const expensesUpToNow = calculateExpensesUpToDate(transactions, today);
          const currentSavings = incomeUpToNow - expensesUpToNow;

          if ((currentSavings - Math.abs(txToDelete.amount)) < 0) {
            // Ideally we check if it dips below zero at ANY point in future, but simple check for now
            setError(`Cannot delete this income. It would result in negative balance for existing expenses.`);
            return;
          }
        }
      }
    }

    setTransactionToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;

    try {
      setIsLoading(true);
      await transactionService.deleteTransaction(transactionToDelete);
      await loadTransactions();
      setShowDeleteModal(false);
      setTransactionToDelete(null);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      setError('Failed to delete transaction: ' + err.message);
      setShowDeleteModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTransaction(null);
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      categoryId: categories[0]?.id || 1,
      category: categories[0]?.name || 'Food',
      date: new Date().toISOString().split('T')[0]
    });
    setError('');
  };

  // Stats Calculation
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const totalExpenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0);

  const netBalance = totalIncome - totalExpenses;

  return (
    <Container>
      <Header>
        <div>
          <Title>Transactions</Title>
          <Subtitle>Manage all your income and expenses</Subtitle>
        </div>
        <div style={{ display: 'flex' }}>
          <RefreshButton onClick={loadTransactions} disabled={isLoading}>
            <FiRefreshCw className={isLoading ? 'spinning' : ''} /> {isLoading ? 'Loading...' : 'Refresh'}
          </RefreshButton>
          <Button onClick={() => setShowModal(true)}>
            <FiPlus /> Add Transaction
          </Button>
        </div>
      </Header>

      <SummaryGrid>
        <SummaryCard color="#16a34a">
          <SummaryLabel>Total Income</SummaryLabel>
          <SummaryValue style={{ color: '#16a34a' }}>{formatCurrency(totalIncome)}</SummaryValue>
        </SummaryCard>
        <SummaryCard color="#dc2626">
          <SummaryLabel>Total Expenses</SummaryLabel>
          <SummaryValue style={{ color: '#dc2626' }}>{formatCurrency(totalExpenses)}</SummaryValue>
        </SummaryCard>
        <SummaryCard color="#4f46e5">
          <SummaryLabel>Net Balance</SummaryLabel>
          <SummaryValue style={{ color: netBalance >= 0 ? '#4f46e5' : '#dc2626' }}>
            {formatCurrency(netBalance)}
          </SummaryValue>
        </SummaryCard>
      </SummaryGrid>

      <FilterBar>
        <FilterButton
          active={filterType === 'all'}
          onClick={() => setFilterType('all')}
        >
          All Transactions
        </FilterButton>
        <FilterButton
          active={filterType === 'income'}
          activeColor="#16a34a"
          activeBg="#dcfce7"
          onClick={() => setFilterType('income')}
        >
          <FiArrowUpCircle style={{ marginRight: '0.5rem' }} /> Modified Income
        </FilterButton>
        <FilterButton
          active={filterType === 'expense'}
          activeColor="#dc2626"
          activeBg="#fee2e2"
          onClick={() => setFilterType('expense')}
        >
          <FiArrowDownCircle style={{ marginRight: '0.5rem' }} /> Expense
        </FilterButton>
      </FilterBar>

      <TransactionsList>
        {filteredTransactions.length === 0 ? (
          <EmptyState>
            <h3>No transactions found.</h3>
            <p>Try changing your filters or add a new transaction.</p>
          </EmptyState>
        ) : (
          [...filteredTransactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(transaction => (
              <TransactionItem key={transaction.id}>
                <TransactionInfo>
                  <IconWrapper type={transaction.type}>
                    {transaction.type === 'income' ? <FiDollarSign /> : <FiArrowDownCircle />}
                  </IconWrapper>
                  <TransactionDetails>
                    <TransactionDescription>{transaction.description}</TransactionDescription>
                    <TransactionMeta>
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </TransactionMeta>
                  </TransactionDetails>
                </TransactionInfo>

                <TransactionAmount type={transaction.type}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </TransactionAmount>

                <Actions>
                  <ActionButton edit onClick={() => handleEdit(transaction)} title="Edit">
                    <FiEdit2 size={16} />
                  </ActionButton>
                  <ActionButton delete onClick={() => initiateDelete(transaction.id)} title="Delete">
                    <FiTrash2 size={16} />
                  </ActionButton>
                </Actions>
              </TransactionItem>
            ))
        )}
      </TransactionsList>

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

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{editingTransaction ? 'Edit Transaction' : 'Add Transaction'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <FiX size={24} />
              </CloseButton>
            </ModalHeader>

            {error && <ErrorMessage><FiX size={16} /> {error}</ErrorMessage>}

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Transaction Type</Label>
                <TypeSelector>
                  <TypeButton
                    type="button"
                    $active={formData.type === 'income'}
                    $txnType="income"
                    onClick={() => setFormData({ ...formData, type: 'income' })}
                  >
                    Income
                  </TypeButton>
                  <TypeButton
                    type="button"
                    $active={formData.type === 'expense'}
                    $txnType="expense"
                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                  >
                    Expense
                  </TypeButton>
                </TypeSelector>
              </FormGroup>

              <FormGroup>
                <Label>Description</Label>
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                  required
                  autoFocus
                />
              </FormGroup>

              <FormGroup>
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Category</Label>
                <Select
                  value={formData.categoryId}
                  onChange={handleCategoryChange}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  max={formData.type === 'expense' ? new Date().toISOString().split('T')[0] : undefined}
                  required
                />
              </FormGroup>

              <FormActions>
                <SecondaryButton type="button" onClick={handleCloseModal}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={isLoading}>
                  {editingTransaction ? 'Save Changes' : 'Add Transaction'}
                </PrimaryButton>
              </FormActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Transactions;
