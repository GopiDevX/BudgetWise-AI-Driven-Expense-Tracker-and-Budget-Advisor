import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import styled, { css } from 'styled-components';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  transition: transform 0.3s ease-in-out;

  /* Auto-hide behavior for register page */
  ${props => props.$autoHide && !props.$isHovered && css`
    transform: translateY(-100%);
  `}
  
  ${props => props.$autoHide && props.$isHovered && css`
    transform: translateY(0);
  `}

  /* Dark mode styles */
  [data-theme="dark"] & {
    background: rgba(15, 23, 42, 0.85);
    border-bottom: 1px solid rgba(75, 85, 99, 0.8);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
`;

const NavTrigger = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 20px;
  z-index: 1001;
  background: transparent;
  display: ${props => props.$show ? 'block' : 'none'};
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563eb;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  &:hover {
    color: #2563eb;
  }

  /* Dark mode styles */
  [data-theme="dark"] & {
    color: #d1d5db;
    
    &:hover {
      color: #60a5fa;
    }
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: 1px solid #dc2626;
  color: #dc2626;
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #fef2f2;
  }

  /* Dark mode styles */
  [data-theme="dark"] & {
    border-color: #ef4444;
    color: #ef4444;
    
    &:hover {
      background: rgba(239, 68, 68, 0.1);
    }
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled(Link)`
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  
  &.primary {
    background-color: #2563eb;
    color: white;
    border: 1px solid #2563eb;
    
    &:hover {
      background-color: #1d4ed8;
      border-color: #1d4ed8;
    }
  }
  
  &.outline {
    border: 1px solid #d1d5db;
    color: #4b5563;
    
    &:hover {
      background-color: #f3f4f6;
    }
  }

  /* Dark mode styles */
  [data-theme="dark"] & {
    &.outline {
      border-color: #4b5563;
      color: #d1d5db;
      
      &:hover {
        background-color: #374151;
      }
    }
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: 1px solid #d1d5db;
  color: #4b5563;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  &:hover {
    background-color: #f3f4f6;
    border-color: #9ca3af;
  }

  /* Dark mode styles */
  [data-theme="dark"] & {
    border-color: #4b5563;
    color: #f3f4f6;
    
    &:hover {
      background-color: #374151;
      border-color: #6b7280;
    }
  }
`;

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const isAuthPage = location.pathname === '/register' || location.pathname === '/login';
  const [isHovered, setIsHovered] = React.useState(false);
  const hoverTimeoutRef = React.useRef(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 100); // 100ms delay to prevents flickering
  };

  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <NavTrigger
        $show={isAuthPage}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <Nav
        id="main-navbar"
        $autoHide={isAuthPage}
        $isHovered={isHovered}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Logo to="/">BudgetWise</Logo>

        <NavLinks>
          <ThemeToggle onClick={toggleTheme} aria-label="Toggle dark mode">
            {isDarkMode ? '🌙' : '☀️'}
          </ThemeToggle>

          {isAuthenticated ? (
            <>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/expenses">Expenses</NavLink>
              <NavLink to="/faq">FAQ</NavLink>
              <LogoutButton onClick={handleLogout}>
                Logout
              </LogoutButton>
            </>
          ) : (
            <>
              <NavLink to="/#features">Features</NavLink>
              <NavLink to="/faq">FAQ</NavLink>
              <AuthButtons>
                <Button to="/login" className="outline">Login</Button>
                <Button to="/register" className="primary">Sign Up</Button>
              </AuthButtons>
            </>
          )}
        </NavLinks>
      </Nav>
    </>
  );
};

export default Navbar;
