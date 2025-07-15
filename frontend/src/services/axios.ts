import axios from "axios";

const api = axios.create({
    baseURL: 'https://gdancik.pythonanywhere.com/api/',
    withCredentials: true, // allows sending cookies for session auth
});

export default api;
