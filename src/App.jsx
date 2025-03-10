import { useState } from 'react';

import './App.css';
import Header from './Components/Header';
import Login from './Components/Login';
import BuilderModule from './Components/Builder/Builder';
import RMCModule from './Components/RMC/Rmc';
import UserModule from './Components/User/User';

function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-center mb-8">RMC Blockchain Certificate Issuer</h1>
          <BuilderModule />
          <UserModule />
          <RMCModule />
        </div>
        <div className="p-6 text-center">
          <Login />
        </div>
      </div>
    </>
  );
}

export default App;
