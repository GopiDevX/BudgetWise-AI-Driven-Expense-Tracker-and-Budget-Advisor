import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FiSend, FiCpu, FiUser, FiMessageSquare, FiZap } from 'react-icons/fi';
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

    const handleSend = () => {
        if (!input.trim()) return;

        setMessages(prev => [...prev, { id: Date.now(), isUser: true, text: input }]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                isUser: false,
                text: "That's a great question! Based on your recent spending patterns, I'd recommend focusing on reducing discretionary expenses. Would you like me to create a detailed savings plan for you?"
            }]);
        }, 1500);
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
                            <MessageBubble isUser={msg.isUser}>{msg.text}</MessageBubble>
                        </Message>
                    ))}
                </MessagesArea>

                <SuggestionChips>
                    {suggestions.map((suggestion, idx) => (
                        <Chip key={idx} onClick={() => setInput(suggestion)}>
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
