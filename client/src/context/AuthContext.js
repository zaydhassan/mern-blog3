import React, { createContext, useContext,useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [user, setUser] = useState(null);

useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userId", userData._id); 
    localStorage.setItem("userRole", userData.role);
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

return (
<AuthContext.Provider value={{user, isLoggedIn, login, logout }}>
 {children}
</AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);