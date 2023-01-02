import { useTheme } from 'next-themes';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

export const Toast = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      toastOptions={{
        className: '',
        style: {
          color: theme === 'dark' ? 'white' : 'black',
          padding: '16px',
          border: theme === 'dark' ? '1px solid #1f2937' : '1px solid #f1f5f9',
          background: theme === 'dark' ? '#1f2937' : '#f1f5f9',
        },
        success: {
          style: {
            border:
              theme === 'dark' ? '1px solid #1f2937' : '1px solid #f1f5f9',
            background: theme === 'dark' ? '#1f2937' : '#f1f5f9',
          },
        },
        error: {
          style: {
            border:
              theme === 'dark' ? '1px solid #1f2937' : '1px solid #f1f5f9',
            background: theme === 'dark' ? '#1f2937' : '#f1f5f9',
          },
        },
      }}
    />
  );
};
