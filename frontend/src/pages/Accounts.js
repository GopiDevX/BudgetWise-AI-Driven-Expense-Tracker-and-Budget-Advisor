import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlus, FiCreditCard, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';
import accountService from '../services/accountService';
import { useCurrency } from '../contexts/CurrencyContext';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const TitleSection = styled.div``;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
`;

const PageSubtitle = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px -2px rgba(37, 99, 235, 0.3);
  }
`;

const SummarySection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const SummaryCard = styled.div`
  background: ${props => props.gradient || 'white'};
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.light ? 'transparent' : '#f1f5f9'};
`;

const SummaryLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.light ? 'rgba(255, 255, 255, 0.9)' : '#64748b'};
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const SummaryValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.light ? 'white' : '#0f172a'};
`;

const AccountsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const AccountCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const AccountIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.gradient || 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'};
  color: white;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #94a3b8;
  border-radius: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: ${props => props.danger ? '#ef4444' : '#3b82f6'};
  }
`;

const AccountName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
`;

const AccountType = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1rem;
  text-transform: capitalize;
`;

const BalanceSection = styled.div`
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
`;

const BalanceLabel = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
`;

const BalanceAmount = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
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
  border-radius: 1rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #94a3b8;
  border-radius: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
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
  font-weight: 600;
  color: #0f172a;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
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
  border-radius: 0.5rem;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${props => props.primary && `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
  `}

  ${props => props.secondary && `
    background: #f1f5f9;
    color: #64748b;

    &:hover {
      background: #e2e8f0;
    }
  `}
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #64748b;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
`;

const EmptyStateText = styled.p`
  font-size: 0.95rem;
  margin: 0 0 1.5rem 0;
`;

const Accounts = () => {
  usePageTitle('Accounts | BudgetWise');
  const { format: formatCurrency, symbol: currencySymbol } = useCurrency();

  const [accounts, setAccounts] = useState([]);
  const [summary, setSummary] = useState({ totalAssets: 0, totalLiabilities: 0, netWorth: 0 });
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    accountName: '',
    accountType: 'SAVINGS',
    balance: '',
    currency: 'INR'
  });

  useEffect(() => {
    loadAccounts();
    loadSummary();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await accountService.getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Failed to load accounts:', error);
      setError('Failed to load accounts');
    }
  };

  const loadSummary = async () => {
    try {
      const data = await accountService.getAccountSummary();
      setSummary(data);
    } catch (error) {
      console.error('Failed to load summary:', error);
    }
  };

  const handleOpenModal = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        accountName: account.accountName,
        accountType: account.accountType,
        balance: account.balance.toString(),
        currency: account.currency
      });
    } else {
      setEditingAccount(null);
      setFormData({
        accountName: '',
        accountType: 'SAVINGS',
        balance: '',
        currency: 'INR'
      });
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAccount(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const accountData = {
        accountName: formData.accountName,
        accountType: formData.accountType,
        balance: parseFloat(formData.balance) || 0,
        currency: formData.currency
      };

      if (editingAccount) {
        await accountService.updateAccount(editingAccount.id, accountData);
      } else {
        await accountService.createAccount(accountData);
      }

      await loadAccounts();
      await loadSummary();
      handleCloseModal();
    } catch (error) {
      setError(editingAccount ? 'Failed to update account' : 'Failed to create account');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountService.deleteAccount(id);
        await loadAccounts();
        await loadSummary();
      } catch (error) {
        setError('Failed to delete account');
      }
    }
  };

  const getAccountGradient = (type) => {
    const gradients = {
      SAVINGS: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      CURRENT: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      CASH: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      CREDIT: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      DEBIT: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    };
    return gradients[type] || gradients.SAVINGS;
  };

  return (
    <PageContainer>
      <PageHeader>
        <TitleSection>
          <PageTitle>Accounts</PageTitle>
          <PageSubtitle>Manage your bank accounts and wallets</PageSubtitle>
        </TitleSection>
        <AddButton onClick={() => handleOpenModal()}>
          <FiPlus size={18} /> Add Account
        </AddButton>
      </PageHeader>

      <SummarySection>
        <SummaryCard gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" light>
          <SummaryLabel light>Net Worth</SummaryLabel>
          <SummaryValue>{formatCurrency(summary.netWorth)}</SummaryValue>
        </SummaryCard>
        <SummaryCard gradient="linear-gradient(135deg, #10b981 0%, #059669 100%)" light>
          <SummaryLabel light>Total Assets</SummaryLabel>
          <SummaryValue>{formatCurrency(summary.totalAssets)}</SummaryValue>
        </SummaryCard>
        <SummaryCard gradient="linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" light>
          <SummaryLabel light>Total Liabilities</SummaryLabel>
          <SummaryValue>{formatCurrency(summary.totalLiabilities)}</SummaryValue>
        </SummaryCard>
      </SummarySection>

      {accounts.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No accounts yet</EmptyStateTitle>
          <EmptyStateText>Get started by adding your first account</EmptyStateText>
          <AddButton onClick={() => handleOpenModal()}>
            <FiPlus size={18} /> Add Your First Account
          </AddButton>
        </EmptyState>
      ) : (
        <AccountsGrid>
          {accounts.map(account => (
            <AccountCard key={account.id}>
              <CardHeader>
                <AccountIcon gradient={getAccountGradient(account.accountType)}>
                  <FiCreditCard size={24} />
                </AccountIcon>
                <CardActions>
                  <IconButton onClick={() => handleOpenModal(account)}>
                    <FiEdit2 size={18} />
                  </IconButton>
                  <IconButton danger onClick={() => handleDelete(account.id)}>
                    <FiTrash2 size={18} />
                  </IconButton>
                </CardActions>
              </CardHeader>
              <AccountName>{account.accountName}</AccountName>
              <AccountType>{account.accountType.toLowerCase()}</AccountType>
              <BalanceSection>
                <BalanceLabel>Current Balance</BalanceLabel>
                <BalanceAmount>
                  {formatCurrency(account.balance)}
                </BalanceAmount>
              </BalanceSection>
            </AccountCard>
          ))}
        </AccountsGrid>
      )}

      {showModal && (
        <Modal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>{editingAccount ? 'Edit Account' : 'Add New Account'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>
                <FiX size={24} />
              </CloseButton>
            </ModalHeader>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Account Name</Label>
                <Input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  placeholder="e.g., HDFC Salary Account"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Account Type</Label>
                <Select
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                  required
                >
                  <option value="SAVINGS">Savings</option>
                  <option value="CURRENT">Current</option>
                  <option value="CASH">Cash</option>
                  <option value="CREDIT">Credit</option>
                  <option value="DEBIT">Debit</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Balance</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Currency</Label>
                <Select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  required
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </Select>
              </FormGroup>

              <ButtonGroup>
                <Button type="button" secondary onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit" primary>
                  {editingAccount ? 'Update Account' : 'Add Account'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default Accounts;
