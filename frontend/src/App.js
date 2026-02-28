import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';
import './styles/darkmode.css';

import Navbar from './components/Navbar/Navbar';
import ChatBot from './components/ChatBot';


import Landing from './pages/Landing';
import Login from './pages/Login';
import LoginOTP from './pages/LoginOTP';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Transactions from './pages/Transactions';
import FAQ from './pages/FAQ';
import AiInsights from './pages/AiInsights';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Accounts from './pages/Accounts';
import Analytics from './pages/Analytics';
import AiAdvisor from './pages/AiAdvisor';
import Categories from './pages/Categories';
import Upgrade from './pages/Upgrade';

import DashboardLayout from './layouts/DashboardLayout';

import ProtectedRoute from './components/Common/ProtectedRoute';

/* =============================
   THEME CONFIG
============================= */

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#64748b',
      light: '#94a3b8',
      dark: '#475569',
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc2626',
    },
    success: {
      main: '#16a34a',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },

  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.25,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: 16,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.2)',
          },
        },
      },
    },
  },
});

/* =============================
   APP ROOT
============================= */



function App() {
  return (
    <CustomThemeProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CurrencyProvider>
            <Router>
              <div className="App">
                <Routes>
                  {/* Public Routes with Navbar */}
                  <Route
                    path="/"
                    element={
                      <main style={{ minHeight: '100vh' }}>
                        <Landing />
                      </main>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <>
                        <Navbar />
                        <main style={{ minHeight: 'calc(100vh - 80px)' }}>
                          <Login />
                        </main>
                      </>
                    }
                  />
                  <Route
                    path="/login-otp"
                    element={
                      <>
                        <Navbar />
                        <main style={{ minHeight: 'calc(100vh - 80px)' }}>
                          <LoginOTP />
                        </main>
                      </>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <>
                        <Navbar />
                        <main style={{ minHeight: 'calc(100vh - 80px)' }}>
                          <Register />
                        </main>
                      </>
                    }
                  />
                  <Route
                    path="/faq"
                    element={
                      <>
                        <Navbar />
                        <main style={{ minHeight: 'calc(100vh - 80px)' }}>
                          <FAQ />
                        </main>
                      </>
                    }
                  />

                  {/* Protected Routes with Sidebar Layout */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout>
                          <Dashboard />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />





                  <Route
                    path="/expenses"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout>
                          <Expenses />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/transactions"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout>
                          <Transactions />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/ai-insights"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout>
                          <AiInsights />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout>
                          <Settings />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout>
                          <Profile />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/accounts"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout>
                          <Accounts />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/analytics"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout>
                          <Analytics />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/ai-advisor"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout>
                          <AiAdvisor />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/categories"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout>
                          <Categories />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/upgrade"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout>
                          <Upgrade />
                        </DashboardLayout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Other Routes */}
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/forgot-password/verify" element={<VerifyOtp />} />
                  <Route path="/forgot-password/reset" element={<ResetPassword />} />
                </Routes>
              </div>
              <ChatBot />
            </Router>
          </CurrencyProvider>
        </AuthProvider>
      </ThemeProvider>
    </CustomThemeProvider>
  );
}

export default App;
