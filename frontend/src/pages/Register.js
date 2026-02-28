import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import styled, { keyframes, css } from 'styled-components';
import { FiLock, FiEye, FiEyeOff, FiMail, FiUser, FiCheckCircle, FiShield, FiTrendingUp, FiActivity, FiDollarSign, FiAlertCircle } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';
import authService from '../services/authService';
import ParticleWaveBackground from '../components/ParticleWaveBackground';

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const moveParticle = keyframes`
  0% { transform: translate(0, 0); }
  25% { transform: translate(10px, -15px); }
  50% { transform: translate(-5px, -25px); }
  75% { transform: translate(-15px, -10px); }
  100% { transform: translate(0, 0); }
`;

const scaleUp = keyframes`
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

// --- Finance Animation Helpers ---
const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const floatAnimationReverse = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(15px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const borderRotate = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// --- Layout Components ---
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f1f5f9;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
`;

const LeftPanel = styled.div`
  flex: 1;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #172554 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(255,255,255,0.03) 0%, transparent 20%),
      radial-gradient(circle at 80% 80%, rgba(255,255,255,0.03) 0%, transparent 20%);
    pointer-events: none;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const ParticlesContainer = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
`;

const Particle = styled.div`
  position: absolute;
  width: ${props => props.size || '4px'};
  height: ${props => props.size || '4px'};
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  top: ${props => props.top};
  left: ${props => props.left};
  animation: ${moveParticle} ${props => props.duration || '10s'} infinite linear alternate;
`;

const BrandContent = styled.div`
  max-width: 480px;
  position: relative;
  z-index: 10;
  animation: ${fadeIn} 0.8s ease-out;
`;

const LogoDisplay = styled.div`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #ffffff, #93c5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  width: fit-content;
`;

const FinanceComposition = styled.div`
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  perspective: 1000px;
`;

const MainCard = styled.div`
  width: 300px;
  height: 190px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 1.5rem;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 2;
  animation: ${scaleUp} 0.8s ease-out;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.1) 20%,
      rgba(255, 255, 255, 0.2) 60%,
      rgba(255, 255, 255, 0)
    );
    animation: ${shimmer} 3s infinite;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.9;
  z-index: 2;
`;

const CardBalance = styled.div`
  font-size: 2.25rem;
  font-weight: 700;
  color: #fff;
  margin-top: 0.25rem;
  letter-spacing: -0.02em;
  z-index: 2;
`;

const CardGraph = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 50px;
  margin-top: auto;
  z-index: 2;
`;

const GraphBar = styled.div`
  flex: 1;
  background: ${props => props.$active ? '#60a5fa' : 'rgba(255,255,255,0.15)'};
  border-radius: 4px;
  height: ${props => props.$height};
  animation: ${scaleUp} 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  animation-delay: ${props => props.$delay};
  transform-origin: bottom;
`;

const FloatingElement = styled.div`
  position: absolute;
  background: ${props => props.$bg || 'rgba(255, 255, 255, 0.9)'};
  color: ${props => props.$color || '#0f172a'};
  padding: 0.75rem 1rem;
  border-radius: 12px;
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.2);
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  z-index: 3;
  animation: ${floatAnimation} 5s ease-in-out infinite;
  animation-delay: ${props => props.$delay || '0s'};
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.5);

  svg {
    color: ${props => props.$iconColor};
    width: 20px;
    height: 20px;
  }
`;

// --- Right Panel (Form) ---
const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f1f5f9;
  position: relative;
  overflow-y: auto;
`;

const RegisterCard = styled.div`
  background: #ffffff;
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1), 
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 480px;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  z-index: 1;

  /* Animated Border Effect */
  &::before {
    content: "";
    position: absolute;
    inset: -2px;
    z-index: -1;
    border-radius: 1.6rem;
    background: linear-gradient(
      45deg, 
      #eff6ff, 
      #3b82f6, 
      #eff6ff, 
      #60a5fa
    );
    background-size: 300% 300%;
    animation: ${borderRotate} 4s ease infinite;
    opacity: 0.6;
  }
  
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: #ffffff;
    border-radius: 1.5rem;
  }

  @media (max-width: 640px) {
    padding: 1.5rem;
    box-shadow: none;
    &::before { display: none; }
    &::after { display: none; }
  }
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.925rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1.25rem;
  }
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
  
  svg {
    position: absolute;
    left: 12px;
    color: #94a3b8;
    width: 18px;
    height: 18px;
    transition: color 0.2s;
  }

  &:focus-within svg {
    color: #2563eb;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 2.5rem;
  font-size: 0.925rem;
  color: #1e293b;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  transition: all 0.2s ease;

  &::placeholder {
    color: #cbd5e1;
  }

  &:focus {
    outline: none;
    border-color: #2563eb;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  ${props => props.$hasError && css`
    border-color: #ef4444;
    background: #fef2f2;
    &:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  `}
`;

