
import axios from "axios";

const api = axios.create({
   baseURL: "https://leadflow-api-y3cf.onrender.com/api"
});

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("leadflow_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
