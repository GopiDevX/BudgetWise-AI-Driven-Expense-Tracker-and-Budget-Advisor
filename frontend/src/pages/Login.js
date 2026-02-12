import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FiLock, FiEye, FiEyeOff, FiMail, FiKey } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';
import authService from '../services/authService';

const LoginContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  position: relative;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LogoText = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2563eb;
  margin: 0;
`;

const LogoTagline = styled.p`
  color: #64748b;
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
`;

const WelcomeText = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0.5rem 0;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0.5rem 0;
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
  color: #374151;
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  
  &:hover {
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
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  
  &:hover {
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
  }
  
  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Spinner = styled.div`
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid #fff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
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
  color: #9ca3af;
  font-size: 0.875rem;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e7eb;
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
  font-size: 0.875rem;
  margin-top: 1.5rem;
`;

const SignUpLink = styled(Link)`
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const ResendLink = styled.button`
  background: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  color: #64748b;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: all 0.2s;
  
  &:hover {
    background: #f8fafc;
    border-color: #d1d5db;
  }
`;

const Login = () => {
  // Set page title
  usePageTitle('Login | BudgetWise');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: initial, 2: password verified, 3: OTP verified
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const resendInterval = useRef(null);
  const navigate = useNavigate();
  const { setUserAuthenticated } = useAuth();

  const handleContinue = async (e) => {
    e.preventDefault();
    
    if (!email || (!password && !showOtpInput)) {
      setError('Please enter email and password');
      return;
    }
    
    try {
      setError('');
      setMessage('');
      setLoading(true);

      let result;
      if (step === 1) {
        // Step 1: Verify password and send OTP
        const loginResp = await authService.loginUser(email, password);
        // backend returns { token, message } on successful credential verification
        if (loginResp && loginResp.token) {
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
      setError('Please enter your email address');
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
        
        <Form onSubmit={handleContinue}>
          <FormGroup>
            <Label htmlFor="email">Email address</Label>
            <InputWrapper>
              <InputIcon>
                <FiMail />
              </InputIcon>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoFocus
                disabled={step !== 1}
              />
            </InputWrapper>
          </FormGroup>
          
          {step === 1 && (
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <InputWrapper>
                <InputIcon>
                  <FiLock />
                </InputIcon>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </PasswordToggle>
              </InputWrapper>
              <div style={{ textAlign: 'right' }}>
                <ForgotText to="/forgot-password">Forgot password?</ForgotText>
              </div>
            </FormGroup>
          )}
          
          {step === 2 && (
            <FormGroup>
              <Label htmlFor="otp">One-Time Password (OTP)</Label>
              <InputWrapper>
                <InputIcon>
                  <FiKey />
                </InputIcon>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  required
                />
              </InputWrapper>
            </FormGroup>
          )}
          
          <LoginButton type="submit" disabled={loading}>
            {loading ? (<><Spinner />&nbsp;Processing...</>) : 'Continue'}
          </LoginButton>
        </Form>
        
        {step === 2 && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <ResendLink type="button" onClick={handleResendOtp} disabled={resendTimer>0}>
              {resendTimer>0 ? `Resend OTP (${resendTimer}s)` : 'Resend OTP'}
            </ResendLink>
          </div>
        )}
        
        <Divider>or</Divider>
        
        <SignUpPrompt>
          Don't have an account? <SignUpLink to="/register">Sign up</SignUpLink>
        </SignUpPrompt>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
