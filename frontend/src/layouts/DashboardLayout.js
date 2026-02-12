import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../components/Sidebar/Sidebar';
import { FiMenu } from 'react-icons/fi';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  
  [data-theme="dark"] & {
    background-color: #0f172a;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${props => props.$collapsed ? '80px' : '280px'};
  padding: 2rem;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 100vh;
  width: 100%;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 1rem;
    padding-top: 5rem; /* Space for mobile header */
  }
`;

const MobileHeader = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  z-index: 50;
  padding: 0 1rem;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    display: flex;
  }

  [data-theme="dark"] & {
    background: rgba(15, 23, 42, 0.8);
    border-color: #334155;
  }
`;

const MenuButton = styled.button`
  background: transparent;
  border: none;
  color: #64748b;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const LogoText = styled.span`
  font-weight: 700;
  font-size: 1.25rem;
  color: #2563eb;
`;

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <LayoutContainer>
      <Sidebar
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <MobileHeader>
        <MenuButton onClick={() => setMobileOpen(true)}>
          <FiMenu size={24} />
        </MenuButton>
        <LogoText>BudgetWise</LogoText>
        <div style={{ width: 40 }} /> {/* Spacer for balance */}
      </MobileHeader>

      <MainContent $collapsed={collapsed}>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default DashboardLayout;
