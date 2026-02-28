import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiMail, FiKey } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';

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
  transition: color 0.2s;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.75rem 0.75rem 2.5rem;
  border: 1px solid ${props => props.$hasError ? '#dc2626' : '#d1d5db'};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#dc2626' : '#2563eb'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(37, 99, 235, 0.1)'};
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const FieldError = styled.span`
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.375rem;
  display: block;
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

// OTP Input Components
const OtpRow = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: 12,
  justifyContent: 'center',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const Digit = styled('input')(({ theme }) => ({
  width: 50,
  height: 60,
  textAlign: 'center',
  fontSize: 24,
  fontWeight: 600,
  borderRadius: 12,
  border: '2px solid #e5e7eb',
  background: 'rgba(255, 255, 255, 0.9)',
  boxShadow: 'inset 0 -1px 0 rgba(16,24,40,0.02)',
  outline: 'none',
  transition: 'all 200ms ease',
  color: '#1e293b',

  '&:focus': {
    boxShadow: '0 6px 18px rgba(59,130,246,0.12)',
    borderColor: '#2563eb',
    transform: 'translateY(-2px) scale(1.02)',
    background: 'rgba(255, 255, 255, 1)',
  },

  '&:hover': {
    borderColor: '#94a3b8',
    transform: 'translateY(-1px)',
  },

  [theme.breakpoints.down('sm')]: {
    width: 45,
    height: 55,
    fontSize: 20,
  },
}));

const LoginOTP = () => {
  // Set page title
  usePageTitle('Login with OTP | BudgetWise');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [digits, setDigits] = useState(Array(6).fill(''));
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  // OTP handling functions
  const handleChange = (index, e) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
    if (!val) {
      setDigits((d) => {
        const copy = [...d];
        copy[index] = '';
        return copy;
      });
      return;
    }
    setDigits((d) => {
      const copy = [...d];
      copy[index] = val;
      return copy;
    });
    // focus next
    if (index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
      setDigits((d) => {
        const copy = [...d];
        copy[index - 1] = '';
        return copy;
      });
    }
    if (e.key === 'ArrowLeft' && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const arr = pasted.split('');
    const merged = Array.from({ length: 6 }).map((_, i) => arr[i] || '');
    setDigits(merged);
    // focus end
    const firstEmpty = merged.findIndex((c) => !c);
    inputsRef.current[firstEmpty === -1 ? 5 : firstEmpty]?.focus();
  };

  const otpValue = digits.join('');

  useEffect(() => {
    // autofocus first input when OTP input is shown
    if (showOtpInput) {
      inputsRef.current[0]?.focus();
    }
  }, [showOtpInput]);

  const handleRequestOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    setEmailError('');
    setError('');

    if (!email) {
      setEmailError('Please enter your email address');
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    try {
      setMessage('');
      setLoading(true);

      // Request OTP for login
      const response = await fetch('http://localhost:8081/api/auth/login/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to send OTP');
      }

      const result = await response.json();
      setShowOtpInput(true);
      setMessage('OTP has been sent to your email address');
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
      console.error('Request OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithOtp = async (e) => {
    e.preventDefault();

    if (!email || otpValue.length < 6) {
      setError('Please enter both email and OTP');
      return;
    }

    try {
      setError('');
      setMessage('');
      setLoading(true);

      // Complete login with OTP
      const response = await fetch('http://localhost:8081/api/auth/login/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Login failed');
      }

      const result = await response.json();

      // Store token and user data
      localStorage.setItem('budgetwise_token', result.token);
      const user = JSON.parse(atob(result.token.split('.')[1]));
      localStorage.setItem('budgetwise_user', JSON.stringify(user));

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <LogoText>BudgetWise</LogoText>
          <LogoTagline>Smart money management made simple</LogoTagline>
        </Logo>

        <WelcomeText>Welcome back</WelcomeText>
        <Subtitle>Sign in with OTP</Subtitle>

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

        {!showOtpInput ? (
          <Form onSubmit={handleRequestOtp} noValidate>
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
                  $hasError={!!emailError}
                />
              </InputWrapper>
              {emailError && <FieldError>{emailError}</FieldError>}
            </FormGroup>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <LoginButton type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'}
              </LoginButton>
            </div>
          </Form>
        ) : (
          <Form onSubmit={handleLoginWithOtp}>
            <FormGroup>
              <Label>Enter 6-digit OTP</Label>
              <OtpRow role="group" aria-label="OTP input">
                {digits.map((d, i) => (
                  <Digit
                    key={i}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    aria-label={`Digit ${i + 1}`}
                    ref={(el) => (inputsRef.current[i] = el)}
                    value={d}
                    onChange={(e) => handleChange(i, e)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                  />
                ))}
              </OtpRow>
            </FormGroup>

            <LoginButton type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </LoginButton>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={handleBackToLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Back to login
              </button>
            </div>
          </Form>
        )}
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginOTP;
