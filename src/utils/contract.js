// @ts-nocheck
import { ethers } from 'ethers';
import CONTRACT_ABI from './latestRmcAbi';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const provider = new ethers.providers.Web3Provider(window.ethereum);
  
// Function to get a read-only contract instance
export const getContractInstance = () => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

// Function to get a contract with a signer (for transactions)
export const getSignerContract = async () => {
  const PRIVATE_KEY = import.meta.env.VITE_WALLET_PRIVATE_KEY; // Load securely
  const signer = await provider.getSigner();
  // console.log({ signer });
  // const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};
