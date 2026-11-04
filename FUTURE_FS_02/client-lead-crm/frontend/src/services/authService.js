
import axios from "axios";

const API_URL = "https://leadflow-api-y3cf.onrender.com/api/auth";

export const loginAdmin = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, {
        email,
        password
    });

    return response.data;
};
