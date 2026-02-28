import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import styled, { keyframes } from 'styled-components';
import { FiLock, FiEye, FiEyeOff, FiMail, FiKey } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';
import authService from '../services/authService';

const fadeInScale = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
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

const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f2f7ff 100%);
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before, &::after {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.5;
    z-index: 0;
  }

  &::before {
    background: rgba(37, 99, 235, 0.15); /* Blue */
    top: -150px;
    left: -150px;
    animation: ${float1} 15s ease-in-out infinite;
  }

  &::after {
    background: rgba(147, 51, 234, 0.15); /* Purple */
    bottom: -150px;
    right: -150px;
    animation: ${float2} 18s ease-in-out infinite;
  }
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 10px 15px -3px rgba(0, 0, 0, 0.03);
  padding: 3rem;
  width: 100%;
  max-width: 440px;
  position: relative;
  z-index: 1;
  animation: ${fadeInScale} 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;

  @media (max-width: 640px) {
    padding: 2rem;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const LogoText = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  color: #2563eb;
  margin: 0;
  letter-spacing: -0.03em;
`;

const LogoTagline = styled.p`
  color: #64748b;
  margin: 0.5rem 0 0 0;
  font-size: 0.95rem;
  font-weight: 400;
`;

const WelcomeText = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0.5rem 0;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  margin: 0 0 1.5rem 0;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
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
    transition: color 0.2s ease;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid ${props => props.$hasError ? '#ef4444' : '#e2e8f0'};
  border-radius: 12px;
  font-size: 0.95rem;
  color: #1e293b;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 4px ${props => props.$hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.15)'};
    background: #ffffff;
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const FieldError = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
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
    transition: color 0.2s ease;
  }
  
  &:hover svg {
    color: #64748b;
  }
`;

const ForgotText = styled(Link)`
  display: inline-block;
  margin-top: 0.5rem;
  text-align: right;
  color: #2563eb;
  font-size: 0.875rem;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
  
  &:hover {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3), 0 0 12px rgba(37, 99, 235, 0.4);
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

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #94a3b8;
  font-size: 0.875rem;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
  
  &::before {
    margin-right: 1rem;
  }
  
  &::after {
    margin-left: 1rem;
  }
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
  margin-bottom: 1rem;
  text-align: center;
`;

const ResendLink = styled.button`
  background: none;
  border: none;
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
  transition: all 0.2s;
  
  &:hover {
    color: #1d4ed8;
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
  background: rgba(255, 255, 255, 0.9);
  color: #1e293b;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #2563eb;
    background: white;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
    transform: translateY(-2px);
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
    <LoginContainer>
      <LoginCard>
        <Logo>
          <LogoText>BudgetWise</LogoText>
          <LogoTagline>Smart money management made simple</LogoTagline>
        </Logo>

        <WelcomeText>
          {step === 1 && 'Welcome back'}
          {step === 2 && 'Verify your identity'}
        </WelcomeText>
        <Subtitle>
          {step === 1 && 'Enter your credentials to continue'}
          {step === 2 && 'Enter the OTP sent to your email'}
        </Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#166534',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          marginBottom: '1rem',
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
                placeholder="Enter your email"
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
              <div style={{ textAlign: 'right', marginTop: passwordError ? '0.5rem' : '0' }}>
                <ForgotText to="/forgot-password">Forgot password?</ForgotText>
              </div>
            </FormGroup>
          )}

          {step === 2 && (
            <FormGroup>
              <Label htmlFor="otp">One-Time Password (OTP)</Label>
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

          <LoginButton type="submit" disabled={loading}>
            {loading ? (<><Spinner />&nbsp;Processing...</>) : 'Continue'}
          </LoginButton>
        </Form>

        {step === 2 && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <ResendLink type="button" onClick={handleResendOtp} disabled={resendTimer > 0}>
              {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
            </ResendLink>
          </div>
        )}

        <Divider>or</Divider>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
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
    </LoginContainer>
  );
};

export default Login;
