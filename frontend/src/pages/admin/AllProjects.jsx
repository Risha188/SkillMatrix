import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/admin";

const AllProjects = () => {
    const navigate = useNavigate();
    // =====================================================
    // STATE
    // =====================================================

    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState("");
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    // =====================================================
    // CREATE FORM
    // =====================================================

    const [formData, setFormData] = useState({
        projectName: "",
        projectCode: "",
        description: "",
        client: "Internal Project",
        projectType: "Web Application",
        priority: "medium",
        startDate: "",
        endDate: "",
        technologyStack: "",
        objectives: "",
        employeeIds: [],
    });

    // =====================================================
    // TOKEN
    // =====================================================

const getToken = () => {
    return sessionStorage.getItem("adminToken");
};
    // =====================================================
    // HEADERS
    // =====================================================

    const getHeaders = () => {
        const token = getToken();
        return {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    };

    // =====================================================
    // FETCH EMPLOYEES
    // =====================================================

    const fetchEmployees = async () => {
        try {
            const response = await fetch(`${API_URL}/employees`, {
                method: "GET",
                headers: getHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch employees");
            }

            const employeeList = data.employees || data.data || [];
            setEmployees(Array.isArray(employeeList) ? employeeList : []);
        } catch (err) {
            console.error("Employee fetch error:", err);
        }
    };

    // =====================================================
    // FETCH PROJECTS
    // =====================================================

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/projects`, {
                method: "GET",
                headers: getHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch projects");
            }

            const projectList = data.projects || data.data || [];

            const finalProjects = await Promise.all(
                (Array.isArray(projectList) ? projectList : []).map(
                    async (project) => {
                        try {
                            const detailResponse = await fetch(
                                `${API_URL}/projects/${project.projectId}`,
                                {
                                    method: "GET",
                                    headers: getHeaders(),
                                }
                            );

                            if (!detailResponse.ok) {
                                return { ...project, assignments: [] };
                            }

                            const detailData = await detailResponse.json();

                            return {
                                ...project,
                                assignments: Array.isArray(detailData.assignments)
                                    ? detailData.assignments
                                    : [],
                            };
                        } catch (err) {
                            console.error("Project details error:", err);
                            return { ...project, assignments: [] };
                        }
                    }
                )
            );

            setProjects(finalProjects);
        } catch (err) {
            console.error("Project fetch error:", err);
            setError(err.message || "Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadData = async () => {
        setError("");
        await Promise.all([fetchProjects(), fetchEmployees()]);
    };

    useEffect(() => {
        loadData();
    }, []);

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    // =====================================================
    // EMPLOYEE SELECT
    // =====================================================

    const handleEmployeeSelect = (employeeId) => {
        setFormData((previous) => {
            const exists = previous.employeeIds.includes(employeeId);

            if (exists) {
                return {
                    ...previous,
                    employeeIds: previous.employeeIds.filter(
                        (id) => id !== employeeId
                    ),
                };
            }

            return {
                ...previous,
                employeeIds: [...previous.employeeIds, employeeId],
            };
        });
    };

    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {
        setFormData({
            projectName: "",
            projectCode: "",
            description: "",
            client: "Internal Project",
            projectType: "Web Application",
            priority: "medium",
            startDate: "",
            endDate: "",
            technologyStack: "",
            objectives: "",
            employeeIds: [],
        });
    };

    // =====================================================
    // OPEN CREATE
    // =====================================================

    const openCreateForm = () => {
        setError("");
        setSuccess("");
        resetForm();
        setShowCreateForm(true);
    };

    // =====================================================
    // CLOSE CREATE
    // =====================================================

    const closeCreateForm = () => {
        setShowCreateForm(false);
        resetForm();
    };

    // =====================================================
    // CREATE PROJECT
    // =====================================================

    const handleCreateProject = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        // VALIDATION

        if (!formData.projectName.trim()) {
            setError("Project name is required");
            return;
        }

        if (!formData.projectCode.trim()) {
            setError("Project code is required");
            return;
        }

        if (!formData.startDate) {
            setError("Start date is required");
            return;
        }

        if (!formData.endDate) {
            setError("End date is required");
            return;
        }

        if (new Date(formData.endDate) < new Date(formData.startDate)) {
            setError("End date cannot be before start date");
            return;
        }

        if (formData.employeeIds.length < 2) {
            setError("Select at least 2 employees");
            return;
        }

        // PAYLOAD

        // =====================================================
        // CONVERT TECHNOLOGY STACK TO ARRAY
        // =====================================================
        // The form accepts technologies as comma-separated text:
        // React, Node.js, MongoDB, Express.js
        //
        // MongoDB expects:
        // ["React", "Node.js", "MongoDB", "Express.js"]
        // =====================================================

        const technologyStack = String(
            formData.technologyStack || ""
        )
            .split(",")
            .map((technology) => technology.trim())
            .filter(Boolean);

        // =====================================================
        // CONVERT OBJECTIVES TO ARRAY
        // =====================================================
        // The form accepts one objective per line.
        //
        // MongoDB expects:
        // ["Objective 1", "Objective 2"]
        // =====================================================

        const objectives = String(
            formData.objectives || ""
        )
            .split(/\r?\n/)
            .map((objective) => objective.trim())
            .filter(Boolean);

        // =====================================================
        // BUILD CREATE PROJECT PAYLOAD
        // =====================================================

        const payload = {
            projectId: formData.projectCode
                .trim()
                .toUpperCase(),

            name: formData.projectName.trim(),

            description: formData.description.trim(),

            client: formData.client.trim(),

            projectType: formData.projectType.trim(),

            priority: formData.priority.toLowerCase(),

            startDate: formData.startDate,

            endDate: formData.endDate,

            status: "pending",

            // IMPORTANT:
            // These two fields were previously missing.
            technologyStack,

            objectives,

            employeeIds: formData.employeeIds
                .map((mongoId) => {
                    const employee = employees.find(
                        (emp) =>
                            String(
                                emp._id || emp.id
                            ) === String(mongoId)
                    );

                    return employee?.employeeId;
                })
                .filter(Boolean),
        };
        // CREATE PROJECT

        try {
            setCreating(true);

            // IMPORTANT:
            // Use the complete URL here.
            // This prevents /admin/admin/projects.
            const PROJECT_CREATE_URL = "http://localhost:5000/api/admin/projects";

            console.log("=================================");
            console.log("CREATE PROJECT URL:", PROJECT_CREATE_URL);
            console.log("CREATE PROJECT PAYLOAD:", payload);
            console.log("=================================");

            const response = await fetch(PROJECT_CREATE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...getHeaders(),
                },
                body: JSON.stringify(payload),
            });

            // RESPONSE

            const contentType = response.headers.get("content-type");
            let data;

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();
                data = { message: text };
            }

            console.log("CREATE PROJECT STATUS:", response.status);
            console.log("CREATE PROJECT RESPONSE:", data);

            // ERROR
if (!response.ok) {
    console.error(
        "BACKEND ERROR STATUS:",
        response.status
    );

    console.error(
        "BACKEND ERROR RESPONSE:",
        data
    );

    throw new Error(
        data?.message ||
        data?.error ||
        JSON.stringify(data) ||
        `Failed to create project (${response.status})`
    );
}

            // SUCCESS

            setSuccess("Project created successfully");
            setShowCreateForm(false);
            resetForm();
            await fetchProjects();
        } catch (err) {
            console.error("Create project error:", err);
            setError(err.message || "Failed to create project");
        } finally {
            setCreating(false);
        }
    };

    // =====================================================
    // DELETE PROJECT
    // =====================================================

    const handleDeleteProject = async (projectId) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${projectId}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleteLoading(projectId);
            setError("");
            setSuccess("");

            const response = await fetch(`${API_URL}/projects/${projectId}`, {
                method: "DELETE",
                headers: getHeaders(),
            });

            const contentType = response.headers.get("content-type");
            const data =
                contentType && contentType.includes("application/json")
                    ? await response.json()
                    : { message: await response.text() };

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete project");
            }

            setProjects((previous) =>
                previous.filter((project) => project.projectId !== projectId)
            );

            setSuccess("Project deleted successfully");
        } catch (err) {
            console.error("Delete project error:", err);
            setError(err.message || "Failed to delete project");
        } finally {
            setDeleteLoading("");
        }
    };

    // =====================================================
    // OPEN REASSIGN PAGE
    // =====================================================

    const openReassign = (project) => {
        const projectId = project?.projectId || project?._id || project?.id;

        if (!projectId) {
            setError("Project ID not found.");
            return;
        }

        setError("");
        setSuccess("");

        navigate(`/admin/reassign-project/${projectId}`, { state: { project } });
    };

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredProjects = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) {
            return projects;
        }

        return projects.filter((project) => {
            const name = String(project.name || "").toLowerCase();
            const projectId = String(project.projectId || "").toLowerCase();
            const client = String(project.client || "").toLowerCase();

            const employeeMatch = (project.assignments || []).some(
                (assignment) => {
                    const employee = assignment.employeeId;

                    if (!employee) {
                        return false;
                    }

                    const employeeId = String(
                        employee.employeeId || ""
                    ).toLowerCase();
                    const firstName = String(
                        employee.personalDetails?.firstName || ""
                    ).toLowerCase();
                    const lastName = String(
                        employee.personalDetails?.lastName || ""
                    ).toLowerCase();

                    return (
                        employeeId.includes(value) ||
                        firstName.includes(value) ||
                        lastName.includes(value)
                    );
                }
            );

            return (
                name.includes(value) ||
                projectId.includes(value) ||
                client.includes(value) ||
                employeeMatch
            );
        });
    }, [projects, search]);

    // =====================================================
    // COUNTS
    // =====================================================

    const totalProjects = projects.length;

    const activeProjects = projects.filter(
        (project) => project.status === "active"
    ).length;

    const completedProjects = projects.filter(
        (project) => project.status === "completed"
    ).length;

    const pendingProjects = projects.filter(
        (project) => project.status === "pending"
    ).length;

    // =====================================================
    // DATE
    // =====================================================

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return "—";
        }

        return parsed.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // =====================================================
    // EMPLOYEE NAME
    // =====================================================

    const getEmployeeName = (employee) => {
        if (!employee) {
            return "Unknown Employee";
        }

        const firstName = employee.personalDetails?.firstName || "";
        const lastName = employee.personalDetails?.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim();

        return fullName || employee.name || employee.employeeId || "Unknown Employee";
    };

    // =====================================================
    // STATUS
    // =====================================================

    const getStatusClass = (status) => {
        if (status === "active") {
            return "bg-green-100 text-green-700";
        }

        if (status === "completed") {
            return "bg-blue-100 text-blue-700";
        }

        if (status === "cancelled") {
            return "bg-red-100 text-red-700";
        }

        return "bg-yellow-100 text-yellow-700";
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <p className="text-sm text-gray-500">Loading projects...</p>
            </div>
        );
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="space-y-5">
            {/* HEADER */}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        All Projects
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage projects, dates and employee assignments.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadData}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Refresh
                </button>
            </div>

            {/* ERROR */}

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* SUCCESS */}

            {success && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>
            )}

            {/* STATS */}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <StatCard
                    title="Total Projects"
                    value={totalProjects}
                    className="text-blue-600"
                />
                <StatCard
                    title="Active Projects"
                    value={activeProjects}
                    className="text-green-600"
                />
                <StatCard
                    title="Completed Projects"
                    value={completedProjects}
                    className="text-blue-600"
                />
                <StatCard
                    title="Pending Projects"
                    value={pendingProjects}
                    className="text-orange-600"
                />
            </div>

            {/* SEARCH */}

            <div className="rounded-xl bg-white p-3 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="relative w-full md:max-w-md">
                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search project or employee..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                            
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        + Create New Project
                    </button>
                </div>
            </div>

            {/* CREATE FORM */}

            {showCreateForm && (
                <CreateProjectForm
                    formData={formData}
                    employees={employees}
                    creating={creating}
                    handleFormChange={handleFormChange}
                    handleEmployeeSelect={handleEmployeeSelect}
                    handleCreateProject={handleCreateProject}
                    closeCreateForm={closeCreateForm}
                />
            )}

            {/* PROJECT TABLE */}

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px]">
                        <thead>
                            <tr className="border-b border-gray-300 bg-gray-50">
                                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600">
                                    Project
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600">
                                    Employees
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600">
                                    Team Members
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600">
                                    Start Date
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600">
                                    End Date
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600">
                                    Status
                                </th>
                                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-600">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredProjects.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="px-6 py-12 text-center text-sm text-gray-500"
                                    >
                                        No projects found.
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.map((project) => (
                                    <ProjectRow
                                        key={project._id || project.projectId}
                                        project={project}
                                        getEmployeeName={getEmployeeName}
                                        formatDate={formatDate}
                                        getStatusClass={getStatusClass}
                                        deleteLoading={deleteLoading}
                                        handleDeleteProject={handleDeleteProject}
                                        openReassign={openReassign}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Reassign navigates to the existing ReassignProject page */}
        </div>
    );
};

// =========================================================
// STAT CARD
// =========================================================

const StatCard = ({ title, value, className }) => {
    return (
        <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <p className={`mt-2 text-3xl font-bold ${className}`}>{value}</p>
        </div>
    );
};

// =========================================================
// CREATE PROJECT FORM
// =========================================================

const CreateProjectForm = ({
    formData,
    employees,
    creating,
    handleFormChange,
    handleEmployeeSelect,
    handleCreateProject,
    closeCreateForm,
}) => {
    return (
        <form
            onSubmit={handleCreateProject}
            className="rounded-xl bg-white p-6 shadow-sm"
        >
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Create New Project
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Select at least 2 employees for the project.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={closeCreateForm}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                    Close
                </button>
            </div>

            {/* NAME / CODE */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormInput
                    label="Project Name"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleFormChange}
                    placeholder="Enter project name"
                />

                <FormInput
                    label="Project Code"
                    name="projectCode"
                    value={formData.projectCode}
                    onChange={handleFormChange}
                    placeholder="PRJ001"
                />
            </div>

            {/* DESCRIPTION */}

            <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                </label>

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="3"
                    placeholder="Enter project description"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
            </div>

            {/* CLIENT / TYPE */}

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                <FormInput
                    label="Client"
                    name="client"
                    value={formData.client}
                    onChange={handleFormChange}
                />

                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Project Type
                    </label>

                    <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                        <option value="Web Application">Web Application</option>
                        <option value="Mobile Application">
                            Mobile Application
                        </option>
                        <option value="Desktop Application">
                            Desktop Application
                        </option>
                        <option value="API">API</option>
                        <option value="Internal Project">Internal Project</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            {/* PRIORITY / DATES */}

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Priority
                    </label>

                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleFormChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                </div>

                <FormInput
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleFormChange}
                />

                <FormInput
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleFormChange}
                />
            </div>

            {/* TECHNOLOGY STACK */}

            <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Technology Stack
                </label>

                <input
                    type="text"
                    name="technologyStack"
                    value={formData.technologyStack || ""}
                    onChange={(event) => {
                        handleFormChange({
                            target: {
                                name: "technologyStack",
                                value: event.target.value,
                            },
                        });
                    }}
                    placeholder="e.g. React, Node.js, MongoDB, Express.js"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-gray-500">
                    Enter technologies separated by commas.
                </p>
            </div>

            {/* PROJECT OBJECTIVES */}

            <div className="mt-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Project Objectives
                </label>

                <textarea
                    name="objectives"
                    value={formData.objectives || ""}
                    onChange={handleFormChange}
                    rows="5"
                    placeholder={`Enter project objectives, one per line.

Example:
Improve employee skill tracking
Manage employee profiles
Assign employees based on skills`}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <p className="mt-1 text-xs text-gray-500">
                    Enter each objective on a separate line.
                </p>
            </div>

            {/* TEAM */}

            <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-800">
                            Project Team
                        </h3>
                        <p className="text-xs text-gray-500">
                            Select at least 2 employees.
                        </p>
                    </div>

                    <span
                        className={`rounded-full px-3 py-1 text-xs ${
                            formData.employeeIds.length >= 2
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                        }`}
                    >
                        {formData.employeeIds.length} selected
                    </span>
                </div>

                <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-200">
                    {employees.length === 0 ? (
                        <p className="p-5 text-center text-sm text-gray-500">
                            No employees found.
                        </p>
                    ) : (
                        employees.map((employee) => {
                            const id = employee._id || employee.id;
                            const firstName =
                                employee.personalDetails?.firstName || "";
                            const lastName =
                                employee.personalDetails?.lastName || "";
                            const name =
                                `${firstName} ${lastName}`.trim() ||
                                employee.name ||
                                employee.employeeId;
                            const email = employee.email || "";
                            const selected = formData.employeeIds.includes(id);

                            return (
                                <label
                                    key={id}
                                    className={`flex cursor-pointer items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-0 ${
                                        selected
                                            ? "bg-blue-50"
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected}
                                        onChange={() => handleEmployeeSelect(id)}
                                        className="h-4 w-4"
                                    />

                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {employee.employeeId}
                                            {email ? ` • ${email}` : ""}
                                        </p>
                                    </div>
                                </label>
                            );
                        })
                    )}
                </div>
            </div>

            {/* BUTTON */}

            <div className="mt-6 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={closeCreateForm}
                    className="rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={creating}
                    className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {creating ? "Creating..." : "Create Project"}
                </button>
            </div>
        </form>
    );
};

