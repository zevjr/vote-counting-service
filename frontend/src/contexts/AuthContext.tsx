import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Usuários simulados para o protótipo
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: 'user-001',
    name: 'Carlos Inspetor',
    email: 'inspetor@bumonitor.br',
    password: '123456',
    role: 'inspector',
    municipality: 'Florianópolis',
  },
  {
    id: 'user-002',
    name: 'Ana Analista',
    email: 'analista@bumonitor.br',
    password: '123456',
    role: 'analyst',
    municipality: 'Florianópolis',
  },
  {
    id: 'user-003',
    name: 'João Inspetor',
    email: 'joao@bumonitor.br',
    password: '123456',
    role: 'inspector',
    municipality: 'Florianópolis',
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simula delay de autenticação
    await new Promise((resolve) => setTimeout(resolve, 800));

    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (found) {
      const { password: _pw, ...userData } = found;
      void _pw;
      setUser(userData);
      return true;
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
