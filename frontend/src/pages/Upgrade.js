import React, { useState } from 'react';
import styled from 'styled-components';
import { FiCheck, FiZap, FiStar, FiAward } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
`;

const PageSubtitle = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin: 0 0 1.5rem 0;
`;

const ToggleContainer = styled.div`
  display: inline-flex;
  background: #f1f5f9;
  border-radius: 2rem;
  padding: 0.25rem;
`;

const ToggleButton = styled.button`
  padding: 0.625rem 1.5rem;
  border: none;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#0f172a' : '#64748b'};
  font-weight: 500;
  font-size: 0.9rem;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${props => props.active ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'};
`;

const SaveBadge = styled.span`
  background: #10b981;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  margin-left: 0.5rem;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: stretch;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }
`;

const PricingCard = styled.div`
  background: ${props => props.featured ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)' : 'white'};
  border-radius: 1.5rem;
  padding: 2rem;
  position: relative;
  box-shadow: ${props => props.featured ? '0 20px 40px -8px rgba(139, 92, 246, 0.4)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)'};
  border: 1px solid ${props => props.featured ? 'transparent' : '#f1f5f9'};
  transform: ${props => props.featured ? 'scale(1.05)' : 'scale(1)'};
  color: ${props => props.featured ? 'white' : '#0f172a'};

  @media (max-width: 1024px) {
    transform: scale(1);
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 0.375rem 1rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
`;

const PlanIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.featured ? 'rgba(255,255,255,0.2)' : props.bg || '#f1f5f9'};
  color: ${props => props.featured ? 'white' : props.color || '#64748b'};
  margin-bottom: 1.25rem;
`;

const PlanName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`;

const PlanDescription = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0 0 1.5rem 0;
`;

const PriceContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const Price = styled.span`
  font-size: 2.5rem;
  font-weight: 800;
`;

const Period = styled.span`
  font-size: 0.9rem;
  opacity: 0.7;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  opacity: ${props => props.disabled ? 0.4 : 1};
`;

const CheckIcon = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.featured ? 'rgba(255,255,255,0.2)' : '#ecfdf5'};
  color: ${props => props.featured ? 'white' : '#10b981'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CTAButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  border-radius: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: ${props => props.featured ? 'none' : '1px solid #e2e8f0'};
  background: ${props => props.featured ? 'white' : 'transparent'};
  color: ${props => props.featured ? '#6366f1' : '#0f172a'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.15);
  }
`;

const Upgrade = () => {
  usePageTitle('Upgrade | BudgetWise');
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Free',
      description: 'Basic tracking to get started',
      price: isYearly ? 0 : 0,
      icon: FiZap,
      iconBg: '#f1f5f9',
      iconColor: '#64748b',
      features: [
        { text: 'Up to 3 accounts', enabled: true },
        { text: 'Manual expense entry', enabled: true },
        { text: 'Basic categories', enabled: true },
        { text: 'Monthly summaries', enabled: true },
        { text: 'Limited AI insights (5/month)', enabled: true },
        { text: 'Email support', enabled: false },
      ]
    },
    {
      name: 'Pro',
      description: 'Everything for smarter money management',
      price: isYearly ? 2990 : 299,
      icon: FiStar,
      featured: true,
      features: [
        { text: 'Unlimited accounts', enabled: true },
        { text: 'Automatic categorization', enabled: true },
        { text: 'AI budget recommendations', enabled: true },
        { text: 'Real-time alerts', enabled: true },
        { text: 'Unlimited AI insights', enabled: true },
        { text: 'Priority support', enabled: true },
      ]
    },
    {
      name: 'Premium',
      description: 'Ultimate AI-powered financial control',
      price: isYearly ? 6990 : 699,
      icon: FiAward,
      iconBg: '#fffbeb',
      iconColor: '#f59e0b',
      features: [
        { text: 'Everything in Pro', enabled: true },
        { text: 'Unlimited AI receipt scanning', enabled: true },
        { text: 'Spending predictions & forecasting', enabled: true },
        { text: 'Custom automation rules', enabled: true },
        { text: 'Goal tracking with milestones', enabled: true },
        { text: 'Dedicated account manager', enabled: true },
      ]
    }
  ];

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Upgrade Your Plan</PageTitle>
        <PageSubtitle>Unlock powerful AI features, unlimited accounts, and smarter insights</PageSubtitle>
        <ToggleContainer>
          <ToggleButton active={!isYearly} onClick={() => setIsYearly(false)}>
            Monthly
          </ToggleButton>
          <ToggleButton active={isYearly} onClick={() => setIsYearly(true)}>
            Yearly <SaveBadge>Save 20%</SaveBadge>
          </ToggleButton>
        </ToggleContainer>
      </PageHeader>

      <PricingGrid>
        {plans.map((plan, idx) => (
          <PricingCard key={idx} featured={plan.featured}>
            {plan.featured && <PopularBadge>✨ Most Popular</PopularBadge>}
            <PlanIcon featured={plan.featured} bg={plan.iconBg} color={plan.iconColor}>
              <plan.icon size={24} />
            </PlanIcon>
            <PlanName>{plan.name}</PlanName>
            <PlanDescription>{plan.description}</PlanDescription>
            <PriceContainer>
              <Price>₹{plan.price.toLocaleString()}</Price>
              <Period>/{isYearly ? 'year' : 'month'}</Period>
            </PriceContainer>
            <FeatureList>
              {plan.features.map((feature, fIdx) => (
                <Feature key={fIdx} disabled={!feature.enabled}>
                  <CheckIcon featured={plan.featured}>
                    <FiCheck size={12} />
                  </CheckIcon>
                  {feature.text}
                </Feature>
              ))}
            </FeatureList>
            <CTAButton featured={plan.featured}>
              {plan.price === 0 ? 'Current Plan' : 'Upgrade Now'}
            </CTAButton>
          </PricingCard>
        ))}
      </PricingGrid>
    </PageContainer>
  );
};

export default Upgrade;
