import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FiCheck, FiZap, FiStar, FiAward, FiCreditCard, FiLock, FiShield, FiX, FiCheckCircle, FiLoader, FiAlertCircle, FiCalendar } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.75rem 0;
  letter-spacing: -0.02em;
`;

const PageSubtitle = styled.p`
  color: #64748b;
  font-size: 1.125rem;
  margin: 0 0 2rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ToggleContainer = styled.div`
  display: inline-flex;
  background: #f1f5f9;
  border-radius: 2rem;
  padding: 0.375rem;
  border: 1px solid #e2e8f0;
`;

const ToggleButton = styled.button`
  padding: 0.625rem 1.75rem;
  border: none;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#0f172a' : '#64748b'};
  font-weight: 600;
  font-size: 0.9rem;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => props.active ? '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' : 'none'};

  &:hover {
    color: #0f172a;
  }
`;

const SaveBadge = styled.span`
  background: #10b981;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.625rem;
  border-radius: 1rem;
  margin-left: 0.5rem;
  text-transform: uppercase;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  align-items: stretch;
  animation: ${fadeIn} 0.5s ease-out 0.2s both;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 450px;
    margin: 0 auto;
  }
`;

const PricingCard = styled.div`
  background: ${props => props.featured ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'white'};
  border-radius: 2rem;
  padding: 2.5rem;
  position: relative;
  box-shadow: ${props => props.featured ? '0 25px 50px -12px rgba(79, 70, 229, 0.35)' : '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)'};
  border: 1px solid ${props => props.featured ? 'transparent' : '#f1f5f9'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: ${props => props.featured ? 'white' : '#0f172a'};
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${props => props.featured ? '0 30px 60px -12px rgba(79, 70, 229, 0.45)' : '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'};
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 4px 6px -1px rgba(217, 119, 6, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

const PlanIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.featured ? 'rgba(255,255,255,0.15)' : props.bg || '#f8fafc'};
  color: ${props => props.featured ? 'white' : props.color || '#64748b'};
  margin-bottom: 1.5rem;
  backdrop-filter: blur(8px);
`;

const PlanName = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.01em;
`;

const PlanDescription = styled.p`
  font-size: 0.95rem;
  opacity: 0.8;
  margin: 0 0 2rem 0;
  line-height: 1.5;
`;

const PriceContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
`;

const Price = styled.span`
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
`;

const Period = styled.span`
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.7;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2.5rem 0;
  flex: 1;
`;

const Feature = styled.li`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  opacity: ${props => props.disabled ? 0.4 : 1};
  font-weight: 500;
`;

const CheckIcon = styled.span`
  width: 22px;
  height: 22px;
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
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  border: ${props => props.featured ? 'none' : '2px solid #e2e8f0'};
  background: ${props => {
    if (props.current) return '#f1f5f9';
    return props.featured ? 'white' : 'transparent';
  }};
  color: ${props => {
    if (props.current) return '#94a3b8';
    return props.featured ? '#4f46e5' : '#0f172a';
  }};
  pointer-events: ${props => props.current ? 'none' : 'auto'};

  &:hover {
    ${props => !props.current && css`
      transform: translateY(-2px);
      background: ${props.featured ? '#f8fafc' : '#f8fafc'};
      border-color: ${!props.featured && '#cbd5e1'};
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    `}
  }
`;

// Payment Modal Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  width: 100%;
  max-width: 480px;
  border-radius: 2rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
`;

const ModalHeader = styled.div`
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
`;

const CloseButton = styled.button`
  background: #f8fafc;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const PaymentSummary = styled.div`
  background: #f8fafc;
  padding: 1.25rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  border: 1px solid #f1f5f9;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  &:last-child { margin-bottom: 0; }
`;

const SummaryLabel = styled.span`
  color: #64748b;
  font-size: 0.9rem;
`;

const SummaryValue = styled.span`
  color: #0f172a;
  font-weight: 700;
  font-size: 0.9rem;
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
  font-weight: 600;
  color: #334155;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  color: #94a3b8;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 2px solid #f1f5f9;
  border-radius: 0.875rem;
  font-size: 0.95rem;
  transition: all 0.2s;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    background: white;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
  }
`;

const CardRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const PayButton = styled.button`
  width: 100%;
  padding: 1.125rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecureBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.8rem;
  margin-top: 1.5rem;
`;

// OTP Specific Styles
const OtpGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.75rem;
  margin: 1.5rem 0;
`;

