import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({
  isLoggedIn: false,
  userInfo: null,
  login: (_username, _password) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = (username, userType) => {
    const user = { username, userType };
    localStorage.setItem('userInfo', JSON.stringify(user));
    setUserInfo(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('userInfo'); 
    setIsLoggedIn(false);
    setUserInfo(null);
  };
  return (
    <AuthContext.Provider value={{ isLoggedIn, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the context
export const useAuth = () => useContext(AuthContext);
