import { useState } from 'react';
import { Button } from '@/components/ui/Button';

const Header = () => {
  const [isConnected, setIsConnected] = useState(false);

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
