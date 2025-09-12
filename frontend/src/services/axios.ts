import axios from "axios";

const api = axios.create({
    //baseURL: 'http://127.0.0.1:5000/api/',
    baseURL: 'https://gdancik.pythonanywhere.com/api/',
    withCredentials: true, // allows sending cookies for session auth
});

export default api;
