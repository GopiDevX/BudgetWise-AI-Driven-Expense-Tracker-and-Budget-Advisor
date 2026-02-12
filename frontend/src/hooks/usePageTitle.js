import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    document.title = title;
    
    return () => {
      // Optional: Reset to default title when component unmounts
      document.title = 'BudgetWise | Smart Money Management';
    };
  }, [title]);
};

export default usePageTitle;
