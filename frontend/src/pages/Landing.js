import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled, { keyframes, css } from 'styled-components';
import { FiArrowRight, FiCheck, FiBarChart2, FiSmartphone, FiLock, FiShield, FiClock, FiDatabase } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';
import ParticleWaveBackground from '../components/ParticleWaveBackground';

// Styled components
// Animation
const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(60px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeInUpDelayed = keyframes`
  0% {
    opacity: 0;
    transform: translateY(60px);
  }
  35% {
    opacity: 0;
    transform: translateY(60px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: radial-gradient(ellipse at center, #f8fafc 0%, #f0f9ff 50%, #e0f2fe 100%);
  padding: 100px 0;
  overflow: hidden;
  position: relative;
  isolation: isolate;

  /* Remove the static background generic effect if we want the particles to be the main star, 
     but keeping a subtle gradient is nice. */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 80% 50%, rgba(99, 102, 241, 0.03) 0%, transparent 50%);
    z-index: -1;
  }
`;


const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const HeroContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 4rem;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  letter-spacing: -0.05em;
  background: linear-gradient(to right, #0f172a, #4f46e5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  max-width: 90%;
  
  @media (max-width: 1024px) {
    font-size: 3rem;
    max-width: 100%;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
  
  @media (max-width: 640px) {
    font-size: 2.5rem;
    line-height: 1.2;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #475569;
  max-width: 500px;
  margin: 0 0 2.5rem 0;
  line-height: 1.7;
  opacity: 0.9;
  font-weight: 400;
  
  @media (max-width: 1024px) {
    margin: 0 auto 2.5rem;
    text-align: center;
    max-width: 600px;
    padding: 0 1rem;
  }
  
  @media (max-width: 640px) {
    font-size: 1.1rem;
  }
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px -3px rgba(79, 70, 229, 0.3);
  position: relative;
  overflow: hidden;
  z-index: 1;
  border: none;
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
    
    &::before {
      width: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px -3px rgba(79, 70, 229, 0.2);
  }
  
  @media (max-width: 1024px) {
    margin: 0 auto;
    display: flex;
  }
`;

const HeroText = styled.div`
  max-width: 600px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 1024px) {
    margin: 0 auto;
    text-align: center;
    padding: 0 1rem;
  }
`;

const DeviceContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 600px;
  margin-top: -20px;
  
  @media (max-width: 1024px) {
    min-height: 500px;
    margin-top: 0;
  }
`;

const LaptopMockup = styled.div`
  position: relative;
  width: 93%;
  max-width: 780px;
  height: auto;
  background: #1e293b;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 
    0 20px 40px -8px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  animation: ${fadeInUp} 0.65s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: #475569;
    border-radius: 2px;
    z-index: 10;
  }
  
  @media (max-width: 1024px) {
    width: 95%;
    max-width: 650px;
  }
`;

const LaptopScreen = styled.div`
  width: 100%;
  height: 400px;
  background: white;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const LaptopHeader = styled.div`
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LaptopContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  overflow: hidden;
`;

const PhoneOverlay = styled.div`
  position: absolute;
  bottom: 30px;
  right: 8%;
  width: 170px;
  height: 340px;
  background: #1e293b;
  border-radius: 24px;
  padding: 8px;
  box-shadow: 
    0 10px 24px -6px rgba(0, 0, 0, 0.15),
    0 0 0 1px rgba(0, 0, 0, 0.06);
  animation: ${fadeInUpDelayed} 0.65s ease-out;
  z-index: 5;
  
  &::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 4px;
    background: #475569;
    border-radius: 2px;
    z-index: 10;
  }
  
  @media (max-width: 1024px) {
    width: 140px;
    height: 280px;
    bottom: 20px;
    right: 5%;
  }
`;

const PhoneScreenOverlay = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const PhoneHeaderOverlay = styled.div`
  padding: 0.75rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: #0f172a;
`;

const PhoneContentOverlay = styled.div`
  flex: 1;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DashboardCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  
  ${props => props.primary && `
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    border: none;
  `}
`;

const CardTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${props => props.primary ? 'rgba(255, 255, 255, 0.9)' : '#64748b'};
`;

const CardValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.primary ? 'white' : '#0f172a'};
`;

const MiniChart = styled.div`
  height: 60px;
  margin-top: 0.5rem;
  display: flex;
  align-items: end;
  gap: 4px;
`;

const ChartBar = styled.div`
  flex: 1;
  background: ${props => props.primary ? 'rgba(255, 255, 255, 0.3)' : '#4f46e5'};
  border-radius: 2px;
  height: ${props => props.height}%;
`;

const TransactionItemSmall = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 0.75rem;
`;

const PhoneBalanceCard = styled.div`
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
`;

const PhoneBalanceLabel = styled.div`
  font-size: 0.625rem;
  opacity: 0.9;
`;

const PhoneBalanceAmount = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 1.25rem;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid #f1f5f9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    border-color: #e2e8f0;
  }
