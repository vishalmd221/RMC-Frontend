import { useState } from 'react';

import './App.css';
import Header from './Components/Header';
import Login from './Components/Login';
function App() {
  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header />

        {/* Dropdown Menu */}
        <div className="relative">
          <div className="p-6 text-center">
            <Login />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
