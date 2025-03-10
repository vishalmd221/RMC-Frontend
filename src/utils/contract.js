import { ethers } from 'ethers';
import CONTRACT_ABI from './rmcABI (1).json';

// Load Infura RPC from environment variables
const CONTRACT_ADDRESS = '0x97d9DB4761505aB98c4247eF380f6A57D543FD49'; // Your contract address
const INFURA_RPC_URL = import.meta.env.VITE_INFURA_RPC_URL;


// ✅ Correcting the provider instantiation
const provider = new ethers.providers.JsonRpcProvider(INFURA_RPC_URL);

// Function to get a read-only contract instance
export const getContractInstance = () => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

// Function to get a contract with a signer (for transactions)
export const getSignerContract = () => {
  const PRIVATE_KEY = import.meta.env.VITE_WALLET_PRIVATE_KEY; // Load securely
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};
