import React from "react";
import {NavLink} from "react-router-dom";
import "../index.css";

const Sidebar = () => {
    return (
        <aside className="sidebar">

            {/* Logo */}
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    S
                </div>

                <div>
                    <h2>SkillMatrix</h2>
                    <span>Employee Panel</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="sidebar-menu">

                <p className="menu-title">
                    PROFILE
                </p>

                <NavLink
                    to="/employee/personal"
                    className="sidebar-link"
                >
                    <span>👤</span>
                    Personal Information
                </NavLink>

                <NavLink
                    to="/employee/education"
                    className="sidebar-link"
                >
                    <span>🎓</span>
                    Education
                </NavLink>

                <NavLink
                    to="/employee/address"
                    className="sidebar-link"
                >
                    <span>📍</span>
                    Address
                </NavLink>

                <NavLink
                    to="/employee/skills"
                    className="sidebar-link"
                >
                    <span>💡</span>
                    Skills
                </NavLink>

                <NavLink
                    to="/employee/status"
                    className="sidebar-link"
                >
                    <span>📊</span>
                    Present Status
                </NavLink>

                <NavLink
                    to="/employee/bdm"
                    className="sidebar-link"
                >
                    <span>👔</span>
                    BDM Details
                </NavLink>

            </div>

            {/* Bottom */}
            <div className="sidebar-bottom">

                <NavLink
                    to="/"
                    className="sidebar-link"
                >
                    <span>🏠</span>
                    Dashboard
                </NavLink>

                <button className="logout-btn">
                    <span>🚪</span>
                    Logout
                </button>

            </div>

        </aside>
    );
};

export default Sidebar;

