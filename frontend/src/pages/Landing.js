import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled, { keyframes, css } from 'styled-components';
import {
  FiArrowRight, FiCheck, FiBarChart2, FiShield, FiZap,
  FiPieChart, FiTrendingUp, FiTarget, FiSmartphone, FiLock, FiBell, FiX, FiMenu
} from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';

/* ─── Animations ──────────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-12px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
`;

const shimmer = keyframes`
  0%   { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const blobAnim1 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(30px, -50px) scale(1.1); }
  66%       { transform: translate(-20px, 20px) scale(0.9); }
`;

const blobAnim2 = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(-40px, 30px) scale(1.05); }
  66%       { transform: translate(30px, -30px) scale(0.95); }
`;

/* ─── Global Page Wrapper ─────────────────────────────────────── */
const Page = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #0f172a;
  overflow-x: hidden;
  background: #ffffff;
`;

/* ─── NAVBAR ──────────────────────────────────────────────────── */
const Nav = styled.nav`
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: ${props => props.$scrolled ? 'rgba(255,255,255,0.92)' : 'transparent'};
  backdrop-filter: ${props => props.$scrolled ? 'blur(20px)' : 'none'};
  border-bottom: ${props => props.$scrolled ? '1px solid rgba(37,99,235,0.08)' : 'none'};
  box-shadow: ${props => props.$scrolled ? '0 4px 20px rgba(37,99,235,0.07)' : 'none'};
  transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
`;

const NavLogo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  text-decoration: none;
`;

const NavLogoIcon = styled.div`
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  font-weight: 800;
  box-shadow: 0 4px 10px rgba(37,99,235,0.3);
`;

const NavLogoText = styled.span`
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) { display: none; }
`;

const NavLink = styled.a`
  color: #475569;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.25s;
  position: relative;
  padding-bottom: 2px;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #2563eb, #8b5cf6);
    border-radius: 2px;
    transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
  }

  &:hover { color: #2563eb; }
  &:hover::after { width: 100%; }
`;

const NavCta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 640px) { display: none; }
`;

const NavLoginBtn = styled(Link)`
  font-size: 0.9rem;
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  transition: background 0.2s;

  &:hover { background: rgba(37,99,235,0.07); }
`;

const NavSignupBtn = styled(Link)`
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  text-decoration: none;
  padding: 0.55rem 1.375rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 10px;
  box-shadow: 0 4px 14px rgba(37,99,235,0.3), 0 1px 3px rgba(37,99,235,0.15);
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);

  &:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(37,99,235,0.45); }
`;

/* ─── HERO ────────────────────────────────────────────────────── */
const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 2rem 80px;
  position: relative;
  overflow: hidden;
  background: radial-gradient(ellipse at 60% 50%, #eef4ff 0%, #ffffff 55%);
`;

const Blob = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
  z-index: 0;
  pointer-events: none;
`;

const Blob1 = styled(Blob)`
  width: 500px; height: 500px;
  background: rgba(37,99,235,0.08);
  top: -100px; right: -80px;
  animation: ${blobAnim1} 12s ease-in-out infinite;
`;

const Blob2 = styled(Blob)`
  width: 400px; height: 400px;
  background: rgba(139,92,246,0.06);
  bottom: -80px; left: -80px;
  animation: ${blobAnim2} 15s ease-in-out infinite;
`;

const Blob3 = styled(Blob)`
  width: 300px; height: 300px;
  background: rgba(6,182,212,0.05);
  top: 40%; left: 35%;
  animation: ${blobAnim1} 18s ease-in-out infinite reverse;
`;

const GridPattern = styled.div`
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(37,99,235,0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37,99,235,0.018) 1px, transparent 1px);
  background-size: 60px 60px;
  z-index: 0;
  pointer-events: none;
  mask-image: radial-gradient(ellipse at center, black 40%, transparent 100%);
`;

const HeroInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
  }
`;

const HeroText = styled.div`
  animation: ${fadeUp} 0.8s ease forwards;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(37,99,235,0.07);
  border: 1px solid rgba(37,99,235,0.12);
  color: #2563eb;
  padding: 0.375rem 0.875rem;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  letter-spacing: 0.02em;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 3.75rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.035em;
  color: #0f172a;
  margin: 0 0 1.5rem;

  span {
    background: linear-gradient(135deg, #2563eb 0%, #8b5cf6 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 1024px) { text-align: center; }
`;

