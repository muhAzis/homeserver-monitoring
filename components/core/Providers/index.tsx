import React from 'react'
import QueryProvider from './QueryProvider'
import { ThemeProvider } from 'next-themes';

const ProvidersWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryProvider>
  );
}

export default ProvidersWrapper;