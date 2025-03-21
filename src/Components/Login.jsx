import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('Buyer');
  const { login } = useAuth();

  // Static user data based on user type  
  const users = {
    Buyer: [
      { username: 'buyer1', password: 'pass1' },
      { username: 'buyer2', password: 'pass2' },
      { username: 'buyer3', password: 'pass3' },
    ],
    RMC: [
      { username: 'rmc1', password: 'pass1' },
      { username: 'rmc2', password: 'pass2' },
      { username: 'rmc3', password: 'pass3' },
    ],
    Seller: [
      { username: 'seller1', password: 'pass1' },
      { username: 'seller2', password: 'pass2' },
      { username: 'seller3', password: 'pass3' },
    ],
  };

  const handleLogin = async () => {
    const validUser = users[userType].find(
      (user) => user.username === username && user.password === password,
    );
    if (validUser) {
      login(username, userType);
      alert(`Welcome ${userType}!`);
    } else {
      alert('Invalid credentials!');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100 p-6 text-center">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

        <div className="mb-4">
          <label htmlFor="userType" className="block text-gray-700">
            User Type
          </label>
          <select
            id="userType"
            className="w-full mt-2 p-3 border border-gray-300 rounded-md"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="Buyer">Buyer</option>
            <option value="RMC">RMC Authority</option>
            <option value="Seller">Seller</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full mt-2 p-3 border border-gray-300 rounded-md"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full mt-2 p-3 border border-gray-300 rounded-md"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full py-3 mt-6 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