const HeroSubtitle = styled.p`
  font-size: 1.15rem;
  color: #64748b;
  line-height: 1.75;
  max-width: 480px;
  margin: 0 0 2.5rem;

  @media (max-width: 1024px) { margin: 0 auto 2.5rem; }
`;

const HeroCTAGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 1024px) { justify-content: center; }
`;

const PrimaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  padding: 0.875rem 1.75rem;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 8px 25px rgba(37,99,235,0.3);
  transition: all 0.3s;

  &:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(37,99,235,0.4); }
  svg { transition: transform 0.3s; }
  &:hover svg { transform: translateX(3px); }
`;

const SecondaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #334155;
  padding: 0.875rem 1.75rem;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.3s;

  &:hover { border-color: #bfdbfe; background: #f0f7ff; transform: translateY(-2px); }
`;

const SocialProofRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;

  @media (max-width: 1024px) { justify-content: center; }
`;

const ProofAvatars = styled.div`
  display: flex;
`;

const ProofAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  background: linear-gradient(135deg, ${props => props.$c1}, ${props => props.$c2});
  margin-left: -8px;
  &:first-child { margin-left: 0; }
`;

const ProofText = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  strong { color: #0f172a; }
`;

/* ─── HERO MOCKUP ─────────────────────────────────────────────── */
const MockupWrap = styled.div`
  position: relative;
  animation: ${float} 6s ease-in-out infinite;
  transition: transform 0.4s ease;

  &::before {
    content: '';
    position: absolute;
    inset: -30px;
    background: radial-gradient(ellipse at 50% 60%, rgba(37,99,235,0.12) 0%, transparent 70%);
    z-index: -1;
    border-radius: 50%;
    filter: blur(20px);
    pointer-events: none;
  }

  &:hover { transform: perspective(1000px) rotateY(-1.5deg) rotateX(0.5deg); }

  @media (max-width: 1024px) { display: none; }
`;

const DashCard = styled.div`
  background: rgba(255,255,255,0.93);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(37,99,235,0.08);
  border-radius: 20px;
  box-shadow:
    0 30px 60px rgba(37,99,235,0.14),
    0 10px 24px rgba(37,99,235,0.06),
    0 2px 6px rgba(0,0,0,0.04),
    inset 0 1px 0 rgba(255,255,255,0.8);
  padding: 1.5rem;
  width: 420px;
`;

const DashHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const DashTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
`;

const DashLive = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 600;

  span {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #10b981;
    animation: ${pulse} 2s ease-in-out infinite;
    display: inline-block;
  }
`;

const DashStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
`;

const DashStat = styled.div`
  background: ${props => props.$primary ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#f8fafc'};
  border-radius: 14px;
  padding: 1rem;
  border: ${props => props.$primary ? 'none' : '1px solid #f1f5f9'};
`;

const DashStatLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${props => props.$primary ? 'rgba(255,255,255,0.8)' : '#94a3b8'};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
`;

const DashStatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${props => props.$primary ? 'white' : '#0f172a'};
`;

const DashStatChange = styled.div`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${props => props.$up ? '#10b981' : (props.$primary ? 'rgba(255,255,255,0.7)' : '#94a3b8')};
  margin-top: 0.125rem;
`;

const MiniBarChart = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 36px;
  margin-top: 0.5rem;
`;

const Bar = styled.div`
  flex: 1;
  border-radius: 2px;
  background: ${props => props.$primary ? 'rgba(255,255,255,0.35)' : '#2563eb'};
  height: ${props => props.$h}%;
  transition: height 0.5s ease;
`;

const DashTransactions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DashTxTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
`;

const DashTx = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.625rem 0.75rem;
  background: #f8fafc;
  border-radius: 10px;
`;

const DashTxLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const DashTxIcon = styled.div`
  width: 28px; height: 28px;
  border-radius: 8px;
  background: ${props => props.$bg};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
`;

const DashTxInfo = styled.div`
  .name { font-size: 0.8rem; font-weight: 600; color: #0f172a; }
  .date { font-size: 0.7rem; color: #94a3b8; }
`;

const DashTxAmount = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: ${props => props.$type === 'credit' ? '#10b981' : '#ef4444'};
`;

/* Floating notification card */
const AIBadge = styled.div`
  position: absolute;
  top: -30px;
  right: -30px;
  background: white;
  border: 1px solid rgba(37,99,235,0.1);
  border-radius: 14px;
  padding: 0.75rem 1rem;
  box-shadow: 0 10px 30px rgba(37,99,235,0.12);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${float} 4s ease-in-out infinite reverse;
`;

const AIBadgeIcon = styled.div`
  width: 28px; height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
`;

const AIBadgeText = styled.div`
  font-size: 0.75rem;
  .label { color: #94a3b8; font-weight: 500; }
  .value { color: #0f172a; font-weight: 700; }
`;

/* Savings badge */
const SavingsBadge = styled.div`
  position: absolute;
  bottom: -20px;
  left: -30px;
  background: white;
  border: 1px solid rgba(16,185,129,0.15);
  border-radius: 14px;
  padding: 0.75rem 1rem;
  box-shadow: 0 10px 30px rgba(16,185,129,0.1);
  display: flex;
  align-items: center;
  gap: 0.625rem;
  animation: ${float} 5s ease-in-out infinite 1s;
`;

const SavingsEmoji = styled.div`
  font-size: 1.25rem;
`;

const SavingsText = styled.div`
  font-size: 0.75rem;
  .label { color: #94a3b8; font-weight: 500; }
  .value { color: #10b981; font-weight: 700; font-size: 0.9rem; }
`;

/* ─── STATS BAR ───────────────────────────────────────────────── */
const StatsSection = styled.section`
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 3rem 2rem;
`;

const StatsInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #94a3b8;
  font-weight: 500;
`;

/* ─── FEATURES ────────────────────────────────────────────────── */
const FeaturesSection = styled.section`
  padding: 7rem 2rem;
  background: white;
`;

const SectionHeader = styled.div`
  text-align: center;
  max-width: 640px;
  margin: 0 auto 4rem;
`;

const SectionTag = styled.div`
  display: inline-block;
  background: rgba(37,99,235,0.07);
  color: #2563eb;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.375rem 1rem;
  border-radius: 100px;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
  letter-spacing: -0.025em;
  margin: 0 0 1rem;
`;

const SectionSubtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.7;
  margin: 0;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;

const FeatureCard = styled.div`
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 1.25rem;
  padding: 2rem;
  transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
  cursor: default;

  &:hover {
    border-color: rgba(37,99,235,0.18);
    box-shadow:
      0 0 0 1px rgba(37,99,235,0.06),
      0 20px 40px -10px rgba(37,99,235,0.12),
      0 6px 16px rgba(37,99,235,0.05);
    transform: translateY(-5px) scale(1.02);
  }
`;

const FeatureIconWrap = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  background: ${props => props.$bg || 'rgba(37,99,235,0.1)'};
  color: ${props => props.$color || '#2563eb'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  box-shadow: 0 2px 8px ${props => (props.$bg || 'rgba(37,99,235,0.1)').replace(')', ', 0.5)').replace('rgba(', 'rgba(')};
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  ${FeatureCard}:hover & {
    transform: scale(1.08);
    box-shadow: 0 4px 16px ${props => (props.$bg || 'rgba(37,99,235,0.1)').replace('0.1)', '0.3)')}
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.625rem;
`;

const FeatureText = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.65;
  margin: 0;
`;

/* ─── HOW IT WORKS ────────────────────────────────────────────── */
const HowSection = styled.section`
  padding: 7rem 2rem;
  background: radial-gradient(ellipse at 50% 0%, #eef4ff 0%, #f8fafc 60%);
`;

const StepsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 2rem;
    left: calc(16.7% + 1.5rem);
    right: calc(16.7% + 1.5rem);
    height: 2px;
    background: linear-gradient(90deg, #dbeafe, #c7d2fe);
    z-index: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    &::before { display: none; }
  }
`;

const StepCard = styled.div`
  text-align: center;
  position: relative;
  z-index: 1;
`;

const StepNumber = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  font-size: 1.25rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  box-shadow: 0 8px 20px rgba(37,99,235,0.3);
`;

const StepTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem;
`;

const StepText = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
`;

/* ─── TESTIMONIALS ────────────────────────────────────────────── */
const TestimonialsSection = styled.section`
  padding: 7rem 2rem;
  background: white;
`;

const TestiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: 1024px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;

const TestiCard = styled.div`
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 1.25rem;
  padding: 1.75rem;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 16px 40px rgba(37,99,235,0.08);
    border-color: rgba(37,99,235,0.12);
    transform: translateY(-3px);
  }
`;

const Stars = styled.div`
  color: #f59e0b;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const TestiQuote = styled.p`
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.7;
  margin: 0 0 1.25rem;
`;

const TestiAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

const TestiAvatar = styled.div`
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.$c1}, ${props => props.$c2});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
`;

const TestiName = styled.div`
  font-size: 0.875rem;
  font-weight: 700;
  color: #0f172a;
`;

const TestiRole = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
`;

/* ─── CTA SECTION ─────────────────────────────────────────────── */
const CtaSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.2) 0%, transparent 60%);
  }
`;

const CtaInner = styled.div`
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const CtaTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  color: white;
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin: 0 0 1.25rem;
`;

const CtaSubtitle = styled.p`
  font-size: 1.1rem;
  color: #94a3b8;
  line-height: 1.7;
  margin: 0 0 2.5rem;
`;

const CtaBtnGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const CtaPrimary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 60%, #3b82f6 100%);
  background-size: 200% auto;
  color: white;
  padding: 0.95rem 2rem;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 25px rgba(37,99,235,0.4);
  transition: all 0.3s, background-position 0.5s ease;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 35px rgba(37,99,235,0.5);
    background-position: right center;
  }
  &:hover::after { left: 150%; }
`;

const CtaSecondary = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.07);
  color: white;
  padding: 0.95rem 2rem;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.12);
  transition: all 0.3s;

  &:hover { background: rgba(255,255,255,0.12); }
`;

const CtaTrust = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
`;

const CtaTrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #64748b;
  svg { color: #2563eb; }
`;

/* ─── FOOTER ──────────────────────────────────────────────────── */
const Footer = styled.footer`
  background: #0f172a;
  padding: 4rem 2rem 2rem;
  color: white;
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid rgba(255,255,255,0.07);

  @media (max-width: 1024px) { grid-template-columns: 1fr 1fr; gap: 2rem; }
  @media (max-width: 640px)  { grid-template-columns: 1fr; }
`;

const FooterBrand = styled.div``;

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1rem;
`;

const FooterLogoIcon = styled.div`
  width: 30px; height: 30px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.875rem;
  font-weight: 800;
`;

const FooterLogoText = styled.span`
  font-size: 1.15rem;
  font-weight: 800;
  color: white;
`;

const FooterTagline = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  max-width: 280px;
`;

const FooterCol = styled.div``;

const FooterColTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #f1f5f9;
  margin-bottom: 1.25rem;
`;

const FooterLink = styled(Link)`
  display: block;
  color: #4b5563;
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  transition: color 0.25s, transform 0.25s;

  &:hover { color: #93c5fd; transform: translateX(3px); }
`;

const FooterA = styled.a`
  display: block;
  color: #4b5563;
  text-decoration: none;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  transition: color 0.25s, transform 0.25s;

  &:hover { color: #93c5fd; transform: translateX(3px); }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 640px) { flex-direction: column; text-align: center; }
`;

const Copyright = styled.p`
  color: #475569;
  font-size: 0.875rem;
  margin: 0;
`;

const FooterBadges = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const FooterBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #475569;
  svg { color: #2563eb; }
`;

/* ─── COMPONENT ───────────────────────────────────────────────── */
const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  usePageTitle('BudgetWise | AI-Powered Expense Tracker');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    { icon: <FiBarChart2 size={20} />, bg: 'rgba(37,99,235,0.1)', color: '#2563eb', title: 'Real-time Analytics', text: 'Beautiful charts and graphs that update instantly. Understand your spending patterns at a glance.' },
    { icon: <FiTarget size={20} />, bg: 'rgba(16,185,129,0.1)', color: '#10b981', title: 'Smart Budget Goals', text: 'Set monthly limits per category and get proactive alerts before you overspend.' },
    { icon: <FiZap size={20} />, bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6', title: 'AI-Powered Insights', text: 'Our AI advisor analyzes your habits and gives personalized tips to grow your savings.' },
    { icon: <FiPieChart size={20} />, bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', title: 'Expense Categories', text: 'Auto-categorize expenses with smart tagging. From food to fuel — everything sorted.' },
    { icon: <FiTrendingUp size={20} />, bg: 'rgba(6,182,212,0.1)', color: '#06b6d4', title: 'Financial Forecasting', text: 'Predict next month\'s spending based on your historical patterns. Plan ahead effortlessly.' },
    { icon: <FiShield size={20} />, bg: 'rgba(239,68,68,0.1)', color: '#ef4444', title: 'Bank-grade Security', text: '256-bit encryption for all your data. Your financial information is always private and secure.' },
  ];

  const testimonials = [
    { quote: 'BudgetWise helped me save ₹40,000 in 3 months just by showing me where my money was going. The AI insights are spot on!', name: 'Priya S.', role: 'Software Engineer, Bengaluru', c1: '#2563eb', c2: '#1d4ed8' },
    { quote: 'Switching from spreadsheets to BudgetWise was the best financial decision I made this year. It\'s so intuitive!', name: 'Arjun K.', role: 'MBA Student, Mumbai', c1: '#8b5cf6', c2: '#7c3aed' },
    { quote: 'The budget alerts saved me twice from going over this month. Love how it shows rupee breakdowns for every category.', name: 'Meera R.', role: 'Freelance Designer, Chennai', c1: '#10b981', c2: '#059669' },
  ];

  return (
    <Page>
      {/* NAVBAR */}
      <Nav $scrolled={scrolled}>
        <NavLogo to="/">
          <NavLogoIcon>₹</NavLogoIcon>
          <NavLogoText>BudgetWise</NavLogoText>
        </NavLogo>
        <NavLinks>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#how-it-works">How It Works</NavLink>
          <NavLink href="#testimonials">Reviews</NavLink>
        </NavLinks>
        <NavCta>
          {isAuthenticated ? (
            <NavSignupBtn to="/dashboard">Go to Dashboard</NavSignupBtn>
          ) : (
            <>
              <NavLoginBtn to="/login">Log in</NavLoginBtn>
              <NavSignupBtn to="/register">Get Started Free</NavSignupBtn>
            </>
          )}
        </NavCta>
      </Nav>

      {/* HERO */}
      <HeroSection>
        <Blob1 /><Blob2 /><Blob3 />
        <GridPattern />
        <HeroInner>
          <HeroText>
            <Badge>✨ AI-Powered Finance Tracker</Badge>
            <HeroTitle>
              Manage money smarter with <span>AI insights</span>
            </HeroTitle>
            <HeroSubtitle>
              Track expenses, set budgets, and unlock personalized AI recommendations — all in one beautifully simple app built for India.
            </HeroSubtitle>
            <HeroCTAGroup>
              <PrimaryBtn to={isAuthenticated ? '/dashboard' : '/register'}>
                {isAuthenticated ? 'Go to Dashboard' : 'Start for Free'} <FiArrowRight />
              </PrimaryBtn>
              <SecondaryBtn href="#features">See features</SecondaryBtn>
            </HeroCTAGroup>
            <SocialProofRow>
              <ProofAvatars>
                {[['#2563eb', '#1d4ed8'], ['#8b5cf6', '#7c3aed'], ['#10b981', '#059669'], ['#f59e0b', '#d97706']].map(([c1, c2], i) => (
                  <ProofAvatar key={i} $c1={c1} $c2={c2} />
                ))}
              </ProofAvatars>
              <ProofText><strong>2,400+</strong> users already tracking smarter</ProofText>
            </SocialProofRow>
          </HeroText>

          {/* Dashboard Mockup */}
          <MockupWrap>
            <AIBadge>
              <AIBadgeIcon><FiZap size={14} /></AIBadgeIcon>
              <AIBadgeText>
                <div className="label">AI Tip</div>
                <div className="value">Save ₹8,200 this month</div>
              </AIBadgeText>
            </AIBadge>

            <DashCard>
              <DashHeader>
                <DashTitle>BudgetWise Dashboard</DashTitle>
                <DashLive><span />Live</DashLive>
              </DashHeader>
              <DashStats>
                <DashStat $primary>
                  <DashStatLabel $primary>Total Balance</DashStatLabel>
                  <DashStatValue $primary>₹1,24,500</DashStatValue>
                  <DashStatChange $primary>Feb 2026</DashStatChange>
                  <MiniBarChart>
                    {[40, 60, 45, 80, 65, 90, 75].map((h, i) => <Bar key={i} $h={h} $primary />)}
                  </MiniBarChart>
                </DashStat>
                <DashStat>
                  <DashStatLabel>Monthly Savings</DashStatLabel>
                  <DashStatValue>₹32,500</DashStatValue>
                  <DashStatChange $up>+12.4% ↑</DashStatChange>
                  <MiniBarChart>
                    {[50, 65, 40, 75, 55, 80, 70].map((h, i) => <Bar key={i} $h={h} />)}
                  </MiniBarChart>
                </DashStat>
                <DashStat>
                  <DashStatLabel>Spent This Month</DashStatLabel>
                  <DashStatValue>₹42,300</DashStatValue>
                  <DashStatChange>↓ 8% vs last month</DashStatChange>
                </DashStat>
                <DashStat>
                  <DashStatLabel>Budget Used</DashStatLabel>
                  <DashStatValue>68%</DashStatValue>
                  <DashStatChange $up>On track ✓</DashStatChange>
                </DashStat>
              </DashStats>
              <DashTransactions>
                <DashTxTitle>Recent Transactions</DashTxTitle>
                {[
                  { icon: '💼', name: 'Salary Credit', date: 'Today', amount: '+₹85,000', type: 'credit', bg: '#dcfce7' },
                  { icon: '🛒', name: 'Big Bazaar', date: 'Yesterday', amount: '-₹2,340', type: 'debit', bg: '#fef3c7' },
                  { icon: '🍕', name: 'Swiggy Order', date: '2 days ago', amount: '-₹480', type: 'debit', bg: '#fce7f3' },
                ].map((tx, i) => (
                  <DashTx key={i}>
                    <DashTxLeft>
                      <DashTxIcon $bg={tx.bg}>{tx.icon}</DashTxIcon>
                      <DashTxInfo>
                        <div className="name">{tx.name}</div>
                        <div className="date">{tx.date}</div>
                      </DashTxInfo>
                    </DashTxLeft>
                    <DashTxAmount $type={tx.type}>{tx.amount}</DashTxAmount>
                  </DashTx>
                ))}
              </DashTransactions>
            </DashCard>

            <SavingsBadge>
              <SavingsEmoji>🎯</SavingsEmoji>
              <SavingsText>
                <div className="label">Goal Progress</div>
                <div className="value">₹1,20,000 / ₹2,00,000</div>
              </SavingsText>
            </SavingsBadge>
          </MockupWrap>
        </HeroInner>
      </HeroSection>

      {/* STATS BAR */}
      <StatsSection>
        <StatsInner>
          {[
            { number: '₹50Cr+', label: 'Expenses Tracked' },
            { number: '2,400+', label: 'Active Users' },
            { number: '98%', label: 'Satisfaction Rate' },
            { number: '4.9 ★', label: 'Average Rating' },
          ].map((s, i) => (
            <StatItem key={i}>
              <StatNumber>{s.number}</StatNumber>
              <StatLabel>{s.label}</StatLabel>
            </StatItem>
          ))}
        </StatsInner>
      </StatsSection>

      {/* FEATURES */}
      <FeaturesSection id="features">
        <SectionHeader>
          <SectionTag>Features</SectionTag>
          <SectionTitle>Everything you need to<br />master your finances</SectionTitle>
          <SectionSubtitle>
            BudgetWise packs powerful tools into an elegant, easy-to-use experience — from real-time tracking to AI-powered advice.
          </SectionSubtitle>
        </SectionHeader>
        <FeaturesGrid>
          {features.map((f, i) => (
            <FeatureCard key={i}>
              <FeatureIconWrap $bg={f.bg} $color={f.color}>{f.icon}</FeatureIconWrap>
              <FeatureTitle>{f.title}</FeatureTitle>
              <FeatureText>{f.text}</FeatureText>
            </FeatureCard>
          ))}
        </FeaturesGrid>
      </FeaturesSection>

      {/* HOW IT WORKS */}
      <HowSection id="how-it-works">
        <SectionHeader>
          <SectionTag>How It Works</SectionTag>
          <SectionTitle>Up and running in minutes</SectionTitle>
          <SectionSubtitle>
            Three simple steps to financial clarity. No complexity, no jargon — just results.
          </SectionSubtitle>
        </SectionHeader>
        <StepsRow>
          {[
            { n: '1', title: 'Create Your Account', text: 'Sign up in seconds with email or Google. No credit card needed. No hidden fees.' },
            { n: '2', title: 'Log Your Transactions', text: 'Add income and expenses manually or scan receipts with our AI receipt scanner.' },
            { n: '3', title: 'Get Smarter Every Day', text: 'Track trends, hit your goals, and receive personalized AI tips to grow your savings.' },
          ].map((s, i) => (
            <StepCard key={i}>
              <StepNumber>{s.n}</StepNumber>
              <StepTitle>{s.title}</StepTitle>
              <StepText>{s.text}</StepText>
            </StepCard>
          ))}
        </StepsRow>
      </HowSection>

      {/* TESTIMONIALS */}
      <TestimonialsSection id="testimonials">
        <SectionHeader>
          <SectionTag>Testimonials</SectionTag>
          <SectionTitle>Loved by thousands<br />across India</SectionTitle>
        </SectionHeader>
        <TestiGrid>
          {testimonials.map((t, i) => (
            <TestiCard key={i}>
              <Stars>★★★★★</Stars>
              <TestiQuote>"{t.quote}"</TestiQuote>
              <TestiAuthor>
                <TestiAvatar $c1={t.c1} $c2={t.c2}>{t.name[0]}</TestiAvatar>
                <div>
                  <TestiName>{t.name}</TestiName>
                  <TestiRole>{t.role}</TestiRole>
                </div>
              </TestiAuthor>
            </TestiCard>
          ))}
        </TestiGrid>
      </TestimonialsSection>

      {/* CTA */}
      <CtaSection>
        <CtaInner>
          <SectionTag style={{ background: 'rgba(255,255,255,0.08)', color: '#93c5fd', borderColor: 'transparent' }}>
            Start Today — It's Free
          </SectionTag>
          <CtaTitle>Take control of your money, starting now.</CtaTitle>
          <CtaSubtitle>
            Join 2,400+ smart savers who trust BudgetWise to manage their finances. Set up in under 2 minutes.
          </CtaSubtitle>
          <CtaBtnGroup>
            <CtaPrimary to={isAuthenticated ? '/dashboard' : '/register'}>
              {isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'} <FiArrowRight />
            </CtaPrimary>
            <CtaSecondary to="/login">Sign In</CtaSecondary>
          </CtaBtnGroup>
          <CtaTrust>
            {[
              [<FiCheck />, 'No credit card'],
              [<FiShield />, 'Bank-level security'],
              [<FiLock />, '256-bit encryption'],
            ].map(([icon, label], i) => (
              <CtaTrustItem key={i}>{icon}{label}</CtaTrustItem>
            ))}
          </CtaTrust>
        </CtaInner>
      </CtaSection>

      {/* FOOTER */}
      <Footer>
        <FooterInner>
          <FooterTop>
            <FooterBrand>
              <FooterLogo>
                <FooterLogoIcon>₹</FooterLogoIcon>
                <FooterLogoText>BudgetWise</FooterLogoText>
              </FooterLogo>
              <FooterTagline>
                AI-powered expense tracking and budget management designed for India.
              </FooterTagline>
            </FooterBrand>
            <FooterCol>
              <FooterColTitle>Product</FooterColTitle>
              <FooterLink to="/dashboard">Dashboard</FooterLink>
              <FooterLink to="/expenses">Expenses</FooterLink>
              <FooterLink to="/analytics">Analytics</FooterLink>
              <FooterLink to="/settings">Settings</FooterLink>
            </FooterCol>
            <FooterCol>
              <FooterColTitle>Features</FooterColTitle>
              <FooterA href="#features">AI Insights</FooterA>
              <FooterA href="#features">Budget Tracking</FooterA>
              <FooterA href="#features">Receipt Scanner</FooterA>
              <FooterA href="#features">Financial Goals</FooterA>
            </FooterCol>
            <FooterCol>
              <FooterColTitle>Company</FooterColTitle>
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterA href="#testimonials">Reviews</FooterA>
              <FooterLink to="/register">Get Started</FooterLink>
            </FooterCol>
          </FooterTop>
          <FooterBottom>
            <Copyright>© 2026 BudgetWise. Built for learning & demonstration purposes.</Copyright>
            <FooterBadges>
              <FooterBadge><FiShield size={13} /> Secure</FooterBadge>
              <FooterBadge><FiLock size={13} /> Private</FooterBadge>
              <FooterBadge><FiCheck size={13} /> Free Forever</FooterBadge>
            </FooterBadges>
          </FooterBottom>
        </FooterInner>
      </Footer>
    </Page>
  );
};

export default Landing;
