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


// Simple bot message renderer — relies on backend sending \n-separated lines
const BotMessage = ({ text }) => (
    <Typography
        variant="body2"
        component="div"
        sx={{
            whiteSpace: 'pre-wrap',
            lineHeight: 1.75,
            fontSize: '0.875rem',
            color: '#1e293b',
            wordBreak: 'break-word',
        }}
    >
        {text}
    </Typography>
);

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your BudgetWise assistant. How can I help you today?", sender: 'bot' }
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

    // Hide on AI Advisor page
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

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

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
                    zIndex: 1000
                }}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </Fab>

            {isOpen && (
                <Paper
                    elevation={3}
                    sx={{
                        position: 'fixed',
                        bottom: 90,
                        right: 24,
                        width: 380,
                        height: 520,
                        display: 'flex',
                        flexDirection: 'column',
                        zIndex: 1000,
                        borderRadius: 4,
                        overflow: 'hidden',
                        bgcolor: 'background.paper'
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}
                    >
                        <BotIcon />
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            BudgetWise AI
                        </Typography>
                    </Box>

                    {/* Messages Area */}
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowY: 'auto',
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5,
                            bgcolor: 'action.hover'
                        }}
                    >
                        {messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    alignItems: 'flex-start',
                                    gap: 1
                                }}
                            >
                                {msg.sender === 'bot' && (
                                    <Box
                                        sx={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: '50%',
                                            bgcolor: 'primary.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            mt: 0.5
                                        }}
                                    >
                                        <BotIcon sx={{ fontSize: 16, color: 'white' }} />
                                    </Box>
                                )}

                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 1.5,
                                        maxWidth: '82%',
                                        borderRadius: 3,
                                        borderTopLeftRadius: msg.sender === 'bot' ? 0 : 3,
                                        borderTopRightRadius: msg.sender === 'user' ? 0 : 3,
                                        bgcolor: msg.sender === 'user' ? 'primary.main' : 'background.paper',
                                        color: msg.sender === 'user' ? 'white' : 'text.primary',
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    {msg.sender === 'bot' ? (
                                        <BotMessage text={msg.text} />
                                    ) : (
                                        <Typography variant="body2">{msg.text}</Typography>
                                    )}
                                </Paper>
                            </Box>
                        ))}
                        {isLoading && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                                <CircularProgress size={16} />
                                <Typography variant="caption" color="text.secondary">Thinking...</Typography>
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Input Area */}
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: 'background.paper',
                            borderTop: 1,
                            borderColor: 'divider',
                            display: 'flex',
                            gap: 1
                        }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 3
                                }
                            }}
                        />
                        <IconButton
                            color="primary"
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                        >
                            <SendIcon />
                        </IconButton>
                    </Box>
                </Paper>
            )}
        </>
    );
};

export default ChatBot;

