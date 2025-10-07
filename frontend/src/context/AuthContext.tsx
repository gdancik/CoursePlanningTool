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
    // Temporary bypass for testing - automatically set a test user
    const [user, setUser] = useState<User | null>({
        user: "test@example.com",
        name: "Test User"
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
