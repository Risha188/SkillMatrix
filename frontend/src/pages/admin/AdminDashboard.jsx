import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000/api";

const AdminDashboard = () => {
    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [employees, setEmployees] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // GET ADMIN TOKEN
    // =====================================================

    const getToken = () => {
        const adminToken = sessionStorage.getItem("adminToken");

        console.log(
            "================================="
        );
        console.log(
            "ADMIN DASHBOARD TOKEN CHECK"
        );
        console.log(
            "Admin token:",
            adminToken ? "FOUND" : "NOT FOUND"
        );
        console.log(
            "================================="
        );

        return adminToken;
    };

    // =====================================================
    // LOAD DASHBOARD DATA
    // =====================================================

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            // -------------------------------------------------
            // CHECK ADMIN TOKEN
            // -------------------------------------------------

            if (!token) {
                console.error(
                    "Admin authentication token not found."
                );

                setError(
                    "Admin authentication token not found. Please login again."
                );

                setLoading(false);

                return;
            }

            // -------------------------------------------------
            // REQUEST HEADERS
            // -------------------------------------------------

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };

            // =================================================
            // LOAD EMPLOYEES
            // =================================================

            console.log(
                "Loading admin employees..."
            );

            const employeeResponse = await fetch(
                `${API_BASE_URL}/admin/employees`,
                {
                    method: "GET",
                    headers,
                }
            );

            let employeeData = {};

            try {
                employeeData =
                    await employeeResponse.json();
            } catch (jsonError) {
                console.error(
                    "Employee response is not valid JSON:",
                    jsonError
                );
            }

            if (!employeeResponse.ok) {
                // -------------------------------------------------
                // TOKEN EXPIRED / INVALID
                // -------------------------------------------------

                if (
                    employeeResponse.status === 401
                ) {
                    console.error(
                        "Admin authentication failed."
                    );

                    sessionStorage.removeItem(
                        "adminToken"
                    );

                    sessionStorage.removeItem(
                        "adminUser"
                    );

                    sessionStorage.removeItem(
                        "adminId"
                    );

                    sessionStorage.removeItem(
                        "adminEmail"
                    );

                    sessionStorage.removeItem(
                        "adminRole"
                    );

                    setError(
                        "Admin session expired. Please login again."
                    );

                    setLoading(false);

                    return;
                }

                // -------------------------------------------------
                // ADMIN ACCESS DENIED
                // -------------------------------------------------

                if (
                    employeeResponse.status === 403
                ) {
                    setError(
                        employeeData.message ||
                            "Admin access required."
                    );

                    setLoading(false);

                    return;
                }

                throw new Error(
                    employeeData.message ||
                        employeeData.error ||
                        "Failed to load employees."
                );
            }

            if (
                employeeData.success === false
            ) {
                throw new Error(
                    employeeData.message ||
                        "Failed to load employees."
                );
            }

            const employeeList =
                Array.isArray(
                    employeeData.employees
                )
                    ? employeeData.employees
                    : [];

            setEmployees(employeeList);

            console.log(
                "Employees loaded:",
                employeeList.length
            );

            // =================================================
            // LOAD PROJECTS
            // =================================================

            console.log(
                "Loading admin projects..."
            );

            const projectResponse = await fetch(
                `${API_BASE_URL}/admin/projects`,
                {
                    method: "GET",
                    headers,
                }
            );

            let projectData = {};

            try {
                projectData =
                    await projectResponse.json();
            } catch (jsonError) {
                console.error(
                    "Project response is not valid JSON:",
                    jsonError
                );
            }

            if (!projectResponse.ok) {
                // -------------------------------------------------
                // TOKEN EXPIRED / INVALID
                // -------------------------------------------------

                if (
                    projectResponse.status === 401
                ) {
                    console.error(
                        "Admin authentication failed while loading projects."
                    );

                    sessionStorage.removeItem(
                        "adminToken"
                    );

                    sessionStorage.removeItem(
                        "adminUser"
                    );

                    sessionStorage.removeItem(
                        "adminId"
                    );

                    sessionStorage.removeItem(
                        "adminEmail"
                    );

                    sessionStorage.removeItem(
                        "adminRole"
                    );

                    setError(
                        "Admin session expired. Please login again."
                    );

                    setLoading(false);

                    return;
                }

                // -------------------------------------------------
                // ADMIN ACCESS DENIED
                // -------------------------------------------------

                if (
                    projectResponse.status === 403
                ) {
                    setError(
                        projectData.message ||
                            "Admin access required."
                    );

                    setLoading(false);

                    return;
                }

                throw new Error(
                    projectData.message ||
                        projectData.error ||
                        "Failed to load projects."
                );
            }

            if (
                projectData.success === false
            ) {
                throw new Error(
                    projectData.message ||
                        "Failed to load projects."
                );
            }

            const projectList =
                Array.isArray(
                    projectData.projects
                )
                    ? projectData.projects
                    : [];

            setProjects(projectList);

            console.log(
                "Projects loaded:",
                projectList.length
            );

        } catch (err) {
            console.error(
                "Dashboard loading error:",
                err
            );

            setError(
                err.message ||
                    "Failed to load dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        const token =
            sessionStorage.getItem(
                "adminToken"
            );

        if (!token) {
            console.warn(
                "No admin token found. Redirecting to admin login."
            );

            navigate(
                "/admin/login",
                {
                    replace: true,
                }
            );

            return;
        }

        loadDashboard();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // =====================================================
    // EMPLOYEE COUNTS
    // =====================================================

    const totalEmployees =
        employees.length;

    const activeEmployees =
        employees.filter(
            (employee) => {
                if (
                    employee.status ===
                    "active"
                ) {
                    return true;
                }

                if (
                    employee.status ===
                    "Active"
                ) {
                    return true;
                }

                if (
                    employee.isActive ===
                    true
                ) {
                    return true;
                }

                return false;
            }
        ).length;

    const inactiveEmployees =
        employees.filter(
            (employee) => {
                if (
                    employee.status ===
                    "inactive"
                ) {
                    return true;
                }

                if (
                    employee.status ===
                    "Inactive"
                ) {
                    return true;
                }

                if (
                    employee.isActive ===
                    false
                ) {
                    return true;
                }

                return false;
            }
        );

    // =====================================================
    // PROJECT STATUS
    // =====================================================

    const normalizeProjectStatus =
        (status) => {
            return String(
                status || ""
            )
                .trim()
                .toLowerCase();
        };

    const activeProjects =
        projects.filter(
            (project) => {
                const status =
                    normalizeProjectStatus(
                        project.status
                    );

                return (
                    status === "active"
                );
            }
        ).length;

    const completedProjects =
        projects.filter(
            (project) => {
                const status =
                    normalizeProjectStatus(
                        project.status
                    );

                return (
                    status === "completed"
                );
            }
        ).length;

    const pendingProjects =
        projects.filter(
            (project) => {
                const status =
                    normalizeProjectStatus(
                        project.status
                    );

                return (
                    status === "pending"
                );
            }
        ).length;

    const totalProjects =
        projects.length;

    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = () => {
        loadDashboard();
    };

    // =====================================================
    // DASHBOARD STATS
    // =====================================================

    const stats = [
        {
            title: "Total Employees",
            value: totalEmployees,
            description:
                "Total employees in the organization",
            bg: "bg-blue-50",
            valueColor:
                "text-blue-700",
            onClick: () =>
                navigate(
                    "/admin/employees"
                ),
        },

        {
            title: "Active Employees",
            value: activeEmployees,
            description:
                "Currently active employees",
            bg: "bg-green-50",
            valueColor:
                "text-green-700",
            onClick: () =>
                navigate(
                    "/admin/employees?status=active"
                ),
        },

        {
            title: "Total Projects",
            value: totalProjects,
            description:
                `${activeProjects} active, ${completedProjects} completed, ${pendingProjects} pending`,
            bg: "bg-purple-50",
            valueColor:
                "text-purple-700",
            onClick: () =>
                navigate(
                    "/admin/allprojects"
                ),
        },

        {
            title: "Inactive Employees",
            value: inactiveEmployees.length,
            description:
                "Employees currently inactive",
            bg: "bg-red-50",
            valueColor:
                "text-red-700",
            onClick: () =>
                navigate(
                    "/admin/employees?status=inactive"
                ),
        },
    ];

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="space-y-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex items-start justify-between">

                <div>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-slate-500">
                        Welcome to the SkillMatrix
                        administration panel.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={loading}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Loading..."
                        : "Refresh"}
                </button>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                    <p className="font-semibold text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Try Again
                    </button>

                </div>
            )}

            {/* =================================================
                MAIN STAT CARDS
            ================================================= */}

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

                {stats.map(
                    (stat) => (
                        <button
                            key={
                                stat.title
                            }
                            type="button"
                            onClick={
                                stat.onClick
                            }
                            className={`w-full rounded-2xl ${stat.bg} p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
                        >

                            <p className="text-sm font-medium text-slate-500">
                                {stat.title}
                            </p>

                            <h2
                                className={`mt-2 text-3xl font-bold ${stat.valueColor}`}
                            >
                                {loading
                                    ? "..."
                                    : stat.value}
                            </h2>

                            <p className="mt-2 text-xs text-slate-500">
                                {
                                    stat.description
                                }
                            </p>

                            <p className="mt-4 text-xs font-semibold text-slate-600">
                                Click to view details
                            </p>

                        </button>
                    )
                )}

            </div>

            {/* =================================================
                PROJECT + ADMIN
            ================================================= */}

            <div className="grid gap-6 lg:grid-cols-2">

                {/* =================================================
                    PROJECT OVERVIEW
                ================================================= */}

                <div className="rounded-2xl bg-white p-6 shadow-sm">

                    <div className="mb-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            Project Overview
                        </h2>

                        <p className="text-sm text-slate-500">
                            Current project status
                        </p>

                    </div>

                    <div className="grid grid-cols-3 gap-4">

                        {/* ACTIVE */}

                        <div className="rounded-xl bg-green-50 p-4">

                            <p className="text-xs font-medium text-slate-500">
                                Active
                            </p>

                            <p className="mt-2 text-2xl font-bold text-green-700">
                                {loading
                                    ? "..."
                                    : activeProjects}
                            </p>

                        </div>

                        {/* COMPLETED */}

                        <div className="rounded-xl bg-blue-50 p-4">

                            <p className="text-xs font-medium text-slate-500">
                                Completed
                            </p>

                            <p className="mt-2 text-2xl font-bold text-blue-700">
                                {loading
                                    ? "..."
                                    : completedProjects}
                            </p>

                        </div>

                        {/* PENDING */}

                        <div className="rounded-xl bg-orange-50 p-4">

                            <p className="text-xs font-medium text-slate-500">
                                Pending
                            </p>

                            <p className="mt-2 text-2xl font-bold text-orange-600">
                                {loading
                                    ? "..."
                                    : pendingProjects}
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/allprojects"
                            )
                        }
                        className="mt-6 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        View All Projects
                    </button>

                </div>

                {/* =================================================
                    ADMINISTRATORS
                ================================================= */}

                <div className="rounded-2xl bg-white p-6 shadow-sm">

                    <div className="mb-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            Administrators
                        </h2>

                        <p className="text-sm text-slate-500">
                            Administrator accounts
                        </p>

                    </div>

                    <div className="space-y-3">

                        <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">

                            <div>

                                <p className="font-semibold text-slate-800">
                                    System Administrator
                                </p>

                                <p className="text-xs text-slate-500">
                                    poreysouvik71@gmail.com
                                </p>

                            </div>

                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                Active
                            </span>

                        </div>

                    </div>

                </div>

            </div>

            {/* =================================================
                INACTIVE EMPLOYEES
            ================================================= */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center justify-between">

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Inactive Employees
                        </h2>

                        <p className="text-sm text-slate-500">
                            Employees who are currently inactive
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/employees?status=inactive"
                            )
                        }
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                    >
                        View All
                    </button>

                </div>

                {loading ? (

                    <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center">

                        <p className="text-sm text-slate-500">
                            Loading employees...
                        </p>

                    </div>

                ) : inactiveEmployees.length === 0 ? (

                    <div className="rounded-xl border border-dashed border-slate-300 py-10 text-center">

                        <p className="font-semibold text-slate-700">
                            No inactive employees
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                            All employees are currently active.
                        </p>

                    </div>

                ) : (

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                        {inactiveEmployees.map(
                            (employee) => {

                                const firstName =
                                    employee
                                        .personalDetails
                                        ?.firstName ||
                                    "";

                                const lastName =
                                    employee
                                        .personalDetails
                                        ?.lastName ||
                                    "";

                                const fullName =
                                    `${firstName} ${lastName}`
                                        .trim();

                                return (

                                    <button
                                        key={
                                            employee.employeeId
                                        }
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/admin/employees/${employee.employeeId}`
                                            )
                                        }
                                        className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-red-200 hover:bg-red-50 hover:shadow-sm"
                                    >

                                        <div className="flex items-center justify-between">

                                            <div>

                                                <p className="font-semibold text-slate-800">
                                                    {
                                                        fullName ||
                                                        employee.name ||
                                                        "Unknown Employee"
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {
                                                        employee.employeeId
                                                    }
                                                </p>

                                            </div>

                                            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                                                Inactive
                                            </span>

                                        </div>

                                        <p className="mt-3 text-xs text-slate-500">
                                            {
                                                employee.email ||
                                                employee.personalDetails
                                                    ?.email ||
                                                "No email"
                                            }
                                        </p>

                                    </button>

                                );
                            }
                        )}

                    </div>

                )}

            </div>

        </div>
    );
};

export default AdminDashboard;