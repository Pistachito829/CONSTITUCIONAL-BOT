import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: any | null;
  userData: any | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, userData: null, loading: true, isAdmin: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("authStatus");
    const userName = sessionStorage.getItem("userName");
    const userRole = sessionStorage.getItem("userRole");

    if (authStatus === "authenticated" && userName) {
      const mockUser = { uid: `user_${userName}`, displayName: userName };
      const mockData = {
        uid: mockUser.uid,
        name: userName,
        role: userRole || 'student',
        createdAt: new Date().toISOString()
      };
      setUser(mockUser);
      setUserData(mockData);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading, isAdmin: userData?.role === 'professor' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
