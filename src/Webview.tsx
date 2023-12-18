import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}
const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function renderApp() {
  const container = document.getElementById('root');
  if (!container) {
    return;
  }

  const root = ReactDOM.createRoot(container);

  root.render(
    <ClerkProvider publishableKey={publishableKey}>
      <App />
    </ClerkProvider>
  );
}

renderApp();
