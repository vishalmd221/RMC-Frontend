import React from 'react';
import { useAuth } from './context/AuthContext';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="bg-[#1E3A8A] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-[25px] font-semibold">RMC Blockchain App</div>

        {/* Connect/Disconnect Button */}
        <div className="flex items-center justify-between gap-x-4">
          <button className="h-[42px] p-2" onClick={logout}>
            LogOut
          </button>
          <ConnectButton label="Connect Certificate Wallet" />
        </div>
      </div>
    </header>
  );
};

export default Header;
