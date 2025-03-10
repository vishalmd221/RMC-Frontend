import React from 'react';
import { getContractInstance } from '../utils/contract';

const ContractIntegration = () => {
  const getPropertyDetails = async (tokenId) => {
    try {
      const contract = getContractInstance();
      const details = await contract.tokenIdDetails(tokenId);
      console.log('Property Details:', details);
    } catch (error) {
      console.error('Error fetching property details:', error);
    }
  };

  // getPropertyDetails(1); //THIS FUNCTION CALL IS FOR TESTING PURPOSE ONLY.
};

export default ContractIntegration;
