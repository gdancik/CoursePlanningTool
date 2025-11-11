// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";

interface User {
    user: string;   // this is the id (e-mail address)
    name: string;   // users name
}

interface AuthContextType {
    user: User | null    
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // TEMPORARY: Auto-login for development (bypass Google OAuth)
    const [user, setUser] = useState<User | null>({ 
        user: "test@example.com", 
        name: "Development User" 
    });
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
