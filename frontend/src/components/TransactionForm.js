import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiX, FiDollarSign, FiCalendar, FiTag, FiFileText, FiCheck, FiArrowDown, FiArrowUp } from 'react-icons/fi';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

// --- Styled Components ---

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalCard = styled.div`
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 1.5rem;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  padding: 1.5rem 1.5rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f1f5f9;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #ef4444;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// --- Form Elements (Matching Auth Page Style) ---

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg {
    position: absolute;
    left: 1rem;
    color: #94a3b8;
    font-size: 1.1rem;
    pointer-events: none;
    transition: color 0.2s;
  }

  &:focus-within svg {
    color: #2563eb;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  color: #1e293b;
  transition: all 0.2s;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #2563eb;
    background: white;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #cbd5e1;
  }
  
  /* Type specific styling for amount */
  &[type="number"] {
    font-family: 'Inter', monospace;
    font-weight: 600;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  color: #1e293b;
  transition: all 0.2s;
  background: #f8fafc;
  appearance: none;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #2563eb;
    background: white;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }
`;

const TypeToggleContainer = styled.div`
  display: flex;
  background: #f1f5f9;
  padding: 0.25rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
`;

const TypeButton = styled.button`
  flex: 1;
  border: none;
  padding: 0.6rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  ${props => props.$active && props.$variant === 'income' && `
    background: white;
    color: #10b981;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  `}

  ${props => props.$active && props.$variant === 'expense' && `
    background: white;
    color: #ef4444;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  `}

  ${props => !props.$active && `
    background: transparent;
    color: #64748b;
    &:hover { color: #475569; }
  `}
`;

const ModalFooter = styled.div`
  padding: 1rem 1.5rem 1.5rem;
  display: flex;
  gap: 1rem;
  background: #f8fafc;
  border-top: 1px solid #f1f5f9;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
`;

const SaveButton = styled(Button)`
  background: #2563eb;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);

  &:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CancelButton = styled(Button)`
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;

  &:hover {
    background: #f1f5f9;
    color: #475569;
  }
`;

const defaultCategories = [
  { id: 1, name: 'Food' },
  { id: 2, name: 'Shopping' },
  { id: 3, name: 'Transportation' },
  { id: 4, name: 'Housing' },
  { id: 5, name: 'Entertainment' },
  { id: 6, name: 'Healthcare' },
  { id: 7, name: 'Education' },
  { id: 8, name: 'Salary' },
  { id: 9, name: 'Other Income' },
  { id: 10, name: 'Other Expense' }
];

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  border: 1px solid #fecaca;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TransactionForm = ({ transaction, initialData, onSubmit, onCancel, error, categories: propCategories }) => {
  // Use prop categories or fallback to defaults
  const categories = propCategories && propCategories.length > 0 ? propCategories : defaultCategories;

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    categoryId: categories[0]?.id || 1,
    category: categories[0]?.name || 'Food',
    date: new Date().toISOString().split('T')[0],
    type: 'expense'
  });

  const [animateClose, setAnimateClose] = useState(false);

  useEffect(() => {
    if (transaction) {
      // Find matching category by name for editing
      const matchedCat = categories.find(c => c.name === transaction.category);
      setFormData({
        description: transaction.description,
        amount: Math.abs(transaction.amount).toString(),
        categoryId: matchedCat ? matchedCat.id : (transaction.categoryId || categories[0]?.id),
        category: transaction.category,
        date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        type: transaction.type || 'expense'
      });
    } else if (initialData) {
      // Pre-fill from scanned data (New Transaction)
      // Extract amount from potentially messy scan
      let amountStr = '';
      if (initialData.amount) {
        amountStr = initialData.amount.toString();
      }

      setFormData({
        description: initialData.description || '',
        amount: amountStr,
        categoryId: categories.find(c => c.name === 'Other Expense')?.id || categories[0]?.id || 1,
        category: 'Other Expense', // Default for scanned
        date: initialData.date || new Date().toISOString().split('T')[0],
        type: initialData.type || 'expense'
      });
    }
  }, [transaction, initialData, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categoryId') {
      const selectedCategory = categories.find(c => c.id === parseInt(value));
      setFormData(prev => ({
        ...prev,
        categoryId: parseInt(value),
        category: selectedCategory?.name || prev.category
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'amount' ? value.replace(/[^0-9.]/g, '') : value
      }));
    }
  };

  const setType = (type) => {
    setFormData(prev => ({ ...prev, type }));
  };

  const handleClose = () => {
    setAnimateClose(true);
    setTimeout(onCancel, 200); // Wait for animation
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount) || 0;
    const transactionData = {
      ...formData,
      amount: formData.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
      date: formData.date || new Date().toISOString().split('T')[0],
      categoryId: formData.categoryId
    };

    if (transaction) {
      onSubmit({ ...transactionData, id: transaction.id });
    } else {
      onSubmit(transactionData);
    }
  };

  return (
    <Overlay onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <ModalCard>
        <FormGroup as="form" onSubmit={handleSubmit} style={{ gap: 0 }}>
          <ModalHeader>
            <ModalTitle>{transaction ? 'Edit Transaction' : 'Add New Transaction'}</ModalTitle>
            <CloseButton type="button" onClick={onCancel}>
              <FiX size={20} />
            </CloseButton>
          </ModalHeader>

          <ModalBody>
            {error && (
              <ErrorMessage>
                <FiX size={16} /> {error}
              </ErrorMessage>
            )}

            <TypeToggleContainer>
              <TypeButton
                type="button"
                variant="expense"
                active={formData.type === 'expense'}
                onClick={() => setType('expense')}
              >
                <FiArrowDown /> Expense
              </TypeButton>
              <TypeButton
                type="button"
                variant="income"
                active={formData.type === 'income'}
                onClick={() => setType('income')}
              >
                <FiArrowUp /> Income
              </TypeButton>
            </TypeToggleContainer>

            <FormGroup>
              <Label>Description</Label>
              <InputWrapper>
                <FiFileText />
                <Input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What is this transaction for?"
                  required
                  autoFocus
                />
              </InputWrapper>
            </FormGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormGroup>
                <Label>Amount</Label>
                <InputWrapper>
                  <FiDollarSign />
                  <Input
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </InputWrapper>
              </FormGroup>

              <FormGroup>
                <Label>Date</Label>
                <InputWrapper>
                  <FiCalendar />
                  <Input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </FormGroup>
            </div>

            <FormGroup>
              <Label>Category</Label>
              <InputWrapper>
                <FiTag />
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
                <FiArrowDown style={{ left: 'auto', right: '1rem', width: '16px', color: '#94a3b8' }} />
              </InputWrapper>
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <CancelButton type="button" onClick={onCancel}>
              Cancel
            </CancelButton>
            <SaveButton type="submit">
              {transaction ? 'Save Changes' : 'Add Transaction'}
            </SaveButton>
          </ModalFooter>
        </FormGroup>
      </ModalCard>
    </Overlay>
  );
};

export default TransactionForm;
