import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiLock } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';
import authService from '../services/authService';

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 2rem;
  width: 100%;
  max-width: 420px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0.5rem 0;
  text-align: center;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0.5rem 0 1rem 0;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
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
`;

const Button = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
`;

const Message = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const Error = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const SmallLink = styled(Link)`
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;

  &:hover { text-decoration: underline; }
`;

const ResetPassword = () => {
  usePageTitle('Reset Password | BudgetWise');
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setError('Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError('');
      setMessage('');
      setLoading(true);

      await authService.resetPasswordRequest(email, newPassword);
      setMessage('Password reset successful. Redirecting to login...');

      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Create new password</Title>
        <Subtitle>Choose a strong password for your account</Subtitle>

        {error && <Error>{error}</Error>}
        {message && <Message>{message}</Message>}

        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <InputIcon><FiLock /></InputIcon>
            <Input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </InputWrapper>

          <InputWrapper>
            <InputIcon><FiLock /></InputIcon>
            <Input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </InputWrapper>

          <Button type="submit" disabled={loading}>{loading ? 'Submitting...' : 'Submit'}</Button>
        </Form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <SmallLink to="/login">Back to login</SmallLink>
        </div>
      </Card>
    </Container>
  );
};

export default ResetPassword;
