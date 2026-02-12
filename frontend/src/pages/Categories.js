import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit2, FiTrash2, FiShoppingCart, FiHome, FiTruck, FiFilm, FiHeart, FiCoffee, FiBook, FiGift, FiBriefcase, FiWifi, FiDroplet } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';

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

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
`;

const Tab = styled.button`
  padding: 0.625rem 1.25rem;
  border: none;
  background: ${props => props.active ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'transparent'};
  color: ${props => props.active ? 'white' : '#64748b'};
  font-weight: 500;
  font-size: 0.9rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#f1f5f9'};
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const CategoryCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.color || '#3b82f6'};
  }
`;

const CategoryIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bg || '#eff6ff'};
  color: ${props => props.color || '#3b82f6'};
  margin-bottom: 1rem;
`;

const CategoryName = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
`;

const CategoryCount = styled.p`
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0;
`;

const CategoryActions = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;

  ${CategoryCard}:hover & {
    opacity: 1;
  }
`;

const ActionBtn = styled.button`
  padding: 0.25rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;

  &:hover {
    background: #f8fafc;
    color: ${props => props.danger ? '#ef4444' : '#3b82f6'};
  }
`;

const Categories = () => {
  usePageTitle('Categories | BudgetWise');
  const [activeTab, setActiveTab] = useState('expense');

  const expenseCategories = [
    { id: 1, name: 'Shopping', icon: FiShoppingCart, count: 45, color: '#3b82f6', bg: '#eff6ff' },
    { id: 2, name: 'Housing', icon: FiHome, count: 12, color: '#8b5cf6', bg: '#f5f3ff' },
    { id: 3, name: 'Transport', icon: FiTruck, count: 28, color: '#f59e0b', bg: '#fffbeb' },
    { id: 4, name: 'Entertainment', icon: FiFilm, count: 15, color: '#ec4899', bg: '#fdf2f8' },
    { id: 5, name: 'Healthcare', icon: FiHeart, count: 8, color: '#ef4444', bg: '#fef2f2' },
    { id: 6, name: 'Food & Drinks', icon: FiCoffee, count: 62, color: '#f97316', bg: '#fff7ed' },
    { id: 7, name: 'Education', icon: FiBook, count: 5, color: '#10b981', bg: '#ecfdf5' },
    { id: 8, name: 'Gifts', icon: FiGift, count: 7, color: '#a855f7', bg: '#faf5ff' },
    { id: 9, name: 'Utilities', icon: FiWifi, count: 12, color: '#06b6d4', bg: '#ecfeff' },
    { id: 10, name: 'Bills', icon: FiDroplet, count: 24, color: '#0ea5e9', bg: '#f0f9ff' },
  ];

  const incomeCategories = [
    { id: 1, name: 'Salary', icon: FiBriefcase, count: 12, color: '#10b981', bg: '#ecfdf5' },
    { id: 2, name: 'Freelance', icon: FiBook, count: 8, color: '#3b82f6', bg: '#eff6ff' },
    { id: 3, name: 'Investments', icon: FiGift, count: 5, color: '#8b5cf6', bg: '#f5f3ff' },
    { id: 4, name: 'Gifts Received', icon: FiGift, count: 3, color: '#f59e0b', bg: '#fffbeb' },
  ];

  const categories = activeTab === 'expense' ? expenseCategories : incomeCategories;

  return (
    <PageContainer>
      <PageHeader>
        <TitleSection>
          <PageTitle>Categories</PageTitle>
          <PageSubtitle>Organize your transactions with custom categories</PageSubtitle>
        </TitleSection>
        <AddButton>
          <FiPlus size={18} /> Add Category
        </AddButton>
      </PageHeader>

      <TabsContainer>
        <Tab active={activeTab === 'expense'} onClick={() => setActiveTab('expense')}>
          Expense Categories
        </Tab>
        <Tab active={activeTab === 'income'} onClick={() => setActiveTab('income')}>
          Income Categories
        </Tab>
      </TabsContainer>

      <CategoriesGrid>
        {categories.map(category => {
          const IconComponent = category.icon;
          return (
            <CategoryCard key={category.id} color={category.color}>
              <CategoryActions>
                <ActionBtn><FiEdit2 size={14} /></ActionBtn>
                <ActionBtn danger><FiTrash2 size={14} /></ActionBtn>
              </CategoryActions>
              <CategoryIcon bg={category.bg} color={category.color}>
                <IconComponent size={24} />
              </CategoryIcon>
              <CategoryName>{category.name}</CategoryName>
              <CategoryCount>{category.count} transactions</CategoryCount>
            </CategoryCard>
          );
        })}
      </CategoriesGrid>
    </PageContainer>
  );
};

export default Categories;
