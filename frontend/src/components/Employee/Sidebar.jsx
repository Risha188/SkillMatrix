import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    // ==========================================
    // NAVIGATION STYLE
    // ==========================================

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
            isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-white hover:bg-blue-200 hover:text-blue-600"
        }`;

    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("authToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("skillmatrix_token");

        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("employeeId");
        localStorage.removeItem("isAuthenticated");

        setShowLogoutModal(false);
        setIsMobileOpen(false);

        navigate("/login", {
            replace: true,
        });
    };

    const handleNavigation = () => {
        setIsMobileOpen(false);
    };

    return (
        <>
            {/* ==========================================
                MOBILE TOP BAR
            ========================================== */}

            <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-blue-500 bg-sky-600 px-4 text-white shadow-md md:hidden">

                <div className="flex min-w-0 items-center gap-3">

                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white shadow">
                        <img
                            src="/pcs_logo.png"
                            alt="PCS Global"
                            className="block h-full w-full object-cover"
                        />
                    </div>

                    <div className="min-w-0">

                        <h2 className="truncate text-base font-bold tracking-wide">
                            SkillMatrix
                        </h2>

                        <p className="text-[10px] text-blue-100">
                            Employee Panel
                        </p>

                    </div>

                </div>

                <button
                    type="button"
                    aria-label="Open employee menu"
                    aria-expanded={isMobileOpen}
                    onClick={() => setIsMobileOpen(true)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-700 text-xl text-white transition hover:bg-blue-800"
                >
                    ☰
                </button>

            </header>

            {/* ==========================================
                MOBILE OVERLAY
            ========================================== */}

            {isMobileOpen && (
                <button
                    type="button"
                    aria-label="Close employee menu"
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                />
            )}

            {/* ==========================================
                SIDEBAR
            ========================================== */}

            <aside
                className={`
                    fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
                    bg-sky-600 text-white shadow-xl
                    transition-transform duration-300 ease-in-out
                    md:translate-x-0
                    ${isMobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
            >

                {/* ==========================================
                    LOGO / HEADER
                ========================================== */}

                <div className="flex h-20 shrink-0 items-center justify-between gap-3 border-b border-blue-400 px-5">

                    <div className="flex min-w-0 items-center gap-3">

                        {/* PCS LOGO */}

                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white shadow-md">

                            <img
                                src="/pcs_logo.png"
                                alt="PCS Global"
                                className="block h-full w-full object-cover"
                            />

                        </div>

                        {/* TITLE */}

                        <div className="min-w-0">

                            <h2 className="truncate text-lg font-bold tracking-wide">
                                SkillMatrix
                            </h2>

                            <p className="text-xs text-blue-100">
                                Employee Panel
                            </p>

                        </div>

                    </div>

                    {/* MOBILE CLOSE */}

                    <button
                        type="button"
                        aria-label="Close employee menu"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-white hover:bg-blue-500 md:hidden"
                    >
                        ×
                    </button>

                </div>

                {/* ==========================================
                    NAVIGATION
                ========================================== */}

                <nav className="flex-1 overflow-y-auto px-3 py-5 sm:px-4 sm:py-6">

                    <p className="mb-3 px-3 text-xs font-semibold tracking-widest text-blue-100">
                        PROFILE
                    </p>

                    <div className="space-y-2">

                        <NavLink
                            to="/employee/dashboard"
                            className={navLinkClass}
                            onClick={handleNavigation}
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/employee/personal"
                            className={navLinkClass}
                            onClick={handleNavigation}
                        >
                            Personal Information
                        </NavLink>

                        <NavLink
                            to="/employee/education"
                            className={navLinkClass}
                            onClick={handleNavigation}
                        >
                            Education
                        </NavLink>

                        <NavLink
                            to="/employee/address"
                            className={navLinkClass}
                            onClick={handleNavigation}
                        >
                            Address
                        </NavLink>

                        <NavLink
                            to="/employee/skills"
                            className={navLinkClass}
                            onClick={handleNavigation}
                        >
                            Skills
                        </NavLink>

                        <NavLink
                            to="/employee/experience"
                            className={navLinkClass}
                            onClick={handleNavigation}
                        >
                            Work Experience
                        </NavLink>

                        <NavLink
                            to="/employee/bdm"
                            className={navLinkClass}
                            onClick={handleNavigation}
                        >
                            BDM Details
                        </NavLink>

                    </div>

                </nav>

                {/* ==========================================
                    LOGOUT
                ========================================== */}

                <div className="shrink-0 border-t border-blue-400 p-3 sm:p-4">

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-200 hover:text-blue-600"
                    >
                        Logout
                    </button>

                </div>

            </aside>

            {/* ==========================================
                LOGOUT CONFIRMATION
            ========================================== */}

            {showLogoutModal && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
                    role="dialog"
                    aria-modal="true"
                >

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        <h2 className="text-xl font-bold text-gray-800">
                            Confirm Logout
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Are you sure you want to logout from your employee account?
                        </p>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(false)}
                                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={confirmLogout}
                                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </>
    );
};

export default Sidebar;