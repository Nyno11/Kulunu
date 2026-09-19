import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user_session');
      if (raw) {
        const session = JSON.parse(raw);
        setUser(session);
        setToken(session.token);
      }
    } catch {}
    setInitialized(true);
  }, []);

  function login(session) {
    localStorage.setItem('user_session', JSON.stringify(session));
    setUser(session);
    setToken(session.token);
  }

  function logout() {
    localStorage.removeItem('user_session');
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, initialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
