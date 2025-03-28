import React from 'react';
import './App.css';
import Header from './Components/Header';
import Login from './Components/Login';
import SellerModule from './Components/Seller/Seller';
import BuyerModule from './Components/Buyer/Buyer';
import { useAuth } from './Components/context/AuthContext';
import Rmc from './Components/RMC/Rmc';
import { useAccount, useConnect } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function App() {
  const { isLoggedIn, userInfo } = useAuth();
  // const { connectors, connect } = useConnect();
  const { address } = useAccount();
  if (!isLoggedIn) {
    return (
      <div>
        <Login />
      </div>
    );
  }
  return (
    <>
      {isLoggedIn && (
        <div className="min-h-screen bg-gray-100">
          {/* {address && (
            <div className="text-center text-gray-500">Connected Wallet Address: {address}</div>
          )} */}
          <Header />

          <div className="container mx-auto py-8 px-4">
            {userInfo?.userType === 'Seller' && <SellerModule />}
            {userInfo?.userType === 'Buyer' && <BuyerModule />}
            {userInfo?.userType === 'RMC' && <Rmc />}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
