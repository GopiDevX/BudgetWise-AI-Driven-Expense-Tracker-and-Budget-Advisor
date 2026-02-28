import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatCurrency, getCurrencySymbol, CURRENCIES } from '../utils/currencyUtils';

const CurrencyContext = createContext();

const STORAGE_KEY = 'budgetwise_currency';

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within CurrencyProvider');
    }
    return context;
};

export const CurrencyProvider = ({ children }) => {
    // Default to INR; if user previously chose a currency, restore it instantly from localStorage
    const [currency, setCurrencyState] = useState(() => {
        return localStorage.getItem(STORAGE_KEY) || 'INR';
    });
    const [loading, setLoading] = useState(true);

    // Sync with backend on login to get the most up-to-date preference
    useEffect(() => {
        const loadCurrencyPreference = async () => {
            try {
                const token = localStorage.getItem('budgetwise_token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await fetch('http://localhost:8081/api/user/preferences', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.preferredCurrency) {
                        // Backend value is the source of truth — sync localStorage
                        localStorage.setItem(STORAGE_KEY, data.preferredCurrency);
                        setCurrencyState(data.preferredCurrency);
                    } else {
                        // Backend has no preference yet — push our INR default
                        const token2 = localStorage.getItem('budgetwise_token');
                        if (token2) {
                            fetch('http://localhost:8081/api/user/preferences', {
                                method: 'PUT',
                                headers: {
                                    'Authorization': `Bearer ${token2}`,
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ preferredCurrency: 'INR' }),
                            }).catch(() => { });
                        }
                    }
                }
            } catch (error) {
                console.error('CurrencyContext: Failed to load currency preference:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCurrencyPreference();
    }, []);

    // Save currency to localStorage immediately for instant persistence, then sync to backend
    const updateCurrency = async (newCurrency) => {
        setCurrencyState(newCurrency);
        localStorage.setItem(STORAGE_KEY, newCurrency);

        try {
            const token = localStorage.getItem('budgetwise_token');
            if (!token) return;

            const response = await fetch('http://localhost:8081/api/user/preferences', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ preferredCurrency: newCurrency }),
            });

            if (!response.ok) {
                throw new Error('Failed to update currency preference on server');
            }
        } catch (error) {
            console.error('CurrencyContext: Failed to save currency preference to backend:', error);
            throw error;
        }
    };

    const format = (amount, showSymbol = true) => {
        return formatCurrency(amount, currency, showSymbol);
    };

    const symbol = getCurrencySymbol(currency);
    console.log(`CurrencyContext: Current currency=${currency}, symbol=${symbol}`);

    const value = {
        currency,
        setCurrency: updateCurrency,
        format,
        symbol,
        loading,
        currencies: CURRENCIES,
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};
