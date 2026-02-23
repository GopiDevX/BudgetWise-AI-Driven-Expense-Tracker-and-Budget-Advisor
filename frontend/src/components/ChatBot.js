import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Fab,
    Paper,
    Typography,
    IconButton,
    TextField,
    CircularProgress
} from '@mui/material';
import {
    Chat as ChatIcon,
    Close as CloseIcon,
    Send as SendIcon,
    SmartToy as BotIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

// Renders a single bot message line with context-aware styling
const renderLine = (line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} style={{ height: '0.4rem' }} />;

    // Handle horizontal bars (can be surrounded by text or alone)
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
const BotMessage = ({ text }) => {
    if (!text) return null;

    // 1. Convert literal \n strings back into real newlines
    let processed = text.replace(/\\n/g, '\n');

    // 2. Force splits before specific markers if they're stuck on the same line
    const markers = ['🟢', '🟡', '🔴', '🧠', '📊', '⚠️', '🎯', '💰', '💸', '💵', '📈', '📉', '•'];
    markers.forEach(m => {
        // Insert newline before marker if it's not already at the start or preceded by a newline
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

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your AI Financial Advisor. I can help you with budgeting tips, spending analysis, and personalized financial advice. What would you like to know?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();
    const location = useLocation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    if (location.pathname === '/ai-advisor') return null;

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages((prev) => [...prev, userMessage]);
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
                body: JSON.stringify({ message: userMessage.text })
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();
            const botMessage = { text: data.response, sender: 'bot' };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages((prev) => [
                ...prev,
                { text: "Sorry, I'm having trouble connecting right now. Please try again later.", sender: 'bot' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!user) return null;

    return (
        <>
            <Fab
                color="primary"
                aria-label="chat"
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1000,
                    boxShadow: 4
                }}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </Fab>

            {isOpen && (
                <Paper
                    elevation={6}
                    sx={{
                        position: 'fixed',
                        bottom: 90,
                        right: 24,
                        width: 400,
                        height: 550,
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 1000,
                        borderRadius: 3,
                        overflow: 'hidden',
                        bgcolor: 'background.paper',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
                    }}
                >
                    <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <BotIcon />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>BudgetWise AI Advisor</Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, bgcolor: '#f8fafc' }}>
                        {messages.map((msg, index) => (
                            <Box key={index} sx={{ display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start', gap: 1 }}>
                                {msg.sender === 'bot' && (
                                    <Box sx={{ width: 30, height: 30, borderRadius: '50%', bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', flexShrink: 0, mt: 0.5 }}>
                                        <BotIcon sx={{ fontSize: 18, color: 'white' }} />
                                    </Box>
                                )}
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        maxWidth: '85%',
                                        borderRadius: 2,
                                        borderTopLeftRadius: msg.sender === 'bot' ? 0 : 2,
                                        borderTopRightRadius: msg.sender === 'user' ? 0 : 2,
                                        bgcolor: msg.sender === 'user' ? 'primary.main' : 'white',
                                        color: msg.sender === 'user' ? 'white' : '#1e293b',
                                        boxShadow: msg.sender === 'bot' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                                    }}
                                >
                                    {msg.sender === 'bot' ? <BotMessage text={msg.text} /> : <Typography variant="body2">{msg.text}</Typography>}
                                </Paper>
                            </Box>
                        ))}
                        {isLoading && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1, ml: 1 }}>
                                <CircularProgress size={16} thickness={5} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>Analyzing data...</Typography>
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Ask me anything about your finances..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            variant="outlined"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: '#f1f5f9', border: 'none', '& fieldset': { border: 'none' } } }}
                        />
                        <IconButton color="primary" onClick={handleSend} disabled={!input.trim() || isLoading} sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' }, borderRadius: 2 }}>
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Paper>
            )}
        </>
    );
};

export default ChatBot;
