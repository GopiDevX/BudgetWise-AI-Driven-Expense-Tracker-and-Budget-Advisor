import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiMail, FiLock, FiKey } from 'react-icons/fi';
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

const ForgotPassword = () => {
  // Set page title
  usePageTitle('Forgot Password | BudgetWise');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setError('');
      setMessage('');
      setLoading(true);

      // Request OTP for password reset
      await authService.requestPasswordResetOtp(email);
      setMessage('Password reset OTP has been sent to your email');
      // navigate to verify otp screen
      navigate('/forgot-password/verify', { state: { email } });
    } catch (err) {
      setError(err.message || 'Failed to send password reset OTP');
      console.error('Request OTP error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmNewPassword) {
      setError('Please fill all fields');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setError('');
      setMessage('');
      setLoading(true);

      // Complete password reset with OTP
      const response = await fetch('http://localhost:8081/api/auth/forgot-password/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Password reset failed');
      }

      const result = await response.json();

      setMessage('Password reset successful! You can now login with your new password.');
      setShowOtpInput(false);
      setNewPassword('');
      setConfirmNewPassword('');

      // Navigate back to login after successful reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Password reset failed');
      console.error('Password reset error:', err);
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

        <WelcomeText>Reset your password</WelcomeText>
        <Subtitle>
          {showOtpInput ? 'Enter the OTP sent to your email' : 'Enter your email to receive OTP'}
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

        <Form onSubmit={handleRequestOtp}>
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
              />
            </InputWrapper>
          </FormGroup>

          <LoginButton type="submit" disabled={loading}>
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </LoginButton>
        </Form>

        <Divider>or</Divider>

        <SignUpPrompt>
          Don't have an account? <SignUpLink to="/register">Sign up</SignUpLink>
        </SignUpPrompt>
      </LoginCard>
    </LoginContainer>
  );
};

export default ForgotPassword;
