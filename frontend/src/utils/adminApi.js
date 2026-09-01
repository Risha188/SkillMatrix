import axios from "axios";

const ADMIN_API = axios.create({
    baseURL: "http://localhost:5000/api",

    headers: {
        "Content-Type": "application/json",
    },
});


// =========================================================
// ADMIN AUTH TOKEN
// =========================================================

ADMIN_API.interceptors.request.use(
    (config) => {

        const token =
            sessionStorage.getItem("adminToken");

        if (token) {

            config.headers =
                config.headers || {};

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
// HANDLE ADMIN AUTH ERRORS
// =========================================================

ADMIN_API.interceptors.response.use(

    (response) => {
        return response;
    },

    (error) => {

        if (
            error.response?.status === 401
        ) {

            console.warn(
                "Admin session expired or unauthorized."
            );

            // ---------------------------------------------
            // REMOVE ADMIN SESSION ONLY
            // ---------------------------------------------

            sessionStorage.removeItem(
                "adminToken"
            );

            sessionStorage.removeItem(
                "adminUser"
            );

            sessionStorage.removeItem(
                "adminUserId"
            );

            sessionStorage.removeItem(
                "adminUserEmail"
            );

            sessionStorage.removeItem(
                "adminUserRole"
            );

            sessionStorage.removeItem(
                "adminAuthenticated"
            );

            // ---------------------------------------------
            // IMPORTANT
            // ---------------------------------------------
            // Do NOT remove employee session here.
        }

        return Promise.reject(error);
    }
);


export default ADMIN_API;