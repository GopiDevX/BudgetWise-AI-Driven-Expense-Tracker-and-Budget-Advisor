import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { FiHome, FiCreditCard, FiList, FiTag, FiBarChart2, FiCpu, FiMessageSquare, FiZap, FiSettings, FiLogOut, FiChevronLeft, FiChevronRight, FiMenu } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const SidebarContainer = styled.div`
  height: 100vh;
  width: ${props => props.collapsed ? '80px' : '280px'};
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.02);

  /* Dark mode */
  [data-theme="dark"] & {
    background: rgba(15, 23, 42, 0.8);
    border-right: 1px solid rgba(51, 65, 85, 0.5);
  }

  @media (max-width: 768px) {
    transform: translateX(${props => props.mobileOpen ? '0' : '-100%'});
    width: 280px;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  padding: 0 0.5rem;
  overflow: hidden;
  white-space: nowrap;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1.2rem;
  flex-shrink: 0;
  box-shadow: 0 8px 16px -4px rgba(37, 99, 235, 0.3);
`;

const LogoText = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  opacity: ${props => props.collapsed ? 0 : 1};
  transition: opacity 0.2s;
  
  [data-theme="dark"] & {
    color: #f1f5f9;
  }
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;

  /* Icon wrapper to ensure fixed width */
  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: #f1f5f9;
    color: #2563eb;
    transform: translateX(4px);
  }

  &.active {
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    color: #2563eb;
    font-weight: 600;
    box-shadow: 0 4px 12px -2px rgba(37, 99, 235, 0.1);
  }

  /* Dark mode */
  [data-theme="dark"] & {
    color: #94a3b8;
    
    &:hover {
      background: rgba(30, 41, 59, 0.5);
      color: #60a5fa;
    }

    &.active {
      background: rgba(37, 99, 235, 0.15);
      color: #60a5fa;
    }
  }
`;

const NavLabel = styled.span`
  opacity: ${props => props.collapsed ? 0 : 1};
  transition: opacity 0.2s;
`;

const UserSection = styled.div`
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  [data-theme="dark"] & {
    border-top-color: rgba(51, 65, 85, 0.5);
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  overflow: hidden;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  opacity: ${props => props.collapsed ? 0 : 1};
  transition: opacity 0.2s;
  white-space: nowrap;
`;

const UserName = styled.p`
  font-weight: 600;
  font-size: 0.9rem;
  color: #0f172a;
  margin: 0;

  [data-theme="dark"] & {
    color: #f1f5f9;
  }
`;

const UserEmail = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
`;

const CollapseButton = styled.button`
  position: absolute;
  right: -12px;
  top: 48px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  z-index: 101;

  &:hover {
    color: #2563eb;
    transform: scale(1.1);
  }

  [data-theme="dark"] & {
    background: #1e293b;
    border-color: #475569;
    color: #94a3b8;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 90;
  opacity: ${props => props.open ? 1 : 0};
  pointer-events: ${props => props.open ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Sidebar = ({ isOpen, onClose, collapsed, setCollapsed }) => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
    { icon: FiCreditCard, label: 'Accounts', path: '/accounts' },
    { icon: FiList, label: 'Transactions', path: '/expenses' },
    { icon: FiTag, label: 'Categories', path: '/categories' },
    { icon: FiBarChart2, label: 'Analytics', path: '/analytics' },
    { icon: FiCpu, label: 'AI Insights', path: '/ai-insights' },
    { icon: FiMessageSquare, label: 'AI Advisor', path: '/ai-advisor' },
    { icon: FiZap, label: 'Upgrade', path: '/upgrade', highlight: true },
    { icon: FiSettings, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      <MobileOverlay open={isOpen} onClick={onClose} />
      <SidebarContainer collapsed={collapsed} mobileOpen={isOpen}>
        <CollapseButton onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
        </CollapseButton>

        <LogoContainer>
          <LogoIcon>BW</LogoIcon>
          <LogoText collapsed={collapsed}>BudgetWise</LogoText>
        </LogoContainer>

        <NavList>
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              onClick={() => isOpen && onClose()}
            >
              <item.icon />
              <NavLabel collapsed={collapsed}>{item.label}</NavLabel>
            </NavItem>
          ))}
        </NavList>

        <UserSection>
          {currentUser && (
            <UserProfile>
              <Avatar>{currentUser.email[0].toUpperCase()}</Avatar>
              <UserInfo collapsed={collapsed}>
                <UserName>User</UserName>
                <UserEmail>{currentUser.email}</UserEmail>
              </UserInfo>
            </UserProfile>
          )}

          <NavItem as="button" onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <FiLogOut />
            <NavLabel collapsed={collapsed}>Logout</NavLabel>
          </NavItem>
        </UserSection>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
