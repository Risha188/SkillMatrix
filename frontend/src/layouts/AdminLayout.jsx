import React, { useState } from "react";

import {
    NavLink,
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { useAdmin } from "../context/AdminContext.jsx";

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        currentAdmin,
        logoutAdmin,
    } = useAdmin();

    // =========================================================
    // LOGOUT MODAL STATE
    // =========================================================

    const [showLogoutModal, setShowLogoutModal] =
        useState(false);

    // =========================================================
    // OPEN LOGOUT MODAL
    // =========================================================

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    // =========================================================
    // CONFIRM LOGOUT
    // =========================================================

    const confirmLogout = () => {
        // Clear AdminContext session
        logoutAdmin();

        // =====================================================
        // CLEAR AUTHENTICATION TOKENS
        // =====================================================

        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("skillmatrix_token");

        // =====================================================
        // CLEAR ADMIN / USER INFORMATION
        // =====================================================

        localStorage.removeItem("admin");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("employeeId");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("adminId");

        // =====================================================
        // CLOSE MODAL
        // =====================================================

        setShowLogoutModal(false);

        // =====================================================
        // GO TO ADMIN LOGIN
        // =====================================================

        navigate("/admin/login", {
            replace: true,
        });
    };

    // =========================================================
    // CLOSE LOGOUT MODAL
    // =========================================================

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    // =========================================================
    // NAVIGATION
    // =========================================================

    const navItems = [
        {
            name: "Dashboard",
            path: "/admin/dashboard",
        },
        {
            name: "Employees",
            path: "/admin/employees",
        },
        {
            name: "All Projects",
            path: "/admin/allprojects",
        },
        {
            name: "Assigned Projects",
            path: "/admin/assignedproject",
        },
    ];

    // =========================================================
    // PROJECT PAGE CHECK
    // =========================================================

    const isProjectPage =
        location.pathname.includes(
            "/admin/projectdetails"
        ) ||
        location.pathname.includes(
            "/admin/reassign-project"
        );

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <div className="min-h-screen bg-slate-100">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-slate-900 text-white shadow-2xl">

                {/* =================================================
                    BRAND
                ================================================= */}

                <div className="flex h-20 shrink-0 items-center border-b border-slate-700 px-6">

                    <div>
                        <h1 className="text-xl font-bold text-white">
                            Admin Panel
                        </h1>

                        <p className="mt-1 text-xs text-slate-400">
                            SkillMatrix
                        </p>
                    </div>

                </div>

                {/* =================================================
                    NAVIGATION
                ================================================= */}

                <nav className="flex-1 overflow-y-auto px-3 py-6">

                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Main Menu
                    </p>

                    <div className="space-y-1">

                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}

                    </div>

                    {/* =================================================
                        PROJECT NAVIGATION
                    ================================================= */}

                    {isProjectPage && (
                        <div className="mt-8">

                            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Project
                            </p>

                            <div className="space-y-1">

                                <NavLink
                                    to="/admin/allprojects"
                                    className={({ isActive }) =>
                                        `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                                            isActive
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`
                                    }
                                >
                                    All Projects
                                </NavLink>

                                <NavLink
                                    to="/admin/assignedproject"
                                    className={({ isActive }) =>
                                        `block rounded-xl px-4 py-3 text-sm font-medium transition ${
                                            isActive
                                                ? "bg-blue-600 text-white"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`
                                    }
                                >
                                    Assigned Projects
                                </NavLink>

                            </div>

                        </div>
                    )}

                </nav>

                {/* =================================================
                    ADMIN INFORMATION
                ================================================= */}

                <div className="shrink-0 border-t border-slate-700 p-4">

                  

                    {/* =================================================
                        LOGOUT BUTTON
                    ================================================= */}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500 hover:text-white"
                    >
                        Logout
                    </button>

                </div>

            </aside>

            {/* =====================================================
                LOGOUT CONFIRMATION MODAL
            ===================================================== */}

            {showLogoutModal && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        bg-black/50
                        px-4
                        backdrop-blur-sm
                    "
                >

                    {/* =================================================
                        MODAL
                    ================================================= */}

                    <div
                        className="
                            w-full
                            max-w-md
                            rounded-2xl
                            bg-white
                            p-6
                            shadow-2xl
                        "
                    >

                        {/* =================================================
                            ICON
                        ================================================= */}

                        <div
                            className="
                                mx-auto
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-full
                                bg-red-100
                            "
                        >

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-7 w-7 text-red-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7"
                                />
                            </svg>

                        </div>

                        {/* =================================================
                            TITLE
                        ================================================= */}

                        <h2
                            className="
                                mt-5
                                text-center
                                text-xl
                                font-bold
                                text-slate-900
                            "
                        >
                            Logout
                        </h2>

                        {/* =================================================
                            MESSAGE
                        ================================================= */}

                        <p
                            className="
                                mt-2
                                text-center
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            Are you sure you want to logout
                            from the administration panel?
                        </p>

                        {/* =================================================
                            BUTTONS
                        ================================================= */}

                        <div
                            className="
                                mt-6
                                flex
                                gap-3
                            "
                        >

                            {/* CANCEL */}

                            <button
                                type="button"
                                onClick={cancelLogout}
                                className="
                                    flex-1
                                    rounded-xl
                                    border
                                    border-slate-200
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    transition
                                    hover:bg-slate-100
                                "
                            >
                                Cancel
                            </button>

                            {/* YES, LOGOUT */}

                            <button
                                type="button"
                                onClick={confirmLogout}
                                className="
                                    flex-1
                                    rounded-xl
                                    bg-red-600
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-red-700
                                "
                            >
                                Yes, Logout
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <div className="ml-64 min-h-screen">

                <main
                    className="
                        min-h-[calc(100vh-5rem)]
                        p-6
                        md:p-8
                    "
                >
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default AdminLayout;