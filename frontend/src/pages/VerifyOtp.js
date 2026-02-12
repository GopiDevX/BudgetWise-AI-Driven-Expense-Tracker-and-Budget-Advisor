import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle';
import authService from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

// MUI imports
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { styled, keyframes } from '@mui/material/styles';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #f7fbff 0%, #eef6ff 100%)',
}));

const StickyNav = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  width: '100%',
  zIndex: 1200,
  backdropFilter: 'blur(6px)',
  backgroundColor: 'rgba(255,255,255,0.6)',
  borderBottom: '1px solid rgba(0,0,0,0.04)',
  padding: theme.spacing(1, 2),
}));

const Card = styled(Paper)(({ theme }) => ({
  width: '100%',
  maxWidth: 520,
  padding: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 10px 30px rgba(16,24,40,0.08)',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.85), rgba(250,250,255,0.75))',
  backdropFilter: 'saturate(120%) blur(6px)',
  animation: `${fadeInUp} 420ms ease-out both`,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    borderRadius: 12,
    boxShadow: '0 6px 18px rgba(16,24,40,0.06)',
  },
}));

const Header = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));

const Subtitle = styled(Typography)(({ theme }) => ({ color: '#64748b' }));

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

const ResendText = styled(Typography)(({ theme, clickable }) => ({
  color: clickable ? '#2563eb' : '#94a3b8',
  cursor: clickable ? 'pointer' : 'default',
  fontWeight: 600,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  transition: 'color 200ms ease',
}));

const SuccessBanner = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: theme.spacing(1, 2),
  borderRadius: 10,
  background: 'linear-gradient(90deg, rgba(220,250,235,0.9), rgba(235,255,245,0.9))',
  color: '#064e3b',
  marginBottom: theme.spacing(1.5),
}));

function maskEmail(email) {
  if (!email) return '';
  const [local, domain] = email.split('@');
  const visible = local.slice(0, Math.max(1, Math.min(4, local.length)));
  const masked = visible + '*'.repeat(Math.max(3, local.length - visible.length));
  return `${masked}@${domain}`;
}

const VerifyOtp = () => {
  usePageTitle('Verify OTP | BudgetWise');
  const location = useLocation();
  const navigate = useNavigate();
  const { completeSignup, setUserAuthenticated } = useAuth();
  
  const email = location.state?.email || '';
  const userData = location.state?.userData || {};
  const isSignup = location.state?.isSignup || false;

  const [digits, setDigits] = useState(Array(6).fill(''));
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    if (!email) navigate(isSignup ? '/register' : '/forgot-password');
  }, [email, navigate, isSignup]);

  useEffect(() => {
    // autofocus first input when mounted
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

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

  const handleVerify = async (e) => {
    e?.preventDefault();
    if (otpValue.length < 6) return;
    setError('');
    setMessage('');
    setLoading(true);
    try {
      if (isSignup) {
        // Handle signup verification
        await completeSignup(userData, otpValue);
        setMessage('Account created successfully! Please login to continue.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Handle password reset verification
        const resp = await authService.verifyPasswordResetOtp(email, otpValue);
        setMessage(resp.message || 'OTP verified');
        navigate('/forgot-password/reset', { state: { email } });
      }
    } catch (err) {
      setError(err?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      setError('');
      setMessage('');
      setLoading(true);
      if (isSignup) {
        // Resend signup OTP
        await authService.requestSignupOtp(email);
      } else {
        // Resend password reset OTP
        await authService.requestPasswordResetOtp(email);
      }
      setMessage('OTP resent to your email');
      setResendTimer(60);
    } catch (err) {
      setError(err?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StickyNav>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>BudgetWise</Typography>
          <Box>
            <IconButton size="small" aria-label="menu" sx={{ ml: 1 }}>
              {/* placeholder hamburger for small screens */}
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="1" width="20" height="2" rx="1" fill="#0f172a" opacity="0.8"/><rect y="6" width="20" height="2" rx="1" fill="#0f172a" opacity="0.8"/><rect y="11" width="20" height="2" rx="1" fill="#0f172a" opacity="0.8"/></svg>
            </IconButton>
          </Box>
        </Box>
      </StickyNav>

      <Container>
        <Card elevation={3}>
          <Header>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a' }}>
              {isSignup ? 'Verify your email' : 'Verify your identity'}
            </Typography>
            <Subtitle variant="body2">
              Enter the 6-digit code we sent to <strong>{maskEmail(email)}</strong>
            </Subtitle>
            <Box mt={1}>
              <Link 
                component={RouterLink} 
                to={isSignup ? '/register' : '/forgot-password'} 
                underline="hover" 
                sx={{ fontWeight: 600, color: '#2563eb' }}
              >
                Change email
              </Link>
            </Box>
          </Header>

          {message && (
            <SuccessBanner>
              <CheckCircleIcon sx={{ color: '#065f46' }} />
              <Typography variant="body2" sx={{ color: '#065f46' }}>{message}</Typography>
            </SuccessBanner>
          )}
          {error && (
            <Box mb={1}>
              <Typography variant="body2" sx={{ color: '#dc2626', fontWeight: 600 }}>{error}</Typography>
            </Box>
          )}

          <form onSubmit={handleVerify} onPaste={handlePaste}>
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
                />
              ))}
            </OtpRow>

            <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
              <ResendText clickable={resendTimer <= 0} onClick={handleResend} component="span">
                {resendTimer > 0 ? `Resend available in ${resendTimer}s` : 'Resend OTP'}
              </ResendText>

              <Button
                type="submit"
                variant="contained"
                disabled={loading || otpValue.length < 6}
                sx={{
                  background: 'linear-gradient(90deg,#2563eb,#1d4ed8)',
                  boxShadow: loading ? '0 6px 18px rgba(37,99,235,0.24)' : '0 8px 20px rgba(29,78,216,0.12)',
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  fontWeight: 700,
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : (isSignup ? 'Complete Signup' : 'Continue')}
              </Button>
            </Box>
          </form>
        </Card>
      </Container>
    </>
  );
};

export default VerifyOtp;