// =========================================================
// FORM INPUT
// =========================================================

const FormInput = ({
    label,
    name,
    value,
    onChange,
    type = "text",
    placeholder = "",
}) => {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
        </div>
    );
};

// =========================================================
// PROJECT ROW
// =========================================================

const ProjectRow = ({
    project,
    getEmployeeName,
    formatDate,
    getStatusClass,
    deleteLoading,
    handleDeleteProject,
    openReassign,
}) => {
    const assignments = Array.isArray(project.assignments)
        ? project.assignments
        : [];

    const [showAll, setShowAll] = useState(false);

    const visibleEmployees = showAll ? assignments : assignments.slice(0, 2);
    const remaining = Math.max(assignments.length - 2, 0);

    return (
        <tr className="border-b border-gray-200 align-top hover:bg-gray-50">
            {/* PROJECT */}

            <td className="px-5 py-5">
                <span className="font-medium text-gray-900">
        {project.name}
    </span>

                <p className="mt-1 text-xs text-gray-400">{project.projectId}</p>
            </td>

            {/* EMPLOYEES */}

            <td className="px-5 py-5">
                <div className="space-y-3">
                    {visibleEmployees.map((assignment, index) => {
                        const employee = assignment.employeeId;

                        return (
                            <div
                                key={assignment._id || index}
                                className="flex items-center gap-2"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                                    {getEmployeeName(employee)
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-800">
                                        {getEmployeeName(employee)}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {employee?.employeeId || "—"}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {remaining > 0 && !showAll && (
                        <button
                            type="button"
                            onClick={() => setShowAll(true)}
                            className="text-xs font-medium text-blue-600 hover:underline"
                        >
                            +{remaining} more
                        </button>
                    )}

                    {showAll && assignments.length > 2 && (
                        <button
                            type="button"
                            onClick={() => setShowAll(false)}
                            className="text-xs font-medium text-blue-600 hover:underline"
                        >
                            Show less
                        </button>
                    )}
                </div>
            </td>

            {/* TEAM */}

            <td className="px-5 py-5">
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700">
                    {assignments.length}{" "}
                    {assignments.length === 1 ? "Member" : "Members"}
                </span>
            </td>

            {/* START */}

            <td className="px-5 py-5 text-sm text-gray-600">
                {formatDate(project.startDate)}
            </td>

            {/* END */}

            <td className="px-5 py-5 text-sm text-gray-600">
                {formatDate(project.endDate)}
            </td>

            {/* STATUS */}

            <td className="px-5 py-5">
                <span
                    className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${getStatusClass(
                        project.status
                    )}`}
                >
                    {project.status}
                </span>
            </td>

            {/* ACTION */}

            <td className="px-5 py-5">
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => openReassign(project)}
                        className="rounded-lg border border-blue-500 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                    >
                        Reassign
                    </button>

                    <button
                        type="button"
                        disabled={deleteLoading === project.projectId}
                        onClick={() => handleDeleteProject(project.projectId)}
                        className="rounded-lg border border-red-500 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                        {deleteLoading === project.projectId
                            ? "Deleting..."
                            : "Delete"}
                    </button>
                </div>
            </td>
        </tr>
    );
};

// =========================================================
// DEFAULT EXPORT
// =========================================================

export default AllProjects;
