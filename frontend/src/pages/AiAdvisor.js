import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiSend, FiCpu, FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import usePageTitle from '../hooks/usePageTitle';

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`;

const typing = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

const PageContainer = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const AiAvatar = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px -4px rgba(139, 92, 246, 0.4);
  animation: ${pulse} 3s ease-in-out infinite;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
`;

const PageSubtitle = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
`;

const ChatContainer = styled.div`
  flex: 1;
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MessagesArea = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  flex-direction: ${props => props.isUser ? 'row-reverse' : 'row'};
`;

const MessageAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.isUser ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  padding: 0.875rem 1rem;
  border-radius: ${props => props.isUser ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem'};
  background: ${props => props.isUser ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#f8fafc'};
  color: ${props => props.isUser ? 'white' : '#0f172a'};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 0.25rem;
  padding: 0.875rem 1rem;
  
  span {
    width: 8px;
    height: 8px;
    background: #94a3b8;
    border-radius: 50%;
    animation: ${typing} 1s ease-in-out infinite;
    
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
`;

const InputArea = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 0.75rem;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.875rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SendButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px -2px rgba(37, 99, 235, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuggestionChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #f1f5f9;
`;

const Chip = styled.button`
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 2rem;
  font-size: 0.8rem;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #eff6ff;
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

// Renders a single bot message line with context-aware styling
const renderLine = (line, i) => {
  const trimmed = line.trim();
  if (!trimmed) return <div key={i} style={{ height: '0.4rem' }} />;

  // Handle horizontal bars
  if (trimmed.includes('----------------')) {
    return (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}>
        <div style={{ flex: 1, borderTop: '1.5px solid rgba(15, 23, 42, 0.1)' }} />
        {trimmed.replace(/-+/g, '').trim() && (
          <span style={{ fontWeight: 600, fontSize: '0.75rem', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {trimmed.replace(/-+/g, '').trim()}
          </span>
        )}
        <div style={{ flex: 1, borderTop: '1.5px solid rgba(15, 23, 42, 0.1)' }} />
      </div>
    );
  }

  // Monospace lines for bar charts
  if (line.includes('█')) {
    return (
      <div key={i} style={{
        fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
        fontSize: '0.8rem',
        lineHeight: 1.6,
        color: '#4338ca',
        whiteSpace: 'pre',
        overflowX: 'auto',
        letterSpacing: '-0.5px'
      }}>
        {line}
      </div>
    );
  }

  const firstChar = [...trimmed][0];

  // Status Badges
  if (firstChar === '🟢' || firstChar === '🟡' || firstChar === '🔴') {
    const color = firstChar === '🟢' ? '#16a34a' : firstChar === '🟡' ? '#d97706' : '#dc2626';
    return <div key={i} style={{ fontWeight: 700, fontSize: '0.9rem', color, lineHeight: 1.8, margin: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>{trimmed}</div>;
  }

  // Section Headers
  if ('📊⚠️🎯📌💡📈📉🧠'.includes(firstChar) || trimmed.match(/^(💰|💸|💵)/u)) {
    return <div key={i} style={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.8, color: '#0f172a', marginTop: '12px', marginBottom: '4px' }}>{trimmed}</div>;
  }

  // Bullets
  if (trimmed.startsWith('•')) {
    return <div key={i} style={{ paddingLeft: '0.8rem', fontSize: '0.875rem', lineHeight: 1.6, color: '#334155', display: 'flex', gap: '8px' }}>{trimmed}</div>;
  }

  // Normal Text
  return <div key={i} style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#1e293b' }}>{line}</div>;
};

// Splits backend response on \n, literal \n, and emoji markers to ensure line-by-line rendering
const FormattedMessage = ({ text }) => {
  if (!text) return null;

  // 1. Convert literal \n strings back into real newlines
  let processed = text.replace(/\\n/g, '\n');

  // 2. Force splits before specific markers if they're stuck on the same line
  const markers = ['🟢', '🟡', '🔴', '🧠', '📊', '⚠️', '🎯', '💰', '💸', '💵', '📈', '📉', '•'];
  markers.forEach(m => {
    processed = processed.split(m).join('\n' + m);
  });

  // 3. Special handling for horizontal bars to ensure they stay on their own line
  processed = processed.replace(/(-{5,})/g, '\n$1\n');

  // 4. Split and clean up lines
  const lines = processed.split('\n')
    .map(l => l.trim())
    .filter((l, idx, arr) => {
      // Remove consecutive empty lines
      if (l === '' && idx > 0 && arr[idx - 1] === '') return false;
      return true;
    });

  return (
    <div style={{ wordBreak: 'break-word', fontFamily: 'inherit', display: 'flex', flexDirection: 'column' }}>
      {lines.map((line, i) => renderLine(line, i))}
    </div>
  );
};

const AiAdvisor = () => {
  usePageTitle('AI Advisor | BudgetWise');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, isUser: false, text: "Hi! I'm your AI Financial Advisor. I can help you with budgeting tips, spending analysis, and personalized financial advice. What would you like to know?" }
  ]);

  const suggestions = [
    "How can I save more?",
    "Analyze my spending",
    "Create a budget plan",
    "Investment tips"
  ];

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { id: Date.now(), isUser: true, text: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = authService.getToken();
      const response = await fetch('http://localhost:8081/api/chat/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const botMessage = { id: Date.now() + 1, isUser: false, text: data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, isUser: false, text: "Sorry, I'm having trouble connecting right now. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <AiAvatar>
          <FiCpu size={32} />
        </AiAvatar>
        <PageTitle>AI Financial Advisor</PageTitle>
        <PageSubtitle>Get personalized financial guidance powered by AI</PageSubtitle>
      </PageHeader>

      <ChatContainer>
        <MessagesArea>
          {messages.map(msg => (
            <Message key={msg.id} isUser={msg.isUser}>
              <MessageAvatar isUser={msg.isUser}>
                {msg.isUser ? <FiUser size={16} /> : <FiCpu size={16} />}
              </MessageAvatar>
              <MessageBubble isUser={msg.isUser}>
                {msg.isUser ? msg.text : <FormattedMessage text={msg.text} />}
              </MessageBubble>
            </Message>
          ))}
          {isLoading && (
            <Message isUser={false}>
              <MessageAvatar isUser={false}>
                <FiCpu size={16} />
              </MessageAvatar>
              <MessageBubble isUser={false}>
                <TypingIndicator>
                  <span></span>
                  <span></span>
                  <span></span>
                </TypingIndicator>
              </MessageBubble>
            </Message>
          )}
          <div ref={messagesEndRef} />
        </MessagesArea>

        <SuggestionChips>
          {suggestions.map((suggestion, idx) => (
            <Chip key={idx} onClick={() => handleSend(suggestion)}>
              {suggestion}
            </Chip>
          ))}
        </SuggestionChips>

        <InputArea>
          <ChatInput
            placeholder="Ask me anything about your finances..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <SendButton onClick={handleSend} disabled={!input.trim()}>
            <FiSend size={20} />
          </SendButton>
        </InputArea>
      </ChatContainer>
    </PageContainer>
  );
};

export default AiAdvisor;
