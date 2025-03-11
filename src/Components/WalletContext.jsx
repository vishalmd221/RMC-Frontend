// @ts-nocheck
import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);

  // Function to request account access and connect MetaMask
  const connectMetaMask = async () => {
    if (!window.ethereum) return;
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log(accounts);

      // Get the signer (the connected wallet)
      const signer = await provider.getSigner();

      // Get the user's account address
      const userAccount = await signer.getAddress();
      setAccount(userAccount);
      setProvider(provider);

      console.log('Connected to MetaMask with account:', userAccount);
    } catch (err) {
      setError(err.message);
      console.error('Error connecting to MetaMask:', err);
    }
  };

  // Function to disconnect (reset state)
  const disconnectMetaMask = () => {
    setAccount(null);
    setProvider(null);
    setError(null);
    console.log('Disconnected from MetaMask');
  };

  // Listen for account changes and prompt the user to reconnect if the account is not connected
  useEffect(() => {
    if (!window.ethereum) return;
    // Check if the user has already connected an account
    window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    });

    // Handle account change
    window.ethereum.on('accountsChanged', async (accounts) => {
      if (accounts.length === 0) {
        // If no accounts are connected, prompt to connect
        setAccount(null);
        setProvider(null);
        setError('Account disconnected. Please connect your wallet.');
        console.log('Account disconnected');

        // Request connection again if no account is selected
        await connectMetaMask();
      } else {
        // If the account changed, update the state with the new account
        setAccount(accounts[0]);
        setError(null);
        console.log('Account changed to', accounts[0]);
      }
    });

    // Handle network change (optional)
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });

    window.ethereum.on('accountsChanged', async (accounts) => {
      if (accounts.length === 0) {
        // If no accounts are connected, prompt to connect
        setAccount(null);
        setProvider(null);
        setError('Account disconnected. Please connect your wallet.');
        console.log('Account disconnected');

        // Request connection again if no account is selected
        await connectMetaMask();
      } else {
        // If the account changed, update the state with the new account
        setAccount(accounts[0]);
        setError(null);
        console.log('Account changed to', accounts[0]);
      }
    });
  }, []);
  return (
    <WalletContext.Provider
      value={{
        account,
        provider,
        error,
        connectMetaMask,
        disconnectMetaMask,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
