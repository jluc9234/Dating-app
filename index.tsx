import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { PremiumProvider } from './contexts/PremiumContext';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { DateInteractionProvider } from './contexts/DateInteractionContext';
import { MatchProvider } from './contexts/MatchContext';
import { StackProvider } from '@stackframe/react';
import { stackClientApp } from './services/neonAuth';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <StackProvider app={stackClientApp}>
      <AuthProvider>
        <PremiumProvider>
          <NotificationProvider>
            <MatchProvider>
              <DateInteractionProvider>
                <App />
              </DateInteractionProvider>
            </MatchProvider>
          </NotificationProvider>
        </PremiumProvider>
      </AuthProvider>
    </StackProvider>
  </React.StrictMode>
);