import React from 'react';
import ConnectWallet from './ConnectWallet';
import { useAuth } from './context/AuthContext';

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-[25px]">RMC Blockchain App</div>

        {/* Connect/Disconnect Button */}
        <div className="flex items-center justify-between gap-x-4">
          <button className="h-[42px] p-2" onClick={logout}>
            LogOut
          </button>
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
};

export default Header;
