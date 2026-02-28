import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import styled, { keyframes } from 'styled-components';
import { FiLock, FiEye, FiEyeOff, FiMail, FiKey, FiShield, FiCheckCircle, FiTrendingUp, FiActivity, FiDollarSign } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';
import authService from '../services/authService';

// --- Animations ---
const fadeInScale = keyframes`
  from { opacity: 0; transform: scale(0.98) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const float1 = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
`;

const float2 = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-30px, 50px) scale(1.15); }
  66% { transform: translate(20px, -20px) scale(0.85); }
  100% { transform: translate(0, 0) scale(1); }
`;

const float3 = keyframes`
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, 40px) scale(0.9); }
  66% { transform: translate(-40px, -40px) scale(1.1); }
  100% { transform: translate(0, 0) scale(1); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const cardFloat = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0); }
`;

// --- Layout Controls ---
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: radial-gradient(circle at center, #ffffff 0%, #eef4ff 100%);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  overflow: hidden;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 40px,
      rgba(37, 99, 235, 0.03) 40px,
      rgba(37, 99, 235, 0.03) 41px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 40px,
      rgba(37, 99, 235, 0.03) 40px,
      rgba(37, 99, 235, 0.03) 41px
    );
    pointer-events: none;
    z-index: 0;
  }
`;

