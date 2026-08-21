import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/Sidebar.jsx";
import { EmployeeProfileProvider } from "../context/EmployeeProfileContext.jsx";

const EmployeeLayout = () => {
    const location = useLocation();

    useEffect(() => {
        /*
        ==========================================================
        FIX BROWSER BACK BUTTON AFTER LOGIN
        ==========================================================

        Before login the history can look like:

        Registration
             ↓
        Verify Email
             ↓
        Set Password
             ↓
        Login
             ↓
        Employee Dashboard

        We want:

        Employee Dashboard
             ↓ BACK
        Login

        So when the employee layout is opened, we replace the
        current history entry with Login and then add the current
        employee page after it.

        Result:

        Login
          ↓
        Employee Dashboard

        Pressing BACK from Dashboard goes to Login.
        ==========================================================
        */

        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        // Current employee URL
        const currentPath =
            location.pathname +
            location.search +
            location.hash;

        // Replace the current history entry with Login
        window.history.replaceState(
            {
                skillMatrixLogin: true
            },
            "",
            "/login"
        );

        // Add the employee page after Login
        window.history.pushState(
            {
                skillMatrixEmployee: true
            },
            "",
            currentPath
        );

    }, []);

    return (
        <EmployeeProfileProvider>

            <div className="relative min-h-screen bg-gray-50">

                {/* ==========================================
                    SIDEBAR
                ========================================== */}

                <Sidebar />


                {/* ==========================================
                    EMPLOYEE CONTENT
                ========================================== */}

                <main className="ml-64 min-h-screen p-6">

                    <div className="mx-auto w-full max-w-7xl">

                        <Outlet />

                    </div>

                </main>

            </div>

        </EmployeeProfileProvider>
    );
};

export default EmployeeLayout;