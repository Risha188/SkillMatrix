import { useEffect, useMemo, useState } from "react";
import {
    useLocation,
    useNavigate
} from "react-router-dom";

const API_URL = "http://localhost:5000/api/admin";

const ReassignProject = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // =========================================================
    // PROJECT RECEIVED FROM ALL PROJECTS PAGE
    // =========================================================

    const initialProject =
        location.state?.project || null;

    const [project, setProject] =
        useState(initialProject);

    // =========================================================
    // STATE
    // =========================================================

    const [employees, setEmployees] =
        useState([]);

    const [selectedEmployees, setSelectedEmployees] =
        useState([]);

    const [employeeSearch, setEmployeeSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");
    // =========================================================
    // TOKEN
    // =========================================================

    const getToken = () => {
        // Admin login stores the JWT in sessionStorage as adminToken.
        // Check it first so admin pages use the correct session.
        return (
            sessionStorage.getItem("adminToken") ||
            sessionStorage.getItem("token") ||
            localStorage.getItem("adminToken") ||
            localStorage.getItem("token") ||
            localStorage.getItem("accessToken") ||
            localStorage.getItem("jwt")
        );
    };

    // =========================================================
    // HEADERS
    // =========================================================

    const getHeaders = () => {
        const token = getToken();

        return {
            "Content-Type": "application/json",

            ...(token
                ? {
                      Authorization: `Bearer ${token}`
                  }
                : {})
        };
    };

    // =========================================================
    // HANDLE ADMIN AUTH ERROR
    // =========================================================

    const handleAuthError = () => {
        console.error("❌ Admin authentication failed.");

        sessionStorage.removeItem("adminToken");
        sessionStorage.removeItem("adminUser");
        sessionStorage.removeItem("adminId");
        sessionStorage.removeItem("adminEmail");
        sessionStorage.removeItem("adminRole");

        localStorage.removeItem("adminToken");

        setError("Admin session expired. Please login again.");

        setTimeout(() => {
            navigate("/admin/login", { replace: true });
        }, 500);
    };

    // =========================================================
    // EMPLOYEE ID
    // =========================================================

    const getEmployeeMongoId = (employee) => {
        if (!employee) {
            return null;
        }

        return (
            employee._id ||
            employee.id ||
            null
        );
    };

    // =========================================================
    // EMPLOYEE DISPLAY ID
    // =========================================================

    const getEmployeeCode = (employee) => {
        if (!employee) {
            return "—";
        }

        return (
            employee.employeeId ||
            employee.empId ||
            "—"
        );
    };

    // =========================================================
    // EMPLOYEE NAME
    // =========================================================

    const getEmployeeName = (employee) => {
        if (!employee) {
            return "Unknown Employee";
        }

        const firstName =
            employee.personalDetails?.firstName ||
            employee.firstName ||
            "";

        const lastName =
            employee.personalDetails?.lastName ||
            employee.lastName ||
            "";

        const fullName =
            `${firstName} ${lastName}`.trim();

        return (
            fullName ||
            employee.name ||
            employee.employeeId ||
            "Unknown Employee"
        );
    };

    // =========================================================
    // INITIALS
    // =========================================================

    const getInitials = (employee) => {
        const name =
            getEmployeeName(employee);

        if (
            !name ||
            name === "Unknown Employee"
        ) {
            return "U";
        }

        const parts =
            name.split(" ");

        if (parts.length === 1) {
            return parts[0]
                .charAt(0)
                .toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    };

    // =========================================================
    // NORMALIZE SKILLS
    // =========================================================

    const normalizeSkills = (skills) => {
        if (!skills) {
            return [];
        }

        if (Array.isArray(skills)) {
            return skills
                .map((skill) => {
                    if (
                        typeof skill ===
                        "string"
                    ) {
                        return skill.trim();
                    }

                    if (
                        skill?.skillName
                    ) {
                        return skill.skillName.trim();
                    }

                    if (skill?.name) {
                        return skill.name.trim();
                    }

                    if (skill?.skill) {
                        return skill.skill.trim();
                    }

                    if (skill?.title) {
                        return skill.title.trim();
                    }

                    return "";
                })
                .filter(Boolean);
        }

        if (
            typeof skills ===
            "string"
        ) {
            return skills
                .split(",")
                .map((skill) =>
                    skill.trim()
                )
                .filter(Boolean);
        }

        return [];
    };

    // =========================================================
    // TECHNICAL SKILLS
    //
    // Employee schema:
    //
    // skills: [
    //   {
    //      skill,
    //      category,
    //      proficiency,
    //      experience
    //   }
    // ]
    // =========================================================

    const getTechnicalSkills = (
        employee
    ) => {
        if (!employee) {
            return [];
        }

        const skills =
            employee.skills ??
            employee.technicalSkills ??
            employee.technicalSkill ??
            employee.primarySkills ??
            employee.primarySkill ??
            employee.personalDetails
                ?.technicalSkills ??
            employee.personalDetails
                ?.technicalSkill ??
            employee.personalDetails
                ?.primarySkills ??
            employee.personalDetails
                ?.primarySkill ??
            [];

        return normalizeSkills(
            skills
        );
    };

    // =========================================================
    // TECHNICAL SKILLS TEXT
    // =========================================================

    const getTechnicalSkillsText = (
        employee
    ) => {
        return getTechnicalSkills(
            employee
        )
            .join(" ")
            .toLowerCase();
    };

    // =========================================================
    // FETCH EMPLOYEES
    // =========================================================



    // =========================================================
// FETCH REAL PROJECT DATA
// =========================================================

const fetchProjectDetails = async () => {
    try {
        let projectId =
            initialProject?.projectId ||
            initialProject?.projectCode ||
            initialProject?._id ||
            initialProject?.id;

        if (!projectId) {
            throw new Error(
                "Project ID is missing."
            );
        }

        const response =
            await fetch(
                `${API_URL}/projects/${projectId}`,
                {
                    method: "GET",
                    headers: getHeaders()
                }
            );

        const data =
            await response.json();

        console.log(
            "REAL PROJECT RESPONSE:",
            data
        );

        if (response.status === 401) {
            handleAuthError();
            return null;
        }

        if (response.status === 403) {
            throw new Error("Admin permission denied for project details.");
        }

        if (!response.ok) {
            throw new Error(
                data.message ||
                "Failed to fetch project details"
            );
        }

        const realProject =
            data.project ||
            data.data ||
            null;

        if (!realProject) {
            throw new Error(
                "Project data was not returned by the server."
            );
        }

        // =====================================================
        // IMPORTANT
        // Attach assignments if backend returns them separately
        // =====================================================

        const projectWithAssignments = {
            ...realProject,

            assignments:
                data.assignments ||
                realProject.assignments ||
                []
        };

        console.log(
            "REAL PROJECT:",
            projectWithAssignments
        );

        setProject(
            projectWithAssignments
        );

        return projectWithAssignments;

    } catch (error) {

        console.error(
            "Fetch project details error:",
            error
        );

        setError(
            error.message ||
            "Failed to load project details."
        );

        return null;
    }
};

    const fetchEmployees = async () => {
        try {
            const response =
                await fetch(
                    `${API_URL}/employees`,
                    {
                        method: "GET",
                        headers:
                            getHeaders()
                    }
                );

            const data =
                await response.json();

            if (response.status === 401) {
                handleAuthError();
                return [];
            }

            if (response.status === 403) {
                throw new Error("Admin permission denied for employees.");
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to fetch employees"
                );
            }

            const employeeList =
                data.employees ||
                data.data ||
                [];

            setEmployees(
                Array.isArray(
                    employeeList
                )
                    ? employeeList
                    : []
            );

            return Array.isArray(
                employeeList
            )
                ? employeeList
                : [];
        } catch (err) {
            console.error(
                "Fetch employees error:",
                err
            );

            setError(
                err.message ||
                    "Failed to load employees"
            );

            return [];
        }
    };

    // =========================================================
    // INITIAL ASSIGNED EMPLOYEES
    // =========================================================

    // =========================================================
// INITIAL ASSIGNED EMPLOYEES
// =========================================================

const getInitialEmployeeIds = (
    projectData,
    employeeList
) => {

    if (!projectData) {
        return [];
    }

    let assigned = [];

    // =====================================================
    // employeeIds
    // =====================================================

    if (
        Array.isArray(
            projectData.employeeIds
        )
    ) {
        assigned = [
            ...projectData.employeeIds
        ];
    }

    // =====================================================
    // assignments
    // =====================================================

    if (
        Array.isArray(
            projectData.assignments
        ) &&
        projectData.assignments.length > 0
    ) {

        assigned =
            projectData.assignments
                .map(
                    (assignment) =>
                        assignment?.employeeId
                )
                .filter(Boolean);
    }

    const result = [];

    assigned.forEach(
        (item) => {

            if (!item) {
                return;
            }

            // ==============================================
            // POPULATED EMPLOYEE OBJECT
            // ==============================================

            if (
                typeof item ===
                "object"
            ) {

                // Match MongoDB _id

                if (item._id) {

                    const employee =
                        employeeList.find(
                            (emp) =>
                                String(
                                    emp._id
                                ) ===
                                String(
                                    item._id
                                )
                        );

                    if (employee) {

                        const id =
                            getEmployeeMongoId(
                                employee
                            );

                        if (
                            id &&
                            !result.includes(id)
                        ) {
                            result.push(id);
                        }

                        return;
                    }
                }

                // Match employeeId

                if (
                    item.employeeId
                ) {

                    const employee =
                        employeeList.find(
                            (emp) =>
                                String(
                                    emp.employeeId
                                ) ===
                                String(
                                    item.employeeId
                                )
                        );

                    if (employee) {

                        const id =
                            getEmployeeMongoId(
                                employee
                            );

                        if (
                            id &&
                            !result.includes(id)
                        ) {
                            result.push(id);
                        }
                    }

                    return;
                }
            }

            // ==============================================
            // RAW ID / EMPLOYEE CODE
            // ==============================================

            const employee =
                employeeList.find(
                    (emp) =>
                        String(
                            emp._id
                        ) ===
                            String(item) ||
                        String(
                            emp.employeeId
                        ) ===
                            String(item)
                );

            if (employee) {

                const id =
                    getEmployeeMongoId(
                        employee
                    );

                if (
                    id &&
                    !result.includes(id)
                ) {
                    result.push(id);
                }
            }
        }
    );

    return result;
};

    // =========================================================
    // LOAD PAGE
    // =========================================================

    // =========================================================
// LOAD PAGE
// =========================================================

useEffect(() => {

    const loadPage = async () => {

        setLoading(true);
        setError("");

        try {

            // =================================================
            // 1. FETCH REAL PROJECT FROM BACKEND
            // =================================================

            const realProject =
                await fetchProjectDetails();

            if (!realProject) {
                setLoading(false);
                return;
            }

            // =================================================
            // 2. FETCH REAL EMPLOYEES
            // =================================================

            const employeeList =
                await fetchEmployees();

            // =================================================
            // 3. GET REAL CURRENT PROJECT TEAM
            // =================================================

            const initialIds =
                getInitialEmployeeIds(
                    realProject,
                    employeeList
                );

            console.log(
                "CURRENT ASSIGNED EMPLOYEES:",
                initialIds
            );

            setSelectedEmployees(
                initialIds
            );

        } catch (error) {

            console.error(
                "Load Reassign Page Error:",
                error
            );

            setError(
                error.message ||
                "Failed to load project."
            );

        } finally {

            setLoading(false);
        }
    };

    loadPage();

}, []);
    // =========================================================
    // CURRENT ASSIGNED EMPLOYEES
    // =========================================================

    const currentEmployees =
        useMemo(() => {
            return employees.filter(
                (employee) => {
                    const id =
                        getEmployeeMongoId(
                            employee
                        );

                    return (
                        id &&
                        selectedEmployees.includes(
                            id
                        )
                    );
                }
            );
        }, [
            employees,
            selectedEmployees
        ]);

    // =========================================================
    // SEARCH AVAILABLE EMPLOYEES
    // =========================================================

    const availableEmployees =
        useMemo(() => {
            const searchValue =
                employeeSearch
                    .toLowerCase()
                    .trim();

            return employees.filter(
                (employee) => {
                    const employeeMongoId =
                        getEmployeeMongoId(
                            employee
                        );

                    const isAssigned =
                        selectedEmployees.includes(
                            employeeMongoId
                        );

                    if (isAssigned) {
                        return false;
                    }

                    if (
                        !searchValue
                    ) {
                        return true;
                    }

                    const name =
                        getEmployeeName(
                            employee
                        ).toLowerCase();

                    const employeeId =
                        getEmployeeCode(
                            employee
                        ).toLowerCase();

                    const technicalSkills =
                        getTechnicalSkillsText(
                            employee
                        );

                    return (
                        name.includes(
                            searchValue
                        ) ||
                        employeeId.includes(
                            searchValue
                        ) ||
                        technicalSkills.includes(
                            searchValue
                        )
                    );
                }
            );
        }, [
            employees,
            selectedEmployees,
            employeeSearch
        ]);

    // =========================================================
    // ORIGINAL EMPLOYEES
    // =========================================================

    const originalEmployeeIds =
        useMemo(() => {
            if (!project) {
                return [];
            }

            return getInitialEmployeeIds(
                project,
                employees
            );
        }, [
            project,
            employees
        ]);

    // =========================================================
    // CHECK CHANGES
    // =========================================================

    const hasChanges =
        useMemo(() => {
            if (
                originalEmployeeIds.length !==
                selectedEmployees.length
            ) {
                return true;
            }

            return originalEmployeeIds.some(
                (id) =>
                    !selectedEmployees.includes(
                        id
                    )
            );
        }, [
            originalEmployeeIds,
            selectedEmployees
        ]);

    // =========================================================
    // TOGGLE EMPLOYEE
    // =========================================================

    const toggleEmployee = (
        employee
    ) => {
        const employeeId =
            getEmployeeMongoId(
                employee
            );

        if (!employeeId) {
            return;
        }

        setSelectedEmployees(
            (previous) => {
                const alreadySelected =
                    previous.includes(
                        employeeId
                    );

                // -----------------------------------------
                // REMOVE
                // -----------------------------------------

                if (
                    alreadySelected
                ) {
                    if (
                        previous.length <=
                        2
                    ) {
                        alert(
                            "At least 2 employees are required for every project."
                        );

                        return previous;
                    }

                    return previous.filter(
                        (id) =>
                            id !==
                            employeeId
                    );
                }

                // -----------------------------------------
                // ADD
                // -----------------------------------------

                return [
                    ...previous,
                    employeeId
                ];
            }
        );
    };

    // =========================================================
    // SAVE CHANGES
    // =========================================================

   const handleSaveChanges = async () => {
    if (!project) {
        return;
    }

    if (!hasChanges) {
        return;
    }

    if (selectedEmployees.length < 2) {
        alert(
            "At least 2 employees are required for every project."
        );
        return;
    }

    try {
        setSaving(true);
        setError("");
        setSuccess("");

        // Project ID can be PRJ001 or MongoDB _id
        const projectId =
            project.projectId ||
            project.projectCode ||
            project._id ||
            project.id;

        if (!projectId) {
            throw new Error(
                "Project ID is missing."
            );
        }

        /*
         * IMPORTANT:
         *
         * Backend expects:
         *
         * employeeIds: ["EMP002", "EMP003"]
         *
         * NOT:
         *
         * employeeIds: ["68a....", "68b...."]
         */

        const employeeIds = selectedEmployees
            .map((mongoId) => {
                const employee = employees.find(
                    (emp) =>
                        String(
                            emp._id ||
                                emp.id
                        ) ===
                        String(mongoId)
                );

                return employee?.employeeId;
            })
            .filter(Boolean);

        if (employeeIds.length < 2) {
            throw new Error(
                "Could not find the selected employee IDs."
            );
        }

        console.log(
            "Reassign Project:",
            projectId
        );

        console.log(
            "Employee IDs:",
            employeeIds
        );

        // IMPORTANT: use the same admin JWT as the GET requests.
        const token = getToken();

        if (!token) {
            handleAuthError();
            return;
        }

        const response = await fetch(
            `${API_URL}/assigned-projects/${projectId}/team`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json",

                    ...(token
                        ? {
                              Authorization:
                                  `Bearer ${token}`
                          }
                        : {})
                },

                body: JSON.stringify({
                    employeeIds
                })
            }
        );

        const data =
            await response.json();

        console.log(
            "Reassign response:",
            data
        );

        if (response.status === 401) {
            handleAuthError();
            return;
        }

        if (response.status === 403) {
            throw new Error("Admin permission denied for reassignment.");
        }

        if (!response.ok) {
            throw new Error(
                data.message ||
                    data.error ||
                    "Failed to update project team"
            );
        }

        setSuccess(
            "Project team reassigned successfully."
        );

        // Go back to All Projects
        setTimeout(() => {
            navigate(
                "/admin/allprojects"
            );
        }, 800);

    } catch (error) {
        console.error(
            "Reassign error:",
            error
        );

        setError(
            error.message ||
                "Failed to reassign project team."
        );
    } finally {
        setSaving(false);
    }
};

    // =========================================================
    // PROJECT NOT FOUND
    // =========================================================

    if (!project) {
        return (
            <div className="min-h-screen bg-gray-100 p-6">

                <div className="rounded-xl bg-white p-8 text-center shadow-sm">

                    <h2 className="text-xl font-semibold text-gray-800">
                        Project Not Found
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        No project information was
                        provided.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/allprojects"
                            )
                        }
                        className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        Back to All Projects
                    </button>

                </div>

            </div>
        );
    }

    // =========================================================
    // EMPLOYEE ITEM
    // =========================================================

    const EmployeeItem = ({
        employee,
        type
    }) => {
        const employeeId =
            getEmployeeMongoId(
                employee
            );

        const fullName =
            getEmployeeName(
                employee
            );

        const initials =
            getInitials(
                employee
            );

        const technicalSkills =
            getTechnicalSkills(
                employee
            );

        const isAssigned =
            selectedEmployees.includes(
                employeeId
            );

        const isAssignedSection =
            type === "assigned";

        return (
            <div
                className={`rounded-lg border p-4 transition ${
                    isAssigned
                        ? "border-blue-100 bg-blue-50"
                        : "border-gray-100 hover:border-blue-200 hover:bg-blue-50"
                }`}
            >

                {/* TOP */}

                <div className="flex items-start justify-between gap-4">

                    <div className="flex min-w-0 items-center gap-3">

                        {/* AVATAR */}

                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                                isAssigned
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {
                                initials
                            }
                        </div>

                        {/* NAME */}

                        <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-gray-800">
                                {
                                    fullName
                                }
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                {
                                    getEmployeeCode(
                                        employee
                                    )
                                }
                            </p>

                            {employee.email && (
                                <p className="mt-0.5 truncate text-xs text-gray-400">
                                    {
                                        employee.email
                                    }
                                </p>
                            )}

                        </div>

                    </div>

                    {/* ACTION */}

                    {isAssigned ? (
                        isAssignedSection ? (
                            <button
                                type="button"
                                onClick={() =>
                                    toggleEmployee(
                                        employee
                                    )
                                }
                                className="shrink-0 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                            >
                                Remove
                            </button>
                        ) : (
                            <span className="shrink-0 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-600">
                                Already Assigned
                            </span>
                        )
                    ) : (
                        <button
                            type="button"
                            onClick={() =>
                                toggleEmployee(
                                    employee
                                )
                            }
                            className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700"
                        >
                            Assign
                        </button>
                    )}

                </div>

                {/* TECHNICAL SKILLS */}

                <div className="mt-4 border-t border-gray-100 pt-3">

                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        Technical Skills
                    </p>

                    {technicalSkills.length >
                    0 ? (
                        <div className="flex flex-wrap gap-1.5">

                            {technicalSkills.map(
                                (
                                    skill,
                                    index
                                ) => (
                                    <span
                                        key={`${skill}-${index}`}
                                        className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                                            isAssigned
                                                ? "bg-white text-blue-700 ring-1 ring-blue-100"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {
                                            skill
                                        }
                                    </span>
                                )
                            )}

                        </div>
                    ) : (
                        <p className="text-xs text-gray-400">
                            No technical skills
                            added
                        </p>
                    )}

                </div>

            </div>
        );
    };

    // =========================================================
    // AVAILABLE COUNT
    // =========================================================

    const availableEmployeeCount =
        employees.filter(
            (employee) => {
                const id =
                    getEmployeeMongoId(
                        employee
                    );

                return !selectedEmployees.includes(
                    id
                );
            }
        ).length;

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-6">

                <div className="flex min-h-[500px] items-center justify-center">

                    <p className="text-sm text-gray-500">
                        Loading project and
                        employees...
                    </p>

                </div>

            </div>
        );
    }

    // =========================================================
    // RETURN
    // =========================================================

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* HEADER */}

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/allprojects"
                            )
                        }
                        className="mb-3 text-sm font-medium text-blue-600 transition hover:text-blue-800"
                    >
                        ← Back to All Projects
                    </button>

                    <h1 className="text-2xl font-bold text-gray-800">
                        Reassign Project
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage employees assigned
                        to this project.
                    </p>

                </div>

                <div className="rounded-lg bg-blue-50 px-4 py-3">

                    <p className="text-xs text-blue-500">
                        Project Code
                    </p>

                    <p className="text-sm font-semibold text-blue-700">
                        {project.projectId ||
                            project.projectCode ||
                            "—"}
                    </p>

                </div>

            </div>

            {/* ERROR */}

            {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* SUCCESS */}

            {success && (
                <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>
            )}

            {/* PROJECT INFORMATION */}

            <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">

                <div className="mb-5">

                    <h2 className="text-lg font-semibold text-gray-800">
                        Project Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        View project details before
                        changing the assigned
                        employees.
                    </p>

                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    {/* NAME */}

                    <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Project Name
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                            {project.name ||
                                project.projectName ||
                                "—"}
                        </p>

                    </div>

                    {/* CODE */}

                    <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Project Code
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                            {project.projectId ||
                                project.projectCode ||
                                "—"}
                        </p>

                    </div>

                    {/* START DATE */}

                    <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Start Date
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                            {formatDate(
                                project.startDate
                            )}
                        </p>

                    </div>

                    {/* STATUS */}

                    <div>

                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Status
                        </p>

                        <span
                            className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                                String(
                                    project.status
                                ).toLowerCase() ===
                                "active"
                                    ? "bg-green-100 text-green-700"
                                    : String(
                                          project.status
                                      ).toLowerCase() ===
                                      "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                            }`}
                        >
                            {project.status ||
                                "Pending"}
                        </span>

                    </div>

                </div>

            </div>

            {/* EMPLOYEE MANAGEMENT */}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* ASSIGNED */}

                <div className="rounded-xl bg-white shadow-sm">

                    <div className="border-b border-gray-100 px-6 py-5">

                        <div className="flex items-center justify-between gap-3">

                            <div>

                                <h2 className="text-lg font-semibold text-gray-800">
                                    Assigned Employees
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Employees currently
                                    assigned to this
                                    project.
                                </p>

                            </div>

                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                {
                                    currentEmployees.length
                                }
                            </span>

                        </div>

                    </div>

                    <div className="max-h-[500px] overflow-y-auto p-4">

                        {currentEmployees.length >
                        0 ? (
                            <div className="space-y-3">

                                {currentEmployees.map(
                                    (
                                        employee
                                    ) => (
                                        <EmployeeItem
                                            key={
                                                getEmployeeMongoId(
                                                    employee
                                                )
                                            }
                                            employee={
                                                employee
                                            }
                                            type="assigned"
                                        />
                                    )
                                )}

                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed border-gray-300 px-5 py-10 text-center">

                                <p className="text-sm font-medium text-gray-600">
                                    No employees
                                    assigned
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    Please assign at
                                    least 2 employees.
                                </p>

                            </div>
                        )}

                    </div>

                </div>

                {/* AVAILABLE */}

                <div className="rounded-xl bg-white shadow-sm">

                    <div className="border-b border-gray-100 px-6 py-5">

                        <div className="flex items-center justify-between gap-3">

                            <div>

                                <h2 className="text-lg font-semibold text-gray-800">
                                    Available Employees
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Search employees by
                                    name, ID or technical
                                    skill.
                                </p>

                            </div>

                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                                {
                                    availableEmployeeCount
                                }
                            </span>

                        </div>

                        {/* SEARCH */}

                        <div className="mt-4">

                            <input
                                type="text"
                                value={
                                    employeeSearch
                                }
                                onChange={(e) =>
                                    setEmployeeSearch(
                                        e.target
                                            .value
                                    )
                                }
                                placeholder="Search by name, ID or skill e.g. Java, React, Python..."
                                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />

                        </div>

                        <p className="mt-2 text-xs text-gray-400">
                            Search supports employee
                            name, employee ID and
                            technical skills.
                        </p>

                    </div>

                    {/* RESULTS */}

                    <div className="max-h-[500px] overflow-y-auto p-4">

                        {availableEmployees.length >
                        0 ? (
                            <div className="space-y-3">

                                {availableEmployees.map(
                                    (
                                        employee
                                    ) => (
                                        <EmployeeItem
                                            key={
                                                getEmployeeMongoId(
                                                    employee
                                                )
                                            }
                                            employee={
                                                employee
                                            }
                                            type="available"
                                        />
                                    )
                                )}

                            </div>
                        ) : (
                            <div className="rounded-lg border border-dashed border-gray-300 px-5 py-10 text-center">

                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                    <span className="text-lg font-semibold text-gray-400">
                                        ?
                                    </span>
                                </div>

                                <p className="mt-3 text-sm font-semibold text-gray-600">
                                    No Employee Found
                                </p>

                                <p className="mt-1 text-xs text-gray-400">
                                    {employeeSearch
                                        ? `No employee matches "${employeeSearch}"`
                                        : "No available employees."}
                                </p>

                            </div>
                        )}

                    </div>

                </div>

            </div>

            {/* FOOTER */}

            <div className="mt-6 flex flex-col-reverse gap-3 rounded-xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <p className="text-sm font-medium text-gray-700">
                        {
                            selectedEmployees.length
                        }{" "}
                        employees assigned
                    </p>

                    <p
                        className={`mt-1 text-xs ${
                            selectedEmployees.length >=
                            2
                                ? "text-green-600"
                                : "text-red-500"
                        }`}
                    >
                        {selectedEmployees.length >=
                        2
                            ? hasChanges
                                ? "You have unsaved changes."
                                : "No changes made."
                            : "Minimum 2 employees are required."}
                    </p>

                </div>

                <div className="flex gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/admin/allprojects"
                            )
                        }
                        className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={
                            !hasChanges ||
                            saving ||
                            selectedEmployees.length <
                                2
                        }
                        onClick={
                            handleSaveChanges
                        }
                        className={`rounded-lg px-5 py-2.5 text-sm font-medium transition ${
                            hasChanges &&
                            selectedEmployees.length >=
                                2 &&
                            !saving
                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                : "cursor-not-allowed bg-gray-200 text-gray-400"
                        }`}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </div>

            </div>

        </div>
    );
};

// =========================================================
// DATE FORMAT
// =========================================================

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
            year: "numeric"
        }
    );
};

export default ReassignProject;