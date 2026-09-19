import axios from "axios";

const API = axios.create({
    baseURL: "https://skillmatrix-backend.onrender.com/api",

    headers: {
        "Content-Type": "application/json",
    },
});

// =========================================================
// EMPLOYEE AUTH TOKEN
// =========================================================

API.interceptors.request.use(
    (config) => {
        const token =
            sessionStorage.getItem("employeeToken");

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// =========================================================
// HANDLE UNAUTHORIZED EMPLOYEE SESSION
// =========================================================

API.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        if (error.response?.status === 401) {

            console.warn(
                "Employee session expired or unauthorized."
            );

            sessionStorage.removeItem("employeeToken");
            sessionStorage.removeItem("employeeUser");
            sessionStorage.removeItem("employeeId");
            sessionStorage.removeItem("employeeEmail");
            sessionStorage.removeItem("employeeRole");

            // Admin session is not removed.
        }

        return Promise.reject(error);
    }
);

export default API;