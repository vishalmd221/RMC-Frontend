import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getContractInstance } from '../utils/contract';

const ContractIntegration = () => {
  // const [account, setAccount] = useState(null);
  // const [contractData, setContractData] = useState(null);

  // useEffect(() => {
  //   connectWallet();
  // }, []);

  // const connectWallet = async () => {
  //   if (!window.ethereum) {
  //     alert('Please install MetaMask!');
  //     return;
  //   }

  //   const provider = new ethers.BrowserProvider(window.ethereum);
  //   const signer = await provider.getSigner();
  //   const address = await signer.getAddress();
  //   setAccount(address);
  // };

  const getPropertyDetails = async (tokenId) => {
    try {
      const contract = getContractInstance();
      const details = await contract.tokenIdDetails(tokenId);
      console.log('Property Details:', details);
    } catch (error) {
      console.error('Error fetching property details:', error);
    }
  };

  getPropertyDetails(1);
  return (
    <>
    </>
  );
};

export default ContractIntegration;