`;

const FeatureIcon = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  background: ${props => props.color}20;
  color: ${props => props.color};
  font-size: 1.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.75rem;
`;

const FeatureDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
  margin: 0;
`;

const CtaSection = styled.section`
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 6rem 1.5rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54 20H40v-6h6V8h6v6h6v6zm-12-6h-6V8h6v6zm-6 0h-6V8h6v6zm-6 0h-6V8h6v6zm-6 0h-6V8h6v6z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.5;
  }
`;

const CtaContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const CtaTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  
  @media (max-width: 640px) {
    font-size: 2rem;
  }
`;

const CtaText = styled.p`
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto 2.5rem;
  opacity: 0.9;
  line-height: 1.6;
  
  @media (max-width: 640px) {
    font-size: 1.1rem;
  }
`;

const CtaButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: white;
  color: #4f46e5;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }
  
  &:hover svg {
    transform: translateX(4px);
  }
`;

const TrustBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  margin: 0.5rem;
  backdrop-filter: blur(5px);
  
  svg {
    margin-right: 0.5rem;
  }
`;

const TrustBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const Footer = styled.footer`
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 4rem 0 2rem 0;
  margin-top: 4rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  }
`;

const FooterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
  z-index: 1;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterLogo = styled.div`
  font-size: 1.75rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
`;

const FooterTagline = styled.p`
  color: #cbd5e1;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  max-width: 300px;
`;

