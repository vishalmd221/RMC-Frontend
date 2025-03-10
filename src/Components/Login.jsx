import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
// import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('User');
  const { login } = useAuth();
  //   const navigate = useNavigate();

  // Static user data based on user type
  const users = {
    User: [
      { username: 'user1', password: 'pass1' },
      { username: 'user2', password: 'pass2' },
      { username: 'user3', password: 'pass3' },
    ],
    RMC: [
      { username: 'rmc1', password: 'rmcpass1' },
      { username: 'rmc2', password: 'rmcpass2' },
      { username: 'rmc3', password: 'rmcpass3' },
    ],
    Builder: [
      { username: 'builder1', password: 'builderpass1' },
      { username: 'builder2', password: 'builderpass2' },
      { username: 'builder3', password: 'builderpass3' },
    ],
  };

  const handleLogin = async () => {
    const validUser = users[userType].find(
      (user) => user.username === username && user.password === password,
    );
    if (validUser) {
      // Redirect to dashboard based on user type
      //   navigate("/dashboard");
      await login(username, userType);
      alert(`Welcome ${userType}!`);
    } else {
      alert('Invalid credentials!');
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
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
            <option value="User">User</option>
            <option value="RMC">RMC</option>
            <option value="Builder">Builder</option>
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
