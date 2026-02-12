import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCalendar, FiDollarSign, FiRefreshCw } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';
import ConfirmationModal from '../components/Common/ConfirmationModal';
import categoryService from '../services/categoryService';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  margin-top: 80px;
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
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
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
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
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
`;

const SummaryLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
`;

const SummaryValue = styled.div`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${props => props.expense ? '#dc2626' : '#1e293b'};
`;

const ExpenseList = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const ExpenseItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const ExpenseDetails = styled.div`
  flex: 1;
`;

const ExpenseDescription = styled.div`
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.25rem;
`;

const ExpenseMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #64748b;
`;

const ExpenseAmount = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #dc2626;
  margin-right: 1rem;
  
  @media (max-width: 768px) {
    margin-right: 0;
    align-self: flex-end;
  }
`;

const ExpenseActions = styled.div`
  display: flex;
  gap: 0.5rem;
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
    background: #3b82f6;
    color: white;
    
    &:hover {
      background: #2563eb;
    }
  `}
  
  ${props => props.delete && `
    background: #fee2e2;
    color: #dc2626;
    
    &:hover {
      background: #fecaca;
    }
  `}
`;

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
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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
  padding: 0;
  
  &:hover {
    color: #1e293b;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const SecondaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f9fafb;
  }
`;

const PrimaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #64748b;
`;

const Expenses = () => {
  const { user } = useAuth();

  // Set page title
  usePageTitle('Expenses | BudgetWise');

  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    categoryId: 1, // Default ID
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');

  // Delete Confirmation State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  // Initial load
  useEffect(() => {
    loadCategories();
    loadTransactions();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await categoryService.getCategories();
      if (cats && cats.length > 0) {
        setCategories(cats);
        setFormData(prev => ({
          ...prev,
          categoryId: cats[0].id,
          category: cats[0].name
        }));
      } else {
        const defaults = categoryService.getDefaultCategories();
        setCategories(defaults);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
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
      setError('Failed to load transactions from network.');
    } finally {
      setIsLoading(false);
    }
  };

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

    // Business Logic: Expenses cannot be added for future dates
    if (txDate > today) {
      return {
        valid: false,
        message: 'Expenses cannot be added for a future date.'
      };
    }

    // For expense transactions, check if it would make savings negative
    if (transaction.type === 'expense') {
      const checkDate = new Date(transaction.date);
      checkDate.setHours(23, 59, 59, 999);

      let currentSavings = calculateIncomeUpToDate(transactions, checkDate) -
        calculateExpensesUpToDate(transactions, checkDate);

      // If updating, add back the original amount if it was an expense
      if (isUpdate && originalTransaction && originalTransaction.type === 'expense') {
        const originalDate = new Date(originalTransaction.date);
        if (originalDate <= checkDate) {
          // Backend stores as negative, so convert to positive to add back to resource pool
          currentSavings += Math.abs(originalTransaction.amount);
        }
      }

      if (amount > currentSavings) {
        return {
          valid: false,
          message: `Insufficient balance on ${checkDate.toLocaleDateString()}. Available: $${currentSavings.toFixed(2)}.`
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

    // Create transaction object for validation
    const transaction = {
      type: 'expense',
      description: formData.description,
      amount: formData.amount,
      categoryId: formData.categoryId,
      category: formData.category,
      date: formData.date
    };

    // Validate the transaction
    const validation = validateTransaction(transaction, editingExpense ? true : false, editingExpense);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    try {
      setIsLoading(true);
      if (editingExpense) {
        // Update existing expense
        await transactionService.updateTransaction(editingExpense.id, transaction);
      } else {
        // Add new expense
        await transactionService.createTransaction(transaction);
      }
      // Refresh list
      await loadTransactions();
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save transaction:', err);
      setError(err.message || 'Failed to save transaction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    // Find matching category
    const matchedCat = categories.find(c => c.name === expense.category);

    setFormData({
      description: expense.description,
      amount: Math.abs(expense.amount).toString(), // Remove negative sign for form
      category: expense.category,
      categoryId: matchedCat ? matchedCat.id : (expense.categoryId || categories[0]?.id),
      date: expense.date
    });
    setShowModal(true);
  };

  const initiateDelete = (id) => {
    const expenseToDeleteObj = transactions.find(tx => tx.id === id);
    if (!expenseToDeleteObj) return;

    // Future validation check (same as before)
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const futureExpenses = transactions
      .filter(tx => tx.type === 'expense' && new Date(tx.date) > today);

    if (futureExpenses.length > 0) {
      const incomeUpToNow = calculateIncomeUpToDate(transactions, new Date());
      const expensesUpToNow = calculateExpensesUpToDate(transactions, new Date());
      const currentSavings = incomeUpToNow - expensesUpToNow;

      const adjustedSavings = currentSavings + Math.abs(expenseToDeleteObj.amount);

      if (adjustedSavings < futureExpenses.reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0)) {
        alert('Cannot delete this expense. Future expenses depend on current income balance.');
        return;
      }
    }

    setExpenseToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;

    try {
      setIsLoading(true);
      await transactionService.deleteTransaction(expenseToDelete);
      await loadTransactions();
      setShowDeleteModal(false);
      setExpenseToDelete(null);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      // alert('Failed to delete transaction: ' + err.message); // Could use a toast here
      setError('Failed to delete transaction: ' + err.message);
      setShowDeleteModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExpense(null);
    setFormData({
      description: '',
      amount: '',
      categoryId: categories[0]?.id || 1,
      category: categories[0]?.name || 'Food',
      date: new Date().toISOString().split('T')[0]
    });
    setError('');
  };

  // Filter only expense transactions
  const expenses = transactions.filter(tx => tx.type === 'expense');

  // Calculate current month expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthExpenses = expenses.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });

  const totalCurrentMonthExpenses = currentMonthExpenses.reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0);

  // Calculate available balance
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
  const totalExpenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + Math.abs(parseFloat(tx.amount)), 0);
  const availableBalance = totalIncome - totalExpenses;

  return (
    <Container>
      <Header>
        <div>
          <Title>Expenses</Title>
          <Subtitle>View and manage your expenses</Subtitle>
        </div>
        <div style={{ display: 'flex' }}>
          <RefreshButton onClick={loadTransactions} disabled={isLoading}>
            <FiRefreshCw className={isLoading ? 'spinning' : ''} /> {isLoading ? 'Loading...' : 'Refresh'}
          </RefreshButton>
          <Button onClick={() => setShowModal(true)}>
            <FiPlus /> Add Expense
          </Button>
        </div>
      </Header>

      <SummaryGrid>
        <SummaryCard>
          <SummaryLabel>Total Expenses (This Month)</SummaryLabel>
          <SummaryValue expense>-${totalCurrentMonthExpenses.toFixed(2)}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Number of Expenses</SummaryLabel>
          <SummaryValue>{expenses.length}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Total Balance</SummaryLabel>
          <SummaryValue>${availableBalance.toFixed(2)}</SummaryValue>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>Total Income</SummaryLabel>
          <SummaryValue>${totalIncome.toFixed(2)}</SummaryValue>
        </SummaryCard>
      </SummaryGrid>

      <ExpenseList>
        {expenses.length === 0 ? (
          <EmptyState>
            <h3>No expenses recorded yet.</h3>
            <p>Start by adding your first expense to track your spending.</p>
          </EmptyState>
        ) : (
          expenses.map(expense => (
            <ExpenseItem key={expense.id}>
              <ExpenseDetails>
                <ExpenseDescription>{expense.description}</ExpenseDescription>
                <ExpenseMeta>
                  <span>{expense.category}</span>
                  <span>{new Date(expense.date).toLocaleDateString()}</span>
                </ExpenseMeta>
              </ExpenseDetails>
              <ExpenseAmount>-${Math.abs(parseFloat(expense.amount)).toFixed(2)}</ExpenseAmount>
              <ExpenseActions>
                <ActionButton edit onClick={() => handleEdit(expense)}>
                  <FiEdit2 size={16} />
                </ActionButton>
                <ActionButton delete onClick={() => initiateDelete(expense.id)}>
                  <FiTrash2 size={16} />
                </ActionButton>
              </ExpenseActions>
            </ExpenseItem>
          ))
        )}
      </ExpenseList>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        type="danger"
        isLoading={isLoading}
      />

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{editingExpense ? 'Edit Expense' : 'Add Expense'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <FiX />
              </CloseButton>
            </ModalHeader>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Description</Label>
                <Input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter expense description"
                  required
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
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </FormGroup>

              <FormActions>
                <SecondaryButton type="button" onClick={handleCloseModal}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={isLoading}>
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </PrimaryButton>
              </FormActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Expenses;
