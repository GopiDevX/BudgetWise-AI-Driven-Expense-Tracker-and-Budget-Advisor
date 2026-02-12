import React, { useState } from 'react';
import styled from 'styled-components';
import { FiChevronDown, FiChevronUp, FiHelpCircle } from 'react-icons/fi';
import usePageTitle from '../hooks/usePageTitle';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  margin-top: 80px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
`;

const FAQContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

const FAQItem = styled.div`
  background: white;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const FAQQuestion = styled.button`
  width: 100%;
  padding: 1.5rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8fafc;
  }
  
  ${props => props.isOpen && `
    background: #f1f5f9;
    color: #2563eb;
  `}
`;

const FAQAnswer = styled.div`
  padding: 0 1.5rem;
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  
  ${props => props.isOpen && `
    padding: 0 1.5rem 1.5rem 1.5rem;
  `}
`;

const AnswerText = styled.p`
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
`;

const CategoryTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 2.5rem 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CategoryIcon = styled.span`
  color: #2563eb;
`;

const ContactSection = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 1rem;
  padding: 2rem;
  margin-top: 3rem;
  text-align: center;
  border: 1px solid #e2e8f0;
`;

const ContactTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
`;

const ContactText = styled.p`
  color: #64748b;
  margin-bottom: 1.5rem;
`;

const ContactButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }
`;

const FAQ = () => {
  // Set page title
  usePageTitle('FAQ | BudgetWise');
  
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const faqData = [
    {
      category: "Getting Started",
      icon: <FiHelpCircle />,
      questions: [
        {
          id: "what-is-budgetwise",
          question: "What is BudgetWise?",
          answer: "BudgetWise is a comprehensive personal finance management application that helps you track income, expenses, and savings in real-time. It provides visual analytics, budget tracking, and financial insights to help you make better money decisions."
        },
        {
          id: "how-to-start",
          question: "How do I get started?",
          answer: "Simply sign up for a free account, and you can start adding your income and expenses immediately. The dashboard will automatically calculate your balance and provide insights into your spending patterns."
        },
        {
          id: "is-it-free",
          question: "Is BudgetWise really free?",
          answer: "Yes! BudgetWise is completely free to use. There are no hidden charges, credit card requirements, or premium features locked behind paywalls."
        }
      ]
    },
    {
      category: "Features & Functionality",
      icon: <FiHelpCircle />,
      questions: [
        {
          id: "add-transactions",
          question: "How do I add income and expenses?",
          answer: "You can add transactions through the Dashboard using the 'Add Transaction' button, or visit the dedicated Expenses page for more detailed expense management. Simply enter the description, amount, category, and date."
        },
        {
          id: "edit-delete",
          question: "Can I edit or delete transactions?",
          answer: "Yes! You can edit or delete any transaction from the Dashboard or Expenses page. Simply click the edit or delete icons next to each transaction. The system will validate changes to maintain financial integrity."
        },
        {
          id: "data-security",
          question: "How is my data stored?",
          answer: "Your data is stored locally in your browser's localStorage, ensuring complete privacy. We don't store your financial information on external servers, giving you full control over your data."
        },
        {
          id: "real-time-updates",
          question: "Are calculations real-time?",
          answer: "Absolutely! All calculations, charts, and balance updates happen instantly when you add, edit, or delete transactions. There's no need to refresh or wait for updates."
        }
      ]
    },
    {
      category: "Financial Rules & Validation",
      icon: <FiHelpCircle />,
      questions: [
        {
          id: "negative-balance",
          question: "Can I have a negative balance?",
          answer: "No, BudgetWise prevents negative savings. The system will block expenses that would exceed your available income balance, ensuring you maintain healthy financial habits."
        },
        {
          id: "future-dates",
          question: "Can I add transactions for future dates?",
          answer: "No, BudgetWise only allows transactions for today or past dates. This prevents unrealistic financial planning and ensures all data reflects actual financial activity."
        },
        {
          id: "validation-rules",
          question: "What validation rules exist?",
          answer: "All transactions must have: positive amounts, valid dates (not in the future), descriptions, and categories. Expenses must not exceed available balance. These rules ensure data integrity."
        }
      ]
    },
    {
      category: "Technical & Support",
      icon: <FiHelpCircle />,
      questions: [
        {
          id: "browser-support",
          question: "What browsers are supported?",
          answer: "BudgetWise works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your preferred browser for the best experience."
        },
        {
          id: "mobile-support",
          question: "Can I use BudgetWise on mobile?",
          answer: "Yes! BudgetWise is fully responsive and works great on mobile devices. The interface adapts to different screen sizes for optimal viewing and interaction."
        },
        {
          id: "data-backup",
          question: "Should I backup my data?",
          answer: "Since data is stored locally, we recommend periodically exporting your transaction data for backup. You can do this by copying the data from browser developer tools if needed."
        }
      ]
    }
  ];

  return (
    <Container>
      <Header>
        <Title>Frequently Asked Questions</Title>
        <Subtitle>
          Find answers to common questions about BudgetWise and personal finance management.
        </Subtitle>
      </Header>

      <FAQContainer>
        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <CategoryTitle>
              <CategoryIcon>{category.icon}</CategoryIcon>
              {category.category}
            </CategoryTitle>
            
            {category.questions.map((item) => (
              <FAQItem key={item.id}>
                <FAQQuestion 
                  onClick={() => toggleItem(item.id)}
                  isOpen={openItems[item.id]}
                >
                  {item.question}
                  {openItems[item.id] ? <FiChevronUp /> : <FiChevronDown />}
                </FAQQuestion>
                <FAQAnswer isOpen={openItems[item.id]}>
                  <AnswerText>{item.answer}</AnswerText>
                </FAQAnswer>
              </FAQItem>
            ))}
          </div>
        ))}
      </FAQContainer>

      <ContactSection>
        <ContactTitle>Still have questions?</ContactTitle>
        <ContactText>
          Can't find the answer you're looking for? We're here to help with any questions about BudgetWise.
        </ContactText>
        <ContactButton href="mailto:support@budgetwise.com">
          <FiHelpCircle /> Contact Support
        </ContactButton>
      </ContactSection>
    </Container>
  );
};

export default FAQ;
