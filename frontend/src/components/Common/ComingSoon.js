import React from 'react';
import styled from 'styled-components';
import { FiClock } from 'react-icons/fi';
import usePageTitle from '../../hooks/usePageTitle';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  color: #64748b;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: #94a3b8;
  
  svg {
    width: 40px;
    height: 40px;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  max-width: 400px;
  line-height: 1.6;
`;

const ComingSoon = ({ title, description }) => {
    usePageTitle(`${title} | BudgetWise`);

    return (
        <Container>
            <IconWrapper>
                <FiClock />
            </IconWrapper>
            <Title>{title}</Title>
            <Description>{description || "We're working hard to bring you this feature. Stay tuned for updates!"}</Description>
        </Container>
    );
};

export default ComingSoon;
