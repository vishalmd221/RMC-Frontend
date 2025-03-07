import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const Header = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const connectWallet = () => {
    // Simulate connecting a wallet
    setIsConnected(true);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold">RMC Blockchain App</h1>

        {/* Dropdown Menu */}
        <div className="relative">
          <Button
            onClick={() => setMenuOpen(!menuOpen)}
            className="bg-white text-blue-600 px-4 py-2 rounded-md shadow-md"
          >
            Menu
          </Button>
          {menuOpen && (
            <ul className="absolute right-0 mt-2 bg-white text-blue-600 shadow-md rounded-md w-40">
              <li className="p-2 hover:bg-blue-100 cursor-pointer">Upload</li>
              <li className="p-2 hover:bg-blue-100 cursor-pointer">View Records</li>
              <li className="p-2 hover:bg-blue-100 cursor-pointer">Settings</li>
            </ul>
          )}
        </div>

        {/* Connect/Disconnect Button */}
        {isConnected ? (
          <Button onClick={disconnectWallet} className="bg-red-500 px-4 py-2 rounded-md">
            Disconnect
          </Button>
        ) : (
          <Button onClick={connectWallet} className="bg-green-500 px-4 py-2 rounded-md">
            Connect Wallet
          </Button>
        )}
      </div>
    </header>
  );
};

export default Header;
