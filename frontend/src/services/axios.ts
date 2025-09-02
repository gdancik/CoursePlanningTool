import axios from "axios";

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://gdancik.pythonanywhere.com/api/'
        : '/api/', // Use proxy in development
    withCredentials: true, // allows sending cookies for session auth
});

export default api;
