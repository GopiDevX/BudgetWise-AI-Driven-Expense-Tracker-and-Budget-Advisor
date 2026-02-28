import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import styled, { keyframes, css } from 'styled-components';
import { FiLock, FiEye, FiEyeOff, FiMail, FiUser, FiCheckCircle, FiShield, FiTrendingUp, FiActivity, FiDollarSign, FiAlertCircle, FiKey } from 'react-icons/fi';
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
    background: rgba(147, 197, 253, 0.2); /* Light Blue */
    top: -100px;
    left: -100px;
    animation: ${float1} 14s ease-in-out infinite;
  }

  &::after {
    background: rgba(192, 132, 252, 0.15); /* Soft Purple */
    bottom: 10%;
    right: -100px;
    animation: ${float2} 18s ease-in-out infinite;
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
  background: rgba(34, 211, 238, 0.12); /* Subtle Cyan */
  top: 40%;
  left: 30%;
  animation: ${float3} 16s ease-in-out infinite;
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

const RegisterCard = styled.div`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(37, 99, 235, 0.08); /* Subtle border */
  border-radius: 20px;
  box-shadow: 0 30px 60px rgba(37, 99, 235, 0.15);
  padding: 1.5rem 2.5rem; /* Reduced to save vertical space */
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
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
  margin-bottom: 1rem;
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

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 1rem;
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
  margin: 0 0 1.5rem 0;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 0.5rem;
  
  /* Custom Scrollbar for the form */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
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
  padding: 0.65rem 1rem 0.65rem 2.875rem;
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
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 0.25rem;
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
  margin-top: 0.8rem;
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

const Row = styled.div`
  display: flex;
  gap: 1rem;
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1.25rem;
  }
`;

const StrengthMeter = styled.div`
  display: flex;
  gap: 4px;
  height: 4px;
  margin-top: 0.5rem;
`;

const StrengthSegment = styled.div`
  flex: 1;
  background: ${props => props.$active ? props.$color : '#e2e8f0'};
  border-radius: 2px;
  transition: background 0.3s ease;
  
  &.active {
    background: ${props => {
    if (props.$score <= 1) return '#ef4444';
    if (props.$score === 2) return '#f59e0b';
    if (props.$score === 3) return '#84cc16';
    return '#10b981';
  }};
  }
`;


const StrengthLabel = styled.div`
font-size: 0.75rem;
margin-top: 0.25rem;
text-align: right;
font-weight: 500;
color: ${props => {
    if (props.$score <= 1) return '#ef4444';
    if (props.$score === 2) return '#f59e0b';
    if (props.$score === 3) return '#84cc16';
    return '#10b981';
  }
  };
