import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { fetchWithAuth } from "../utils/fetchWithAuth";

interface User {
  id: number;
  username: string;
  role_id: number;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Utiliser fetchWithAuth qui gère automatiquement le refresh du token
      const response = await fetchWithAuth("http://localhost:3000/api/my-profile");

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'authentification:", error);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      // await fetch("http://localhost:3000/api/logout", { method: "POST", credentials: "include" });
      setUser(null);
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
