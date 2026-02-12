import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiUser, FiBell, FiShield, FiCreditCard, FiGlobe, FiMoon, FiCamera, FiSave, FiLogOut, FiTarget } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import budgetService from '../services/budgetService';
import categoryService from '../services/categoryService';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

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

const SettingsLayout = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  height: fit-content;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
`;

const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: none;
  background: ${props => props.active ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' : 'transparent'};
  color: ${props => props.active ? '#2563eb' : '#64748b'};
  font-size: 0.9rem;
  font-weight: ${props => props.active ? '600' : '500'};
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' : '#f8fafc'};
  }
`;

const ContentArea = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1.5rem 0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const AvatarSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  position: relative;
`;

const CameraButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  border: 2px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
    color: #3b82f6;
  }
`;

const AvatarInfo = styled.div``;

const AvatarTitle = styled.p`
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
`;

const AvatarSubtitle = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Toggle = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const ToggleInfo = styled.div``;

const ToggleTitle = styled.p`
  font-weight: 500;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
`;

const ToggleDescription = styled.p`
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
`;

const ToggleSwitch = styled.div`
  width: 48px;
  height: 28px;
  background: ${props => props.active ? '#3b82f6' : '#e2e8f0'};
  border-radius: 14px;
  position: relative;
  transition: all 0.2s;

  &::after {
    content: '';
    position: absolute;
    width: 22px;
    height: 22px;
    background: white;
    border-radius: 50%;
    top: 3px;
    left: ${props => props.active ? '23px' : '3px'};
    transition: all 0.2s;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px -4px rgba(37, 99, 235, 0.4);
  }
`;

const DangerButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 1px solid #ef4444;
  border-radius: 0.75rem;
  color: #ef4444;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fef2f2;
  }
