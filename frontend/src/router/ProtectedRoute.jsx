import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
    const location = useLocation();

    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    // Not logged in
    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    // Employee route but not employee
    if (userRole !== "employee") {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;