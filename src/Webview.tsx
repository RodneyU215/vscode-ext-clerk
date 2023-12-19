import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';
import Clerk from '@clerk/clerk-js';
// @ts-ignore
const vscode = acquireVsCodeApi();

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}
const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const clerk = new Clerk(publishableKey);
clerk.__unstable__onBeforeRequest(async (requestInit) => {
  requestInit.credentials = 'omit';
  requestInit.url?.searchParams.append('_is_native', '1');

  const res = vscode.getState();
  (requestInit.headers as Headers).set(
    'authorization',
    res?.jwt || ''
  );
});

clerk.__unstable__onAfterResponse(async (_, response) => {
  const authHeader = response?.headers.get('authorization');

  if (authHeader) {
    vscode.setState({ jwt: authHeader });
  }
});

function renderApp() {
  const container = document.getElementById('root');
  if (!container) {
    return;
  }

  const root = ReactDOM.createRoot(container);

  root.render(
    <ClerkProvider publishableKey={publishableKey} Clerk={clerk}>
      <App />
    </ClerkProvider>
  );
}

renderApp();
