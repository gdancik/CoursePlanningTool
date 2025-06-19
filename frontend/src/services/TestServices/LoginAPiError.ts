import api from "../axios"; // Use your Axios instance

export const login = async (user: string, password: string): Promise<{ user: string }> => {
    try {
        const response = await api.get(
            `/test_login/?user=${encodeURIComponent(user)}&password=${encodeURIComponent(password)}`
        );

        return response.data;
    } catch (err: any) {
        if (err.response?.status === 401) {
            throw new Error("Invalid password");
        } else if (err.response?.status === 400) {
            throw new Error("Invalid format or missing parameters");
        } else {
            throw new Error("Unknown error occurred");
        }
    }
};

export const logout = async (): Promise<void> => {
    try {
        const response = await api.get("/logout/");
        if (response.status !== 200) {
            throw new Error("Failed to log out");
        }
    } catch (err) {
        console.error("Logout error:", err);
        throw err;
    }
};
