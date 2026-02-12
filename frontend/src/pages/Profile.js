import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiCalendar } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #64748b;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
`;

const CoverImage = styled.div`
  height: 160px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  position: relative;
`;

const AvatarContainer = styled.div`
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 50%;
  padding: 4px;
  position: absolute;
  bottom: -60px;
  left: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const Avatar = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 700;
  color: #64748b;
`;

const CardBody = styled.div`
  padding: 5rem 2rem 2rem;
`;

const InfoGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  color: #1e293b;
  font-weight: 500;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
`;

const Profile = () => {
    usePageTitle('My Profile | BudgetWise');
    const { currentUser } = useAuth();

    if (!currentUser) return null;

    return (
        <ProfileContainer>
            <Header>
                <Title>My Profile</Title>
                <Subtitle>Manage your personal information</Subtitle>
            </Header>

            <ProfileCard>
                <CoverImage>
                    <AvatarContainer>
                        <Avatar>
                            {currentUser.email ? currentUser.email[0].toUpperCase() : <FiUser />}
                        </Avatar>
                    </AvatarContainer>
                </CoverImage>

                <CardBody>
                    <InfoGroup>
                        <Label>Email Address</Label>
                        <Value>
                            <FiMail style={{ color: '#64748b' }} />
                            {currentUser.email}
                        </Value>
                    </InfoGroup>

                    <InfoGroup>
                        <Label>Account Type</Label>
                        <Value>
                            <FiUser style={{ color: '#64748b' }} />
                            Free Plan
                        </Value>
                    </InfoGroup>
                </CardBody>
            </ProfileCard>
        </ProfileContainer>
    );
};

export default Profile;
