import api from "../axios";

// Login with query params
export async function login(user: string, password: string) {
    const url = `/test_login/?user=${encodeURIComponent(user)}&password=${encodeURIComponent(password)}`;
    return api.get(url); // this sets the session
}

// Example of calling a protected route
export async function getTestData() {
    return api.get("/test_data/");
}
