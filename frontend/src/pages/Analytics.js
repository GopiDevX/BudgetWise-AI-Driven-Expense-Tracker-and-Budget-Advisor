import React, { useState } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { FiTrendingUp, FiArrowUpRight, FiArrowDownRight, FiCalendar } from 'react-icons/fi';
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

const DateFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  color: #0f172a;
  font-weight: 500;
  cursor: pointer;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
`;

const StatLabel = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  margin: 0 0 0.5rem 0;
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TrendBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  background: ${props => props.positive ? '#ecfdf5' : '#fef2f2'};
  color: ${props => props.positive ? '#059669' : '#dc2626'};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
`;

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Analytics = () => {
    usePageTitle('Analytics | BudgetWise');

    const monthlyData = [
        { name: 'Jan', income: 4500, expense: 3200 },
        { name: 'Feb', income: 5200, expense: 3800 },
        { name: 'Mar', income: 4800, expense: 4100 },
        { name: 'Apr', income: 5500, expense: 3500 },
        { name: 'May', income: 6000, expense: 4200 },
        { name: 'Jun', income: 5800, expense: 3900 },
    ];

    const categoryData = [
        { name: 'Shopping', value: 35 },
        { name: 'Food', value: 25 },
        { name: 'Transport', value: 20 },
        { name: 'Bills', value: 15 },
        { name: 'Other', value: 5 },
    ];

    const trendData = [
        { name: 'Week 1', savings: 1200 },
        { name: 'Week 2', savings: 1800 },
        { name: 'Week 3', savings: 1500 },
        { name: 'Week 4', savings: 2200 },
    ];

    return (
        <PageContainer>
            <PageHeader>
                <TitleSection>
                    <PageTitle>Analytics</PageTitle>
                    <PageSubtitle>Deep dive into your financial patterns</PageSubtitle>
                </TitleSection>
                <DateFilter>
                    <FiCalendar size={16} />
                    Last 6 Months
                </DateFilter>
            </PageHeader>

            <StatsRow>
                <StatCard>
                    <StatLabel>Total Income</StatLabel>
                    <StatValue>
                        ₹31,800
                        <TrendBadge positive><FiArrowUpRight size={12} />12%</TrendBadge>
                    </StatValue>
                </StatCard>
                <StatCard>
                    <StatLabel>Total Expenses</StatLabel>
                    <StatValue>
                        ₹22,700
                        <TrendBadge><FiArrowDownRight size={12} />8%</TrendBadge>
                    </StatValue>
                </StatCard>
                <StatCard>
                    <StatLabel>Net Savings</StatLabel>
                    <StatValue>
                        ₹9,100
                        <TrendBadge positive><FiArrowUpRight size={12} />24%</TrendBadge>
                    </StatValue>
                </StatCard>
                <StatCard>
                    <StatLabel>Avg Monthly Spend</StatLabel>
                    <StatValue>₹3,783</StatValue>
                </StatCard>
            </StatsRow>

            <ChartsGrid>
                <ChartCard>
                    <ChartHeader>
                        <ChartTitle>Income vs Expenses Trend</ChartTitle>
                    </ChartHeader>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyData}>
                            <defs>
                                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#incomeGrad)" strokeWidth={2} />
                            <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#expenseGrad)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard>

                <ChartCard>
                    <ChartHeader>
                        <ChartTitle>Expense Distribution</ChartTitle>
                    </ChartHeader>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartCard>
            </ChartsGrid>

            <ChartCard>
                <ChartHeader>
                    <ChartTitle>Weekly Savings Trend</ChartTitle>
                </ChartHeader>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="savings" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>
        </PageContainer>
    );
};

export default Analytics;