`;

const GenderContainer = styled.div`
display: flex;
gap: 0.75rem;
`;

const GenderOption = styled.label`
flex: 1;
display: flex;
align-items: center;
justify-content: center;
gap: 0.5rem;
cursor: pointer;
padding: 0.4rem;
border: 1px solid ${props => props.$checked ? '#2563eb' : '#e2e8f0'};
background: ${props => props.$checked ? '#eff6ff' : '#ffffff'};
border-radius: 12px;
font-size: 0.875rem;
font-weight: 500;
color: ${props => props.$checked ? '#2563eb' : '#64748b'};
transition: all 0.2s;

  input {
  display: none;
}

  &:hover {
  border-color: #cbd5e1;
  background: ${props => props.$checked ? '#eff6ff' : '#f8fafc'};
}
`;

const Register = () => {
  usePageTitle('Sign Up | BudgetWise');
  const navigate = useNavigate();
  const { signup, loginWithGoogle } = useAuth();

  // Step 1: Registration Form
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: ''
  });

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Email check state
  const [emailError, setEmailError] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  // Step 2: OTP Verification
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(0);
  const resendInterval = useRef(null);
  const [message, setMessage] = useState('');

  const [googleError, setGoogleError] = useState('');

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsSubmitting(true);
      setGoogleError('');
      await loginWithGoogle(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      setGoogleError(err.message || 'Google signup failed');
      console.error('Google signup error:', err);
      setIsSubmitting(false);
    }
  };

  const handleGoogleError = () => {
    setGoogleError('Google Sign-In was unsuccessful. Please try again.');
  };

  const handleEmailBlur = async () => {
    if (formData.email && !errors.email) {
      setIsCheckingEmail(true);
      try {
        const exists = await authService.checkEmail(formData.email);
        if (exists) {
          setEmailError('Email already registered. Please login.');
        } else {
          setEmailError('');
        }
      } catch (error) {
        console.error("Failed to check email", error);
      } finally {
        setIsCheckingEmail(false);
      }
    }
  };

  // Real-time validation helpers
  const validateFirstName = (value) => {
    if (!value.trim()) return '';
    if (!/^[A-Za-z]+$/.test(value.trim())) {
      return 'Only alphabets allowed - no numbers or special characters';
    }
    return '';
  };

  const validateLastName = (value) => {
    if (!value.trim()) return '';
    if (value.trim().length < 1) {
      return 'At least 1 character required';
    }
    return '';
  };

  const validateEmail = (value) => {
    if (!value) return '';
    if (!value.includes('@')) {
      return 'Email must contain @ symbol';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Invalid email format (e.g., name@domain.com)';
    }
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return '';
    if (value.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Password must contain at least 1 uppercase letter';
    }
    if (!/[0-9]/.test(value)) {
      return 'Password must contain at least 1 digit';
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      return 'Password must contain at least 1 special character (!@#$%^&*)';
    }
    return '';
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passwordStrengthScore = getPasswordStrength(formData.password);

  const validate = () => {
    const newErrors = {};

    // First Name: Only alphabets allowed
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Required';
    } else if (!/^[A-Za-z]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'Only alphabets allowed';
    }

    // Last Name: Must have at least one character
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Required';
    } else if (formData.lastName.trim().length < 1) {
      newErrors.lastName = 'At least 1 character required';
    }

    // Email: Must contain @ symbol
    if (!formData.email) {
      newErrors.email = 'Required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email must contain @';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    // Password: At least 8 chars, 1 uppercase, 1 digit, 1 special symbol
    if (!formData.password) {
      newErrors.password = 'Required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Min 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Need 1 uppercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Need 1 digit';
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password = 'Need 1 special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.gender) {
      newErrors.gender = 'Required';
    }

    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms';
    }

    if (emailError) {
      newErrors.email = emailError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time inline validation
    const newErrors = { ...errors };

    if (name === 'firstName') {
      const error = validateFirstName(value);
      if (error) {
        newErrors.firstName = error;
      } else {
        delete newErrors.firstName;
      }
    }

    if (name === 'lastName') {
      const error = validateLastName(value);
      if (error) {
        newErrors.lastName = error;
      } else {
        delete newErrors.lastName;
      }
    }

    if (name === 'email') {
      setEmailError('');
      const error = validateEmail(value);
      if (error) {
        newErrors.email = error;
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'password') {
      const error = validatePassword(value);
      if (error) {
        newErrors.password = error;
      } else {
        delete newErrors.password;
      }

      // Also check confirm password match
      if (formData.confirmPassword && value !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else if (formData.confirmPassword && value === formData.confirmPassword) {
        delete newErrors.confirmPassword;
      }
    }

    if (name === 'confirmPassword') {
      if (value && value !== formData.password) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        delete newErrors.confirmPassword;
      }
    }

    setErrors(newErrors);
  };

  // Step 1 Submission: Trigger OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      // Final check: Verifying email availability explicitly before submission
      const emailToCheck = formData.email.trim().toLowerCase();
      const exists = await authService.checkEmail(emailToCheck);
      if (exists) {
        const msg = 'Email already registered. Please login.';
        setEmailError(msg);
        setErrors(prev => ({ ...prev, email: msg }));
        setIsSubmitting(false);
        return;
      }

      // Request OTP
      await authService.requestSignupOtp(formData.email);

      // Move to Step 2
      setStep(2);
      setMessage('OTP has been sent to your email');
      startResendTimer();

    } catch (err) {
      console.error('Registration error:', err);
      // Fallback for demo/testing if backend isn't fully ready
      if (err.message && err.message.includes('Failed to fetch')) {
        setErrors({ form: 'Network error. Please try again later.' });
      } else {
        setErrors({ form: err.message || 'Failed to send OTP.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- OTP Handlers ---

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input automatically
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text");
    if (!/^\d{6}$/.test(data)) return;
    const newOtp = data.split("");
    setOtp(newOtp);
  };

  const startResendTimer = () => {
    setResendTimer(60);
    if (resendInterval.current) clearInterval(resendInterval.current);
    resendInterval.current = setInterval(() => {
      setResendTimer((s) => {
        if (s <= 1) { clearInterval(resendInterval.current); return 0; }
        return s - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    try {
      setMessage('');
      setIsSubmitting(true);
      await authService.requestSignupOtp(formData.email);
      setMessage('OTP has been resent to your email');
      startResendTimer();
    } catch (err) {
      console.error(err);
      setMessage('Failed to resend OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => { if (resendInterval.current) clearInterval(resendInterval.current); };
  }, []);

  // Step 2 Submission: Verify OTP and Create User
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit code' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Complete signup
      await authService.completeSignup({
        ...formData,
        role: "USER",
        otp: otpCode
      });

      // Success - Redirect
      navigate('/dashboard');
    } catch (err) {
      setErrors({ otp: err.message || 'Invalid OTP or registration failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  className={`bar ${i === 5 ? 'active' : ''} `}
                  style={{ height: `${height}% `, animationDelay: `${i * 0.1} s` }}
                />
              ))}
            </MockupChart>
          </MockupCard>
        </IllustrationWrapper>

        <TextContent>
          <h1>Start managing<br />money smarter<br />today.</h1>
          <p>AI-powered insights. Smart budgeting. Financial clarity.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
              <div style={{ color: '#2563eb', background: '#eff6ff', borderRadius: '50%', padding: '0.25rem', display: 'flex' }}><FiCheckCircle size={16} /></div>
              AI Budget Analysis
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
              <div style={{ color: '#2563eb', background: '#eff6ff', borderRadius: '50%', padding: '0.25rem', display: 'flex' }}><FiCheckCircle size={16} /></div>
              Smart Expense Tracking
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
              <div style={{ color: '#2563eb', background: '#eff6ff', borderRadius: '50%', padding: '0.25rem', display: 'flex' }}><FiCheckCircle size={16} /></div>
              Secure & Encrypted
            </div>
          </div>
        </TextContent>
      </LeftPanel>

      <RightPanel>
        <RegisterCard>
          <Logo>
            <LogoIcon>
              <FiDollarSign />
            </LogoIcon>
            <LogoText>BudgetWise</LogoText>
          </Logo>

          <FormHeader>
            <WelcomeText>{step === 1 ? 'Create Account' : 'Verify Email'}</WelcomeText>
            <Subtitle>
              {step === 1
                ? 'Enter your details to get started.'
                : `We've sent a verification code to ${formData.email}`
              }
            </Subtitle >
          </FormHeader >

          {errors.form && <ErrorMessage>{errors.form}</ErrorMessage>}
          {
            message && <div style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534',
              padding: '0.875rem', borderRadius: '12px', fontSize: '0.875rem',
              fontWeight: 500, marginBottom: '1.25rem', textAlign: 'center'
            }}>{message}</div>
          }

          <style>{`
            .form-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 0.85rem;
            }
            .full-width {
              grid-column: 1 / -1;
            }
            @media (max-width: 640px) {
              .form-grid {
                grid-template-columns: 1fr;
              }
            }
          `}</style>
          {
            step === 1 && (
              <Form onSubmit={handleRegister} noValidate className="form-grid">
                <FormGroup>
                  <Label htmlFor="firstName">First Name</Label>
                  <InputWrapper>
                    <InputIcon style={{ color: errors.firstName ? '#dc2626' : undefined }}><FiUser /></InputIcon>
                    <Input id="firstName" name="firstName" placeholder="John" value={formData.firstName} onChange={handleChange} $hasError={!!errors.firstName} />
                  </InputWrapper>
                  {errors.firstName && <FieldError>{errors.firstName}</FieldError>}
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="lastName">Last Name</Label>
                  <InputWrapper>
                    <InputIcon style={{ color: errors.lastName ? '#dc2626' : undefined }}><FiUser /></InputIcon>
                    <Input id="lastName" name="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} $hasError={!!errors.lastName} />
                  </InputWrapper>
                  {errors.lastName && <FieldError>{errors.lastName}</FieldError>}
                </FormGroup>

                <FormGroup className="full-width">
                  <Label htmlFor="email">Email Address</Label>
                  <InputWrapper>
                    <InputIcon style={{ color: errors.email ? '#dc2626' : undefined }}><FiMail /></InputIcon>
                    <Input id="email" name="email" type="email" placeholder="name@company.com" value={formData.email} onChange={handleChange} onBlur={handleEmailBlur} $hasError={!!errors.email} />
                    {isCheckingEmail && <Spinner style={{ position: 'absolute', right: '1rem', width: '14px', height: '14px', borderTopColor: '#2563eb', border: '2px solid #e2e8f0' }} />}
                  </InputWrapper>
                  {errors.email && <FieldError>{errors.email}</FieldError>}
                </FormGroup>

                <FormGroup className="full-width">
                  <Label>Gender</Label>
                  <GenderContainer>
                    <GenderOption $checked={formData.gender === 'MALE'}>
                      <input type="radio" name="gender" value="MALE" checked={formData.gender === 'MALE'} onChange={handleChange} /> Male
                    </GenderOption>
                    <GenderOption $checked={formData.gender === 'FEMALE'}>
                      <input type="radio" name="gender" value="FEMALE" checked={formData.gender === 'FEMALE'} onChange={handleChange} /> Female
                    </GenderOption>
                    <GenderOption $checked={formData.gender === 'OTHER'}>
                      <input type="radio" name="gender" value="OTHER" checked={formData.gender === 'OTHER'} onChange={handleChange} /> Other
                    </GenderOption>
                  </GenderContainer>
                  {errors.gender && <FieldError>{errors.gender}</FieldError>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <InputWrapper>
                    <InputIcon style={{ color: errors.password ? '#dc2626' : undefined }}><FiLock /></InputIcon>
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={formData.password} onChange={handleChange} $hasError={!!errors.password} />
                    <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </PasswordToggle>
                  </InputWrapper>
                  <StrengthMeter>
                    {[1, 2, 3, 4].map((score, idx) => (
                      <StrengthSegment key={score} $score={passwordStrengthScore} className={passwordStrengthScore >= score ? 'active' : ''} />
                    ))}
                  </StrengthMeter>
                  <StrengthLabel $score={passwordStrengthScore}>
                    {passwordStrengthScore === 0 ? '' : passwordStrengthScore < 2 ? 'Weak' : passwordStrengthScore < 3 ? 'Medium' : 'Strong'}
                  </StrengthLabel>
                  {errors.password && <FieldError>{errors.password}</FieldError>}
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <InputWrapper>
                    <InputIcon style={{ color: errors.confirmPassword ? '#dc2626' : undefined }}><FiLock /></InputIcon>
                    <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange} $hasError={!!errors.confirmPassword} />
                    <PasswordToggle type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </PasswordToggle>
                  </InputWrapper>
                  {errors.confirmPassword && <FieldError>{errors.confirmPassword}</FieldError>}
                </FormGroup>

                <TermsContainer className="full-width">
                  <CheckboxInput type="checkbox" id="terms" checked={agreeToTerms} onChange={(e) => {
                    setAgreeToTerms(e.target.checked);
                    setErrors(prev => { const n = { ...prev }; delete n.terms; return n; });
                  }} />
                  <TermsText htmlFor="terms">
                    I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                  </TermsText>
                </TermsContainer>
                {errors.terms && <FieldError className="full-width" style={{ marginTop: '-0.5rem', marginLeft: '1.5rem' }}>{errors.terms}</FieldError>}

                <LoginButton type="submit" disabled={isSubmitting} className="full-width">
                  {isSubmitting ? <><Spinner />&nbsp;&nbsp;Processing...</> : 'Create Account'}
                </LoginButton>
              </Form>
            )
          }

          {
            step === 2 && (
              <Form onSubmit={handleVerifyOtp} noValidate>
                <FormGroup>
                  <Label>One-Time Password</Label>
                  <OtpContainer onPaste={handleOtpPaste}>
                    {otp.map((data, index) => (
                      <OtpBox key={index} type="text" maxLength="1" value={data} onChange={(e) => handleOtpChange(e.target, index)} onKeyDown={(e) => handleOtpKeyDown(e, index)} onFocus={(e) => e.target.select()} />
                    ))}
                  </OtpContainer>
                  {errors.otp && <FieldError style={{ textAlign: 'center', marginTop: '1rem' }}>{errors.otp}</FieldError>}

                  <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                    Didn\'t receive code?{' '}
                    <ResendLink type="button" onClick={handleResendOtp} disabled={resendTimer > 0}>
                      {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
                    </ResendLink>
                  </div>
                </FormGroup>

                <LoginButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner /> : 'Verify & Create Account'}
                </LoginButton>

                <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', width: '100%', marginTop: '1rem', cursor: 'pointer', transition: 'color 0.2s' }}>
                  Back to Signup
                </button>
              </Form>
            )
          }

          <GradientDivider>or sign up with</GradientDivider>

          {googleError && <FieldError style={{ marginBottom: '1rem', textAlign: 'center' }}>{googleError}</FieldError>}

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.05))' }}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} useOneTap shape="rectangular" theme="outline" text="signup_with" size="large" />
          </div>

          <SignUpPrompt>
            Already have an account? <SignUpLink to="/login">Log in</SignUpLink>
          </SignUpPrompt>
        </RegisterCard >
      </RightPanel >
    </Container >
  );
};

export default Register;
