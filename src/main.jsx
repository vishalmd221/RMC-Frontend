import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { WalletProvider } from './Components/WalletContext.jsx';
import { AuthProvider } from './Components/context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WalletProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </WalletProvider>
  </StrictMode>,
);
