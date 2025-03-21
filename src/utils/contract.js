// @ts-nocheck
import { ethers } from 'ethers';
import CONTRACT_ABI from './latestRmcAbi.json';
// import CONTRACT_ABI from './RmcABI.json';

const CONTRACT_ADDRESS = '0x13697f35172Ec534315Cb8c7DA65E4f075262bD9';

const provider = new ethers.providers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');

// const provider = new ethers.providers.Web3Provider(window.ethereum);
// Function to get a read-only contract instance
export const getContractInstance = () => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

// Function to get a contract with a signer (for transactions)
export const getSignerContract = async () => {
  // const PRIVATE_KEY = import.meta.env.VITE_WALLET_PRIVATE_KEY; // Load securely
  const signer = await provider.getSigner();
  // console.log({ signer });
  // const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};