const OtpInput = styled.input`
  width: 100%;
  height: 56px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  border: 2px solid #f1f5f9;
  border-radius: 0.75rem;
  background: #f8fafc;
  &:focus {
    outline: none;
    border-color: #4f46e5;
    background: white;
  }
`;

const ResultOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 2rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

const ResultTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 1.5rem 0 0.5rem;
`;

const ResultText = styled.p`
  color: #64748b;
  margin-bottom: 2rem;
`;

const Upgrade = () => {
  usePageTitle('Upgrade | BudgetWise');
  const { currentUser, setUserAuthenticated } = useAuth();
  const [isYearly, setIsYearly] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentStep, setPaymentStep] = useState(1); // 1: Card, 2: OTP, 3: Success
  const [isProcessing, setIsProcessing] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  const plans = [
    {
      name: 'Free',
      id: 'FREE',
      description: 'Basic tracking for personal use',
      price: 0,
      icon: FiZap,
      iconBg: '#f8fafc',
      iconColor: '#64748b',
      features: [
        { text: 'Up to 3 accounts', enabled: true },
        { text: 'Manual expense entry', enabled: true },
        { text: 'Basic categories', enabled: true },
        { text: 'Monthly summaries', enabled: true },
        { text: 'Limited AI insights', enabled: true },
        { text: 'Priority support', enabled: false },
      ]
    },
    {
      name: 'Pro',
      id: 'PRO',
      description: 'Everything for smarter management',
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
      id: 'PREMIUM',
      description: 'Ultimate AI-powered control',
      price: isYearly ? 6990 : 699,
      icon: FiAward,
      iconBg: '#fffbeb',
      iconColor: '#f59e0b',
      features: [
        { text: 'Everything in Pro', enabled: true },
        { text: 'AI receipt scanning', enabled: true },
        { text: 'Spending predictions', enabled: true },
        { text: 'Custom automation rules', enabled: true },
        { text: 'Goal tracking', enabled: true },
        { text: 'Account manager', enabled: true },
      ]
    }
  ];

  const handleUpgradeClick = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
    setPaymentStep(1);
    setError('');
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment gateway connection
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep(2);
    }, 2000);
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerifyOtp = async () => {
    setIsProcessing(true);
    setError('');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For demo, "123456" is the valid OTP
    const otpValue = otp.join('');
    if (otpValue === '123456') {
      try {
        const token = authService.getToken();
        const response = await fetch('http://localhost:8081/api/subscription/upgrade', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plan: selectedPlan.id,
            period: isYearly ? 'YEARLY' : 'MONTHLY',
            paymentMethod: 'CARD',
            transactionId: 'TXN_' + Math.random().toString(36).substring(7).toUpperCase()
          }),
        });

        if (!response.ok) throw new Error('Failed to update subscription');

        const result = await response.json();

        // Update local auth context with new token
        localStorage.setItem('budgetwise_token', result.token);
        const updatedUser = authService.decodeJWT(result.token);
        localStorage.setItem('budgetwise_user', JSON.stringify(updatedUser));
        setUserAuthenticated(updatedUser);

        setPaymentStep(3);
      } catch (err) {
        setError('System error. Please try again later.');
      }
    } else {
      setError('Invalid OTP. Use 123456 for demo.');
    }
    setIsProcessing(false);
  };

  const closeModal = () => {
    if (isProcessing) return;
    setShowModal(false);
    setPaymentStep(1);
    setOtp(['', '', '', '', '', '']);
    setSelectedPlan(null);
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Upgrade Your Plan</PageTitle>
        <PageSubtitle>Gain full control over your finances with advanced AI analysis and unlimited tracking capabilities.</PageSubtitle>
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
        {plans.map((plan) => (
          <PricingCard key={plan.id} featured={plan.featured}>
            {plan.featured && <PopularBadge>✨ Most Popular</PopularBadge>}
            <PlanIcon featured={plan.featured} bg={plan.iconBg} color={plan.iconColor}>
              <plan.icon size={28} />
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
                    <FiCheck size={14} />
                  </CheckIcon>
                  {feature.text}
                </Feature>
              ))}
            </FeatureList>
            <CTAButton
              featured={plan.featured}
              current={currentUser?.subscriptionPlan === plan.id}
              onClick={() => handleUpgradeClick(plan)}
            >
              {currentUser?.subscriptionPlan === plan.id ? 'Active Plan' : (plan.price === 0 ? 'Current Plan' : 'Get Started')}
            </CTAButton>
          </PricingCard>
        ))}
      </PricingGrid>

      {showModal && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {paymentStep === 1 && 'Secure Checkout'}
                {paymentStep === 2 && 'Payment Authentication'}
                {paymentStep === 3 && 'Payment Successful'}
              </ModalTitle>
              <CloseButton onClick={closeModal} disabled={isProcessing}>
                <FiX size={20} />
              </CloseButton>
            </ModalHeader>

            <ModalBody>
              {paymentStep === 1 && (
                <>
                  <PaymentSummary>
                    <SummaryRow>
                      <SummaryLabel>Plan Name</SummaryLabel>
                      <SummaryValue>{selectedPlan.name} ({isYearly ? 'Yearly' : 'Monthly'})</SummaryValue>
                    </SummaryRow>
                    <SummaryRow>
                      <SummaryLabel>Amount due today</SummaryLabel>
                      <SummaryValue>₹{selectedPlan.price.toLocaleString()}</SummaryValue>
                    </SummaryRow>
                  </PaymentSummary>

                  <Form onSubmit={handlePaymentSubmit}>
                    <FormGroup>
                      <Label>Card Number</Label>
                      <InputWrapper>
                        <InputIcon><FiCreditCard /></InputIcon>
                        <Input type="text" placeholder="XXXX XXXX XXXX XXXX" required defaultValue="4242 4242 4242 4242" />
                      </InputWrapper>
                    </FormGroup>
                    <CardRow>
                      <FormGroup>
                        <Label>Expiry Date</Label>
                        <InputWrapper>
                          <InputIcon><FiCalendar /></InputIcon>
                          <Input type="text" placeholder="MM/YY" required defaultValue="12/28" style={{ paddingLeft: '2.75rem' }} />
                        </InputWrapper>
                      </FormGroup>
                      <FormGroup>
                        <Label>CVV</Label>
                        <InputWrapper>
                          <InputIcon><FiLock /></InputIcon>
                          <Input type="password" placeholder="XXX" required defaultValue="123" style={{ paddingLeft: '2.75rem' }} />
                        </InputWrapper>
                      </FormGroup>
                    </CardRow>
                    <PayButton type="submit" disabled={isProcessing}>
                      {isProcessing ? <FiLoader className="spinning" /> : <><FiShield /> Pay ₹{selectedPlan.price.toLocaleString()}</>}
                    </PayButton>
                  </Form>
                  <SecureBadge>
                    <FiLock size={12} /> Secure 256-bit SSL Encrypted Payment
                  </SecureBadge>
                </>
              )}

              {paymentStep === 2 && (
                <div style={{ textAlign: 'center' }}>
                  <FiShield size={48} color="#4f46e5" style={{ marginBottom: '1.5rem' }} />
                  <p style={{ fontWeight: 600, margin: 0 }}>Step Up Authentication</p>
                  <p style={{ color: '#64748b', fontSize: '0.9rem' }}>We've sent a 6-digit code to your registered device.</p>

                  <OtpGrid>
                    {otp.map((digit, idx) => (
                      <OtpInput
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={e => handleOtpChange(idx, e.target.value)}
                        required
                      />
                    ))}
                  </OtpGrid>

                  {error && <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}><FiAlertCircle size={14} /> {error}</p>}

                  <PayButton onClick={handleVerifyOtp} disabled={isProcessing}>
                    {isProcessing ? <FiLoader className="spinning" /> : 'Verify & Pay'}
                  </PayButton>
                  <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                    Validating your payment for {selectedPlan.name} Plan
                  </p>
                </div>
              )}

              {paymentStep === 3 && (
                <ResultOverlay>
                  <div style={{ position: 'relative' }}>
                    <FiCheckCircle size={80} color="#10b981" />
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, animation: `${shimmer} 2s linear infinite`, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)', borderRadius: '50%' }} />
                  </div>
                  <ResultTitle>Account Upgraded!</ResultTitle>
                  <ResultText>
                    Your subscription to <strong>{selectedPlan.name}</strong> is now active.
                    You can now enjoy all the exclusive AI features and unlimited accounts.
                  </ResultText>
                  <CTAButton featured onClick={closeModal}>Go to Dashboard</CTAButton>
                </ResultOverlay>
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default Upgrade;
