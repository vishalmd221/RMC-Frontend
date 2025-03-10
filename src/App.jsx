import React from 'react';
import './App.css';
import Header from './Components/Header';
import Login from './Components/Login';
import BuilderModule from './Components/Builder/Builder';
import UserModule from './Components/User/User';
import { useAuth } from './Components/context/AuthContext';
import Rmc from './Components/RMC/Rmc';
import ContractIntegration from './Components/contractIntegration';

function App() {
  const { isLoggedIn, userInfo } = useAuth();

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
          <Header />
          <ContractIntegration />

          <div className="container mx-auto py-8 px-4">
            {userInfo?.userType === 'Builder' && <BuilderModule />}
            {userInfo?.userType === 'User' && <UserModule />}
            {userInfo?.userType === 'RMC' && <Rmc />}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
