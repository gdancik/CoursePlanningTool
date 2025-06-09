// /src/services/loginApiError.ts
export const login = async (user: string, password: string): Promise<{ user: string }> => {
    const response = await fetch(
        `https://cors-anywhere.herokuapp.com/https://gdancik.pythonanywhere.com/test_login/?user=${user}&password=${password}`
    );

    if (response.status === 200) {
        return response.json();
    } else if (response.status === 401) {
        throw new Error("Invalid password");
    } else if (response.status === 400) {
        throw new Error("Invalid format or missing parameters");
    } else {
        throw new Error("Unknown error occurred");
    }
};

export const logout = async (): Promise<void> => {
    try {
        const response = await fetch(
            "https://cors-anywhere.herokuapp.com/https://gdancik.pythonanywhere.com/logout/",
            {
                method: "GET",
                credentials: "include",
            }
        );
        if (!response.ok) {
            throw new Error("Failed to log out");
        }
    } catch (err) {
        console.error("Logout error:", err);
        throw err;
    }
};
