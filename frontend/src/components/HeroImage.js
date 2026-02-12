import React from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const PhoneContainer = styled.div`
  position: relative;
  width: 280px;
  height: 560px;
  background: linear-gradient(145deg, #ffffff, #f0f4ff);
  border-radius: 40px;
  box-shadow: 
    20px 20px 60px #d1d9e6,
    -20px -20px 60px #ffffff,
    inset 0 0 0 10px rgba(255, 255, 255, 0.7);
  padding: 10px;
  animation: ${float} 6s ease-in-out infinite;
  
  @media (max-width: 768px) {
    width: 240px;
    height: 480px;
    margin: 2rem auto 0;
  }
`;

const Screen = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 32px;
  overflow: hidden;
  position: relative;
`;

const StatusBar = styled.div`
  height: 24px;
  background: linear-gradient(90deg, #6366f1, #4f46e5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  color: white;
  font-size: 12px;
  font-weight: 500;
`;

const DashboardPreview = styled.div`
  padding: 16px;
  height: calc(100% - 24px);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BalanceCard = styled.div`
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border-radius: 16px;
  padding: 16px;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const BalanceLabel = styled.p`
  font-size: 12px;
  opacity: 0.9;
  margin: 0 0 8px 0;
`;

const BalanceAmount = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 16px 0;
`;

const ChartContainer = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  height: 120px;
  position: relative;
  overflow: hidden;
`;

const ChartBar = styled.div`
  position: absolute;
  bottom: 0;
  width: 12px;
  background: linear-gradient(to top, #6366f1, #a5b4fc);
  border-radius: 4px 4px 0 0;
  left: ${({ left }) => left}%;
  height: ${({ height }) => height}%;
  animation: grow 1s ease-out forwards;
  
  @keyframes grow {
    from { height: 0; }
    to { height: ${({ height }) => height}%; }
  }
`;

const Categories = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-top: 16px;
`;

const Category = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CategoryIcon = styled.div`
  width: 36px;
  height: 36px;
  background: ${({ color }) => color}20;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
  margin-bottom: 4px;
`;

const CategoryLabel = styled.span`
  font-size: 10px;
  color: #64748b;
  text-align: center;
`;

const RecentTransactions = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  padding: 12px;
  margin-top: auto;
`;

const Transaction = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TransactionIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ color }) => color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
  margin-right: 12px;
  font-size: 14px;
`;

const TransactionDetails = styled.div`
  flex: 1;
`;

const TransactionTitle = styled.p`
  font-size: 12px;
  font-weight: 500;
  margin: 0 0 2px 0;
  color: #1e293b;
`;

const TransactionCategory = styled.p`
  font-size: 10px;
  color: #94a3b8;
  margin: 0;
`;

const TransactionAmount = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ type }) => (type === 'expense' ? '#ef4444' : '#10b981')};
`;

const HeroImage = () => {
  const categories = [
    { icon: '🍔', label: 'Food', color: '#f59e0b' },
    { icon: '🛒', label: 'Shopping', color: '#3b82f6' },
    { icon: '🚕', label: 'Transport', color: '#8b5cf6' },
    { icon: '🏠', label: 'Home', color: '#10b981' },
  ];

  const transactions = [
    { id: 1, title: 'Grocery Store', category: 'Food', amount: 42.50, type: 'expense', icon: '🛒', color: '#3b82f6' },
    { id: 2, title: 'Uber Ride', category: 'Transport', amount: 15.30, type: 'expense', icon: '🚕', color: '#8b5cf6' },
  ];

  const chartData = [30, 50, 70, 40, 60, 45, 80];
  const maxHeight = Math.max(...chartData);

  return (
    <PhoneContainer>
      <Screen>
        <StatusBar>
          <span>9:41</span>
          <span>BudgetWise</span>
          <span>100%</span>
        </StatusBar>
        <DashboardPreview>
          <BalanceCard>
            <BalanceLabel>Total Balance</BalanceLabel>
            <BalanceAmount>$4,250.75</BalanceAmount>
            <ChartContainer>
              {chartData.map((value, index) => (
                <ChartBar
                  key={index}
                  left={20 + index * 12}
                  height={(value / maxHeight) * 100}
                />
              ))}
            </ChartContainer>
            <Categories>
              {categories.map((category) => (
                <Category key={category.label}>
                  <CategoryIcon color={category.color}>
                    {category.icon}
                  </CategoryIcon>
                  <CategoryLabel>{category.label}</CategoryLabel>
                </Category>
              ))}
            </Categories>
          </BalanceCard>
          
          <RecentTransactions>
            {transactions.map((tx) => (
              <Transaction key={tx.id}>
                <TransactionIcon color={tx.color}>
                  {tx.icon}
                </TransactionIcon>
                <TransactionDetails>
                  <TransactionTitle>{tx.title}</TransactionTitle>
                  <TransactionCategory>{tx.category}</TransactionCategory>
                </TransactionDetails>
                <TransactionAmount type={tx.type}>
                  {tx.type === 'expense' ? '-' : '+'}${tx.amount.toFixed(2)}
                </TransactionAmount>
              </Transaction>
            ))}
          </RecentTransactions>
        </DashboardPreview>
      </Screen>
    </PhoneContainer>
  );
};

export default HeroImage;
