import React, { createContext, useContext, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = () => setIsLoggedIn(true);

  const logout = async () => {
    try {
      await signOut(auth);
setIsLoggedIn(false);
console.log('User logged out successfully');
} catch (error) {
console.error('Error logging out:', error);
}
};

return (
<AuthContext.Provider value={{ isLoggedIn, login, logout }}>
 {children}
</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
