import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiTrendingUp, FiAlertCircle, FiCheckCircle, FiZap, FiTarget, FiAward } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';
import authService from '../services/authService';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary, #0f172a);
  margin: 0 0 0.25rem 0;
`;

const PageSubtitle = styled.p`
  color: var(--text-secondary, #64748b);
  font-size: 0.95rem;
  margin: 0;
`;

const InsightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const InsightCard = styled.div`
  background: var(--bg-secondary, white);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--border-primary, #f1f5f9);
  border-left: 4px solid ${props => props.color || '#3b82f6'};
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.1);
  }
`;

const InsightHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const InsightIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.bg || '#eff6ff'};
  color: ${props => props.color || '#3b82f6'};
  flex-shrink: 0;

  [data-theme='dark'] & {
    background: rgba(59, 130, 246, 0.1);
  }
`;

const InsightMeta = styled.div`
  flex: 1;
`;

const InsightType = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${props => props.color || '#3b82f6'};
  background: ${props => props.bg || '#eff6ff'};
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
`;

const InsightTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary, #0f172a);
  margin: 0.75rem 0 0.5rem 0;
`;

const InsightDescription = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary, #64748b);
  margin: 0;
  line-height: 1.5;
`;

const ActionButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid ${props => props.color || '#3b82f6'};
  color: ${props => props.color || '#3b82f6'};
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.color || '#3b82f6'};
    color: white;
  }
`;

const AiIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: white;
  border-radius: 2rem;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  animation: ${pulse} 2s ease-in-out infinite;

  svg {
    animation: ${pulse} 1s ease-in-out infinite;
  }
`;

const AiInsights = () => {
  usePageTitle('AI Insights | BudgetWise');

  const [insights, setInsights] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchInsights = async () => {
      try {
        const token = authService.getToken();
        const response = await fetch('http://localhost:8081/api/chat/insights', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch insights');

        const data = await response.json();
        // Ensure data is an array
        const insightsArray = Array.isArray(data) ? data : [];
        setInsights(insightsArray);
      } catch (err) {
        console.error("Error fetching insights:", err);
        setError("Could not generate insights at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const getInsightStyle = (type, sentiment) => {
    // Default styles
    let style = { icon: FiZap, color: '#3b82f6', bg: '#eff6ff' };

    const typeLower = type?.toLowerCase() || '';
    const sentimentLower = sentiment?.toLowerCase() || '';

    if (typeLower.includes('alert') || sentimentLower === 'negative') {
      style = { icon: FiAlertCircle, color: '#ef4444', bg: '#fef2f2' };
    } else if (typeLower.includes('savings') || typeLower.includes('positive') || sentimentLower === 'positive') {
      style = { icon: FiCheckCircle, color: '#10b981', bg: '#ecfdf5' };
    } else if (typeLower.includes('tip') || typeLower.includes('smart')) {
      style = { icon: FiZap, color: '#8b5cf6', bg: '#f5f3ff' };
    } else if (typeLower.includes('goal')) {
      style = { icon: FiTarget, color: '#f59e0b', bg: '#fffbeb' };
    } else if (typeLower.includes('trend')) {
      style = { icon: FiTrendingUp, color: '#3b82f6', bg: '#eff6ff' };
    }

    return style;
  };

  if (loading) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>AI Insights</PageTitle>
          <PageSubtitle>Analyzing your financial data...</PageSubtitle>
        </PageHeader>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <AiIndicator>Generating Insights...</AiIndicator>
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <PageHeader>
          <PageTitle>AI Insights</PageTitle>
        </PageHeader>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
          {error}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <AiIndicator>
          <FiZap size={16} /> AI-Powered Insights
        </AiIndicator>
        <PageTitle>AI Insights</PageTitle>
        <PageSubtitle>Personalized recommendations based on your spending patterns</PageSubtitle>
      </PageHeader>

      <InsightsGrid>
        {insights.map((insight, index) => {
          const style = getInsightStyle(insight.type, insight.sentiment);
          return (
            <InsightCard key={index} color={style.color}>
              <InsightHeader>
                <InsightIcon bg={style.bg} color={style.color}>
                  <style.icon size={24} />
                </InsightIcon>
                <InsightMeta>
                  <InsightType bg={style.bg} color={style.color}>{insight.type}</InsightType>
                  <InsightTitle>{insight.title}</InsightTitle>
                </InsightMeta>
              </InsightHeader>
              <InsightDescription>{insight.description}</InsightDescription>
            </InsightCard>
          );
        })}
      </InsightsGrid>
    </PageContainer>
  );
};

export default AiInsights;
