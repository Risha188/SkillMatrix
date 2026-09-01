import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// =========================================================
// API
// =========================================================

const API_URL = "http://localhost:5000/api/admin";

// =========================================================
// ASSIGNED PROJECT PAGE
// =========================================================

const AssignedProject = () => {
    const navigate = useNavigate();

    // =====================================================
    // STATES
    // =====================================================

    const [assignedProjects, setAssignedProjects] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // GET ADMIN TOKEN
    // =====================================================

    const getAdminToken = () => {
        // -------------------------------------------------
        // PRIMARY ADMIN TOKEN
        // -------------------------------------------------

        const adminToken =
            sessionStorage.getItem("adminToken");

        if (adminToken) {
            console.log(
                "✅ ASSIGNED PROJECTS: ADMIN TOKEN FOUND"
            );

            return adminToken;
        }

        // -------------------------------------------------
        // FALLBACK
        // -------------------------------------------------

        const sessionToken =
            sessionStorage.getItem("token");

        if (sessionToken) {
            console.log(
                "✅ ASSIGNED PROJECTS: SESSION TOKEN FOUND"
            );

            return sessionToken;
        }

        const localAdminToken =
            localStorage.getItem("adminToken");

        if (localAdminToken) {
            console.log(
                "✅ ASSIGNED PROJECTS: LOCAL ADMIN TOKEN FOUND"
            );

            return localAdminToken;
        }

        const localToken =
            localStorage.getItem("token");

        if (localToken) {
            console.log(
                "✅ ASSIGNED PROJECTS: LOCAL TOKEN FOUND"
            );

            return localToken;
        }

        const authToken =
            localStorage.getItem("authToken");

        if (authToken) {
            console.log(
                "✅ ASSIGNED PROJECTS: AUTH TOKEN FOUND"
            );

            return authToken;
        }

        const accessToken =
            localStorage.getItem("accessToken");

        if (accessToken) {
            console.log(
                "✅ ASSIGNED PROJECTS: ACCESS TOKEN FOUND"
            );

            return accessToken;
        }

        const jwtToken =
            localStorage.getItem("jwt");

        if (jwtToken) {
            console.log(
                "✅ ASSIGNED PROJECTS: JWT TOKEN FOUND"
            );

            return jwtToken;
        }

        console.error(
            "❌ ASSIGNED PROJECTS: ADMIN TOKEN NOT FOUND"
        );

        return null;
    };

    // =====================================================
    // GET HEADERS
    // =====================================================

    const getHeaders = () => {
        const token = getAdminToken();

        return {
            "Content-Type": "application/json",

            ...(token
                ? {
                      Authorization: `Bearer ${token}`,
                  }
                : {}),
        };
    };

    // =====================================================
    // HANDLE ADMIN AUTH ERROR
    // =====================================================

    const handleAuthError = () => {
        console.error(
            "❌ Admin authentication failed."
        );

        // Remove ONLY admin authentication.
        // Do NOT remove employee session.
        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminUser");
        sessionStorage.removeItem("adminId");
        sessionStorage.removeItem("adminEmail");
        sessionStorage.removeItem("adminRole");

        localStorage.removeItem("adminToken");

        setAssignedProjects([]);

        setError(
            "Admin session expired. Please login again."
        );

        // Redirect after a short delay
        setTimeout(() => {
            navigate("/admin/login", {
                replace: true,
            });
        }, 1000);
    };

    // =====================================================
    // LOAD ASSIGNED PROJECTS
    // =====================================================

    const loadProjects = async () => {
        let timeoutId = null;

        try {
            setLoading(true);
            setError("");

            console.log(
                "================================="
            );

            console.log(
                "ASSIGNED PROJECTS TOKEN CHECK"
            );

            const token = getAdminToken();

            console.log(
                "Admin token:",
                token ? "FOUND" : "NOT FOUND"
            );

            console.log(
                "================================="
            );

            // -------------------------------------------------
            // NO TOKEN
            // -------------------------------------------------

            if (!token) {
                setAssignedProjects([]);

                setError(
                    "Admin authentication token not found. Please login again."
                );

                return;
            }

            // -------------------------------------------------
            // REQUEST TIMEOUT
            // -------------------------------------------------

            const controller =
                new AbortController();

            timeoutId = setTimeout(() => {
                controller.abort();
            }, 10000);

            console.log(
                "Loading assigned projects..."
            );

            // -------------------------------------------------
            // API REQUEST
            // -------------------------------------------------

            const response = await fetch(
                `${API_URL}/assigned-projects`,
                {
                    method: "GET",

                    headers: getHeaders(),

                    signal: controller.signal,
                }
            );

            // -------------------------------------------------
            // READ RESPONSE
            // -------------------------------------------------

            let data = {};

            try {
                data = await response.json();
            } catch (jsonError) {
                console.error(
                    "Failed to parse server response:",
                    jsonError
                );

                data = {};
            }

            console.log(
                "Assigned Projects Response:",
                data
            );

            console.log(
                "Assigned Projects Status:",
                response.status
            );

            // -------------------------------------------------
            // UNAUTHORIZED
            // -------------------------------------------------

            if (response.status === 401) {
                handleAuthError();
                return;
            }

            // -------------------------------------------------
            // FORBIDDEN
            // -------------------------------------------------

            if (response.status === 403) {
                setError(
                    "You do not have permission to view assigned projects."
                );

                setAssignedProjects([]);

                return;
            }

            // -------------------------------------------------
            // OTHER SERVER ERROR
            // -------------------------------------------------

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                        `Server error: ${response.status}`
                );
            }

            // -------------------------------------------------
            // GET PROJECT DATA
            // -------------------------------------------------

            const projects =
                data?.projects ||
                data?.assignedProjects ||
                data?.data ||
                [];

            if (!Array.isArray(projects)) {
                console.error(
                    "Invalid projects response:",
                    projects
                );

                setAssignedProjects([]);

                return;
            }

            // -------------------------------------------------
            // SAVE PROJECTS
            // -------------------------------------------------

            setAssignedProjects(projects);

            console.log(
                "✅ Assigned Projects Loaded:",
                projects.length
            );
        } catch (error) {
            console.error(
                "❌ Assigned Projects Error:",
                error
            );

            if (
                error?.name ===
                "AbortError"
            ) {
                setError(
                    "Backend server is not responding on port 5000."
                );
            } else {
                setError(
                    error?.message ||
                        "Failed to load assigned projects."
                );
            }

            setAssignedProjects([]);
        } finally {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            setLoading(false);
        }
    };

    // =====================================================
    // LOAD ON PAGE OPEN
    // =====================================================

    useEffect(() => {
        loadProjects();
    }, []);

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredProjects =
        assignedProjects.filter((project) => {
            const searchValue =
                String(search || "")
                    .trim()
                    .toLowerCase();

            if (!searchValue) {
                return true;
            }

            const projectName =
                String(
                    project?.name ||
                        project?.projectName ||
                        ""
                )
                    .trim()
                    .toLowerCase();

            const projectId =
                String(
                    project?.projectId ||
                        project?.projectCode ||
                        project?.code ||
                        project?._id ||
                        project?.id ||
                        ""
                )
                    .trim()
                    .toLowerCase();

            return (
                projectName.includes(
                    searchValue
                ) ||
                projectId.includes(
                    searchValue
                )
            );
        });

    // =====================================================
    // PROJECT ID
    // =====================================================

    const getProjectId = (project) => {
        return (
            project?.projectId ||
            project?.projectCode ||
            project?._id ||
            project?.id
        );
    };

    // =====================================================
    // VIEW PROJECT
    // =====================================================

    const handleViewProject = (project) => {
        const projectId =
            getProjectId(project);

        if (!projectId) {
            console.error(
                "❌ Project ID not found:",
                project
            );

            return;
        }

        navigate(
            `/admin/projectdetails/${projectId}`
        );
    };

    // =====================================================
    // REASSIGN PROJECT
    // =====================================================

    const handleReassignProject = (project) => {
        const projectId =
            getProjectId(project);

        if (!projectId) {
            console.error(
                "❌ Project ID not found for reassignment:",
                project
            );

            return;
        }

        navigate(
            `/admin/reassign-project/${projectId}`,
            {
                state: {
                    project,
                },
            }
        );
    };

    // =====================================================
    // PROJECT NAME
    // =====================================================

    const getProjectName = (project) => {
        return (
            project?.name ||
            project?.projectName ||
            "Unknown Project"
        );
    };

    // =====================================================
    // PROJECT CODE
    // =====================================================

    const getProjectCode = (project) => {
        return (
            project?.projectId ||
            project?.projectCode ||
            project?.code ||
            "—"
        );
    };

    // =====================================================
    // TEAM COUNT
    // =====================================================

    const getTeamCount = (project) => {
        if (
            Array.isArray(
                project?.employeeIds
            )
        ) {
            return project.employeeIds.length;
        }

        if (
            typeof project?.teamMemberCount ===
            "number"
        ) {
            return project.teamMemberCount;
        }

        if (
            Array.isArray(
                project?.assignments
            )
        ) {
            return project.assignments.length;
        }

        if (
            Array.isArray(
                project?.teamMembers
            )
        ) {
            return project.teamMembers.length;
        }

        if (
            Array.isArray(project?.team)
        ) {
            return project.team.length;
        }

        return 0;
    };

    // =====================================================
    // STATUS
    // =====================================================

    const getStatus = (project) => {
        const status = String(
            project?.status ||
                "pending"
        )
            .trim()
            .toLowerCase();

        if (status === "completed") {
            return "completed";
        }

        if (status === "active") {
            return "active";
        }

        return "pending";
    };

    // =====================================================
    // STATUS LABEL
    // =====================================================

    const getStatusLabel = (project) => {
        const status =
            getStatus(project);

        return (
            status.charAt(0).toUpperCase() +
            status.slice(1)
        );
    };

    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (project) => {
        const status =
            getStatus(project);

        if (status === "active") {
            return "bg-green-100 text-green-700";
        }

        if (status === "completed") {
            return "bg-blue-100 text-blue-700";
        }

        return "bg-yellow-100 text-yellow-700";
    };

    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        const parsed =
            new Date(date);

        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return "—";
        }

        return parsed.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // =====================================================
    // SUMMARY COUNTS
    // =====================================================

    const totalProjects =
        assignedProjects.length;

    const activeProjects =
        assignedProjects.filter(
            (project) =>
                getStatus(project) ===
                "active"
        ).length;

    const pendingProjects =
        assignedProjects.filter(
            (project) =>
                getStatus(project) ===
                "pending"
        ).length;

    const completedProjects =
        assignedProjects.filter(
            (project) =>
                getStatus(project) ===
                "completed"
        ).length;

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Assigned Projects
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View all projects currently
                        assigned to your team.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadProjects}
                    disabled={loading}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Refreshing..."
                        : "Refresh"}
                </button>
            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">

                    <p className="text-sm font-medium text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={loadProjects}
                        className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                        Try Again
                    </button>

                </div>
            )}

            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Projects
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-gray-800">
                        {totalProjects}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Active Projects
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-green-600">
                        {activeProjects}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Pending Projects
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-yellow-600">
                        {pendingProjects}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Completed Projects
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-blue-600">
                        {completedProjects}
                    </h2>
                </div>

            </div>

            {/* =================================================
                SEARCH
            ================================================= */}

            <div className="mb-5 rounded-xl bg-white p-4 shadow-sm">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="relative w-full sm:max-w-md">

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search by project name or project ID..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSearch("")
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>
                        )}

                    </div>

                    <p className="text-sm text-gray-500">
                        Showing{" "}
                        <span className="font-semibold text-gray-700">
                            {filteredProjects.length}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-700">
                            {assignedProjects.length}
                        </span>{" "}
                        projects
                    </p>

                </div>

            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="rounded-xl bg-white p-12 text-center shadow-sm">

                    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                    <p className="mt-4 text-sm text-gray-500">
                        Loading assigned projects...
                    </p>

                </div>

            ) : filteredProjects.length > 0 ? (

                /* =================================================
                   PROJECT LIST
                ================================================= */

                <div className="space-y-4">

                    {filteredProjects.map(
                        (project) => {

                            const projectKey =
                                project?._id ||
                                project?.projectId ||
                                project?.id;

                            return (
                                <div
                                    key={
                                        projectKey
                                    }
                                    className="rounded-xl bg-white shadow-sm transition hover:shadow-md"
                                >

                                    <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">

                                        {/* PROJECT */}

                                        <div className="min-w-0 lg:w-[25%]">

                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Project
                                            </p>

                                            <h2 className="mt-1 truncate text-base font-semibold text-gray-800">
                                                {getProjectName(
                                                    project
                                                )}
                                            </h2>

                                            <p className="mt-1 text-xs font-medium text-gray-400">
                                                {getProjectCode(
                                                    project
                                                )}
                                            </p>

                                        </div>

                                        {/* TEAM */}

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Team Members
                                            </p>

                                            <p className="mt-2 text-sm font-semibold text-gray-800">
                                                {getTeamCount(
                                                    project
                                                )}{" "}
                                                Members
                                            </p>
                                        </div>

                                        {/* START DATE */}

                                        <div className="lg:w-[14%]">

                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Start Date
                                            </p>

                                            <p className="mt-2 text-sm font-medium text-gray-700">
                                                {formatDate(
                                                    project?.startDate
                                                )}
                                            </p>

                                        </div>

                                        {/* END DATE */}

                                        <div className="lg:w-[14%]">

                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                End Date
                                            </p>

                                            <p className="mt-2 text-sm font-medium text-gray-700">
                                                {formatDate(
                                                    project?.endDate
                                                )}
                                            </p>

                                        </div>

                                        {/* STATUS */}

                                        <div className="lg:w-[12%]">

                                            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                                Status
                                            </p>

                                            <span
                                                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                                    project
                                                )}`}
                                            >
                                                {getStatusLabel(
                                                    project
                                                )}
                                            </span>

                                        </div>

                                        {/* ACTIONS */}

                                        <div className="flex gap-2 lg:w-[21%] lg:justify-end">

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleViewProject(
                                                        project
                                                    )
                                                }
                                                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                                            >
                                                View Project
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleReassignProject(
                                                        project
                                                    )
                                                }
                                                className="rounded-lg border border-blue-600 bg-white px-4 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
                                            >
                                                Reassign
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>

            ) : (

                /* =================================================
                   EMPTY STATE
                ================================================= */

                <div className="rounded-xl bg-white p-10 text-center shadow-sm">

                    {search.trim() ? (
                        <>
                            <h2 className="text-lg font-semibold text-gray-800">
                                No Projects Found
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                No project matches{" "}
                                <span className="font-medium text-gray-700">
                                    "{search}"
                                </span>
                                .
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    setSearch("")
                                }
                                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                            >
                                Clear Search
                            </button>
                        </>
                    ) : (
                        <>
                            <h2 className="text-lg font-semibold text-gray-800">
                                No Projects Assigned
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                You currently don't
                                have any projects
                                assigned.
                            </p>

                            <button
                                type="button"
                                onClick={loadProjects}
                                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
                            >
                                Refresh
                            </button>
                        </>
                    )}

                </div>
            )}

        </div>
    );
};

export default AssignedProject;