const FooterDescription = styled.p`
  color: #94a3b8;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 1rem 0 0 0;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FooterLink = styled(Link)`
  color: #cbd5e1;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: inline-block;
  
  &:hover {
    color: #60a5fa;
    transform: translateX(2px);
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const FooterCopyright = styled.p`
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 0;
`;

const FooterNote = styled.p`
  color: #64748b;
  font-size: 0.8rem;
  margin: 0;
`;

const FooterTrust = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #cbd5e1;
  font-size: 0.875rem;
`;

const TrustIcon = styled.span`
  color: #60a5fa;
`;

const FeaturesSection = styled.section`
  padding: 6rem 0;
  background-color: white;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 3rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const Landing = () => {
  const { user, isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Set page title
  usePageTitle('BudgetWise | Smart Money Management');

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <>
      <HeroSection>
        <ParticleWaveBackground />
        <Container>
          <HeroContent>
            <HeroText>
              <Title>Track your money anywhere.<br />Analyze it everywhere.</Title>
              <Subtitle>
                Take control of your finances with real-time tracking, beautiful visualizations,
                and powerful budgeting tools all in one place.
              </Subtitle>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Button to={isAuthenticated ? '/dashboard' : '/register'}>
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                </Button>
                <Button
                  as="a"
                  href="#features"
                  style={{
                    background: 'white',
                    color: '#4f46e5',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                >
                  See how it works
                </Button>
              </div>
              <TrustBadges>
                <TrustBadge><FiCheck /> No credit card required</TrustBadge>
                <TrustBadge><FiLock /> Data stays local</TrustBadge>
              </TrustBadges>
              <div style={{
                marginTop: '1rem',
                fontSize: '0.875rem',
                color: '#64748b',
                textAlign: 'center',
                opacity: 0.8
              }}>
                Real-time calculations
              </div>
            </HeroText>

            <DeviceContainer>
              <LaptopMockup>
                <LaptopScreen>
                  <LaptopHeader>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>BudgetWise Dashboard</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Real-time Analytics</div>
                  </LaptopHeader>
                  <LaptopContent>
                    <DashboardCard primary>
                      <CardTitle primary>Total Balance</CardTitle>
                      <CardValue primary>$4,250.00</CardValue>
                      <MiniChart>
                        <ChartBar primary height="40" />
                        <ChartBar primary height="60" />
                        <ChartBar primary height="45" />
                        <ChartBar primary height="80" />
                        <ChartBar primary height="65" />
                        <ChartBar primary height="90" />
                        <ChartBar primary height="75" />
                      </MiniChart>
                    </DashboardCard>
                    <DashboardCard>
                      <CardTitle>Monthly Income</CardTitle>
                      <CardValue>$3,200</CardValue>
                      <MiniChart>
                        <ChartBar height="70" />
                        <ChartBar height="85" />
                        <ChartBar height="60" />
                        <ChartBar height="90" />
                        <ChartBar height="75" />
                        <ChartBar height="95" />
                        <ChartBar height="80" />
                      </MiniChart>
                    </DashboardCard>
                    <DashboardCard>
                      <CardTitle>Monthly Expenses</CardTitle>
                      <CardValue>$1,850</CardValue>
                      <MiniChart>
                        <ChartBar height="50" />
                        <ChartBar height="65" />
                        <ChartBar height="45" />
                        <ChartBar height="70" />
                        <ChartBar height="55" />
                        <ChartBar height="60" />
                        <ChartBar height="40" />
                      </MiniChart>
                    </DashboardCard>
                    <DashboardCard>
                      <CardTitle>Savings Rate</CardTitle>
                      <CardValue>42%</CardValue>
                      <MiniChart>
                        <ChartBar height="30" />
                        <ChartBar height="45" />
                        <ChartBar height="35" />
                        <ChartBar height="50" />
                        <ChartBar height="40" />
                        <ChartBar height="55" />
                        <ChartBar height="45" />
                      </MiniChart>
                    </DashboardCard>
                  </LaptopContent>
                </LaptopScreen>
              </LaptopMockup>

              <PhoneOverlay>
                <PhoneScreenOverlay>
                  <PhoneHeaderOverlay>
                    <div>BudgetWise</div>
                    <div>•••</div>
                  </PhoneHeaderOverlay>
                  <PhoneContentOverlay>
                    <PhoneBalanceCard>
                      <PhoneBalanceLabel>Total Balance</PhoneBalanceLabel>
                      <PhoneBalanceAmount>$4,250</PhoneBalanceAmount>
                    </PhoneBalanceCard>
                    <TransactionItemSmall>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.7rem' }}>Salary</div>
                        <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Today</div>
                      </div>
                      <div style={{ color: '#16a34a', fontWeight: 600 }}>+$3,200</div>
                    </TransactionItemSmall>
                    <TransactionItemSmall>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.7rem' }}>Shopping</div>
                        <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>Yesterday</div>
                      </div>
                      <div style={{ color: '#dc2626', fontWeight: 600 }}>-$86</div>
                    </TransactionItemSmall>
                    <TransactionItemSmall>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: '0.7rem' }}>Dining</div>
                        <div style={{ fontSize: '0.6rem', color: '#94a3b8' }}>2 days ago</div>
                      </div>
                      <div style={{ color: '#dc2626', fontWeight: 600 }}>-$32</div>
                    </TransactionItemSmall>
                  </PhoneContentOverlay>
                </PhoneScreenOverlay>
              </PhoneOverlay>
            </DeviceContainer>
          </HeroContent>
        </Container>
      </HeroSection>

      <FeaturesSection id="features" style={{ padding: '6rem 0' }}>
        <Container>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: '#0f172a',
                marginBottom: '1rem',
                lineHeight: 1.2
              }}
            >
              Everything you need to manage your money
            </h2>
            <p
              style={{
                color: '#64748b',
                fontSize: '1.25rem',
                lineHeight: 1.6,
                margin: '0 auto',
                maxWidth: '600px'
              }}
            >
              BudgetWise combines powerful features with an intuitive interface to help you take control of your finances.
            </p>
          </div>

          <FeatureGrid>
            <FeatureCard>
              <FeatureIcon color="#4f46e5">
                <FiBarChart2 size={24} />
              </FeatureIcon>
              <FeatureTitle>Track Spending</FeatureTitle>
              <FeatureDescription>
                Monitor your expenses and income with beautiful, easy-to-understand visualizations that update in real-time.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon color="#10b981">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>Budget Smarter</FeatureTitle>
              <FeatureDescription>
                Set monthly budgets and get alerts when you're approaching your limits. Make informed financial decisions.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard>
              <FeatureIcon color="#8b5cf6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </FeatureIcon>
              <FeatureTitle>Achieve Goals</FeatureTitle>
              <FeatureDescription>
                Set and track financial goals. Whether it's saving for a vacation or paying off debt, we've got you covered.
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </Container>
      </FeaturesSection>

      <CtaSection>
        <CtaContainer>
          <CtaTitle>Ready to take control of your finances?</CtaTitle>
          <CtaText>
            Join thousands of users who trust BudgetWise to manage their money better. It's free to get started.
          </CtaText>
          <CtaButton to={isAuthenticated ? '/dashboard' : '/register'}>
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started for Free'}
            <FiArrowRight />
          </CtaButton>
          <TrustBadges>
            <TrustBadge><FiLock /> Bank-level security</TrustBadge>
            <TrustBadge><FiCheck /> No credit card required</TrustBadge>
            <TrustBadge>✨ Free forever</TrustBadge>
          </TrustBadges>
        </CtaContainer>
      </CtaSection>

      <Footer>
        <FooterContainer>
          <FooterGrid>
            <FooterBrand>
              <FooterLogo>BudgetWise</FooterLogo>
              <FooterTagline>
                Smart money management made simple.
              </FooterTagline>
              <FooterDescription>
                Take control of your finances with real-time tracking, beautiful visualizations, and powerful budgeting tools.
              </FooterDescription>
            </FooterBrand>

            <FooterSection>
              <FooterTitle>Product</FooterTitle>
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/dashboard">Dashboard</FooterLink>
              <FooterLink to="/expenses">Expenses</FooterLink>
              <FooterLink to="/faq">FAQ</FooterLink>
            </FooterSection>

            <FooterSection>
              <FooterTitle>Features</FooterTitle>
              <FooterLink to="#features">Real-time Analytics</FooterLink>
              <FooterLink to="#features">Budget Tracking</FooterLink>
              <FooterLink to="#features">Financial Insights</FooterLink>
              <FooterLink to="#features">Secure & Private</FooterLink>
            </FooterSection>

            <FooterSection>
              <FooterTitle>Trust</FooterTitle>
              <TrustItem>
                <TrustIcon><FiShield /></TrustIcon>
                Bank-level Security
              </TrustItem>
              <TrustItem>
                <TrustIcon><FiClock /></TrustIcon>
                Real-time Updates
              </TrustItem>
              <TrustItem>
                <TrustIcon><FiDatabase /></TrustIcon>
                Local-first Data
              </TrustItem>
            </FooterSection>
          </FooterGrid>

          <FooterBottom>
            <div>
              <FooterCopyright>
                © 2026 Budgetwise. All rights reserved.
              </FooterCopyright>
              <FooterNote>
                Built for learning & demonstration purposes.
              </FooterNote>
            </div>
            <FooterTrust>
              <TrustItem>
                <TrustIcon><FiLock /></TrustIcon>
                Privacy-first
              </TrustItem>
              <TrustItem>
                <TrustIcon><FiCheck /></TrustIcon>
                Always Free
              </TrustItem>
            </FooterTrust>
          </FooterBottom>
        </FooterContainer>
      </Footer>
    </>
  );
};

export default Landing;
