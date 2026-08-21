import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
    const navigate = useNavigate();

    // ==========================================
    // NAVIGATION STYLE
    // ==========================================

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
            isActive
                ? "bg-blue-600 text-white shadow-md"
                : "text-white hover:bg-blue-500"
        }`;

    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {
        // Remove all authentication information
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("employeeId");
        localStorage.removeItem("isAuthenticated");

        // Go to login and replace the current history entry
        navigate("/login", {
            replace: true
        });
    };

    return (
        <aside className="fixed left-0 top-0 z-10 flex h-screen w-64 flex-col bg-blue-400 text-white shadow-xl">

            {/* =========================
                LOGO
            ========================= */}

            <div className="flex h-20 shrink-0 items-center gap-3 border-b border-blue-300 px-5">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-bold text-blue-600 shadow-md">
                    SM
                </div>

                <div>
                    <h2 className="text-lg font-bold tracking-wide">
                        SkillMatrix
                    </h2>

                    <p className="text-xs text-blue-100">
                        Employee Panel
                    </p>
                </div>

            </div>


            {/* =========================
                NAVIGATION
            ========================= */}

            <nav className="flex-1 overflow-y-auto px-4 py-6">

                <p className="mb-3 px-3 text-xs font-semibold tracking-widest text-blue-100">
                    PROFILE
                </p>

                <div className="space-y-2">

                    {/* Dashboard */}

                    <NavLink
                        to="/employee/dashboard"
                        className={navLinkClass}
                    >
                        <span>Dashboard</span>
                    </NavLink>


                    {/* Personal Information */}

                    <NavLink
                        to="/employee/personal"
                        className={navLinkClass}
                    >
                        <span>Personal Information</span>
                    </NavLink>


                    {/* Education */}

                    <NavLink
                        to="/employee/education"
                        className={navLinkClass}
                    >
                        <span>Education</span>
                    </NavLink>


                    {/* Address */}

                    <NavLink
                        to="/employee/address"
                        className={navLinkClass}
                    >
                        <span>Address</span>
                    </NavLink>


                    {/* Skills */}

                    <NavLink
                        to="/employee/skills"
                        className={navLinkClass}
                    >
                        <span>Skills</span>
                    </NavLink>


                    {/* Work Experience */}

                    <NavLink
                        to="/employee/experience"
                        className={navLinkClass}
                    >
                        <span>Work Experience</span>
                    </NavLink>


                    {/* BDM Details */}

                    <NavLink
                        to="/employee/bdm"
                        className={navLinkClass}
                    >
                        <span>BDM Details</span>
                    </NavLink>

                </div>

            </nav>


            {/* =========================
                LOGOUT
            ========================= */}

            <div className="shrink-0 border-t border-blue-300 p-4">

                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                    <span>Logout</span>
                </button>

            </div>

        </aside>
    );
};

export default Sidebar;