import ky from "ky";

const api = ky.create({
    prefix: "https://gdancik.pythonanywhere.com/api/",
    credentials: "include",
    retry: {
        limit: 0,
    },
});

export default api;