// Left Panel (Visuals)
const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  position: relative;
  overflow: hidden;

  /* Blurred Blobs */
  &::before, &::after {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    filter: blur(100px);
    z-index: 0;
  }

  &::before {
    background: rgba(147, 197, 253, 0.15); /* Light Blue */
    top: -100px;
    left: -100px;
    animation: ${float1} 18s ease-in-out infinite;
  }

  &::after {
    background: rgba(192, 132, 252, 0.1); /* Soft Purple */
    bottom: 10%;
    right: -100px;
    animation: ${float2} 24s ease-in-out infinite;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Blob3 = styled.div`
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(100px);
  background: rgba(34, 211, 238, 0.08); /* Subtle Cyan */
  top: 40%;
  left: 30%;
  animation: ${float3} 20s ease-in-out infinite;
  z-index: 0;
  pointer-events: none;
`;

const IllustrationWrapper = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 500px;
  animation: ${slideUp} 1s ease-out;
`;

const TextContent = styled.div`
  text-align: left;
  margin-top: 3rem;
  z-index: 10;
  animation: ${slideUp} 1s ease-out 0.2s both;

  h1 {
    font-size: 2.75rem;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 1rem;
    letter-spacing: -0.03em;
  }

  p {
    font-size: 1.125rem;
    color: #475569;
    max-width: 400px;
    line-height: 1.6;
  }
`;

// AI Finance Abstract Mockup
const MockupCard = styled.div`
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 
    0 25px 50px -12px rgba(37, 99, 235, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  position: relative;
  overflow: hidden;
`;

const MockupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  .badge {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: white;
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

const MockupChart = styled.div`
  height: 120px;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  
  .bar {
    flex: 1;
    background: linear-gradient(to top, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.5));
    border-radius: 8px 8px 0 0;
    position: relative;
    overflow: hidden;
    
    &.active {
      background: linear-gradient(to top, #3b82f6, #2563eb);
    }
  }
`;

const FloatingElement = styled.div`
  position: absolute;
  background: white;
  color: #0f172a;
  padding: 0.875rem 1.25rem;
  border-radius: 16px;
  box-shadow: 0 15px 35px -5px rgba(37, 99, 235, 0.15);
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 12;
  animation: ${floatAnimation} 6s ease-in-out infinite;
  animation-delay: ${props => props.$delay || '0s'};
  border: 1px solid rgba(241, 245, 249, 1);

  .icon-wrapper {
    background: ${props => props.$iconBg || '#eff6ff'};
    color: ${props => props.$iconColor || '#2563eb'};
    width: 32px;
    height: 32px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// Right Panel (Auth Form)
const RightPanel = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  z-index: 10;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(37, 99, 235, 0.08); /* Subtle border */
  border-radius: 20px;
  box-shadow: 0 30px 60px rgba(37, 99, 235, 0.15);
  padding: 3.5rem 3rem;
  width: 100%;
  max-width: 460px;
  animation: ${fadeInScale} 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  
  &:hover {
    animation: ${cardFloat} 8s ease-in-out infinite;
  }

  @media (max-width: 640px) {
    padding: 2.5rem 2rem;
    box-shadow: 0 20px 40px rgba(37, 99, 235, 0.1);
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
  svg { width: 22px; height: 22px; }
`;

const LogoText = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
`;

const WelcomeText = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 400;
  margin: 0 0 2rem 0;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  
  &:focus-within svg {
    color: #2563eb;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
  display: flex;
  align-items: center;
  
  svg {
    width: 1.125rem;
    height: 1.125rem;
    transition: color 0.3s ease;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.875rem;
  background: #ffffff;
  border: 1px solid ${props => props.$hasError ? '#ef4444' : '#e2e8f0'};
  border-radius: 14px;
  font-size: 0.95rem;
  color: #0f172a;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 4px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.15)'};
    transform: scale(1.01);
  }
  
  &::placeholder {
    color: #94a3b8;
    font-weight: 400;
  }
`;

const FieldError = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.375rem;
  display: block;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  
  svg {
    width: 1.125rem;
    height: 1.125rem;
    transition: color 0.3s ease;
  }
  
  &:hover svg {
    color: #475569;
  }
`;

const ForgotText = styled(Link)`
  display: inline-block;
  margin-top: 0.5rem;
  text-align: right;
  color: #2563eb;
  font-size: 0.875rem;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;

  &:hover {
    color: #1d4ed8;
  }
`;

const TermsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const CheckboxInput = styled.input`
  margin-top: 0.25rem;
  cursor: pointer;
  accent-color: #2563eb;
  width: 1rem;
  height: 1rem;
`;

const TermsText = styled.label`
  font-size: 0.875rem;
  color: #64748b;
  cursor: pointer;
  line-height: 1.4;

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 0.5rem;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }

  &:focus:not(:active)::after {
    animation: ripple 1s ease-out;
  }
  
  @keyframes ripple {
    0% { transform: scale(0, 0); opacity: 0.5; }
    20% { transform: scale(25, 25); opacity: 0.5; }
    100% { opacity: 0; transform: scale(40, 40); }
  }

  &:hover {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35), 0 0 15px rgba(37, 99, 235, 0.2);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const TrustBadges = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1.5rem;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
  
  div {
    display: flex;
    align-items: center;
    gap: 0.375rem;
  }
  
  svg {
    color: #10b981;
    width: 14px;
    height: 14px;
  }
`;

const Spinner = styled.div`
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  vertical-align: middle;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const GradientDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, 
      rgba(226, 232, 240, 0), 
      rgba(226, 232, 240, 1), 
      rgba(226, 232, 240, 0)
    );
  }
  
  &::before { margin-right: 1rem; }
  &::after { margin-left: 1rem; }
`;

const SignUpPrompt = styled.p`
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 1.5rem;
`;

const SignUpLink = styled(Link)`
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.25rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.875rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1.25rem;
  text-align: center;
`;

const ResendLink = styled.button`
  background: none;
  border: none;
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
  
  &:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }
  
  &:disabled {
    color: #94a3b8;
    cursor: not-allowed;
    text-decoration: none;
  }
`;

const OtpContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const OtpBox = styled.input`
  width: 50px;
  height: 55px;
  padding: 0;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  background: #ffffff;
  color: #0f172a;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
    transform: scale(1.05);
  }

  &::placeholder {
    color: #cbd5e1;
    font-weight: 400;
    font-size: 1rem;
  }
`;

const Login = () => {
  // Set page title
  usePageTitle('Login | BudgetWise');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [termsError, setTermsError] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: initial, 2: password verified, 3: OTP verified
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const resendInterval = useRef(null);
  const navigate = useNavigate();
  const { setUserAuthenticated, loginWithGoogle } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Google authentication failed');
      console.error('Google login error:', err);
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In was unsuccessful. Please try again.');
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    setEmailError('');
    setPasswordError('');
    setOtpError('');
    setTermsError('');
    setError('');

    let hasValidationError = false;

    if (!email) {
      setEmailError('Email is required');
      hasValidationError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email');
      hasValidationError = true;
    }

    if (step === 1 && !password) {
      setPasswordError('Password is required');
      hasValidationError = true;
    }

    if (step === 1 && !agreeToTerms) {
      setTermsError('You must agree to the Terms of Service and Privacy Policy');
      hasValidationError = true;
    }

    if (step === 2 && !otp) {
      setOtpError('OTP is required');
      hasValidationError = true;
    } else if (step === 2 && otp.length < 6) {
      setOtpError('OTP must be 6 digits');
      hasValidationError = true;
    }

    if (hasValidationError) {
      return;
    }

    try {
      setMessage('');
      setLoading(true);

      let result;
      if (step === 1) {
        // Step 1: Verify password and send OTP
        const loginResp = await authService.loginUser(email, password);
        // backend verification is successful if it returns the logged-in user profile
        if (loginResp && loginResp.email) {
          // Password verified, send OTP (backend sends asynchronously)
          try {
            await authService.requestLoginOtp(email);
            // start resend countdown
            setResendTimer(60);
            if (resendInterval.current) clearInterval(resendInterval.current);
            resendInterval.current = setInterval(() => {
              setResendTimer((s) => {
                if (s <= 1) { clearInterval(resendInterval.current); return 0; }
                return s - 1;
              });
            }, 1000);
            setStep(2);
            setShowOtpInput(true);
            setMessage('OTP has been sent to your email');
          } catch (mailErr) {
            // Mail failed, but password was valid - show friendly error
            if (mailErr.message && mailErr.message.includes('temporary')) {
              setError('Mail server is temporarily unavailable. Please try again in a moment.');
            } else if (mailErr.message && mailErr.message.includes('internet')) {
              setError('Connection issue. Please check your internet and try again.');
            } else {
              setError('Unable to send OTP. Please verify your email and try again.');
            }
            console.error('Mail error:', mailErr);
          }
        } else {
          setError('Invalid email or password');
        }
      } else if (step === 2) {
        // Step 2: Verify OTP and complete login
        result = await authService.verifyLoginOtp(email, otp);
        if (result && result.token) {
          // OTP verified, login successful
          const token = result.token;
          localStorage.setItem('budgetwise_token', token);
          const user = JSON.parse(atob(token.split('.')[1]));
          localStorage.setItem('budgetwise_user', JSON.stringify(user));
          // update AuthContext so ProtectedRoute recognizes authenticated user
          setUserAuthenticated(user);
          navigate('/dashboard');
        } else {
          setError('Invalid OTP');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setEmailError('Please enter your email address');
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    try {
      setError('');
      setMessage('');
      setLoading(true);
      await authService.requestLoginOtp(email);
      setMessage('OTP has been resent to your email');
      // restart resend timer
      setResendTimer(60);
      if (resendInterval.current) clearInterval(resendInterval.current);
      resendInterval.current = setInterval(() => {
        setResendTimer((s) => {
          if (s <= 1) { clearInterval(resendInterval.current); return 0; }
          return s - 1;
        });
      }, 1000);
    } catch (err) {
      // Handle mail errors gracefully
      if (err.message && err.message.includes('temporary')) {
        setError('Mail server is temporarily unavailable. Please try again in a moment.');
      } else if (err.message && err.message.includes('internet')) {
        setError('Connection issue. Please check your internet and try again.');
      } else {
        setError(err.message || 'Failed to resend OTP. Please try again.');
      }
      console.error('Resend OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => { if (resendInterval.current) clearInterval(resendInterval.current); };
  }, []);

  return (
    <Container>
      <Blob3 />
      <LeftPanel>
        <IllustrationWrapper>
          <FloatingElement top="-20px" left="-30px" $delay="0s" style={{ top: '-10%', left: '-10%' }}>
            <div className="icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <FiTrendingUp />
            </div>
            +24.5% Growth
          </FloatingElement>

          <FloatingElement bottom="-20px" right="-30px" $delay="1.5s" style={{ bottom: '-10%', right: '-10%' }}>
            <div className="icon-wrapper" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
              <FiActivity />
            </div>
            Smart Insights
          </FloatingElement>

          <MockupCard>
            <MockupHeader>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>Expense Overview</div>
              <div className="badge">
                <FiCheckCircle size={12} /> AI Powered
              </div>
            </MockupHeader>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
              $14,230<span style={{ fontSize: '1rem', color: '#64748b' }}>.50</span>
            </div>
            <MockupChart>
              {[40, 60, 45, 80, 50, 90, 65].map((height, i) => (
                <div
                  key={i}
                  className={`bar ${i === 5 ? 'active' : ''}`}
                  style={{ height: `${height}%`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </MockupChart>
          </MockupCard>
        </IllustrationWrapper>

        <TextContent>
          <h1>Track smarter.<br />Save better.<br />Grow faster.</h1>
          <p>Experience the next generation of personal finance. BudgetWise uses state-of-the-art AI to auto-categorize, analyze, and optimize your wealth.</p>
        </TextContent>
      </LeftPanel>

      <RightPanel>
        <LoginCard>
          <Logo>
            <LogoIcon>
              <FiDollarSign />
            </LogoIcon>
            <LogoText>BudgetWise</LogoText>
          </Logo>

          <WelcomeText>
            {step === 1 && 'Welcome back'}
            {step === 2 && 'Verify your identity'}
          </WelcomeText>
          <Subtitle>
            {step === 1 && 'Enter your credentials to access your account.'}
            {step === 2 && 'Enter the OTP sent to your email.'}
          </Subtitle>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {message && <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            color: '#166534',
            padding: '0.875rem',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: 500,
            marginBottom: '1.25rem',
            textAlign: 'center'
          }}>{message}</div>}

          <Form onSubmit={handleContinue} noValidate>
            <FormGroup>
              <Label htmlFor="email">Email address</Label>
              <InputWrapper>
                <InputIcon style={{ color: emailError ? '#dc2626' : undefined }}>
                  <FiMail />
                </InputIcon>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(''); }}
                  placeholder="name@company.com"
                  autoFocus
                  disabled={step !== 1}
                  $hasError={!!emailError}
                />
              </InputWrapper>
              {emailError && <FieldError>{emailError}</FieldError>}
            </FormGroup>

            {step === 1 && (
              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <InputWrapper>
                  <InputIcon style={{ color: passwordError ? '#dc2626' : undefined }}>
                    <FiLock />
                  </InputIcon>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError(''); }}
                    placeholder="Enter your password"
                    $hasError={!!passwordError}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </InputWrapper>
                {passwordError && <FieldError>{passwordError}</FieldError>}
                <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                  <ForgotText to="/forgot-password">Forgot password?</ForgotText>
                </div>
              </FormGroup>
            )}

            {step === 2 && (
              <FormGroup>
                <Label htmlFor="otp">One-Time Password</Label>
                <InputWrapper>
                  <InputIcon style={{ color: otpError ? '#dc2626' : undefined }}>
                    <FiKey />
                  </InputIcon>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value); if (otpError) setOtpError(''); }}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    $hasError={!!otpError}
                  />
                </InputWrapper>
                {otpError && <FieldError>{otpError}</FieldError>}
              </FormGroup>
            )}

            {step === 1 && (
              <>
                <TermsContainer>
                  <CheckboxInput
                    type="checkbox"
                    id="terms"
                    checked={agreeToTerms}
                    onChange={(e) => {
                      setAgreeToTerms(e.target.checked);
                      if (termsError) setTermsError('');
                    }}
                  />
                  <TermsText htmlFor="terms">
                    I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                  </TermsText>
                </TermsContainer>
                {termsError && <FieldError style={{ marginTop: '-0.5rem', marginLeft: '1.5rem' }}>{termsError}</FieldError>}
              </>
            )}

            <LoginButton type="submit" disabled={loading}>
              {loading ? (<><Spinner />&nbsp;&nbsp;Processing...</>) : 'Continue'}
            </LoginButton>

            {step === 1 && (
              <TrustBadges>
                <div><FiShield /> Secure Login</div>
                <div><FiCheckCircle /> 256-bit Encrypted</div>
              </TrustBadges>
            )}
          </Form>

          {step === 2 && (
            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <ResendLink type="button" onClick={handleResendOtp} disabled={resendTimer > 0}>
                {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend Code'}
              </ResendLink>
            </div>
          )}

          <GradientDivider>or log in with</GradientDivider>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              shape="rectangular"
              theme="outline"
              text="continue_with"
              size="large"
            />
          </div>

          <SignUpPrompt>
            Don't have an account? <SignUpLink to="/register">Sign up</SignUpLink>
          </SignUpPrompt>
        </LoginCard>
      </RightPanel>
    </Container>
  );
};

export default Login;
