import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatCurrency, getCurrencySymbol, CURRENCIES } from '../utils/currencyUtils';

const CurrencyContext = createContext();

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within CurrencyProvider');
    }
    return context;
};

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('USD');
    const [loading, setLoading] = useState(true);

    // Load user's preferred currency from backend
    useEffect(() => {
        const loadCurrencyPreference = async () => {
            try {
                const token = localStorage.getItem('budgetwise_token');
                if (!token) {
                    console.log('CurrencyContext: No token found, using default USD');
                    setLoading(false);
                    return;
                }

                console.log('CurrencyContext: Loading currency preference from backend...');
                const response = await fetch('http://localhost:8081/api/user/preferences', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('CurrencyContext: Received preferences:', data);
                    if (data.preferredCurrency) {
                        console.log('CurrencyContext: Setting currency to:', data.preferredCurrency);
                        setCurrency(data.preferredCurrency);
                    }
                } else {
                    console.error('CurrencyContext: Failed to load preferences, status:', response.status);
                }
            } catch (error) {
                console.error('CurrencyContext: Failed to load currency preference:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCurrencyPreference();
    }, []);

    // Save currency preference to backend
    const updateCurrency = async (newCurrency) => {
        try {
            console.log('CurrencyContext: Saving currency preference:', newCurrency);
            const token = localStorage.getItem('budgetwise_token');
            if (!token) {
                console.log('CurrencyContext: No token, setting currency locally only');
                setCurrency(newCurrency);
                return;
            }

            const response = await fetch('http://localhost:8081/api/user/preferences', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ preferredCurrency: newCurrency }),
            });

            if (response.ok) {
                console.log('CurrencyContext: Currency saved successfully');
                setCurrency(newCurrency);
            } else {
                const errorText = await response.text();
                console.error('CurrencyContext: Failed to save, status:', response.status, 'error:', errorText);
                throw new Error('Failed to update currency preference');
            }
        } catch (error) {
            console.error('CurrencyContext: Failed to save currency preference:', error);
            throw error;
        }
    };

    const format = (amount, showSymbol = true) => {
        const result = formatCurrency(amount, currency, showSymbol);
        console.log(`CurrencyContext.format: amount=${amount}, currency=${currency}, result=${result}`);
        return result;
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
