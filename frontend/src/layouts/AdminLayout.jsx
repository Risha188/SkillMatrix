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

    const [showLogoutModal, setShowLogoutModal] =
        useState(false);

    const [isMobileOpen, setIsMobileOpen] =
        useState(false);

    // =========================================================
    // LOGOUT
    // =========================================================

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        // Clear AdminContext session
        logoutAdmin();

        // Clear authentication tokens
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("skillmatrix_token");

        // Clear stored admin/user information
        localStorage.removeItem("admin");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("isAuthenticated");

        setShowLogoutModal(false);
        setIsMobileOpen(false);

        navigate("/admin/login", {
            replace: true,
        });
    };

    // =========================================================
    // MOBILE NAVIGATION
    // =========================================================

    const handleNavigation = () => {
        setIsMobileOpen(false);
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
            "/admin/reassignproject"
        );

    // =========================================================
    // NAVIGATION LINK CLASS
    // =========================================================

    const navLinkClass = ({ isActive }) =>
        `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
            isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`;

    return (
        <div className="min-h-screen bg-slate-100">

            {/* =================================================
                MOBILE TOP BAR
            ================================================= */}

            <header
                className="
                    fixed
                    left-0
                    right-0
                    top-0
                    z-40
                    flex
                    h-16
                    items-center
                    justify-between
                    border-b
                    border-slate-700
                    bg-slate-900
                    px-4
                    text-white
                    shadow-lg
                    md:hidden
                "
            >
                {/* MOBILE BRAND */}
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg">
                        <img
                            src="/pcs_logo.png"
                            alt="PCS Global Logo"
                            className="h-full w-full object-contain p-1"
                        />
                    </div>

                    <div className="min-w-0">
                        <h1
                            className="
                                truncate
                                text-base
                                font-bold
                                text-white
                            "
                        >
                            Admin Panel
                        </h1>

                        <p
                            className="
                                truncate
                                text-[10px]
                                text-slate-400
                            "
                        >
                            SkillMatrix
                        </p>
                    </div>
                </div>

                {/* HAMBURGER */}

                <button
                    type="button"
                    aria-label="Open admin menu"
                    aria-expanded={isMobileOpen}
                    onClick={() =>
                        setIsMobileOpen(true)
                    }
                    className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-600
                        text-xl
                        text-white
                        transition
                        hover:bg-blue-700
                        active:scale-95
                    "
                >
                    ☰
                </button>

            </header>


            {/* =================================================
                MOBILE OVERLAY
            ================================================= */}

            {isMobileOpen && (
                <button
                    type="button"
                    aria-label="Close admin menu"
                    onClick={() =>
                        setIsMobileOpen(false)
                    }
                    className="
                        fixed
                        inset-0
                        z-40
                        bg-black/50
                        md:hidden
                    "
                />
            )}


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    z-50
                    flex
                    h-screen
                    w-72
                    flex-col
                    bg-slate-900
                    text-white
                    shadow-2xl
                    transition-transform
                    duration-300
                    ease-in-out

                    md:w-64
                    md:translate-x-0

                    ${
                        isMobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* =================================================
                    BRAND
                ================================================= */}

                <div
                    className="
                        flex
                        h-20
                        shrink-0
                        items-center
                        justify-between
                        gap-3
                        border-b
                        border-slate-700
                        px-5
                    "
                >

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                        "
                    >

                     <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow">
    <img
        src="/pcs_logo.png"
        alt="PCS Global Logo"
        className="h-full w-full object-contain p-1"
    />
</div>

                        <div className="min-w-0">

                            <h1
                                className="
                                    truncate
                                    text-lg
                                    font-bold
                                    text-white
                                "
                            >
                                Admin Panel
                            </h1>

                            <p
                                className="
                                    mt-1
                                    truncate
                                    text-xs
                                    text-slate-400
                                "
                            >
                                SkillMatrix
                            </p>

                        </div>

                    </div>


                    {/* MOBILE CLOSE BUTTON */}

                    <button
                        type="button"
                        aria-label="Close admin menu"
                        onClick={() =>
                            setIsMobileOpen(false)
                        }
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-xl
                            text-slate-300
                            transition
                            hover:bg-slate-800
                            hover:text-white
                            md:hidden
                        "
                    >
                        ×
                    </button>

                </div>


                {/* =================================================
                    NAVIGATION
                ================================================= */}

                <nav
                    className="
                        flex-1
                        overflow-y-auto
                        px-3
                        py-5
                        sm:px-4
                        sm:py-6
                    "
                >

                    <p
                        className="
                            mb-3
                            px-3
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wider
                            text-slate-500
                        "
                    >
                        Main Menu
                    </p>


                    <div className="space-y-1">

                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={
                                    handleNavigation
                                }
                                className={
                                    navLinkClass
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

                            <p
                                className="
                                    mb-3
                                    px-3
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-slate-500
                                "
                            >
                                Project
                            </p>


                            <div className="space-y-1">

                                <NavLink
                                    to="/admin/allprojects"
                                    onClick={
                                        handleNavigation
                                    }
                                    className={
                                        navLinkClass
                                    }
                                >
                                    All Projects
                                </NavLink>


                                <NavLink
                                    to="/admin/assignedproject"
                                    onClick={
                                        handleNavigation
                                    }
                                    className={
                                        navLinkClass
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

                <div
                    className="
                        shrink-0
                        border-t
                        border-slate-700
                        p-3
                        sm:p-4
                    "
                >

                    <div
                        className="
                            mb-3
                            rounded-xl
                            bg-slate-800
                            p-3
                        "
                    >

                        <p
                            className="
                                truncate
                                text-sm
                                font-semibold
                                text-white
                            "
                        >
                            {currentAdmin?.name ||
                                "Administrator"}
                        </p>

                        <p
                            className="
                                mt-1
                                truncate
                                text-xs
                                text-slate-400
                            "
                        >
                            {currentAdmin?.isDefault
                                ? "System Administrator"
                                : "Administrator"}
                        </p>

                    </div>


                    {/* LOGOUT */}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="
                            w-full
                            rounded-xl
                            bg-red-500/10
                            px-4
                            py-3
                            text-sm
                            font-medium
                            text-red-400
                            transition-all
                            duration-200
                            hover:bg-red-500
                            hover:text-white
                        "
                    >
                        Logout
                    </button>

                </div>

            </aside>


            {/* =================================================
                LOGOUT CONFIRMATION MODAL
            ================================================= */}

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

                    <div
                        className="
                            w-full
                            max-w-md
                            rounded-2xl
                            bg-white
                            p-5
                            shadow-2xl
                            sm:p-6
                        "
                    >

                        {/* ICON */}

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
                                className="
                                    h-7
                                    w-7
                                    text-red-600
                                "
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


                        {/* TITLE */}

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


                        {/* MESSAGE */}

                        <p
                            className="
                                mt-2
                                text-center
                                text-sm
                                leading-6
                                text-slate-500
                            "
                        >
                            Are you sure you want to
                            logout from the
                            administration panel?
                        </p>


                        {/* BUTTONS */}

                        <div
                            className="
                                mt-6
                                grid
                                grid-cols-1
                                gap-3
                                sm:grid-cols-2
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setShowLogoutModal(
                                        false
                                    )
                                }
                                className="
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


                            <button
                                type="button"
                                onClick={confirmLogout}
                                className="
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

            <div
                className="
                    min-h-screen
                    ml-0
                    pt-16
                    md:ml-64
                    md:pt-0
                "
            >

                <main
                    className="
                        min-h-[calc(100vh-4rem)]
                        w-full
                        overflow-x-hidden
                        p-4
                        sm:p-5
                        md:min-h-screen
                        md:p-6
                        lg:p-8
                    "
                >

                    <Outlet />

                </main>

            </div>

        </div>
    );
};

export default AdminLayout;