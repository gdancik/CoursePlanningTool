// useLogin.ts This hook manages the hook with regards to handling user data pre google implementation

import {useState} from "react";
import {login,logout} from "../services/TestServices/LoginAPiError";
import {useAuth} from "../context/AuthContext";


export const useLogin = () =>{
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const {setUser} = useAuth();

    const handleLogin = async (user: string, password: string) => {
        setError(null);
        setMessage(null);
        try {
            const data = await login(user, password);
            setUser(data.user);
            setMessage(`Welcome, ${data.user}!`);
            return data;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setMessage(null);
            setError(null);
        } catch (err: any) {
            setError("Failed to log out.");
        }
    };

    return {message, error, handleLogin, handleLogout};
}