`;

const Settings = () => {
  usePageTitle('Settings | BudgetWise');
  const { user } = useAuth();
  const { currency, setCurrency, currencies } = useCurrency();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false,
    marketing: false
  });
  const [darkMode, setDarkMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [budgetLimits, setBudgetLimits] = useState({});
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [isSavingBudgets, setIsSavingBudgets] = useState(false);
  const [budgetMessage, setBudgetMessage] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(currency);
  const [currencySaveMessage, setCurrencySaveMessage] = useState('');

  // Sync selectedCurrency with context currency when it changes
  useEffect(() => {
    setSelectedCurrency(currency);
  }, [currency]);

  // Load categories and budget status on mount
  useEffect(() => {
    const loadBudgetData = async () => {
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats);

        const status = await budgetService.getBudgetStatus();
        setBudgetStatus(status);

        // Initialize budget limits from existing budgets
        const limits = {};
        status.forEach(b => {
          if (b.categoryId) {
            limits[b.categoryId] = b.limitAmount;
          }
        });
        setBudgetLimits(limits);
      } catch (error) {
        console.error('Failed to load budget data:', error);
      }
    };
    loadBudgetData();
  }, []);

  const handleBudgetChange = (categoryId, value) => {
    setBudgetLimits(prev => ({
      ...prev,
      [categoryId]: value
    }));
  };

  const saveBudgets = async () => {
    setIsSavingBudgets(true);
    setBudgetMessage('');
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    try {
      for (const [categoryId, limit] of Object.entries(budgetLimits)) {
        if (limit && parseFloat(limit) > 0) {
          await budgetService.saveBudget({
            categoryId: parseInt(categoryId),
            limitAmount: parseFloat(limit),
            month,
            year
          });
        }
      }
      // Refresh status
      const status = await budgetService.getBudgetStatus();
      setBudgetStatus(status);
      setBudgetMessage('Budgets saved successfully!');
    } catch (error) {
      setBudgetMessage('Failed to save budgets: ' + error.message);
    } finally {
      setIsSavingBudgets(false);
    }
  };

  const getBudgetStatusForCategory = (categoryId) => {
    return budgetStatus.find(b => b.categoryId === categoryId);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'budget', label: 'Budget Goals', icon: FiTarget },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'billing', label: 'Billing', icon: FiCreditCard },
    { id: 'preferences', label: 'Preferences', icon: FiGlobe },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <>
            <SectionTitle>Profile Settings</SectionTitle>
            <AvatarSection>
              <Avatar>
                {user?.name?.charAt(0) || 'U'}
                <CameraButton><FiCamera size={14} /></CameraButton>
              </Avatar>
              <AvatarInfo>
                <AvatarTitle>Profile Picture</AvatarTitle>
                <AvatarSubtitle>PNG, JPG up to 5MB</AvatarSubtitle>
              </AvatarInfo>
            </AvatarSection>
            <FormRow>
              <FormGroup>
                <Label>First Name</Label>
                <Input type="text" defaultValue={user?.name?.split(' ')[0] || ''} />
              </FormGroup>
              <FormGroup>
                <Label>Last Name</Label>
                <Input type="text" defaultValue={user?.name?.split(' ')[1] || ''} />
              </FormGroup>
            </FormRow>
            <FormGroup>
              <Label>Email Address</Label>
              <Input type="email" defaultValue={user?.email || ''} />
            </FormGroup>
            <FormGroup>
              <Label>Phone Number</Label>
              <Input type="tel" placeholder="+91 XXXXX XXXXX" />
            </FormGroup>
            <SaveButton><FiSave size={16} /> Save Changes</SaveButton>
          </>
        );
      case 'budget':
        return (
          <>
            <SectionTitle>Monthly Budget Goals</SectionTitle>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
              Set spending limits for each category. You'll get alerts when approaching or exceeding your budgets.
            </p>
            {budgetMessage && (
              <div style={{
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                borderRadius: '0.5rem',
                background: budgetMessage.includes('success') ? '#dcfce7' : '#fef2f2',
                color: budgetMessage.includes('success') ? '#166534' : '#dc2626'
              }}>
                {budgetMessage}
              </div>
            )}
            {categories.map(category => {
              const status = getBudgetStatusForCategory(category.id);
              const percentage = status?.percentage || 0;
              const spent = status?.spent || 0;
              const statusLevel = status?.status || 'under';

              return (
                <div key={category.id} style={{
                  marginBottom: '1rem',
                  padding: '1rem',
                  background: '#f8fafc',
                  borderRadius: '0.75rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 500, color: '#0f172a' }}>{category.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#64748b', fontSize: '0.85rem' }}>₹</span>
                      <input
                        type="number"
                        placeholder="0"
                        value={budgetLimits[category.id] || ''}
                        onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                        style={{
                          width: '100px',
                          padding: '0.5rem',
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.5rem',
                          textAlign: 'right'
                        }}
                      />
                    </div>
                  </div>
                  {status && (
                    <>
                      <div style={{
                        height: '8px',
                        background: '#e2e8f0',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginBottom: '0.25rem'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min(percentage, 100)}%`,
                          background: budgetService.getStatusColor(statusLevel),
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                        <span>₹{spent.toFixed(0)} spent</span>
                        <span style={{ color: budgetService.getStatusColor(statusLevel) }}>
                          {budgetService.getStatusIcon(statusLevel)} {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            <SaveButton onClick={saveBudgets} disabled={isSavingBudgets}>
              <FiSave size={16} /> {isSavingBudgets ? 'Saving...' : 'Save Budgets'}
            </SaveButton>
          </>
        );
      case 'notifications':
        return (
          <>
            <SectionTitle>Notification Preferences</SectionTitle>
            <Toggle onClick={() => setNotifications(n => ({ ...n, email: !n.email }))}>
              <ToggleInfo>
                <ToggleTitle>Email Notifications</ToggleTitle>
                <ToggleDescription>Receive transaction alerts via email</ToggleDescription>
              </ToggleInfo>
              <ToggleSwitch active={notifications.email} />
            </Toggle>
            <Toggle onClick={() => setNotifications(n => ({ ...n, push: !n.push }))}>
              <ToggleInfo>
                <ToggleTitle>Push Notifications</ToggleTitle>
                <ToggleDescription>Get real-time alerts on your device</ToggleDescription>
              </ToggleInfo>
              <ToggleSwitch active={notifications.push} />
            </Toggle>
            <Toggle onClick={() => setNotifications(n => ({ ...n, weekly: !n.weekly }))}>
              <ToggleInfo>
                <ToggleTitle>Weekly Reports</ToggleTitle>
                <ToggleDescription>Receive weekly spending summaries</ToggleDescription>
              </ToggleInfo>
              <ToggleSwitch active={notifications.weekly} />
            </Toggle>
            <Toggle onClick={() => setNotifications(n => ({ ...n, marketing: !n.marketing }))}>
              <ToggleInfo>
                <ToggleTitle>Marketing Emails</ToggleTitle>
                <ToggleDescription>Receive tips and product updates</ToggleDescription>
              </ToggleInfo>
              <ToggleSwitch active={notifications.marketing} />
            </Toggle>
            <SaveButton><FiSave size={16} /> Save Preferences</SaveButton>
          </>
        );
      case 'security':
        return (
          <>
            <SectionTitle>Security Settings</SectionTitle>
            <FormGroup>
              <Label>Current Password</Label>
              <Input type="password" placeholder="Enter current password" />
            </FormGroup>
            <FormGroup>
              <Label>New Password</Label>
              <Input type="password" placeholder="Enter new password" />
            </FormGroup>
            <FormGroup>
              <Label>Confirm New Password</Label>
              <Input type="password" placeholder="Confirm new password" />
            </FormGroup>
            <SaveButton><FiSave size={16} /> Update Password</SaveButton>
          </>
        );
      case 'preferences':
        return (
          <>
            <SectionTitle>App Preferences</SectionTitle>
            <Toggle onClick={() => setDarkMode(!darkMode)}>
              <ToggleInfo>
                <ToggleTitle>Dark Mode</ToggleTitle>
                <ToggleDescription>Switch to dark theme</ToggleDescription>
              </ToggleInfo>
              <ToggleSwitch active={darkMode} />
            </Toggle>
            <FormGroup>
              <Label>Currency</Label>
              <Input
                as="select"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
              >
                {Object.values(currencies).map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.name} ({curr.code})
                  </option>
                ))}
              </Input>
            </FormGroup>
            {currencySaveMessage && (
              <div style={{
                padding: '0.75rem 1rem',
                marginBottom: '1rem',
                borderRadius: '0.5rem',
                background: currencySaveMessage.includes('success') ? '#dcfce7' : '#fef2f2',
                color: currencySaveMessage.includes('success') ? '#166534' : '#dc2626'
              }}>
                {currencySaveMessage}
              </div>
            )}
            <FormGroup>
              <Label>Language</Label>
              <Input as="select" defaultValue="en">
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
              </Input>
            </FormGroup>
            <SaveButton onClick={async () => {
              try {
                await setCurrency(selectedCurrency);
                setCurrencySaveMessage('Currency preference saved successfully!');
                setTimeout(() => setCurrencySaveMessage(''), 3000);
              } catch (error) {
                setCurrencySaveMessage('Failed to save currency preference');
              }
            }}><FiSave size={16} /> Save Preferences</SaveButton>
          </>
        );
      case 'billing':
        return (
          <>
            <SectionTitle>Billing & Subscription</SectionTitle>
            <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
              <p style={{ fontWeight: '600', color: '#0f172a', margin: '0 0 0.25rem 0' }}>Current Plan: Free</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Upgrade to unlock premium features</p>
            </div>
            <DangerButton><FiLogOut size={16} /> Cancel Subscription</DangerButton>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
        <PageSubtitle>Manage your account and preferences</PageSubtitle>
      </PageHeader>

      <SettingsLayout>
        <Sidebar>
          {tabs.map(tab => (
            <NavItem
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
            </NavItem>
          ))}
        </Sidebar>
        <ContentArea>
          {renderContent()}
        </ContentArea>
      </SettingsLayout>
    </PageContainer>
  );
};

export default Settings;