const ErrorText = styled.span`
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px;
  display: flex;
  align-items: center;
  z-index: 10;
  
  &:hover {
    color: #475569;
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
  background: #e2e8f0;
  border-radius: 2px;
  
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
  }};
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
  padding: 0.6rem;
  border: 1px solid ${props => props.$checked ? '#2563eb' : '#e2e8f0'};
  background: ${props => props.$checked ? '#eff6ff' : '#f8fafc'};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.$checked ? '#2563eb' : '#64748b'};
  transition: all 0.2s;

  input {
    display: none;
  }

  &:hover {
    border-color: #cbd5e1;
    background: ${props => props.$checked ? '#eff6ff' : '#f1f5f9'};
  }
`;

const SubmitButton = styled.button`
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.875rem;
  background: #2563eb;
  color: white;
  font-size: 0.925rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LinkText = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #64748b;

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 600;
    margin-left: 0.25rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Alert = styled.div`
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 0.5rem;
  color: #991b1b;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuccessAlert = styled(Alert)`
  background: #f0fdf4;
  border-color: #dcfce7;
  color: #166534;
`;

const TermsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

const CheckboxInput = styled.input`
  width: 1.1rem;
  height: 1.1rem;
  margin-top: 0.15rem;
  cursor: pointer;
  accent-color: #2563eb;
  border-radius: 4px;
`;

const TermsText = styled.label`
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.4;
  cursor: pointer;
  user-select: none;

  a {
    color: #2563eb;
    text-decoration: none;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
`;

// --- OTP Styles (Ported from Login.js) ---
const OtpContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const OtpBox = styled.input`
  width: 50px;
  height: 55px;
  padding: 0;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  background: #f8fafc;
  color: #1e293b;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #2563eb;
    background: white;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: #cbd5e1;
    font-weight: 400;
    font-size: 1rem;
  }
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.disabled ? '#94a3b8' : '#2563eb'};
  font-size: 0.85rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  padding: 0;
  text-decoration: ${props => props.disabled ? 'none' : 'underline'};
  
  &:hover {
    color: ${props => props.disabled ? '#94a3b8' : '#1d4ed8'};
  }
`;

const Spinner = styled.div`
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid #fff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// --- Main Component ---

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
      <LeftPanel>
        <ParticlesContainer>
          {[...Array(20)].map((_, i) => (
            <Particle
              key={i}
              top={`${Math.random() * 100}%`}
              left={`${Math.random() * 100}%`}
              size={`${Math.random() * 6 + 2}px`}
              duration={`${Math.random() * 15 + 10}s`}
            />
          ))}
        </ParticlesContainer>

        <BrandContent>
          <LogoDisplay>BudgetWise</LogoDisplay>

          <FinanceComposition>
            <MainCard>
              <CardHeader>
                <span>Total Assets</span>
                <FiShield style={{ opacity: 0.8 }} />
              </CardHeader>
              <CardBalance>$24,500.00</CardBalance>
              <CardGraph>
                <GraphBar $height="40%" $delay="0.1s" />
                <GraphBar $height="65%" $delay="0.2s" $active />
                <GraphBar $height="50%" $delay="0.3s" />
                <GraphBar $height="85%" $active $delay="0.4s" />
                <GraphBar $height="60%" $delay="0.5s" />
              </CardGraph>
            </MainCard>

            <FloatingElement style={{ top: '10%', right: '-5%' }} $delay="2s" $iconColor="#10b981">
              <FiTrendingUp /> Smart Analytics
            </FloatingElement>

            <FloatingElement style={{ bottom: '20%', left: '-10%' }} $delay="1s" $iconColor="#6366f1">
              <FiCheckCircle /> Secure Data
            </FloatingElement>
          </FinanceComposition>
        </BrandContent>
      </LeftPanel>

      <RightPanel>
        <ParticleWaveBackground />
        <RegisterCard>
          <FormHeader>
            <Title>{step === 1 ? 'Create Account' : 'Verify Email'}</Title>
            <Subtitle>
              {step === 1
                ? 'Enter your details to get started with your free account.'
                : `We've sent a verification code to ${formData.email}`
              }
            </Subtitle>
          </FormHeader>

          {errors.form && <Alert><FiShield /> {errors.form}</Alert>}
          {message && <SuccessAlert><FiCheckCircle /> {message}</SuccessAlert>}

          {/* Step 1: Registration Form */}
          {step === 1 && (
            <Form onSubmit={handleRegister}>
              <Row>
                <InputGroup>
                  <Label htmlFor="firstName">First Name</Label>
                  <InputWrapper>
                    <FiUser />
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      $hasError={!!errors.firstName}
                    />
                  </InputWrapper>
                  {errors.firstName && <ErrorText><FiAlertCircle size={14} /> {errors.firstName}</ErrorText>}
                </InputGroup>

                <InputGroup>
                  <Label htmlFor="lastName">Last Name</Label>
                  <InputWrapper>
                    <FiUser />
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      $hasError={!!errors.lastName}
                    />
                  </InputWrapper>
                  {errors.lastName && <ErrorText><FiAlertCircle size={14} /> {errors.lastName}</ErrorText>}
                </InputGroup>
              </Row>

              <InputGroup>
                <Label htmlFor="email">Email Address</Label>
                <InputWrapper>
                  <FiMail />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleEmailBlur}
                    $hasError={!!errors.email}
                  />
                  {isCheckingEmail && <Spinner style={{ position: 'absolute', right: '1rem', width: '14px', height: '14px', borderTopColor: '#2563eb', border: '2px solid #e2e8f0' }} />}
                </InputWrapper>
                {errors.email && <ErrorText><FiAlertCircle size={14} /> {errors.email}</ErrorText>}
              </InputGroup>

              <Row>
                <InputGroup>
                  <Label>Gender</Label>
                  <GenderContainer>
                    <GenderOption $checked={formData.gender === 'MALE'}>
                      <input
                        type="radio"
                        name="gender"
                        value="MALE"
                        checked={formData.gender === 'MALE'}
                        onChange={handleChange}
                      />
                      Male
                    </GenderOption>
                    <GenderOption $checked={formData.gender === 'FEMALE'}>
                      <input
                        type="radio"
                        name="gender"
                        value="FEMALE"
                        checked={formData.gender === 'FEMALE'}
                        onChange={handleChange}
                      />
                      Female
                    </GenderOption>
                    <GenderOption $checked={formData.gender === 'OTHER'}>
                      <input
                        type="radio"
                        name="gender"
                        value="OTHER"
                        checked={formData.gender === 'OTHER'}
                        onChange={handleChange}
                      />
                      Other
                    </GenderOption>
                  </GenderContainer>
                  {errors.gender && <ErrorText><FiAlertCircle size={14} /> {errors.gender}</ErrorText>}
                </InputGroup>
              </Row>

              <InputGroup>
                <Label htmlFor="password">Password</Label>
                <InputWrapper>
                  <FiLock />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    $hasError={!!errors.password}
                  />
                  <PasswordToggle type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </InputWrapper>
                <StrengthMeter>
                  {[1, 2, 3, 4].map(score => (
                    <StrengthSegment
                      key={score}
                      $score={passwordStrengthScore}
                      className={passwordStrengthScore >= score ? 'active' : ''}
                    />
                  ))}
                </StrengthMeter>
                <StrengthLabel $score={passwordStrengthScore}>
                  {passwordStrengthScore === 0 ? '' :
                    passwordStrengthScore < 2 ? 'Weak' :
                      passwordStrengthScore < 3 ? 'Medium' : 'Strong'}
                </StrengthLabel>
                {errors.password && <ErrorText><FiAlertCircle size={14} /> {errors.password}</ErrorText>}
              </InputGroup>

              <InputGroup>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <InputWrapper>
                  <FiLock />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    $hasError={!!errors.confirmPassword}
                  />
                  <PasswordToggle type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </PasswordToggle>
                </InputWrapper>
                {errors.confirmPassword && <ErrorText><FiAlertCircle size={14} /> {errors.confirmPassword}</ErrorText>}
              </InputGroup>

              <TermsContainer>
                <CheckboxInput
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                />
                <TermsText htmlFor="terms">
                  I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                </TermsText>
              </TermsContainer>
              {errors.terms && <ErrorText style={{ marginTop: '-1rem', marginLeft: '2rem' }}>{errors.terms}</ErrorText>}

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : 'Create Account'}
              </SubmitButton>
            </Form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <Form onSubmit={handleVerifyOtp}>
              <InputGroup>
                <OtpContainer onPaste={handleOtpPaste}>
                  {otp.map((data, index) => (
                    <OtpBox
                      key={index}
                      type="text"
                      maxLength="1"
                      value={data}
                      onChange={(e) => handleOtpChange(e.target, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      onFocus={(e) => e.target.select()}
                    />
                  ))}
                </OtpContainer>
                {errors.otp && <Alert style={{ marginTop: '1rem', marginBottom: 0 }}><FiShield /> {errors.otp}</Alert>}

                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                  Didn't receive code?{' '}
                  <ResendButton type="button" onClick={handleResendOtp} disabled={resendTimer > 0}>
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                  </ResendButton>
                </div>
              </InputGroup>

              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : 'Verify & Create Account'}
              </SubmitButton>

              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '0.85rem',
                  width: '100%',
                  marginTop: '1rem',
                  cursor: 'pointer'
                }}
              >
                Back to Signup
              </button>
            </Form>
          )}

          <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', color: '#94a3b8' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
            <span style={{ margin: '0 1rem', fontSize: '0.875rem' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
          </div>

          {googleError && <ErrorText style={{ marginBottom: '1rem', justifyContent: 'center' }}><FiAlertCircle size={14} /> {googleError}</ErrorText>}

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              shape="rectangular"
              theme="outline"
              text="signup_with"
              size="large"
            />
          </div>

          <LinkText>
            Already have an account? <Link to="/login">Sign In</Link>
          </LinkText>
        </RegisterCard>
      </RightPanel>
    </Container>
  );
};

export default Register;
